const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB.DocumentClient(),
  uuidv4 = require('uuid/v4'),
  TABLE_NAME = process.env.TABLE_NAME || '',
  PRIMARY_KEY = process.env.PRIMARY_KEY || '';

exports.handler = async (event:any): Promise<any> => {
  console.log(event);
  if (!event.body) {
    return { statusCode: 400, body: 'invalid' };
  }

  let item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
  item[PRIMARY_KEY] = uuidv4();
  const params = {
    TableName: TABLE_NAME,
    Item: item
  }

  try {
    await dynamo.put(params).promise();
    return { statusCode: 201, body: '' };
  } catch (dbError) {
    console.log(dbError);
    return { statusCode: 500, body: dbError };
  }
}