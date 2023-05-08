import { callbacks, providers, jwt } from 'auth';
import NextAuth from 'next-auth';

export default NextAuth({
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  providers,
  callbacks,
  jwt,
});
