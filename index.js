const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');
const processResponse = require('./process-response.js');
const TABLE_NAME = process.env.TABLE_NAME;
const IS_CORS = process.env.IS_CORS;
const PRIMARY_KEY = process.env.PRIMARY_KEY;

exports.handler = (event) => {
    if (event.httpMethod === 'OPTIONS') {
		return Promise.resolve(processResponse(IS_CORS));
	}
    if (!event.body) {
        return Promise.resolve(processResponse(IS_CORS, 'invalid', 400));
    }
    let item = JSON.parse(event.body);
    item[PRIMARY_KEY] = uuidv4();
    let params = {
        TableName: TABLE_NAME,
        Item: item
    }
    return dynamoDb.put(params)
    .promise()
    .then(() => (processResponse(IS_CORS)))
    .catch(err => {
        console.log(err);
        return processResponse(IS_CORS, 'dynamo-error', 500);
    });
};