import {
  UserByEmailQuery,
  UserByEmailQueryVariables,
  graphQLClient,
} from 'client';
import { gql } from 'graphql-request';

export const getUserByEmail = async (email: string) => {
  const { user } = await graphQLClient.request<
    UserByEmailQuery,
    UserByEmailQueryVariables
  >(
    gql`
      query UserByEmail($email: Email!) {
        user(by: { email: $email }) {
          id
          identities(first: 10) {
            edges {
              node {
                type
              }
            }
          }
        }
      }
    `,
    {
      email,
    },
  );

  if (!user) {
    return undefined;
  }

  return user;
};
