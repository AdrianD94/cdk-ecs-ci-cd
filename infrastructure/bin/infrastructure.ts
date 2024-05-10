#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EcrStack } from '../lib/ecr.stack';
import { EcsStack } from '../lib/ecs-stack';
import { VpcStack } from '../lib/vpc.stack';


const app = new cdk.App();
const ecr = new EcrStack(app, EcrStack.name, {});
const vpc = new VpcStack(app, VpcStack.name, {});
new EcsStack(app, EcsStack.name, { repository: ecr.repository, vpc: vpc.vpc })