# AWS Fargate

AWS Fargate deployment for [importmap-deployer](https://github.com/single-spa/import-map-deployer) used by [single-spa](https://single-spa.js.org/) [Micro Frontends](https://micro-frontends.org/)

## Prerequisites

Ensure you have [downloaded and installed the Pulumi CLI](https://www.pulumi.com/docs/get-started/install/).

## Pulumi stack for importmap deployer on AWS

The importmap deployer is a service required for single-spa Micro Frontends to deploy importmaps

This Pulumi stack is designed to make it easy to set up AWS infrastructure for [importmap-deployer](https://github.com/single-spa/import-map-deployer)

The stack will:

- Create an AWS Fargate service named `importmap-deployer-service`
- Define image `importmap-deployer` based on image `importmap-deployer:latest` that must exist in ECR container registry
- Deploy image `importmap-deployer` in service `importmap-deployer-service`
- Create an AWS Storage Bucket `importmap-bucket`
- Create policy to allow all users to access service
- Create policy to allow all users to access bucket

The image `importmap-deployer` can be found in the folder of the same name.

## Resources

- [Pulumi AWS Fargate service](https://www.pulumi.com/blog/get-started-with-docker-on-aws-fargate-using-pulumi/)
- [Pulumi ASWS bucket](https://www.pulumi.com/docs/aws/s3/)

## Quickstart

1. Install dependencies
2. Push image to ECR Container Registry (via docker)
3. Run `pulumi up` to create stack on AWS and deploy image on service

### Install

Install dependencies

```sh
$ npm i
# dependencies
```

### Push importmap-deployer image to ECR

Define environment variables

```sh
$ EXPORT $AWS_ACCOUNT_ID=[your account id]
$ EXPORT $AWS_REGION_ID=[region id such as: eu-central-1]
$ EXPORT $FARGATE_SERVICE_NAME=importmap-deployer
# ...
```

See [AWS - Pushing an Image](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html)

Create an ECR registry

```sh
$ EXPORT AWS_REGISTRY_NAME=micro-frontends
$ aws ecr create-repository --repository-name $AWS_REGISTRY_NAME
{
  "repository": {
        "repositoryArn": "arn:aws:ecr:eu-central-1:123456789012:repository/micro-frontends",
        "registryId": "123456789012",
        "repositoryName": "micro-frontends",
        "repositoryUri": "123456789012.dkr.ecr.eu-central-1.amazonaws.com/randserver",
      "createdAt": 1543162198.0
  }
}
```

Now create an ENV variable for the generated `registryId` to use as a reference in the following commands

```sh
$ EXPORT $AWS_REGISTRY_ID=123456789012
```

Optionally set up a lifecycle policy to clean up old images

```sh
$ EXPORT $MAX_IMG_COUNT=100
$ aws ecr put-lifecycle-policy --registry-id $AWS_REGISTRY_ID --repository-name $AWS_REGISTRY_NAME --lifecycle-policy-text '{"rules":[{"rulePriority":10,"description":"Expire old images","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":$MAX_IMG_COUNT},"action":{"type":"expire"}}]}'
```

Login to registry

```sh
$ $(aws ecr get-login --registry-ids $AWS_REGISTRY_ID --no-include-email)
```

Build image and push to ECR container registry

```sh
$ EXPORT IMG_VERSION=0.0.1
$ docker build -t importmap-deployer
$ docker push $AWS_REGISTRY_ID.dkr.ecr.$AWS_REGION_ID.amazonaws.com/$AWS_REGISTRY_NAME:$IMG_VERSION
```

## Run

Note: output when this pulumi stack only built a bucket

```sh
$ pulumi up
...

Permalink: https://app.pulumi.com/username/importmap-deployer/dev/updates/1  
```

### Pulumi Configuration

To control the resources being built, use can use [Pulumi Config](https://www.pulumi.com/docs/intro/concepts/config/)

```sh
$ pulumi config set <key> [value]
# ...
```

Passing the `--secret` flag to the config set command encrypts the data and stores the resulting ciphertext instead of plaintext.

```sh
$ pulumi config set --secret dbPassword S3cr37
# ...
```

Alternatively add variables to the `Pulumi.yaml` file

To see the list of config variables

```sh
$ pulumi config
KEY                        VALUE
aws:region                 us-west-1
dbPassword                 ********
```

To use from within the pulumi source code file `index.ts`

```ts
import * as pulumi from "@pulumi/pulumi";

// create a config singleton containing all set config variables
const config = new pulumi.Config();

// use the config
console.log(`Password: ${config.require("dbPassword")}`);
```

Currently the code uses the following config vars:

- `version`
- `service_name`

```ts
const imageVersion = config.require("version") || "latest"
const serviceName = config.require("service_name") || "importmap-deployer-service"
```
