import { constructTemplateData, getSiteData } from 'api';
import { NextResponse } from 'next/server';
import { startupNextJsTemplateSchema } from 'core';

export async function GET() {
  const { site } = await getSiteData({ subdomain: 'test' });
  const { description = '', name = '' } = { ...site };
  const data = await constructTemplateData(
    { data: site?.templateData?.data, site: { description, name } },
    startupNextJsTemplateSchema,
  );

  return NextResponse.json({ data });
}
