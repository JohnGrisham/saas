import { graphQLClient } from '../../client';
import { Scalars, useUserByEmailQuery } from '../../types';

export const useGetUserByEmailQuery = (email: Scalars['Email']) => {
  return useUserByEmailQuery(graphQLClient(), { email });
};
