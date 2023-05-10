import * as React from 'react';
import type { GetServerSideProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import { SiteLayout, SiteLoader } from 'ui';
import { Meta } from 'core';
import { Site } from 'client';
import { authOptions } from '../../api/auth/[...nextauth]';
import dynamic from 'next/dynamic';
import { getServerSession } from 'next-auth/next';
import { getSiteData } from 'auth';
import { TemplateInfo } from 'api';
import { useRouter } from 'next/router';

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  stringifiedData: string;
  template: string;
}

const Template = dynamic(
  () => import('templates').then(({ Template }) => Template),
  {
    ssr: false,
  },
);

export default function Index({ stringifiedData, template }: IndexProps) {
  const router = useRouter();
  const data: Omit<Site, 'templateData'> = router.isFallback
    ? null
    : JSON.parse(stringifiedData);

  if (router.isFallback) return <SiteLoader />;
  if (!data || !template) return null;

  const meta = {
    title: data.name,
    description: data.description,
    logo: '/logo.png',
    ogImage: data.image,
    ogUrl: data.customDomain
      ? data.customDomain
      : `https://${data.subdomain}.vercel.app`,
  } as Meta;

  return (
    <SiteLayout meta={meta} subdomain={data.subdomain ?? undefined}>
      <Template html={template} />
    </SiteLayout>
  );
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

export const getServerSideProps: GetServerSideProps<
  IndexProps,
  PathProps
> = async ({ params, req, res }) => {
  if (!params) throw new Error('No path parameters found');
  const session = await getServerSession(req, res, authOptions);

  const { site } = params;

  let filter: {
    subdomain?: string;
    customDomain?: string;
  } = {
    customDomain: site,
  };

  if (site.includes('.')) {
    filter = {
      subdomain: site.split('.')[0],
    };
  }

  const { site: siteData } = await getSiteData(filter);

  if (!siteData) return { notFound: true, props: { revalidate: 10 } };

  const templateInfo: TemplateInfo = {
    data: siteData.templateData?.data,
    site: { name: siteData.name, description: siteData.description },
    signedin: !!session?.user,
  };
  const htmlData = await fetch(
    `${process.env.NEXT_PUBLIC_ROOT_URL}/api/generate-template`,
    {
      method: 'POST',
      body: JSON.stringify(templateInfo),
    },
  );

  const template = await htmlData.text();
  delete siteData.templateData;

  return {
    props: {
      stringifiedData: JSON.stringify(siteData),
      template,
    },
  };
};

Index.auth = false;
