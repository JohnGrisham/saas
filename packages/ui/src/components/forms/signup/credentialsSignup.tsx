import * as React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Auth } from '@aws-amplify/auth';

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
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          verificationCode: '',
        }}
        // validationSchema={loginSchema}
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
        <section className="w-screen">
          <div className="flex flex-wrap items-center justify-center text-gray-800 g-6">
            <div className="w-7/12 -mt-10 md:mt-0 lg:w-5/12">{image}</div>
            <div className="lg:w-4/12">
              <Form>
                <label
                  className="block pt-2 pb-1 text-sm font-bold text-gray-700 dark:text-white"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="mb-6">
                  <Field
                    className="block w-full px-4 py-2 m-0 text-xl font-normal text-gray-700 transition ease-in-out bg-white border border-gray-300 border-solid rounded form-control bg-clip-padding focus:border-primary-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                    id="email"
                    name="email"
                  />
                </div>
                <ErrorMessage
                  component="a"
                  className="text-sm text-red-500"
                  name="email"
                />
                {authState === AuthState.VERIFY ? (
                  <>
                    <label
                      className="block pt-2 pb-1 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="verificationCode"
                    >
                      Verification Code
                    </label>
                    <div className="mb-6">
                      <Field
                        className="block w-full px-4 py-2 m-0 text-xl font-normal text-gray-700 transition ease-in-out bg-white border border-gray-300 border-solid rounded form-control bg-clip-padding focus:border-primary-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                        id="verificationCode"
                        name="verificationCode"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <label
                      className="block pt-2 pb-1 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="mb-6">
                      <Field
                        className="block w-full px-4 py-2 m-0 text-xl font-normal text-gray-700 transition ease-in-out bg-white border border-gray-300 border-solid rounded form-control bg-clip-padding focus:border-primary-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                        id="password"
                        name="password"
                      />
                    </div>
                  </>
                )}
                <ErrorMessage
                  component="a"
                  className="text-sm text-red-500"
                  name="password"
                />
                <div className="flex flex-col items-center mt-8">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 font-bold text-white bg-gray-700 rounded hover:bg-gray-600"
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
      </Formik>
    </>
  );
};
