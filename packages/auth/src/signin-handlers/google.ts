import { createIdentity, createUser, getUserByEmail } from '../utils';
import { IdentityType } from 'client';
import { Profile } from 'next-auth';

export const googleSigninHandler = async (
  sub: string,
  email: string,
  name: string,
) => {
  const gqlUserRecord = await getUserByEmail(email);
  const googleIdentity = gqlUserRecord?.identities?.edges?.find(
    (edge) => edge?.node.type === IdentityType.Google,
  );

  if (!gqlUserRecord) {
    await createUser(email, sub, IdentityType.Google, name);
  } else if (gqlUserRecord && !googleIdentity) {
    await createIdentity(sub, gqlUserRecord.id, IdentityType.Google);
  }
};
