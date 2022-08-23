import React from 'react';
import * as react_query from 'react-query';
import { QueryKey } from 'react-query';

declare const Client: React.FC;

declare const useQuery: <TQueryFnData, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(key: TQueryKey, query: string) => react_query.UseQueryResult<TData, TError>;

export { Client, useQuery };
