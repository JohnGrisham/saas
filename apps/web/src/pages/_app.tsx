import '../styles/globals.css';
import 'ui/styles.css';
import type { AppProps } from 'next/app';
import { Client } from 'client';
import { Header, SessionProvider } from 'ui';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Client>
        <Component {...pageProps} />
      </Client>
    </SessionProvider>
  );
}
