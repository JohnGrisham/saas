import { useQuery as useRQquery, QueryKey } from 'react-query';
import { GraphQLClient, gql } from 'graphql-request';

const graphQLClient = new GraphQLClient(process.env.API_ENDPOINT as string, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

export const useQuery = <
  TQueryFnData,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  key: TQueryKey,
  query: string,
) => {
  return useRQquery<TQueryFnData, TError, TData, TQueryKey>(key, async () => {
    const response = await graphQLClient.request<TQueryFnData, {}>(
      gql`
        ${query}
      `,
    );

    return response;
  });
};
