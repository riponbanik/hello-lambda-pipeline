import * as cdk from 'aws-cdk-lib';
import { DeploymentStack } from './deployment';
import { BuildSpec } from 'aws-cdk-lib/aws-codebuild';
import { CodePipeline, CodeBuildStep, ManualApprovalStep, StageDeployment, Wave } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { CodeCommitSource } from './source-repository';
import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import { AccountPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import * as iam from 'aws-cdk-lib/aws-iam';
import * as interfaces from '../lib/interfaces';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)
      
    const appName = this.node.tryGetContext('appName');    
    const accountId = props?.env?.account
    const accountRegion = props?.env?.region    

    //Get the configuration
    try {
      var envVars = interfaces.getConfig();    
    } catch (error) {
      console.log('catch: ', error)
    }    
     //Get the configuration
     try {
      var envVars = interfaces.getConfig();    
    } catch (error) {
      console.log('catch: ', error)
    }
    
    //CodeCommit
    const source = new CodeCommitSource(this, 'Source', { 
      repositoryName: appName
    });
    

    // Build
    const synthAction = new CodeBuildStep('Synth', {               
      input: source.codePipelineSource,  
      partialBuildSpec: BuildSpec.fromObject({
          phases: {
            install: {
              'runtime-versions': {
                nodejs: 16,
              },
            },
            build: {             
              commands: ['yarn install --frozen-lockfile', 'npm run build' ],
            },
          },
          version: '0.2',
        }),
        commands: [],
      });
  
      //pipeline
      const pipeline = new CodePipeline(this, appName, {
        pipelineName: appName,
        synth: synthAction,
        dockerEnabledForSynth: true,
        crossAccountKeys: true,
        publishAssetsInParallel: false,   
      });

     
      
        // Stage - Dev
        const dev_stage = pipeline.addStage( 
          new Deployment(this, `${appName}-dev`, {       
            env: {
              account: envVars.env.dev.account,
              region: envVars.env.dev.region,
            },
          }
          )             
        );    
        

        const test_stage = pipeline.addStage( 
          new Deployment(this, `${appName}-test`, {       
            env: {
              account: envVars.env.test.account,
              region: envVars.env.test.region,
            },
          }
          )             
        );
        
        test_stage.addPost(new ManualApprovalStep('PromoteToProd'),) 

        const prod_stage = pipeline.addStage( 
          new Deployment(this, `${appName}-prod`,  {       
            env: {
              account: envVars.env.prod.account,
              region: envVars.env.prod.region,           
            },
          }
          )             
        );   
    
  
  }
}  

// Multiple deployment stages
class Deployment extends Stage {
  constructor(scope: Construct,  id: string, props?: StageProps) {
    super(scope, id, props)

    // const image = new ecrdeploy.ECRDeployment(this, `${id}-DeployDockerImage`, {
    //   src: new ecrdeploy.DockerImageName(appAsset.imageUri),
    //   dest: new ecrdeploy.DockerImageName(`${props?.env?.account}.dkr.ecr.${props?.env?.region}.amazonaws.com/nginx:latest`),
    // });    
        
    new DeploymentStack(this, id, {                 
    })  
  }  
} 
