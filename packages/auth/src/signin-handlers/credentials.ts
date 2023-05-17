import { createIdentity, createUser, getUserByEmail } from '../utils';
import { IdentityType } from 'client';
import { User } from 'next-auth';
import { isCognitoUser } from 'core';

export const credentialsSigninHandler = async (
  user: User,
  email: string,
  name: string,
) => {
  const gqlUserRecord = await getUserByEmail(email);
  const cognitoUser = isCognitoUser(user);
  const passwordIdentity = gqlUserRecord?.identities?.edges?.find(
    (edge) => edge?.node.type === IdentityType.Credentials,
  );

  if (!gqlUserRecord && cognitoUser) {
    await createUser(email, user.getUsername(), IdentityType.Credentials, name);
  } else if (gqlUserRecord && !passwordIdentity && cognitoUser) {
    await createIdentity(
      user.getUsername(),
      gqlUserRecord.id,
      IdentityType.Credentials,
    );
  }
};
