import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import { SiteLayout, SiteLoader } from 'ui';
import { getSiteData } from 'auth';
import { Meta } from 'core';
import { Site } from 'client';
import play from 'templates';
import { useRouter } from 'next/router';

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  stringifiedData: string;
}

export default function Index({ stringifiedData }: IndexProps) {
  const router = useRouter();
  if (router.isFallback) return <SiteLoader />;

  const data: Site = JSON.parse(stringifiedData);

  if (!data) return null;

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
      <div
        className="template-container"
        dangerouslySetInnerHTML={{ __html: play }}
      ></div>
    </SiteLayout>
  );
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  const allPaths: Array<any> = [];
  const paths = allPaths.map((path) => ({
    params: {
      site: path,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<IndexProps, PathProps> = async ({
  params,
}) => {
  if (!params) throw new Error('No path parameters found');

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

  if (!siteData) return { notFound: true, revalidate: 10 };

  return {
    props: {
      stringifiedData: JSON.stringify(siteData),
    },
    revalidate: 3600,
  };
};

Index.auth = false;
