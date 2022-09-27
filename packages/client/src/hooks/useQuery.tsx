import { useQuery as useRQquery, QueryKey, UseQueryOptions } from 'react-query';
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
  variables?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey'
  >,
) => {
  return useRQquery<TQueryFnData, TError, TData, TQueryKey>(
    key,
    async () => {
      const response = await graphQLClient.request<TQueryFnData, {}>(
        gql`
          ${query}
        `,
        variables,
      );

      return response;
    },
    options,
  );
};

export { gql };
