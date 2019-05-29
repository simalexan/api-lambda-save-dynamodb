"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("@aws-cdk/cdk");
const api_lambda_save_dynamodb_stack_1 = require("../lib/api-lambda-save-dynamodb-stack");
const app = new cdk.App();
new api_lambda_save_dynamodb_stack_1.ApiLambdaSaveDynamoDBStack(app, 'ApiLambdaDynamoDBStack');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWxhbWJkYS1zYXZlLWR5bmFtb2RiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBpLWxhbWJkYS1zYXZlLWR5bmFtb2RiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQXFDO0FBQ3JDLG9DQUFxQztBQUNyQywwRkFBbUY7QUFFbkYsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBSSwyREFBMEIsQ0FBQyxHQUFHLEVBQUUsd0JBQXdCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnc291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyJztcclxuaW1wb3J0IGNkayA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2NkaycpO1xyXG5pbXBvcnQgeyBBcGlMYW1iZGFTYXZlRHluYW1vREJTdGFjayB9IGZyb20gJy4uL2xpYi9hcGktbGFtYmRhLXNhdmUtZHluYW1vZGItc3RhY2snO1xyXG5cclxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcclxubmV3IEFwaUxhbWJkYVNhdmVEeW5hbW9EQlN0YWNrKGFwcCwgJ0FwaUxhbWJkYUR5bmFtb0RCU3RhY2snKTsiXX0=