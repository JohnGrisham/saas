import { Account, Profile, CallbacksOptions } from 'next-auth';
import CredentialsProvider, {
  CredentialsConfig,
} from 'next-auth/providers/credentials';
import GithubProvider, { GithubProfile } from 'next-auth/providers/github';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';
import {
  credentialsSigninHandler,
  googleSigninHandler,
} from './signin-handlers';
import {
  UserByEmailQuery,
  UserByEmailQueryVariables,
  graphQLClient,
} from 'client';
import { JWTOptions } from 'next-auth/jwt';
import { OAuthUserConfig } from 'next-auth/providers';
import { Auth } from '@aws-amplify/auth';
import { JWT } from 'next-auth/jwt';
import { constructStripe } from 'payments-server';
import { gql } from 'graphql-request';
import jsonwebtoken from 'jsonwebtoken';
import { isCognitoUser } from 'core';

export const jwt: Partial<JWTOptions> = {
  encode: ({ secret, token }) => {
    const encodedToken = jsonwebtoken.sign(
      {
        ...token,
        iss: process.env.ISSUER_URL as string,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      secret,
    );
    return encodedToken;
  },
  decode: async ({ secret, token }) => {
    const decodedToken = jsonwebtoken.verify(token!, secret);
    return decodedToken as JWT;
  },
};

export const credentials = (config?: CredentialsConfig) =>
  CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: 'Credentials',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      username: {
        label: 'Email',
        type: 'email',
        placeholder: 'johndoe@example.com',
      },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      try {
        const { username = '', password = '' } = { ...credentials };

        const user = await Auth.signIn({
          username,
          password,
        });

        return new Promise((res) => res(user as any));
      } catch (err: any) {
        console.log(err.message);
        return null;
      }
    },
    ...config,
  });

export const google = (config?: OAuthUserConfig<GoogleProfile>) =>
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    ...config,
  });

export const github = (config?: OAuthUserConfig<GithubProfile>) =>
  GithubProvider({
    clientId: process.env.GITHUB_ID as string,
    clientSecret: process.env.GITHUB_SECRET as string,
    ...config,
  });

export const callbacks: Partial<CallbacksOptions<Profile, Account>> = {
  async signIn({ user, account, profile }) {
    try {
      graphQLClient.setHeader('x-api-key', process.env.API_KEY as string);
      let stripeId = '';
      const stripe = constructStripe();
      const name = user.name ?? '';
      const email: string = isCognitoUser(user)
        ? user.attributes.email
        : user.email ?? '';

      if (!email) {
        return false;
      }

      switch (account?.provider) {
        case 'credentials':
          await credentialsSigninHandler(user, email, name);
        case 'google': {
          const sub = profile?.sub ?? `GSTUB_${user.id}`;
          await googleSigninHandler(sub, email, name);
        }
        default:
          await credentialsSigninHandler(user, email, name);
      }

      const { user: userRecord } = await graphQLClient.request<
        UserByEmailQuery,
        UserByEmailQueryVariables
      >(
        gql`
          query GetUserByEmail($email: Email!) {
            user(by: { email: $email }) {
              id
            }
          }
        `,
        {
          email,
        },
      );

      if (!userRecord?.customer) {
        const cognitoUser = isCognitoUser(user);
        const sub = cognitoUser
          ? user.getUsername()
          : account?.providerAccountId ?? '';

        const newStripeCustomer = await stripe.customers.create({
          name,
          email,
          metadata: {
            sub,
            userId: userRecord?.id ?? '',
          },
        });
        stripeId = newStripeCustomer.id;

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
      } else {
        stripeId = userRecord.customer.id;
      }

      if (isCognitoUser(user) && userRecord) {
        await Auth.updateUserAttributes(user, {
          'custom:userId': userRecord.id,
          'custom:stripeId': stripeId,
        });
      }

      return true;
    } catch (err: any) {
      console.error(err.message);
      return false;
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
};

export const providers = [credentials(), google(), github()];
