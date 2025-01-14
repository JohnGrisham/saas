import { callbacks, crossDomainCookies, events, providers, jwt } from 'auth';
import NextAuth, { type NextAuthOptions } from 'next-auth';

const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  providers,
  callbacks,
  cookies: JSON.parse(process.env.NEXT_PUBLIC_MULTIDOMAIN ?? 'false')
    ? crossDomainCookies
    : undefined,
  events,
  jwt,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
