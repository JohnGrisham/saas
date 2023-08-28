import * as React from 'react';
import { AuthenticatedSessionContext } from '../providers';
import { useSession } from 'next-auth/react';

export const useAuthSession = () =>
  React.useContext(AuthenticatedSessionContext);

export { useSession };
