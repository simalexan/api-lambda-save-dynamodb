"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/cdk");
const aws_sam_1 = require("@aws-cdk/aws-sam");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const aws_dynamodb_1 = require("@aws-cdk/aws-dynamodb");
//import { RestApi, LambdaIntegration, IResource, MockIntegration, PassthroughBehavior } from '@aws-cdk/aws-apigateway';
class ApiLambdaSaveDynamoDBStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const tableName = 'twitchViewers';
        const primaryKeyName = 'viewerId';
        const table = new aws_dynamodb_1.Table(this, 'viewers-table', {
            tableName: tableName,
            partitionKey: {
                name: primaryKeyName,
                type: aws_dynamodb_1.AttributeType.String
            },
            billingMode: aws_dynamodb_1.BillingMode.PayPerRequest
        });
        const api = new aws_sam_1.CfnApi(this, 'viewersApi', {
            stageName: 'prod',
            cors: '"*"'
        });
        new aws_sam_1.CfnFunction(this, 'SaveToDynamoDB', {
            codeUri: new aws_lambda_1.AssetCode('src').path,
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
exports.ApiLambdaSaveDynamoDBStack = ApiLambdaSaveDynamoDBStack;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWxhbWJkYS1zYXZlLWR5bmFtb2RiLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBpLWxhbWJkYS1zYXZlLWR5bmFtb2RiLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBQXFDO0FBQ3JDLDhDQUF1RDtBQUN2RCxvREFBaUQ7QUFDakQsd0RBQTBFO0FBQzFFLHdIQUF3SDtBQUV4SCxNQUFhLDBCQUEyQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBRXZELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxTQUFTLEdBQUcsZUFBZSxDQUFDO1FBRWxDLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQztRQUNsQyxNQUFNLEtBQUssR0FBRyxJQUFJLG9CQUFLLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUM3QyxTQUFTLEVBQUUsU0FBUztZQUNwQixZQUFZLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLGNBQWM7Z0JBQ3BCLElBQUksRUFBRSw0QkFBYSxDQUFDLE1BQU07YUFDM0I7WUFDRCxXQUFXLEVBQUUsMEJBQVcsQ0FBQyxhQUFhO1NBQ3ZDLENBQUMsQ0FBQztRQUVILE1BQU0sR0FBRyxHQUFHLElBQUksZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ3pDLFNBQVMsRUFBRSxNQUFNO1lBQ2pCLElBQUksRUFBRSxLQUFLO1NBQ1osQ0FBQyxDQUFDO1FBRUgsSUFBSSxxQkFBVyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUN0QyxPQUFPLEVBQUUsSUFBSSxzQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUk7WUFDbEMsT0FBTyxFQUFFLGVBQWU7WUFDeEIsT0FBTyxFQUFFLFlBQVk7WUFDckIsV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRTtvQkFDVCxVQUFVLEVBQUUsS0FBSyxDQUFDLFNBQVM7b0JBQzNCLFdBQVcsRUFBRSxjQUFjO2lCQUM1QjthQUNGO1lBQ0QsUUFBUSxFQUFFOzt5QkFFUyxTQUFTLEVBQUU7WUFDOUIsTUFBTSxFQUFFO2dCQUNOLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsS0FBSztvQkFDWCxVQUFVLEVBQUU7d0JBQ1YsSUFBSSxFQUFFLFVBQVU7d0JBQ2hCLE1BQU0sRUFBRSxNQUFNO3dCQUNkLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUztxQkFDekI7aUJBQ0Y7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxLQUFLO29CQUNYLFVBQVUsRUFBRTt3QkFDVixJQUFJLEVBQUUsVUFBVTt3QkFDaEIsTUFBTSxFQUFFLFNBQVM7d0JBQ2pCLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUztxQkFDekI7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXZERCxnRUF1REM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQkciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2RrID0gcmVxdWlyZSgnQGF3cy1jZGsvY2RrJyk7XHJcbmltcG9ydCB7IENmbkZ1bmN0aW9uLCBDZm5BcGkgfSBmcm9tICdAYXdzLWNkay9hd3Mtc2FtJztcclxuaW1wb3J0IHsgQXNzZXRDb2RlICB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xyXG5pbXBvcnQgeyBUYWJsZSwgQXR0cmlidXRlVHlwZSwgQmlsbGluZ01vZGUgfSBmcm9tICdAYXdzLWNkay9hd3MtZHluYW1vZGInO1xyXG4vL2ltcG9ydCB7IFJlc3RBcGksIExhbWJkYUludGVncmF0aW9uLCBJUmVzb3VyY2UsIE1vY2tJbnRlZ3JhdGlvbiwgUGFzc3Rocm91Z2hCZWhhdmlvciB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBBcGlMYW1iZGFTYXZlRHluYW1vREJTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgICBjb25zdCB0YWJsZU5hbWUgPSAndHdpdGNoVmlld2Vycyc7XHJcblxyXG4gICAgY29uc3QgcHJpbWFyeUtleU5hbWUgPSAndmlld2VySWQnO1xyXG4gICAgY29uc3QgdGFibGUgPSBuZXcgVGFibGUodGhpcywgJ3ZpZXdlcnMtdGFibGUnLCB7XHJcbiAgICAgIHRhYmxlTmFtZTogdGFibGVOYW1lLFxyXG4gICAgICBwYXJ0aXRpb25LZXk6IHtcclxuICAgICAgICBuYW1lOiBwcmltYXJ5S2V5TmFtZSxcclxuICAgICAgICB0eXBlOiBBdHRyaWJ1dGVUeXBlLlN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBiaWxsaW5nTW9kZTogQmlsbGluZ01vZGUuUGF5UGVyUmVxdWVzdFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgYXBpID0gbmV3IENmbkFwaSh0aGlzLCAndmlld2Vyc0FwaScsIHtcclxuICAgICAgc3RhZ2VOYW1lOiAncHJvZCcsXHJcbiAgICAgIGNvcnM6ICdcIipcIidcclxuICAgIH0pO1xyXG5cclxuICAgIG5ldyBDZm5GdW5jdGlvbih0aGlzLCAnU2F2ZVRvRHluYW1vREInLCB7XHJcbiAgICAgIGNvZGVVcmk6IG5ldyBBc3NldENvZGUoJ3NyYycpLnBhdGgsXHJcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcclxuICAgICAgcnVudGltZTogJ25vZGVqczguMTAnLFxyXG4gICAgICBlbnZpcm9ubWVudDoge1xyXG4gICAgICAgIHZhcmlhYmxlczoge1xyXG4gICAgICAgICAgVEFCTEVfTkFNRTogdGFibGUudGFibGVOYW1lLFxyXG4gICAgICAgICAgUFJJTUFSWV9LRVk6IHByaW1hcnlLZXlOYW1lXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBwb2xpY2llczogYFxyXG4gICAgICAgIC0gRHluYW1vREJDcnVkUG9saWN5OlxyXG4gICAgICAgICAgICBUYWJsZU5hbWU6ICR7dGFibGVOYW1lfWAsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIHNhdmU6IHtcclxuICAgICAgICAgIHR5cGU6ICdBcGknLFxyXG4gICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICBwYXRoOiAnL3ZpZXdlcnMnLFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgcmVzdEFwaUlkOiBhcGkubG9naWNhbElkXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzYXZlT3B0aW9uczoge1xyXG4gICAgICAgICAgdHlwZTogJ0FwaScsXHJcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgICAgIHBhdGg6ICcvdmlld2VycycsXHJcbiAgICAgICAgICAgIG1ldGhvZDogJ09QVElPTlMnLFxyXG4gICAgICAgICAgICByZXN0QXBpSWQ6IGFwaS5sb2dpY2FsSWRcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuLypmdW5jdGlvbiBhZGRDb3JzT3B0aW9ucyhhcGlSZXNvdXJjZTogSVJlc291cmNlKSB7XHJcbiAgYXBpUmVzb3VyY2UuYWRkTWV0aG9kKCdPUFRJT05TJywgbmV3IE1vY2tJbnRlZ3JhdGlvbih7XHJcbiAgICBpbnRlZ3JhdGlvblJlc3BvbnNlczogW3tcclxuICAgICAgc3RhdHVzQ29kZTogJzIwMCcsXHJcbiAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xyXG4gICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiBcIidDb250ZW50VHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5LFgtQW16LVNlY3VyaXR5LVRva2VuLFgtQW16LVVzZXItQWdlbnQnXCIsXHJcbiAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogXCInKidcIixcclxuICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFscyc6IFwiJ2ZhbHNlJ1wiLFxyXG4gICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiBcIidPUFRJT05TLFBPU1QsUFVUJ1wiLFxyXG4gICAgICB9XHJcbiAgICB9XSxcclxuICAgIHBhc3N0aHJvdWdoQmVoYXZpb3I6IFBhc3N0aHJvdWdoQmVoYXZpb3IuTmV2ZXIsXHJcbiAgICByZXF1ZXN0VGVtcGxhdGVzOiB7XHJcbiAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiBcIntcXFwic3RhdHVzQ29kZVxcXCI6MjAwfVwiXHJcbiAgICB9XHJcbiAgfSksIHtcclxuICAgICAgbWV0aG9kUmVzcG9uc2VzOiBbe1xyXG4gICAgICAgIHN0YXR1c0NvZGU6ICcyMDAnLFxyXG4gICAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IHRydWUsXHJcbiAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiB0cnVlLFxyXG4gICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHMnOiB0cnVlLFxyXG4gICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6IHRydWUsXHJcbiAgICAgICAgfVxyXG4gICAgICB9XVxyXG4gICAgfSk7XHJcbn0qLyJdfQ==