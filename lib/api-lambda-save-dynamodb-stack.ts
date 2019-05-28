import cdk = require('@aws-cdk/cdk');
import { Function, AssetCode, Runtime } from '@aws-cdk/aws-lambda';
import { Table, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb';
import { RestApi, LambdaIntegration, IResource, MockIntegration, PassthroughBehavior } from '@aws-cdk/aws-apigateway';

export class ApiLambdaSaveDynamoDBStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const primaryKeyName = 'viewerId';
    const table = new Table(this, 'viewers-table', {
      tableName: 'twitchViewers',
      partitionKey: {
        name: primaryKeyName,
        type: AttributeType.String
      },
      billingMode: BillingMode.PayPerRequest
    });

    const saveFunction = new Function(this, 'SaveToDynamoDB', {
      code: new AssetCode('src'),
      handler: 'index.handler',
      runtime: Runtime.NodeJS10x,
      environment: {
        TABLE_NAME: table.tableName,
        PRIMARY_KEY: primaryKeyName
      }
    });
    table.grantReadWriteData(saveFunction);

    const api = new RestApi(this, 'viewers'); // <API_URL>
    const viewers = api.root.addResource('viewers'); // <API_URL>/viewers
    const saveIntegration = new LambdaIntegration(saveFunction); // (Integrate)-> saveFunction
    viewers.addMethod('POST', saveIntegration); // POST <API_URL>/viewers (Integrate)-> saveFunction
    addCorsOptions(viewers);
  }
}

function addCorsOptions(apiResource: IResource) {
  apiResource.addMethod('OPTIONS', new MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'ContentType,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,POST,PUT'",
      }
    }],
    passthroughBehavior: PassthroughBehavior.Never,
    requestTemplates: {
      "application/json": "{\"statusCode\":200}"
    }
  }), {
      methodResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Credentials': true,
          'method.response.header.Access-Control-Allow-Methods': true,
        }
      }]
    });
}