import uuid from 'uuid';
import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const main = (event, context, callback) => {
  const { body, requestContext } = event;
  const { cognitoIdentityId } = requestContext.identity;
  const { attachment, content } = JSON.parse(body);

  const params = {
    TableName: process.env.tableName,
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      userId: cognitoIdentityId,
      noteId: uuid(),
      content: content,
      attachment: attachment,
      createdAt: Date.now()
    }
  };

  dynamoDb.put(params, (err, data) => {
    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };

    // Return status code 500 on error
    if (err) {
      const res = {
        statusCode: 500,
        headers,
        body: JSON.stringify({ status: false })
      };
      callback(null, res);
      return;
    }

    // Return status code 200 and the newly created item
    const res = {
      statusCode: 200,
      headers,
      body: JSON.stringify(params.Item)
    };
    callback(null, res);
  });
};
