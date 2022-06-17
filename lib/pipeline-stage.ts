import { Stage, Construct, StageProps } from "@aws-cdk/core";

export class CDKPipelineStage extends Stage  {
	constructor(scope: Construct, id: string, props?: StageProps) {
		super(scope, id, props);

	}
}