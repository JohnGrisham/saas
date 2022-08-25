import * as React from 'react';
import {
  SessionProvider as NextAuthSessionProvider,
  SessionProviderProps,
} from 'next-auth/react';

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
  session,
}) => {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
};
