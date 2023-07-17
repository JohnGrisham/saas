import { graphQLClient } from '../../client';
import { Scalars, useSiteByCustomDomainQuery } from '../../types';

export const useGetSiteByCustomDomainQuery = (domain: Scalars['String']) => {
  return useSiteByCustomDomainQuery(graphQLClient(), { domain });
};
