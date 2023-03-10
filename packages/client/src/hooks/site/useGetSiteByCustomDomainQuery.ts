import { graphQLClient } from '../../provider';
import { Scalars, useSiteByCustomDomainQuery } from '../../types';

export const useGetSiteByCustomDomainQuery = (domain: Scalars['String']) => {
  return useSiteByCustomDomainQuery(graphQLClient, { domain });
};
