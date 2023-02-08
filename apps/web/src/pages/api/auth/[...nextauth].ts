import { Auth } from '@aws-amplify/auth';
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { isCognitoUser } from 'core';
import providers, { jwt } from 'auth';
import { stripe } from '../../../utils';

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
          const cognitoUser = isCognitoUser(user);
          const sub = cognitoUser
            ? user.getUsername()
            : account?.providerAccountId;

          if (!sub) {
            throw new Error('Failed to get an account ID for this provider');
          }

          const newStripeCustomer = await stripe.customers.create({
            name,
            email,
            metadata: {
              sub,
            },
          });

          const [starterProduct] = (
            await stripe.products.search({ query: "name~'Starter'" })
          ).data;
          const price =
            typeof starterProduct.default_price === 'string'
              ? starterProduct.default_price
              : starterProduct.default_price?.unit_amount_decimal ?? '0';

          await stripe.subscriptions.create({
            customer: newStripeCustomer.id,
            items: [{ price, quantity: 1 }],
            trial_period_days: 7,
          });
        } else if (isCognitoUser(user)) {
          // await Auth.updateUserAttributes(user, {
          //   'custom:userId': existingStripeUser.metadata.userId,
          // });
        }

        return true;
      } catch (err: any) {
        console.log(err.message);
        throw new Error(err.message);
      }
    },
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
