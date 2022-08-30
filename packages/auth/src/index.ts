import CredentialsProvider, {
  CredentialsConfig,
} from 'next-auth/providers/credentials';
import GithubProvider, { GithubProfile } from 'next-auth/providers/github';
import { graphQLClient, gql } from 'client';
import { OAuthUserConfig } from 'next-auth/providers';

const PRIMARY_USER_LIST_ID = process.env.PRIMARY_USER_LIST_ID;

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
    async authorize(credentials, req) {
      // Add logic here to look up the user from the credentials supplied
      const { username = '', password = '' } = { ...credentials };

      console.log({ username, password });

      const userListQuery = `
          query {
            userList(id: "${PRIMARY_USER_LIST_ID}") {
              users {
                id
                email
                identities {
                  type
                  password
                }
              }
            }
          }`;

      const { userList = { users: [] } } = await graphQLClient.request(
        gql`
          ${userListQuery}
        `,
      );

      if (userList.users.length) {
        const currentUser = userList.users.find(
          (user: any) => user.email === username,
        );
        const passwordIdentity = currentUser?.identities.find(
          (identity: any) =>
            identity.type === 'CREDENTIALS' && identity?.password === password,
        );

        return passwordIdentity ? currentUser : null;
      }

      return null;
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
