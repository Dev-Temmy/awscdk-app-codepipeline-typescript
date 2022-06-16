import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from '@aws-cdk/pipelines';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';
//import {} from '../../../../'

export class CDKPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //const sourceArtifact = new CodePipeline.Artifact();
    //const cloudAssemblyArtifact = new CodePipeline.Artifact();

    // Set your Github username and repository name
        const branch = 'master';
        const gitHubUsernameRepository = 'Dev-Temmy/awscdk-app-codepipeline-typescript';

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyCDKPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub(gitHubUsernameRepository, branch, {
          authentication: cdk.SecretValue.secretsManager('Github-awscdk-app-codepipeline-typescript-token'),
    }),
      installCommands: [
                    'npm install -g aws-cdk'
                ],
                commands: [
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'
                ]
            })
        });
    }
  }