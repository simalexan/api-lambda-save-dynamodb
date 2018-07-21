
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

It's a Nuts & Bolts application component for AWS Serverless Application Repository.

## Latest Release - 1.0.2

Added a few fixes regarding datatable naming:

- Enabled underscore `_` as an enabled character in the table name
- Added a `ValidationException` Reserved Keywords error response reply

## Roadmap - Upcoming changes

Here are the upcoming changes that I'll add to this serverless component:

- ESLint
- Tests
