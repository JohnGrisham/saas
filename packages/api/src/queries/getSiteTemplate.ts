import { Site, SiteByInput, QuerySiteArgs } from 'client';
import { graphQLClient } from '../client';
import { gql } from 'graphql-request';

export const getSiteTemplate = async (
  filter: SiteByInput,
  headers?: Record<string, any>,
) => {
  const data = await graphQLClient(headers).request<
    Site['templateData'],
    QuerySiteArgs
  >(
    gql`
      query Site($by: SiteByInput!) {
        site(by: $by) {
          templateData {
            template
          }
        }
      }
    `,
    { by: { ...filter } },
  );

  return data?.site?.templateData?.template;
};
