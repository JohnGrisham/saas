import type { NextAuthOptions } from 'next-auth';
import { crossDomainCookies, jwt } from 'auth';

export const authOptions: NextAuthOptions = {
  providers: [],
  cookies: crossDomainCookies,
  jwt,
};
