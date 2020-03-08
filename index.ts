import * as awsx from "@pulumi/awsx";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";

const config = new pulumi.Config();

const imageVersion = config.require("version") || "latest"
const serviceName = config.require("service_name") || "importmap-deployer-service"
const clusterName = config.require("cluster_name") || "importmap-deployer-cluster"
const imageId = config.require("image_id") || "importmap-deployer"

// Create a GCP resource (Storage Bucket)
const bucket = new aws.s3.Bucket("importmap-deployer-bucket");


const bucketPolicy = new aws.s3.BucketPolicy("my-bucket-policy", {
  bucket: bucket.bucket,
  policy: bucket.bucket.apply(publicReadPolicyForBucket)
})

function publicReadPolicyForBucket(bucketName: string) {
  return JSON.stringify({
      Version: "2012-10-17",
      Statement: [{
          Effect: "Allow",
          Principal: "*",
          Action: [
              "s3:GetObject",
              "s3:PutObject"
          ],
          Resource: [
              `arn:aws:s3:::${bucketName}/*` // policy refers to bucket name explicitly
          ]
      }]
  });
}
// Step 1: Create an ECS Fargate cluster.
const cluster = new awsx.ecs.Cluster(clusterName);

// Step 2: Define the Networking for our service.
const alb = new awsx.lb.ApplicationLoadBalancer(
    "net-lb", { external: true, securityGroups: cluster.securityGroups });

const web = alb.createListener("web", { port: 80, external: true });

// Step 3: Build and publish a Docker image to a private ECR registry.
const img = awsx.ecs.Image.fromPath(imageId, "./app");

// Step 4: Create a Fargate service task that can scale out.
const appService = new awsx.ecs.FargateService(serviceName, {
    cluster,
    taskDefinitionArgs: {
        container: {
            image: img,
            cpu: 102 /*10% of 1024*/,
            memory: 50 /*MB*/,
            portMappings: [ web ],
        },
    },
    desiredCount: 1,
});

// Step 5: Export the Internet address for the service.
export const url = web.endpoint.hostname;