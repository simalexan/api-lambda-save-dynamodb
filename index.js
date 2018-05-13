const AWS = require('aws-sdk');
const dynamoDb = new AWS.DnyamoDB.DocumentClient()
const processResponse = require('./process-response');
const TABLE_NAME = process.env.TABLE_NAME;
const IS_CORS = process.env.IS_CORS;

exports.handler = (event) => {
    if (event.httpMethod === 'OPTIONS') {
		return Promise.resolve(processResponse(IS_CORS));
	}
    if (!event.body) {
        return Promise.resolve(processResponse(IS_CORS, 'invalid', 400));
    }
    let params = {
        TableName: TABLE_NAME,
        Item: event.body
    }
    return dynamoDb.put(params)
    .promise()
    .then(() => (processResponse(IS_CORS, '', 400)))
    .catch(err => {
        console.log(err);
        return processResponse(IS_CORS, 'dynamo-error', 500);
    });
};