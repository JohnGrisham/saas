import { graphQLClient } from '../../client';
import { Scalars, useIdentityByIdQuery } from '../../types';

export const useGetIdentityByIdQuery = (id: Scalars['ID']) => {
  return useIdentityByIdQuery(graphQLClient(), { id });
};
