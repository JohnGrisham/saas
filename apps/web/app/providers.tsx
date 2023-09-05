'use client';
import { Content, LoadingProvider, SessionProvider, ThemeProvider } from 'ui';
import { StripeClient } from 'payments';
import { ThemeConfig } from 'tailwindcss/types/config';
import dynamic from 'next/dynamic';
// @ts-ignore
import { theme } from 'tailwind-config/tailwind.config';

const GraphqlClient = dynamic(
  () => import('client').then(({ Client }) => Client),
  {
    ssr: false,
  },
);
const Navbar = dynamic(() => import('ui').then(({ Navbar }) => Navbar), {
  ssr: false,
});

const ROOT = process.env.NEXT_PUBLIC_ROOT_URL as string;
const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ??
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
  '';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GraphqlClient>
        <StripeClient publishableKey={STRIPE_PUBLISHABLE_KEY}>
          <ThemeProvider theme={theme as ThemeConfig}>
            <LoadingProvider>
              <Navbar
                logoProps={{
                  title: 'SaaS',
                  src: 'https://flowbite.com/docs/images/logo.svg',
                  href: ROOT,
                }}
                navItems={[
                  { id: 'home', href: '/', title: 'Home', type: 'simple' },
                  {
                    id: 'about',
                    href: '/about',
                    title: 'About',
                    type: 'simple',
                  },
                ]}
                signoutOptions={{
                  callbackUrl: `${ROOT}/auth/signin`,
                  redirect: true,
                }}
              />
              <Content>{children}</Content>
            </LoadingProvider>
          </ThemeProvider>
        </StripeClient>
      </GraphqlClient>
    </SessionProvider>
  );
}
