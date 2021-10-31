const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');
const processResponse = require('./process-response.js');
const TABLE_NAME = process.env.TABLE_NAME,
  PRIMARY_KEY = process.env.PRIMARY_KEY,
  IS_CORS = true;

exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return processResponse(IS_CORS);
  }
  if (!event.body) {
    return processResponse(IS_CORS, 'invalid', 400);
  }
  const item = JSON.parse(event.body);
  
  //require user to provide an unique primary key
  if(!item[PRIMARY_KEY])
    return processResponse(IS_CORS, 'please provide unique primary key', 400);
  
  // idempotence check
  try {
    var params1 = {
      TableName: TABLE_NAME,
      Key:{
          'savetableId': item[PRIMARY_KEY]
      }
    };
    var data = await dynamoDb.get(params1).promise();
    
    if(data.Item) {
      // data have been saved, this is a duplicate write
      return processResponse(IS_CORS);
    }
    // data have not been saved
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
    
  } catch (error) {
    return processResponse(IS_CORS, 'error', 500);
  }

};
