import '../styles/globals.css';
import 'ui/styles.css';
import type { AppProps } from 'next/app';
import { Client } from 'client';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Client>
      <Component {...pageProps} />
    </Client>
  );
}
