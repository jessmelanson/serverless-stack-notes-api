import { call } from './lib/db';
import { success, failure } from './lib/response';

export const main = async event => {
  const {
    pathParameters: {
      id: noteId
    },
    requestContext: {
      identity: {
        cognitoIdentityId: userId
      }
    }
  } = event;

  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be removed
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId,
      noteId
    }
  };

  try {
    await call('delete', params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
};
