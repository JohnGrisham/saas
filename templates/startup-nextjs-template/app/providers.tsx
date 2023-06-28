'use client';
import { Form } from 'ui';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
        <Form initialValues={{}} onSubmit={(values) => console.log(values)}>
          {children}
        </Form>
      </ThemeProvider>
    </SessionProvider>
  );
}
