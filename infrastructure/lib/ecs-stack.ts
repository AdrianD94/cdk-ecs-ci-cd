import { Stack, StackProps } from "aws-cdk-lib";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { IRepository } from "aws-cdk-lib/aws-ecr";
import { Cluster, ContainerDefinition, CpuArchitecture, EcrImage, OperatingSystemFamily } from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { HostedZone } from "aws-cdk-lib/aws-route53";

import { Construct } from "constructs";

interface CustomProps extends StackProps {
    vpc: IVpc;
    repository: IRepository,
    desiredCount:number,
    domain:{
        domainName:string,
        hostedZone:string;
        hostedId:string;
    },
    environment:string
}

export class EcsStack extends Stack {
    public readonly fargate: ApplicationLoadBalancedFargateService;
    public readonly container: ContainerDefinition;
    public readonly cluster: Cluster;

    constructor(scope: Construct, id: string, props: CustomProps) {
        super(scope, id, props);

        this.cluster = new Cluster(this, `webshot-ecs-${props.environment}`, {
            clusterName: `webshot-cluster-${props.environment}`,
            containerInsights: true,
            vpc: props.vpc,
        });

        this.fargate = new ApplicationLoadBalancedFargateService(this, `webshot-fargate-${props.environment}`, {
            assignPublicIp: true,
            cluster: this.cluster,
            desiredCount: props.desiredCount,
            publicLoadBalancer: true,
            taskImageOptions: {
                image: EcrImage.fromEcrRepository(props.repository),
                containerPort: 8094,
            },
            runtimePlatform: {
                cpuArchitecture: CpuArchitecture.ARM64,
                operatingSystemFamily: OperatingSystemFamily.LINUX
            },
//             domainName: props.domain.domainName,
//   domainZone: HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
//     hostedZoneId: props.domain.hostedId,
//     zoneName: props.domain.hostedZone,
//   }),
        })
    }
}
