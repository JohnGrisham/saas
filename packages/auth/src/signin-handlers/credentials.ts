import { createIdentity, createUser, getUserByEmail } from '../utils';
import { IdentityType } from 'client';
import { User } from 'next-auth';
import { isCognitoUser } from 'core';

export const credentialsSigninHandler = async (user: User, email: string) => {
  const gqlUserRecord = await getUserByEmail(email);
  const cognitoUser = isCognitoUser(user);
  const hasPasswordIdentity = !!gqlUserRecord?.identities?.edges?.find(
    (edge) => edge?.node.type === IdentityType.Credentials,
  );

  if (!gqlUserRecord && cognitoUser) {
    await createUser(email, user.getUsername(), IdentityType.Credentials);
  } else if (gqlUserRecord && !hasPasswordIdentity && cognitoUser) {
    await createIdentity(
      user.getUsername(),
      gqlUserRecord.id,
      IdentityType.Credentials,
    );
  }
};
