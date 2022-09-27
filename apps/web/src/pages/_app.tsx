import '../styles/globals.css';
import 'ui/styles.css';
import type { AppProps } from 'next/app';
import { Header, Body, SessionProvider } from 'ui';
import { Auth } from '@aws-amplify/auth';
import { Client as GraphqlClient } from 'client';
import { StripeClient } from 'payments-client';

const ROOT = process.env.NEXT_PUBLIC_ROOT_URL as string;
const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ??
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
  '';

Auth.configure({
  region: process.env.NEXT_PUBLIC_AWS_REGION as string,
  mandatorySignIn: false,
  userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
  userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID as string,
  oauth: {
    redirectSignIn: ROOT,
    redirectSignOut: `${ROOT}/api/auth/callback/cognito`,
    scope: ['email', 'profile', 'openid'],
    domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN as string,
    responseType: 'code',
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={(pageProps as any).session}>
      <Header
        signInOptions={{ callbackUrl: ROOT }}
        signoutOptions={{ callbackUrl: `${ROOT}/auth/signout` }}
      />
      <GraphqlClient>
        <StripeClient publishableKey={STRIPE_PUBLISHABLE_KEY}>
          <Body>
            <Component {...pageProps} />
          </Body>
        </StripeClient>
      </GraphqlClient>
    </SessionProvider>
  );
}
