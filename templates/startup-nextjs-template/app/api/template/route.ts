import { NextResponse } from 'next/server';
import { startupNextJsTemplateSchema } from 'core';
import { constructTemplateData } from 'api';
import { getSiteData } from 'client';

export async function GET() {
  const { site } = await getSiteData({ subdomain: 'test' });
  const { description = '', name = '' } = { ...site };
  const data = await constructTemplateData(
    { data: site?.templateData?.data, site: { description, name } },
    startupNextJsTemplateSchema,
  );

  return NextResponse.json({ data });
}
