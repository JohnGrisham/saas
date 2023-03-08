import { callbacks, providers, jwt } from 'auth';
import NextAuth, { type NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  providers,
  callbacks,
  jwt,
};

export default NextAuth(authOptions);
