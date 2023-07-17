import * as React from 'react';
import { getSiteData } from 'client';

export default async function Head() {
  const { site } = await getSiteData({ subdomain: 'test' });
  const { description, name, logo } = { ...site };

  console.log(site);

  return (
    <>
      <title>{name}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content={description} />
      <link rel="icon" href={logo ?? '/images/favicon.ico'} />
    </>
  );
}
