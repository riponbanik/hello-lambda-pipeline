import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import { Construct } from 'constructs';
import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';

export class DeploymentStack extends Stack {

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)
 
    // Defines an AWS Lambda resource
    const lambdaFunction = new lambda.Function(this, 'lambda-function', {
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 128,
      timeout: cdk.Duration.seconds(5),
      handler: 'hello.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '/../lambda')),
      environment: {
        REGION: cdk.Stack.of(this).region,
        AVAILABILITY_ZONES: JSON.stringify(
          cdk.Stack.of(this).availabilityZones,
        ),
      },
    });

    
  }  
    
}

