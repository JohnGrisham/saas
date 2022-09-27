// index.js
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { GraphQLClient, gql } from 'graphql-request';

const queryClient = new QueryClient();

export const graphQLClient = new GraphQLClient(
  process.env.API_ENDPOINT as string,
  {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  },
);

export const Client: React.FC = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools />
  </QueryClientProvider>
);

export { gql };
