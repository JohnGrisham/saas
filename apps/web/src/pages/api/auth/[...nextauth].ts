import NextAuth from 'next-auth';
import providers from 'auth';
import { CognitoUser } from '@aws-amplify/auth';

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
        const cognitoUser = user as unknown as User;
        const session = cognitoUser.getSignInUserSession();

        const tokenResponse = {
          ...token,
          sub: cognitoUser.getUsername(),
          email: cognitoUser.attributes.email,
          accessToken: session?.getAccessToken().getJwtToken(),
          refreshToken: session?.getRefreshToken().getToken(),
        };

        return tokenResponse;
      }

      return token;
    },
  },
  secret: process.env.JWT_SECRET,
});
