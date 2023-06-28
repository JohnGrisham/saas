import { graphQLClient } from 'api';
import { Scalars, useIdentityByIdQuery } from '../../types';

export const useGetIdentityByIdQuery = (id: Scalars['ID']) => {
  return useIdentityByIdQuery(graphQLClient(), { id });
};
