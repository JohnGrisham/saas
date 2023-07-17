import { GraphQLClient } from 'graphql-request';
import { fetchWithToken } from 'core';

export const graphQLClient = (headers?: any) => {
  return new GraphQLClient(process.env.API_ENDPOINT as string, {
    fetch: fetchWithToken,
    headers,
  });
};
