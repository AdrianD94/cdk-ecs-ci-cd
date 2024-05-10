import { Stack, StackProps } from "aws-cdk-lib";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { IRepository } from "aws-cdk-lib/aws-ecr";
import { Cluster, ContainerDefinition, CpuArchitecture, EcrImage, OperatingSystemFamily } from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";

import { Construct } from "constructs";

interface CustomProps extends StackProps {
    vpc: IVpc;
    repository: IRepository
}

export class EcsStack extends Stack {
    public readonly fargate: ApplicationLoadBalancedFargateService;
    public readonly container: ContainerDefinition;
    public readonly cluster: Cluster;

    constructor(scope: Construct, id: string, props: CustomProps) {
        super(scope, id, props);

        this.cluster = new Cluster(this, 'webshot-ecs', {
            clusterName: 'webshot-cluster',
            containerInsights: true,
            vpc: props.vpc,
        });

        this.fargate = new ApplicationLoadBalancedFargateService(this, 'webshot-fargate', {
            assignPublicIp: true,
            cluster: this.cluster,
            desiredCount: 1,
            publicLoadBalancer: true,
            taskImageOptions: {
                image: EcrImage.fromEcrRepository(props.repository),
                containerPort: 8094,
            },
            runtimePlatform: {
                cpuArchitecture: CpuArchitecture.ARM64,
                operatingSystemFamily: OperatingSystemFamily.LINUX
            }
        })
    }
}
