import {
  DomainResponse,
  DomainConfigResponse,
  DomainVerificationResponse,
} from 'core';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export const middleware = async (req: NextRequest) => {
  const url = req.nextUrl;
  const nextDomain = new URL(process.env.NEXT_PUBLIC_ROOT_URL as string).host;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers
    .get('host')!
    .replace('.localhost:3000', `.${nextDomain}`);

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;

  // rewrites for app pages
  if (hostname == `app.${nextDomain}`) {
    const session = await getToken({ req: req as any });
    if (!session && path !== '/signin') {
      return NextResponse.redirect(new URL('/signin', req.url));
    } else if (session && path == '/signin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.rewrite(
      new URL(`/app${path === '/' ? '' : path}`, req.url),
    );
  }

  // special case for `vercel.pub` domain
  if (hostname === 'vercel.pub') {
    return NextResponse.redirect(
      'https://vercel.com/blog/platforms-starter-kit',
    );
  }

  // rewrite root application to `/home` folder
  if (hostname === 'localhost:3000' || hostname === nextDomain) {
    return NextResponse.rewrite(new URL(path, req.url));
  }

  // rewrite everything else to `/[domain]/[path] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
};

export const addDomainToVercel = async (domain: string) => {
  return await fetch(
    `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`,
    {
      body: `{\n  "name": "${domain}"\n}`,
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  ).then((res) => res.json());
};

export const removeDomainFromVercelProject = async (domain: string) => {
  return await fetch(
    `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
      },
      method: 'DELETE',
    },
  ).then((res) => res.json());
};

export const removeDomainFromVercelTeam = async (domain: string) => {
  return await fetch(
    `https://api.vercel.com/v6/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
      },
      method: 'DELETE',
    },
  ).then((res) => res.json());
};

export const getDomainResponse = async (
  domain: string,
): Promise<DomainResponse & { error: { code: string; message: string } }> => {
  return await fetch(
    `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => {
    return res.json();
  });
};

export const getConfigResponse = async (
  domain: string,
): Promise<DomainConfigResponse> => {
  return await fetch(
    `https://api.vercel.com/v6/domains/${domain}/config?teamId=${process.env.TEAM_ID_VERCEL}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json());
};

export const verifyDomain = async (
  domain: string,
): Promise<DomainVerificationResponse> => {
  return await fetch(
    `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}/verify?teamId=${process.env.TEAM_ID_VERCEL}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json());
};

export const getSubdomain = (name: string, apexName: string) => {
  if (name === apexName) return null;
  return name.slice(0, name.length - apexName.length - 1);
};

export const getApexDomain = (url: string) => {
  let domain;
  try {
    domain = new URL(url).hostname;
  } catch (e) {
    return '';
  }
  const parts = domain.split('.');
  if (parts.length > 2) {
    // if it's a subdomain (e.g. dub.vercel.app), return the last 2 parts
    return parts.slice(-2).join('.');
  }
  // if it's a normal domain (e.g. dub.sh), we return the domain
  return domain;
};

// courtesy of ChatGPT: https://sharegpt.com/c/pUYXtRs
export const validDomainRegex = new RegExp(
  /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
);
