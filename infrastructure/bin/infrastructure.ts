#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EcrStack } from '../lib/ecr.stack';
import { EcsStack } from '../lib/ecs-stack';
import { VpcStack } from '../lib/vpc.stack';
import { PipelineStack } from '../lib/pipeline-stack';
import { Environment } from 'aws-cdk-lib';
// import {getAccountId, getRegion, resolveCurrentUserOwnerName} from "@exanubes/cdk-utils";

async function start(){
  const env: Environment = {account:'572707288963', region:'eu-central-1'}
  
  const app = new cdk.App();
  const ecr = new EcrStack(app, EcrStack.name, {env});
  const vpc = new VpcStack(app, VpcStack.name, {env});
  const ecsDev = new EcsStack(app, `${EcsStack.name}-dev`, { repository: ecr.repository, vpc: vpc.vpc,env, desiredCount:1, domain:{
    domainName:'dev.adriandrozman.com',
    hostedZone:'Z00158631CR24AXUM6EHW'
  } })
  // const ecsQa = new EcsStack(app, `${EcsStack.name}-qa`, { repository: ecr.repository, vpc: vpc.vpc,env, desiredCount:2, route53:{
  //    domainName:'qa.adriandrozman.com',
  //     hostedZone:'Z08040952VB4K1BZLXQF8'
  // } })

  
  // new PipelineStack(app, PipelineStack.name, {
  //   repository: ecr.repository,
  //   devEnv:{
  //     service: ecsDev.fargate.service,
  //     cluster: ecsDev.cluster,
  //     container: ecsDev.fargate.taskDefinition.defaultContainer as any,
  //   },
  //   qaEnv:{
  //      service: ecsQa.fargate.service,
  //     cluster: ecsQa.cluster,
  //     container: ecsQa.fargate.taskDefinition.defaultContainer as any,
  //   },
  //   env,
  // })

}
start().catch(error=>console.log(error));