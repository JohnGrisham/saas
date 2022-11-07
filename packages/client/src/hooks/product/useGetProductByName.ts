import { graphQLClient } from '../../provider';
import { Scalars, useProductByNameQuery } from '../../types';

export const useGetProductByNameQuery = (name: Scalars['String']) => {
  return useProductByNameQuery(graphQLClient, { name });
};
