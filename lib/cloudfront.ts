import * as cdk from "@aws-cdk/core";
import { Bucket } from "@aws-cdk/aws-s3";
import { BucketDeployment, Source } from "@aws-cdk/aws-s3-deployment";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as route53 from "@aws-cdk/aws-route53";
import * as targets from "@aws-cdk/aws-route53-targets";
import {
  OriginAccessIdentity,
  AllowedMethods,
  ViewerProtocolPolicy,
  OriginProtocolPolicy,
  Distribution,
} from "@aws-cdk/aws-cloudfront";

interface CustomStackProps extends cdk.StackProps {
  stage: string;
}

export class CloudfrontDemoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: CustomStackProps) {
    super(scope, id, props);
    
    // Importing ALB domain name
    const loadBalancerDomain = cdk.Fn.importValue("loadBalancerUrl");
      
    // Getting external configuration values from cdk.json file
    //const config = this.node.tryGetContext("stages")[props.stage];

    // Importing already provisioned SSL certificate 
    const certificateArn = 'arn:aws:acm:us-east-1:379590863734:certificate/84640c81-d45f-41a6-bd56-f6d74d148550';
    const certificate = acm.Certificate.fromCertificateArn(this, 'Certificate', certificateArn);

    // Web hosting bucket
    let websiteBucket = new Bucket(this, "websiteBucket", {
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Trigger frontend deployment
    new BucketDeployment(this, "websiteDeployment", {
      sources: [Source.asset("../aws_cdk_stack_typescript/frontend/build/")],
      destinationBucket: websiteBucket as any
    });

    // Create Origin Access Identity for CloudFront
    const originAccessIdentity = new OriginAccessIdentity(this, "cloudfrontOAI", {
      comment: "OAI for web application cloudfront distribution",
    });

    // Creating CloudFront distribution
    let cloudFrontDist = new Distribution(this, "cloudfrontDist", {
      defaultRootObject: "index.html",
      domainNames: ["awscdkexample.cloudtherapy.link"],
      certificate,
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket as any, {
          originAccessIdentity: originAccessIdentity as any,
        }) as any,
        compress: true,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
      },
    });

    // Creating custom origin for the application load balancer
    const loadBalancerOrigin = new origins.HttpOrigin(loadBalancerDomain, {
      protocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
    });

    // Creating the path pattern to direct to the load balancer origin
    cloudFrontDist.addBehavior("/generate/*", loadBalancerOrigin as any, {
      compress: true,
      viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
      allowedMethods: AllowedMethods.ALLOW_ALL,
    });


    // Get the zone
    const zone = route53.HostedZone.fromHostedZoneAttributes(this, "zone",
      {
        zoneName: "cloudtherapy.link",
        hostedZoneId: "Z0935471VDBASDT47II6",
      });

      // Adding out A Record code
      new route53.ARecord(this, "CDNARecord", {zone,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(cloudFrontDist)),
    });

    new cdk.CfnOutput(this, "cloudfrontDomainUrl", {
      value: cloudFrontDist.distributionDomainName,
      exportName: "cloudfrontDomainUrl",
    });
  }
}
