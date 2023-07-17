import { graphQLClient } from '../../client';
import {
  useIdentityCollectionQuery,
  QueryIdentityCollectionArgs,
} from '../../types';

export const useGetIdentityCollection = ({
  first = 100,
  ...args
}: QueryIdentityCollectionArgs) => {
  return useIdentityCollectionQuery(graphQLClient(), { ...args, first });
};
