import * as React from 'react';
import {
  SessionContextValue,
  SessionProviderProps,
  SessionProvider as NextAuthSessionProvider,
  signIn,
  useSession,
} from 'next-auth/react';
import {
  AuthenticatedSession,
  isAuthenticatedSession,
  isAuthScreen,
} from 'core';
import { Loading } from '../components';

export interface AuthenticatedUser {
  email: string;
  name?: string | null;
  image?: string | null;
}

export interface AuthSessionValue extends Omit<SessionContextValue, 'data'> {
  data: AuthenticatedSession;
  status: 'authenticated';
}

export const AuthenticatedSessionContext =
  React.createContext<AuthSessionValue>({
    data: {} as AuthenticatedSession,
    status: 'authenticated',
    update: async () => Promise.resolve(null),
  });

const AuthenticatedSessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const sessionContext = useSession();
  const [authStatus, setAuthStatus] = React.useState(sessionContext.status);
  const isAuthSession = isAuthenticatedSession(sessionContext.data);

  React.useEffect(() => {
    if (
      !isAuthSession &&
      !isAuthScreen() &&
      sessionContext.status !== 'loading'
    ) {
      setAuthStatus('loading');
      signIn();
    } else if (!isAuthScreen()) {
      window.setTimeout(() => setAuthStatus(sessionContext.status), 500);
    } else {
      setAuthStatus('unauthenticated');
    }
  }, [authStatus, isAuthSession, sessionContext]);

  if (authStatus === 'loading') {
    return <Loading size="4x" />;
  }

  if (!isAuthScreen() && authStatus === 'unauthenticated') {
    return null;
  }

  if (isAuthSession) {
    return (
      <AuthenticatedSessionContext.Provider
        value={{
          ...sessionContext,
          data: sessionContext.data as AuthenticatedSession,
          status: 'authenticated',
        }}
      >
        {children}
      </AuthenticatedSessionContext.Provider>
    );
  }

  return <>{children}</>;
};

const withNextSessionProvider = ({
  children,
  ...props
}: SessionProviderProps) => (
  <NextAuthSessionProvider {...props}>
    <AuthenticatedSessionProvider {...props}>
      {children}
    </AuthenticatedSessionProvider>
  </NextAuthSessionProvider>
);

export const SessionProvider: React.FC<
  Omit<SessionProviderProps, 'AuthSessionProvider'>
> = (props) => withNextSessionProvider(props);
