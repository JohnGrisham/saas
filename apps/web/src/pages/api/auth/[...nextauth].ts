import { CognitoUser } from '@aws-amplify/auth';
import NextAuth from 'next-auth';
import providers from 'auth';

interface User extends CognitoUser {
  [key: string]: any;
}

export default NextAuth({
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  providers,
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        let currentUser = user as unknown;
        let tokenResponse = token;

        if (Object.hasOwn(currentUser as {}, 'authenticationFlowType')) {
          const cognitoUser = currentUser as User;
          const session = cognitoUser.getSignInUserSession();

          tokenResponse = {
            ...token,
            sub: cognitoUser.getUsername(),
            email: cognitoUser.attributes.email,
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
});
