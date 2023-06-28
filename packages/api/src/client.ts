import { GraphQLClient } from 'graphql-request';
import { fetchWithToken } from './utils/fetchWithToken';

export const graphQLClient = (headers?: HeadersInit) => {
  return new GraphQLClient(process.env.API_ENDPOINT as string, {
    fetch: fetchWithToken,
    headers,
  });
};
