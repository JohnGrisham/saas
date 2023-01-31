import * as React from 'react';
import { Auth } from '@aws-amplify/auth';
import { ErrorMessage } from 'formik';
import { Field } from '../input';
import { Form } from '../form';

enum AuthState {
  PRE_SIGNUP = 'PRE_SIGNUP',
  VERIFY = 'VERIFY',
}

interface CredentialsSignupProps {
  image: React.ReactNode;
  signInUrl: string;
  onSignup?: (email: string, password: string) => Promise<void>;
}

export const CredentialsSignup: React.FC<CredentialsSignupProps> = ({
  image,
  signInUrl,
  onSignup,
}) => {
  const [authState, setAuthState] = React.useState<AuthState>(
    AuthState.PRE_SIGNUP,
  );

  return (
    <section className="w-screen">
      <div className="flex flex-wrap items-center justify-center text-gray-800 g-6">
        <div className="w-7/12 -mt-10 md:mt-0 lg:w-5/12">{image}</div>
        <div className="lg:w-4/12">
          <Form
            initialValues={{
              email: '',
              password: '',
              verificationCode: '',
            }}
            onSubmit={async ({ email, password, verificationCode }) => {
              if (authState === AuthState.PRE_SIGNUP) {
                const response = await Auth.signUp({
                  username: email,
                  password,
                  attributes: {
                    email,
                  },
                });

                if (response.user && response.userConfirmed === false) {
                  setAuthState(AuthState.VERIFY);
                }
              }

              if (authState === AuthState.VERIFY) {
                const verifyResponse = await Auth.confirmSignUp(
                  email,
                  verificationCode,
                );

                if (verifyResponse === 'SUCCESS') {
                  onSignup ? await onSignup(email, password) : null;
                }
              }
            }}
          >
            <Field name="email" label="Email" type="email" />
            <ErrorMessage
              component="a"
              className="text-sm text-red-500"
              name="email"
            />
            {authState === AuthState.VERIFY ? (
              <Field name="verificationCode" label="Verification Code" />
            ) : (
              <Field label="Password" name="password" type="password" />
            )}
            <ErrorMessage
              component="a"
              className="text-sm text-red-500"
              name="password"
            />
            <div className="flex flex-col items-center mt-8">
              <button
                type="submit"
                className="inline-block w-full py-3 text-sm font-medium leading-snug text-white uppercase transition duration-150 ease-in-out rounded shadow-md bg-primary-600 px-7 hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
              >
                {authState === AuthState.PRE_SIGNUP ? 'Signup' : 'Verify'}
              </button>
              {signInUrl && (
                <a
                  className="mt-2 text-primary-600 hover:cursor-pointer dark:text-white"
                  href={signInUrl}
                >
                  Sign in
                </a>
              )}
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
};
