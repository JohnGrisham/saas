import { graphQLClient } from '../../provider';
import { Scalars, useSiteBySubdomainQuery } from '../../types';

export const useGetSiteBySubdomainQuery = (sub: Scalars['String']) => {
  return useSiteBySubdomainQuery(graphQLClient, { sub });
};
