import { graphQLClient } from '../../client';
import { Scalars, useIdentityBySubQuery } from '../../types';

export const useGetIdentityBySubQuery = (sub: Scalars['String']) => {
  return useIdentityBySubQuery(graphQLClient(), { sub });
};
