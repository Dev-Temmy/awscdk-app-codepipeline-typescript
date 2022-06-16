#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';

//import { App, Stack } from 'aws-cdk-lib';


import { FargateDemoStack } from '../lib/fargate';
import {CloudfrontDemoStack} from '../lib/cloudfront';
import { CDKPipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();

new CDKPipelineStack(app, 'CDKPipelineStack', {
env: { account: '379590863734', region: 'ap-southeast-2' },
});


new FargateDemoStack(app, 'FargateDemoStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
    env: { account: '379590863734', region: 'ap-southeast-2' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

// CloudfrontDemoStack
new CloudfrontDemoStack(app, "CloudfrontDemoStack", {
  stage: "prod",
  env: { account: '379590863734', region: 'ap-southeast-2'
},
});

app.synth();