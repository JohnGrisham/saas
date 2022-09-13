import { CredentialsSignin } from 'ui';

const signin = () => (
  <CredentialsSignin
    signupUrl="/auth/signup"
    signInOptions={{
      callbackUrl: process.env.NEXT_PUBLIC_ROOT_URL as string,
      redirect: false,
    }}
  />
);
export default signin;
