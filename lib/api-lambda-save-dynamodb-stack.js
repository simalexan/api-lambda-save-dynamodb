"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/cdk");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const aws_dynamodb_1 = require("@aws-cdk/aws-dynamodb");
const aws_apigateway_1 = require("@aws-cdk/aws-apigateway");
class ApiLambdaSaveDynamoDBStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const primaryKeyName = 'viewerId';
        const table = new aws_dynamodb_1.Table(this, 'viewers-table', {
            tableName: 'twitchViewers',
            partitionKey: {
                name: primaryKeyName,
                type: aws_dynamodb_1.AttributeType.String
            },
            billingMode: aws_dynamodb_1.BillingMode.PayPerRequest
        });
        const saveFunction = new aws_lambda_1.Function(this, 'SaveToDynamoDB', {
            code: new aws_lambda_1.AssetCode('src'),
            handler: 'index.handler',
            runtime: aws_lambda_1.Runtime.NodeJS10x,
            environment: {
                TABLE_NAME: table.tableName,
                PRIMARY_KEY: primaryKeyName
            },
            memorySize: 256
        });
        table.grantReadWriteData(saveFunction);
        const api = new aws_apigateway_1.RestApi(this, 'viewers'); // <API_URL>
        const viewers = api.root.addResource('viewers'); // <API_URL>/viewers
        const saveIntegration = new aws_apigateway_1.LambdaIntegration(saveFunction); // (Integrate)-> saveFunction
        viewers.addMethod('POST', saveIntegration); // POST <API_URL>/viewers (Integrate)-> saveFunction
        addCorsOptions(viewers);
    }
}
exports.ApiLambdaSaveDynamoDBStack = ApiLambdaSaveDynamoDBStack;
function addCorsOptions(apiResource) {
    apiResource.addMethod('OPTIONS', new aws_apigateway_1.MockIntegration({
        integrationResponses: [{
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Headers': "'ContentType,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                    'method.response.header.Access-Control-Allow-Origin': "'*'",
                    'method.response.header.Access-Control-Allow-Credentials': "'false'",
                    'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,POST,PUT'",
                }
            }],
        passthroughBehavior: aws_apigateway_1.PassthroughBehavior.Never,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWxhbWJkYS1zYXZlLWR5bmFtb2RiLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBpLWxhbWJkYS1zYXZlLWR5bmFtb2RiLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBQXFDO0FBQ3JDLG9EQUFtRTtBQUNuRSx3REFBMEU7QUFDMUUsNERBQXNIO0FBRXRILE1BQWEsMEJBQTJCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFFdkQsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUM7UUFDbEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxvQkFBSyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDN0MsU0FBUyxFQUFFLGVBQWU7WUFDMUIsWUFBWSxFQUFFO2dCQUNaLElBQUksRUFBRSxjQUFjO2dCQUNwQixJQUFJLEVBQUUsNEJBQWEsQ0FBQyxNQUFNO2FBQzNCO1lBQ0QsV0FBVyxFQUFFLDBCQUFXLENBQUMsYUFBYTtTQUN2QyxDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxJQUFJLHFCQUFRLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ3hELElBQUksRUFBRSxJQUFJLHNCQUFTLENBQUMsS0FBSyxDQUFDO1lBQzFCLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLE9BQU8sRUFBRSxvQkFBTyxDQUFDLFNBQVM7WUFDMUIsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRSxLQUFLLENBQUMsU0FBUztnQkFDM0IsV0FBVyxFQUFFLGNBQWM7YUFDNUI7WUFDRCxVQUFVLEVBQUUsR0FBRztTQUNoQixDQUFDLENBQUM7UUFDSCxLQUFLLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFdkMsTUFBTSxHQUFHLEdBQUcsSUFBSSx3QkFBTyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVk7UUFDdEQsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxvQkFBb0I7UUFDckUsTUFBTSxlQUFlLEdBQUcsSUFBSSxrQ0FBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLDZCQUE2QjtRQUMxRixPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLG9EQUFvRDtRQUNoRyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUIsQ0FBQztDQUNGO0FBakNELGdFQWlDQztBQUVELFNBQVMsY0FBYyxDQUFDLFdBQXNCO0lBQzVDLFdBQVcsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksZ0NBQWUsQ0FBQztRQUNuRCxvQkFBb0IsRUFBRSxDQUFDO2dCQUNyQixVQUFVLEVBQUUsS0FBSztnQkFDakIsa0JBQWtCLEVBQUU7b0JBQ2xCLHFEQUFxRCxFQUFFLHdGQUF3RjtvQkFDL0ksb0RBQW9ELEVBQUUsS0FBSztvQkFDM0QseURBQXlELEVBQUUsU0FBUztvQkFDcEUscURBQXFELEVBQUUsb0JBQW9CO2lCQUM1RTthQUNGLENBQUM7UUFDRixtQkFBbUIsRUFBRSxvQ0FBbUIsQ0FBQyxLQUFLO1FBQzlDLGdCQUFnQixFQUFFO1lBQ2hCLGtCQUFrQixFQUFFLHNCQUFzQjtTQUMzQztLQUNGLENBQUMsRUFBRTtRQUNBLGVBQWUsRUFBRSxDQUFDO2dCQUNoQixVQUFVLEVBQUUsS0FBSztnQkFDakIsa0JBQWtCLEVBQUU7b0JBQ2xCLHFEQUFxRCxFQUFFLElBQUk7b0JBQzNELG9EQUFvRCxFQUFFLElBQUk7b0JBQzFELHlEQUF5RCxFQUFFLElBQUk7b0JBQy9ELHFEQUFxRCxFQUFFLElBQUk7aUJBQzVEO2FBQ0YsQ0FBQztLQUNILENBQUMsQ0FBQztBQUNQLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2RrID0gcmVxdWlyZSgnQGF3cy1jZGsvY2RrJyk7XHJcbmltcG9ydCB7IEZ1bmN0aW9uLCBBc3NldENvZGUsIFJ1bnRpbWUgfSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcclxuaW1wb3J0IHsgVGFibGUsIEF0dHJpYnV0ZVR5cGUsIEJpbGxpbmdNb2RlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWR5bmFtb2RiJztcclxuaW1wb3J0IHsgUmVzdEFwaSwgTGFtYmRhSW50ZWdyYXRpb24sIElSZXNvdXJjZSwgTW9ja0ludGVncmF0aW9uLCBQYXNzdGhyb3VnaEJlaGF2aW9yIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXknO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwaUxhbWJkYVNhdmVEeW5hbW9EQlN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcclxuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xyXG5cclxuICAgIGNvbnN0IHByaW1hcnlLZXlOYW1lID0gJ3ZpZXdlcklkJztcclxuICAgIGNvbnN0IHRhYmxlID0gbmV3IFRhYmxlKHRoaXMsICd2aWV3ZXJzLXRhYmxlJywge1xyXG4gICAgICB0YWJsZU5hbWU6ICd0d2l0Y2hWaWV3ZXJzJyxcclxuICAgICAgcGFydGl0aW9uS2V5OiB7XHJcbiAgICAgICAgbmFtZTogcHJpbWFyeUtleU5hbWUsXHJcbiAgICAgICAgdHlwZTogQXR0cmlidXRlVHlwZS5TdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgYmlsbGluZ01vZGU6IEJpbGxpbmdNb2RlLlBheVBlclJlcXVlc3RcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHNhdmVGdW5jdGlvbiA9IG5ldyBGdW5jdGlvbih0aGlzLCAnU2F2ZVRvRHluYW1vREInLCB7XHJcbiAgICAgIGNvZGU6IG5ldyBBc3NldENvZGUoJ3NyYycpLFxyXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXHJcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTm9kZUpTMTB4LFxyXG4gICAgICBlbnZpcm9ubWVudDoge1xyXG4gICAgICAgIFRBQkxFX05BTUU6IHRhYmxlLnRhYmxlTmFtZSxcclxuICAgICAgICBQUklNQVJZX0tFWTogcHJpbWFyeUtleU5hbWVcclxuICAgICAgfSxcclxuICAgICAgbWVtb3J5U2l6ZTogMjU2XHJcbiAgICB9KTtcclxuICAgIHRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShzYXZlRnVuY3Rpb24pO1xyXG5cclxuICAgIGNvbnN0IGFwaSA9IG5ldyBSZXN0QXBpKHRoaXMsICd2aWV3ZXJzJyk7IC8vIDxBUElfVVJMPlxyXG4gICAgY29uc3Qgdmlld2VycyA9IGFwaS5yb290LmFkZFJlc291cmNlKCd2aWV3ZXJzJyk7IC8vIDxBUElfVVJMPi92aWV3ZXJzXHJcbiAgICBjb25zdCBzYXZlSW50ZWdyYXRpb24gPSBuZXcgTGFtYmRhSW50ZWdyYXRpb24oc2F2ZUZ1bmN0aW9uKTsgLy8gKEludGVncmF0ZSktPiBzYXZlRnVuY3Rpb25cclxuICAgIHZpZXdlcnMuYWRkTWV0aG9kKCdQT1NUJywgc2F2ZUludGVncmF0aW9uKTsgLy8gUE9TVCA8QVBJX1VSTD4vdmlld2VycyAoSW50ZWdyYXRlKS0+IHNhdmVGdW5jdGlvblxyXG4gICAgYWRkQ29yc09wdGlvbnModmlld2Vycyk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRDb3JzT3B0aW9ucyhhcGlSZXNvdXJjZTogSVJlc291cmNlKSB7XHJcbiAgYXBpUmVzb3VyY2UuYWRkTWV0aG9kKCdPUFRJT05TJywgbmV3IE1vY2tJbnRlZ3JhdGlvbih7XHJcbiAgICBpbnRlZ3JhdGlvblJlc3BvbnNlczogW3tcclxuICAgICAgc3RhdHVzQ29kZTogJzIwMCcsXHJcbiAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xyXG4gICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiBcIidDb250ZW50VHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5LFgtQW16LVNlY3VyaXR5LVRva2VuLFgtQW16LVVzZXItQWdlbnQnXCIsXHJcbiAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogXCInKidcIixcclxuICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFscyc6IFwiJ2ZhbHNlJ1wiLFxyXG4gICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiBcIidPUFRJT05TLFBPU1QsUFVUJ1wiLFxyXG4gICAgICB9XHJcbiAgICB9XSxcclxuICAgIHBhc3N0aHJvdWdoQmVoYXZpb3I6IFBhc3N0aHJvdWdoQmVoYXZpb3IuTmV2ZXIsXHJcbiAgICByZXF1ZXN0VGVtcGxhdGVzOiB7XHJcbiAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiBcIntcXFwic3RhdHVzQ29kZVxcXCI6MjAwfVwiXHJcbiAgICB9XHJcbiAgfSksIHtcclxuICAgICAgbWV0aG9kUmVzcG9uc2VzOiBbe1xyXG4gICAgICAgIHN0YXR1c0NvZGU6ICcyMDAnLFxyXG4gICAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IHRydWUsXHJcbiAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiB0cnVlLFxyXG4gICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHMnOiB0cnVlLFxyXG4gICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6IHRydWUsXHJcbiAgICAgICAgfVxyXG4gICAgICB9XVxyXG4gICAgfSk7XHJcbn0iXX0=