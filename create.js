import uuid from 'uuid';
import { call } from './lib/db';
import { success, failure } from './lib/response';

export const main = async event => {
  const {
    body,
    requestContext: {
      identity: {
        cognitoIdentityId: userId
      }
    }
  } = event;
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
      userId,
      noteId: uuid(),
      content: content,
      attachment: attachment,
      createdAt: Date.now()
    }
  };

  try {
    await call('put', params);
    return success(params.Item);
  } catch(e) {
    return failure({ status: false });
  }
};
