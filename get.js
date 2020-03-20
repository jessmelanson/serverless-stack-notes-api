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
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId,
      noteId
    }
  };

  try {
    const result = await call('get', params);
    if (result.Item) {
      // return the retrieved item
      return success(result.Item);
    } else {
      return failure({ status: false, error: 'Item not found' });
    }
  } catch (e) {
    return failure({ status: false });
  }
};
