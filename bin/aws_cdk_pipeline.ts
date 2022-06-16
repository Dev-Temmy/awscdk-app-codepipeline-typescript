#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CDKPipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();

new CDKPipelineStack(app, 'CDKPipelineStack', {
env: { account: '379590863734', region: 'ap-southeast-2' },
});

app.synth();