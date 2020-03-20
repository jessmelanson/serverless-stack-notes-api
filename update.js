import { call } from './lib/db';
import { success, failure } from './lib/response';

export const main = async event => {
  const {
    body,
    pathParameters: {
      id: noteId
    },
    requestContext: {
      identity: {
        cognitoIdentityId: userId
      }
    }
  } = event;
  const { attachment, content } = JSON.parse(body);

  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId,
      noteId
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: 'SET content = :content, attachment = :attachment',
    ExpressionAttributeValues: {
      ':attachment': attachment || null,
      ':content': content || null
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: 'ALL_NEW'
  };

  try {
    await call('update', params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
};
