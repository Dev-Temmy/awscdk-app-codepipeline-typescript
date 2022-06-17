import * as cdk from '@aws-cdk/core';
//import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, CodeBuildStep } from 'aws-cdk-lib/pipelines';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import * as pipelines from '@aws-cdk/pipelines'
//import { CDKPipelineStage } from "./pipeline-stage";
//import {} from '../../../../'

export class CDKPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //const sourceArtifact = new CodePipeline.Artifact();
    //const cloudAssemblyArtifact = new CodePipeline.Artifact();

    // Set your Github username and repository name
        const branch = 'master';
        const gitHubUsernameRepository = 'Dev-Temmy/awscdk-app-codepipeline-typescript';

    const modernPipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      selfMutation: false,
      pipelineName: 'MyCDKPipeline', 
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub(gitHubUsernameRepository, branch, {
          authentication: cdk.SecretValue.secretsManager('Github-awscdk-app-codepipeline-typescript-token'),
    }),
    installCommands: ['npm install -g aws-cdk'],
      commands: ['npm ci','npm run build','npx cdk synth']
            })
        });

         //***********Instantiate the stage and add it to the pipeline***********
		//const deploy = new CDKPipelineStage(this, "Deploy");
		//modernPipeline.addStage(deploy);
    }
  }