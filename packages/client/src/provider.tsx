// index.js
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { GraphQLClient, gql } from 'graphql-request';

const queryClient = new QueryClient();

export interface ClientProps {
  children: React.ReactNode;
}

export const graphQLClient = new GraphQLClient(
  process.env.API_ENDPOINT as string,
  {
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.API_KEY as string,
    },
  },
);

export const Client: React.FC<ClientProps> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools />
  </QueryClientProvider>
);

export { gql };
