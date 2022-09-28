import { graphQLClient } from 'client';
import { isCognitoUser, stripe } from '../../../utils';
import { Auth } from '@aws-amplify/auth';
import NextAuth from 'next-auth';
import { gql } from 'graphql-request';
import providers from 'auth';

export default NextAuth({
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      try {
        const name = user.name ?? '';
        const email: string = isCognitoUser(user)
          ? user.attributes.email
          : user.email ?? '';

        if (!email) {
          return false;
        }

        const [existingStripeUser = undefined] = (
          await stripe.customers.list({ email })
        ).data;

        if (!existingStripeUser) {
          const sub = isCognitoUser(user)
            ? user.getUsername()
            : account.providerAccountId;

          const newStripeCustomer = await stripe.customers.create({
            name,
            email,
            metadata: {
              sub,
            },
          });

          const { userCreate } = await graphQLClient.request(
            gql`
              mutation CreatUser(
                $name: String
                $email: String!
                $sub: String
                $type: String
                $stripeId: String!
              ) {
                userCreate(
                  input: {
                    name: $name
                    email: $email
                    identities: { create: { sub: $sub, type: $type } }
                    customer: { create: { stripeId: $stripeId } }
                  }
                ) {
                  user {
                    id
                  }
                }
              }
            `,
            {
              name,
              email,
              sub,
              type: account.provider.toUpperCase(),
              stripeId: newStripeCustomer.id,
            },
          );

          if (isCognitoUser(user)) {
            await Auth.updateUserAttributes(user, {
              'custom:userId': userCreate.user.id,
            });
          }
        }

        return true;
      } catch (err: any) {
        throw new Error(err.message);
      }
    },
    async jwt({ user, token }) {
      if (user) {
        let currentUser = user as unknown;
        let tokenResponse = token;

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
});
