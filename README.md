
# Api Gateway -> Lambda (Put) -> DynamoDB

## Description

This is a serverless component consisting of:

- an API Gateway, receiving request data
- a Lambda function, that processes that data and saves
- a DynamoDB table, where all your data is stored.

Aside from this main functionality, its important features are:

- Supports CORS
- Written in Node.js
- Easily composable into your other app components by adding triggers to its DynamoDB table

## Latest Release - 2.0.0

Added a few fixes regarding datatable naming:

- Fixed CORS
- Changed the billing mode of the DynamoDB table to PAY_PER_REQUEST
- Changed the StageName to `prod`

## Future Release

Switch to AWS CDK

## Roadmap - Upcoming changes

Here are the upcoming changes that I'll add to this serverless component:

- TypeScript
- Potentially converting to an AWS CDK component on SAR
- ESLint
- Tests
