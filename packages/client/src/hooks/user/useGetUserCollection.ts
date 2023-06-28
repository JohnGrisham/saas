import { graphQLClient } from 'api';
import { useUserCollectionQuery, QueryUserCollectionArgs } from '../../types';

export const useGetUserCollection = ({
  first = 100,
  ...args
}: QueryUserCollectionArgs) => {
  return useUserCollectionQuery(graphQLClient(), { ...args, first });
};
