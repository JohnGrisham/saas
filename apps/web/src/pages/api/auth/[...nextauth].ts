import { callbacks, providers, jwt } from 'auth';
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { isCognitoUser } from 'core';

export default NextAuth({
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  providers,
  callbacks: {
    ...callbacks,
    async jwt({ user, token }) {
      if (user) {
        let currentUser = user as unknown;
        let tokenResponse: JWT = token;

        if (isCognitoUser(currentUser)) {
          const session = currentUser.getSignInUserSession();

          tokenResponse = {
            ...token,
            sub: currentUser.getUsername(),
            email: currentUser.attributes.email,
            accessToken: session?.getAccessToken().getJwtToken(),
            refreshToken: session?.getRefreshToken().getToken(),
          };
        }

        return Promise.resolve(tokenResponse);
      }

      return Promise.resolve(token);
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user = token;
      }

      return Promise.resolve(session);
    },
  },
  jwt,
});
