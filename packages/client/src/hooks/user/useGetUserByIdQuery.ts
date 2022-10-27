import { graphQLClient } from '../../provider';
import { Scalars, useUserByIdQuery } from '../../types';

export const useGetUserByIdQuery = (id: Scalars['ID']) => {
  return useUserByIdQuery(graphQLClient, { id });
};
