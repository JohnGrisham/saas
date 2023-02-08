import {
  Mutation,
  MutationUserCreateArgs,
  IdentityType,
  graphQLClient,
  UserByEmailQuery,
  UserByEmailQueryVariables,
} from 'client';
import CredentialsProvider, {
  CredentialsConfig,
} from 'next-auth/providers/credentials';
import { JWTOptions } from 'next-auth/jwt';
import GithubProvider, { GithubProfile } from 'next-auth/providers/github';
import { OAuthUserConfig } from 'next-auth/providers';
import { Auth } from '@aws-amplify/auth';
import { JWT } from 'next-auth/jwt';
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
        graphQLClient.setHeader('x-api-key', process.env.API_KEY as string);
        const { username = '', password = '' } = { ...credentials };

        const user = await Auth.signIn({
          username,
          password,
        });

        const { user: gqlUserRecord } = await graphQLClient.request<
          UserByEmailQuery,
          UserByEmailQueryVariables
        >(
          gql`
            query UserByEmail($email: Email!) {
              user(by: { email: $email }) {
                id
              }
            }
          `,
          {
            email: username,
          },
        );

        if (!gqlUserRecord && isCognitoUser(user)) {
          await graphQLClient.request<Mutation, MutationUserCreateArgs>(
            gql`
              mutation CreateUser($input: UserCreateInput!) {
                userCreate(input: $input) {
                  user {
                    id
                  }
                }
              }
            `,
            {
              input: {
                email: username,
                identities: [
                  {
                    create: {
                      sub: user.getUsername(),
                      type: IdentityType.Credentials,
                    },
                  },
                ],
              },
            },
          );
        }

        return new Promise((res) => res(user as any));
      } catch (err: any) {
        console.log(err.message);
        return null;
      }
    },
    ...config,
  });

export const github = (config?: OAuthUserConfig<GithubProfile>) =>
  GithubProvider({
    clientId: process.env.GITHUB_ID as string,
    clientSecret: process.env.GITHUB_SECRET as string,
    ...config,
  });

const providers = [credentials(), github()];

export default providers;
