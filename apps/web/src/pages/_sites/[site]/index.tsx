//import * as React from 'react';
import type { GetServerSideProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';
//import { SiteLayout, SiteLoader } from 'ui';
//import { Meta } from 'core';
//import { Site } from 'client';
//import { authOptions } from '../../api/auth/[...nextauth]';
//import dynamic from 'next/dynamic';
//import { getServerSession } from 'next-auth/next';
import { getSiteTemplate } from 'client';
//import { TemplateInfo } from 'api';
//import { useRouter } from 'next/router';
import { getTemplateEnv } from '../../../utils';

interface PathProps extends ParsedUrlQuery {
  site: string;
}

export default function Index() {
  return null;
}

// export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
//   const allPaths: Array<any> = [];
//   const paths = allPaths.map((path) => ({
//     params: {
//       site: path,
//     },
//   }));

//   return {
//     paths,
//     fallback: true,
//   };
// };

export const getServerSideProps: GetServerSideProps<any, PathProps> = async ({
  params,
}) => {
  if (!params) throw new Error('No path parameters found');
  const { site } = params;
  const subdomain = site.split('.')[0];

  let filter: {
    subdomain?: string;
    customDomain?: string;
  } = {
    customDomain: site,
  };

  if (site.includes('.')) {
    filter = {
      subdomain,
    };
  }

  const template = await getSiteTemplate(filter);

  if (!template) return { notFound: true, props: { revalidate: 10 } };

  const templateEnv = getTemplateEnv(template);

  if (!templateEnv?.NEXT_PUBLIC_ROOT_URL) {
    return { notFound: true, props: { revalidate: 10 } };
  }

  const { host, protocol } = new URL(templateEnv.NEXT_PUBLIC_ROOT_URL);
  const destination = new URL(
    `${protocol}//${
      filter.customDomain ? filter.customDomain : filter.subdomain + '.' + host
    }/${template}`,
  ).href;

  const redirect = {
    destination,
    permanent: false,
  };

  return {
    props: {},
    redirect,
  };
};

Index.auth = false;
