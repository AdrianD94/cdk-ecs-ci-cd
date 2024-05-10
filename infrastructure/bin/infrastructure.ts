#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EcrStack } from '../lib/ecr.stack';
import { EcsStack } from '../lib/ecs-stack';
import { VpcStack } from '../lib/vpc.stack';
import { PipelineStack } from '../lib/pipeline-stack';
import { Environment } from 'aws-cdk-lib';
import {getAccountId, getRegion, resolveCurrentUserOwnerName} from "@exanubes/cdk-utils";

async function start(){
  const owner = await resolveCurrentUserOwnerName()
  const account = await getAccountId()
  const region = await getRegion()
  const env: Environment = {account, region}
  
  const app = new cdk.App();
  const ecr = new EcrStack(app, EcrStack.name, {env});
  const vpc = new VpcStack(app, VpcStack.name, {env});
  const ecs = new EcsStack(app, EcsStack.name, { repository: ecr.repository, vpc: vpc.vpc,env })

  
  new PipelineStack(app, PipelineStack.name, {
    repository: ecr.repository,
    service: ecs.fargate.service,
    cluster: ecs.cluster,
    container: ecs.fargate.taskDefinition.defaultContainer as any,
    env,
  })

}
start().catch(error=>console.log(error));