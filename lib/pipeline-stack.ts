import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from '@aws-cdk/pipelines';

export class CDKPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyCDKPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('Dev-Temmy/awscdk-app-codepipeline-typescript', 'master'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });
  }
}