import cdk = require('@aws-cdk/cdk');
import { CfnFunction, CfnApi } from '@aws-cdk/aws-sam';
import { AssetCode  } from '@aws-cdk/aws-lambda';
import { Table, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb';
//import { RestApi, LambdaIntegration, IResource, MockIntegration, PassthroughBehavior } from '@aws-cdk/aws-apigateway';

export class ApiLambdaSaveDynamoDBStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tableName = 'twitchViewers';

    const primaryKeyName = 'viewerId';
    const table = new Table(this, 'viewers-table', {
      tableName: tableName,
      partitionKey: {
        name: primaryKeyName,
        type: AttributeType.String
      },
      billingMode: BillingMode.PayPerRequest
    });

    const api = new CfnApi(this, 'viewersApi', {
      stageName: 'prod',
      cors: '"*"'
    });

    new CfnFunction(this, 'SaveToDynamoDB', {
      codeUri: new AssetCode('src').path,
      handler: 'index.handler',
      runtime: 'nodejs8.10',
      environment: {
        variables: {
          TABLE_NAME: table.tableName,
          PRIMARY_KEY: primaryKeyName
        }
      },
      policies: `
        - DynamoDBCrudPolicy:
            TableName: ${tableName}`,
      events: {
        save: {
          type: 'Api',
          properties: {
            path: '/viewers',
            method: 'POST',
            restApiId: api.logicalId
          }
        },
        saveOptions: {
          type: 'Api',
          properties: {
            path: '/viewers',
            method: 'OPTIONS',
            restApiId: api.logicalId
          }
        }
      }
    });
  }
}

/*function addCorsOptions(apiResource: IResource) {
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
}*/