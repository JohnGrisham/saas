// index.js
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { GraphQLClient, gql } from 'graphql-request';
import { fetchWithToken } from './utils/fetchWithToken';

const queryClient = new QueryClient();

export interface ClientProps {
  children: React.ReactNode;
}

export const graphQLClient = new GraphQLClient(
  process.env.API_ENDPOINT as string,
  {
    fetch: fetchWithToken,
  },
);

export const Client: React.FC<ClientProps> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools />
  </QueryClientProvider>
);

export { gql };
