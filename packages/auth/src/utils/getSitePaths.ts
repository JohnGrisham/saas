import {
  SiteConnection,
  SiteEdge,
  QuerySiteCollectionArgs,
  graphQLClient,
} from 'client';
import { gql } from 'graphql-request';

export const getSitePaths = async () => {
  graphQLClient.setHeader('x-api-key', process.env.API_KEY as string);
  const { edges } = await graphQLClient.request<
    SiteConnection,
    QuerySiteCollectionArgs
  >(
    gql`
      query SiteCollection {
        siteCollection(first: 100) {
          edges {
            node {
              customDomain
              subdomain
            }
          }
        }
      }
    `,
  );

  const sites =
    edges
      ?.filter((edge) => edge?.node)
      .map((edge) => (edge as SiteEdge).node) ?? [];

  const allPaths = [
    ...sites.map(({ subdomain }) => subdomain),
    ...sites.map(({ customDomain }) => customDomain),
  ].filter((path) => path) as Array<string>;

  return allPaths;
};
