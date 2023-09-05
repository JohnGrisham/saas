import '@fortawesome/fontawesome-svg-core/styles.css';
import '../styles/globals.css';
import 'ui/styles.css';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="w-full h-full bg-white dark:ui-bg-black"
      suppressHydrationWarning
    >
      <body className="min-w-[400px] w-full h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
