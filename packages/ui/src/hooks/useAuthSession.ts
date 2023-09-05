import { AuthenticatedSessionContext } from '../providers';
import { useContext } from 'react';
import { useSession } from 'next-auth/react';

export const useAuthSession = () => {
  return useContext(AuthenticatedSessionContext);
};

export { useSession };
