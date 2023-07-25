import { NextAuthOptions } from 'next-auth';
import { callbacks, crossDomainCookies, jwt } from 'auth';

export const authOptions: NextAuthOptions = {
  providers: [],
  callbacks,
  cookies: crossDomainCookies,
  jwt,
};
