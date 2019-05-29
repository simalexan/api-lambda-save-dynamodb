import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { ApiLambdaSaveDynamoDBStack } from '../lib/api-lambda-save-dynamodb-stack';

const app = new cdk.App();
new ApiLambdaSaveDynamoDBStack(app, 'ApiLambdaDynamoDBStack');