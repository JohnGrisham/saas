import { JWT } from 'next-auth/jwt';
import { PasswordUser } from 'core';

export const constructCognitoToken = (
  token: JWT,
  user: PasswordUser,
  defaultExpiration: number,
): JWT => {
  const session = user.getSignInUserSession();

  return {
    ...token,
    sub: user.getUsername(),
    email: user.email,
    accessToken: session?.getAccessToken().getJwtToken(),
    accessTokenExpires:
      session?.getAccessToken().getExpiration() ?? defaultExpiration,
    refreshToken: session?.getRefreshToken().getToken(),
  };
};
