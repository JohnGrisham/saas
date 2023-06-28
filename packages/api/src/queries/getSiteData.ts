import { SiteBySubdomainQuery, SiteByInput, QuerySiteArgs } from 'client';
import { graphQLClient } from '../client';
import { gql } from 'graphql-request';

export const getSiteData = async (
  filter: SiteByInput,
  headers?: Record<string, any>,
) => {
  const data = await graphQLClient(headers).request<
    SiteBySubdomainQuery,
    QuerySiteArgs
  >(
    gql`
      query Site($by: SiteByInput!) {
        site(by: $by) {
          id
          name
          description
          logo
          font
          image
          imageBlurhash
          subdomain
          customDomain
          templateData {
            id
            data
          }
        }
      }
    `,
    { by: { ...filter } },
  );

  return data;
};
