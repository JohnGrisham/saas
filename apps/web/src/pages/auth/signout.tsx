import * as React from 'react';
import { Auth } from '@aws-amplify/auth';

export default function Signout() {
  React.useEffect(() => {
    const signout = async () => {
      await Auth.signOut();
      window.location.replace(process.env.NEXT_PUBLIC_ROOT_URL as string);
    };
    signout();
  }, []);

  return null;
}
