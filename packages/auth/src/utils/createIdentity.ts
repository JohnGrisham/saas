import {
  Mutation,
  MutationIdentityCreateArgs,
  IdentityType,
  graphQLClient,
} from 'client';
import { gql } from 'graphql-request';

export const createIdentity = async (
  sub: string,
  userId: string,
  type: IdentityType,
) => {
  await graphQLClient.request<Mutation, MutationIdentityCreateArgs>(
    gql`
      mutation CreateIdentity($input: IdentityCreateInput!) {
        identityCreate(input: $input) {
          identity {
            id
          }
        }
      }
    `,
    {
      input: {
        sub,
        type,
        user: { link: userId },
      },
    },
  );
};
