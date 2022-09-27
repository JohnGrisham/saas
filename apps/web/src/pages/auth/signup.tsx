import { CredentialsSignup } from 'ui';
import { signIn } from 'next-auth/react';

const signup = () => (
  <CredentialsSignup
    signInUrl="/auth/signin"
    onSignup={async (email, password) => {
      try {
        await signIn('credentials', {
          redirect: false,
          username: email,
          password,
        });
        const res = await fetch('/api/signup', { method: 'POST' });

        if (res.ok) {
          const json = await res.json();
          console.log(json);
        }
      } catch (err: any) {
        console.error(err.message);
      } finally {
        window.location.replace(process.env.NEXT_PUBLIC_ROOT_URL as string);
      }
    }}
  />
);
export default signup;
