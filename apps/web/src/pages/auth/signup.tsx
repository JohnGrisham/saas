import { CredentialsSignup, useThemeContext } from 'ui';
import Unlock from '../../../public/unlock-edited.svg';
import { signIn } from 'next-auth/react';

const Signup = () => {
  const theme = useThemeContext();

  return (
    <CredentialsSignup
      image={<Unlock color={theme.colors.primary[500]} />}
      signInUrl="/auth/signin"
      onSignup={async (email, password) => {
        try {
          await signIn('credentials', {
            redirect: false,
            username: email,
            password,
          });
        } catch (err: any) {
          console.error(err.message);
        } finally {
          window.location.replace(process.env.NEXT_PUBLIC_ROOT_URL as string);
        }
      }}
    />
  );
};
export default Signup;
