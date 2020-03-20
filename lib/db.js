import AWS from 'aws-sdk';

export const call = (action, params) => {
  const db = new AWS.DynamoDB.DocumentClient();

  return db[action](params).promise();
};
