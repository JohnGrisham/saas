import Footer from '@/components/Footer';
import TemplateForm from '@/components/Form';
import Head from './head';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import 'react-modal-video/css/modal-video.css';
import 'ui/styles.css';
import '../styles/index.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <Head />
        <body className="dark:bg-black">
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
          <TemplateForm />
        </body>
      </Providers>
    </html>
  );
}

import { Providers } from './providers';
