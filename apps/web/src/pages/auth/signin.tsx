import { CredentialsSignin, useThemeContext } from 'ui';
import Unlock from '../../../public/unlock-edited.svg';

const Signin: React.FC = () => {
  const theme = useThemeContext();

  return (
    <CredentialsSignin
      image={<Unlock color={theme.colors.primary[500]} />}
      signupUrl="/auth/signup"
      signInOptions={{
        callbackUrl: process.env.NEXT_PUBLIC_ROOT_URL as string,
        redirect: false,
      }}
    />
  );
};

export default Signin;
