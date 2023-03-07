import { CredentialsSignin, useThemeContext } from 'ui';
import Netlify from '../../../public/netlify.svg';
import Unlock from '../../../public/unlock.svg';
import { signIn } from 'next-auth/react';

const signInOptions = {
  callbackUrl: process.env.NEXT_PUBLIC_ROOT_URL as string,
  redirect: false,
};

const Signin: React.FC = () => {
  const theme = useThemeContext();

  return (
    <CredentialsSignin
      backgroundImage={<Unlock color={theme.colors.primary[500]} />}
      signupUrl="/auth/signup"
      signInOptions={signInOptions}
    >
      <a
        className="flex items-center justify-center w-full py-3 mb-3 text-sm font-medium leading-snug text-white uppercase transition duration-150 ease-in-out rounded shadow-md px-7 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
        style={{ backgroundColor: '#00AD9F' }}
        href="#!"
        role="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        onClick={async () =>
          await signIn('netlify', signInOptions, { scope: '' })
        }
      >
        <Netlify />
      </a>
    </CredentialsSignin>
  );
};

export default Signin;
