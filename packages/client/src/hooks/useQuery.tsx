import { useQuery as useRQquery, QueryKey } from 'react-query';
import { graphQLClient } from '../provider';
import { gql } from 'graphql-request';

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

export { gql };
