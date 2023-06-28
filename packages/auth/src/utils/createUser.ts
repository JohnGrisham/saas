import type { Mutation, MutationUserCreateArgs, IdentityType } from 'client';
import { gql } from 'graphql-request';
import { graphQLClient } from 'api';

export const createUser = async (
  email: string,
  sub: string,
  type: IdentityType,
  name?: string,
) => {
  await graphQLClient({ ['x-api-key']: process.env.API_KEY as string }).request<
    Mutation,
    MutationUserCreateArgs
  >(
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
        email,
        name,
        identities: [
          {
            create: {
              sub,
              type,
            },
          },
        ],
      },
    },
  );
};
