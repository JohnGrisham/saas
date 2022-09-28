import { graphQLClient, gql } from 'client';
import { isCognitoUser, stripe } from '../../../utils';
import NextAuth from 'next-auth';
import providers from 'auth';

export default NextAuth({
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      const name = user.name ?? undefined;
      const email: string | undefined = isCognitoUser(user)
        ? user.attributes.email
        : user.email ?? undefined;

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

        await graphQLClient.request(gql`
        mutation CreatUser {
                userCreate(
                    input: {
                        name: ${name}
                        email: ${email}
                        identities: {
                        create: { sub: ${sub}, type: ${account.provider.toUpperCase()} }
                        }
                        customer: {
                        create: { stripeId: ${newStripeCustomer.id} }
                        }
                    }
                    ) {
                    user {
                        id
                    }
                }
            }
        `);
      }

      return true;
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
