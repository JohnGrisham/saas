import {
  SiteBySubdomainQuery,
  SiteByInput,
  QuerySiteArgs,
  graphQLClient,
} from 'client';
import { gql } from 'graphql-request';

export const getSiteData = async (filter: SiteByInput) => {
  graphQLClient.setHeader('x-api-key', process.env.API_KEY as string);
  const data = await graphQLClient.request<SiteBySubdomainQuery, QuerySiteArgs>(
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
        }
      }
    `,
    { by: { ...filter } },
  );

  return data;
};
