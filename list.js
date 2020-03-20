import { call } from './lib/db';
import { success, failure } from './lib/response';

export const main = async event => {
  const { cognitoIdentityId: userId } = event.requestContext.identity;

  const params = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be Identity Pool identity id
    //   of the authenticated user
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  };

  try {
    const result = await call('query', params);
    return success(result.Items);
  } catch (e) {
    return failure({ status: false });
  }
};
