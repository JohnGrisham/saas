import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /examples (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|examples/|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.app, demo.localhost:3000)
  const hostname = req.headers.get('host') || 'demo.vercel.app';

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;

  // Only for demo purposes - remove this if you want to use your root domain as the landing page
  if (hostname === 'vercel.app' || hostname === 'platforms.vercel.app') {
    return NextResponse.redirect('https://demo.vercel.app');
  }

  /*  You have to replace ".vercel.app" with your own domain if you deploy this example under your domain.
      You can also use wildcard subdomains on .vercel.app links that are associated with your Vercel team slug
      in this case, our team slug is "platformize", thus *.platformize.vercel.app works. Do note that you'll
      still need to add "*.platformize.vercel.app" as a wildcard domain on your Vercel dashboard. */
  const currentHost =
    process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
      ? hostname
          .replace(`.vercel.app`, '')
          .replace(`.platformize.vercel.app`, '')
      : hostname.replace(`.${process.env.NEXT_PUBLIC_ROOT_URL}`, '');

  // rewrites for app pages
  if (currentHost == 'app') {
    if (
      url.pathname === '/login' &&
      (req.cookies.get('next-auth.session-token') ||
        req.cookies.get('__Secure-next-auth.session-token'))
    ) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    url.pathname = `/app${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // rewrite root application to `/home` folder
  if (
    hostname ===
      process.env.NEXT_PUBLIC_ROOT_URL?.replace(
        new RegExp(/https?:\/\//),
        '',
      ) ||
    hostname === 'platformize.vercel.app'
  ) {
    return NextResponse.rewrite(new URL(path, req.url));
  }

  // rewrite everything else to `/_sites/[site] dynamic route
  return NextResponse.rewrite(
    new URL(`/_sites/${currentHost}${path}`, req.url),
  );
}