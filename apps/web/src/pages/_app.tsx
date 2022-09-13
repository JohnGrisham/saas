import '../styles/globals.css';
import 'ui/styles.css';
import type { AppProps } from 'next/app';
import { Client } from 'client';
import { Header, Body, SessionProvider } from 'ui';
import { Auth } from '@aws-amplify/auth';

const ROOT = process.env.NEXT_PUBLIC_ROOT_URL as string;

export default function MyApp({ Component, pageProps }: AppProps) {
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

  return (
    <SessionProvider session={(pageProps as any).session}>
      <Header
        signInOptions={{ callbackUrl: ROOT }}
        signoutOptions={{ callbackUrl: `${ROOT}/auth/signout` }}
      />
      <Client>
        <Body>
          <Component {...pageProps} />
        </Body>
      </Client>
    </SessionProvider>
  );
}
