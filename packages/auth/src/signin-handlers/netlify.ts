import { createIdentity, createUser, getUserByEmail } from '../utils';
import { IdentityType } from 'client';

export const netlifySigninHandler = async (
  userId: string,
  email: string,
  name: string,
) => {
  const gqlUserRecord = await getUserByEmail(email);
  const netlifyIdentity = !!gqlUserRecord?.identities?.edges?.find(
    (edge) => edge?.node.type === IdentityType.Netlify,
  );

  if (!gqlUserRecord) {
    await createUser(email, userId, IdentityType.Netlify, name);
  } else if (gqlUserRecord && !netlifyIdentity) {
    await createIdentity(userId, gqlUserRecord.id, IdentityType.Netlify);
  }
};
