const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');
const processResponse = require('./process-response.js');
const TABLE_NAME = process.env.TABLE_NAME,
  PRIMARY_KEY = process.env.PRIMARY_KEY,
  IS_CORS = true;

exports.handler = async event => {
  
  const method = event.requestContext.http.method;

  if (method === 'OPTIONS') {
    return processResponse(IS_CORS);
  }
  if (!event.body) {
    return processResponse(IS_CORS, 'invalid', 400);
  }
  const item = JSON.parse(event.body);
  item[PRIMARY_KEY] = uuidv4();
  const params = {
    TableName: TABLE_NAME,
    Item: item
  }
  try {
    await dynamoDb.put(params).promise()
    return processResponse(IS_CORS);
  } catch (error) {
    let errorResponse = `Error: Execution update, caused a Dynamodb error, please look at your logs.`;
    if (error.code === 'ValidationException') {
      if (error.message.includes('reserved keyword')) errorResponse = `Error: You're using AWS reserved keywords as attributes`;
    }
    console.log(error);
    return processResponse(IS_CORS, errorResponse, 500);
  }
};
