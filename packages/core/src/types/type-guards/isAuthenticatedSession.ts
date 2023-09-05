import { Session, User } from 'next-auth';

export interface AuthenticatedUser extends Omit<User, 'email'> {
  email: string;
}

export interface AuthenticatedSession extends Omit<Session, 'user'> {
  user: AuthenticatedUser;
}

export const isAuthenticatedSession = (
  data: unknown,
): data is AuthenticatedSession => {
  const sessionArg = data as Record<string, unknown>;
  const userArg = sessionArg?.user as Record<string, any>;

  return (
    typeof sessionArg?.user === 'object' && typeof userArg.email === 'string'
  );
};
