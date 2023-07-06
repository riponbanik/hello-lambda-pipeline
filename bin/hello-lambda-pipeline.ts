#!/usr/bin/env node
import 'source-map-support/register';
import { PipelineStack } from '../lib/pipeline';
import { App, Tags } from 'aws-cdk-lib';
import * as interfaces from '../lib/interfaces';

try {
  var envVars = interfaces.getConfig();
  const appName = 'HelloLambda';
  const app = new App({ context: { appName } });

  new PipelineStack(app, 'HelloLambdaPipelineStack', {      
    description: `${appName} pipeline`,
    env: {
      account: envVars.env.tools.account,
      region: envVars.env.tools.region,
    }  
  });
  app.synth();

} catch (error) {
    console.log('catch: ', error)
  }  