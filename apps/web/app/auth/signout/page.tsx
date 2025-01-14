'use client';
import * as React from 'react';
import Auth from 'amplify';

const Signout: React.FC = () => {
  React.useEffect(() => {
    const signout = async () => {
      await Auth.signOut();
      window.location.replace(
        `${process.env.NEXT_PUBLIC_ROOT_URL}/auth/signin`,
      );
    };
    signout();
  }, []);

  return null;
};

export default Signout;
