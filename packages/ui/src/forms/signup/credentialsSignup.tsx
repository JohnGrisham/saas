import * as React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
//import { loginSchema } from './validation/loginSchema'
import { Auth } from '@aws-amplify/auth';

enum AuthState {
  PRE_SIGNUP = 'PRE_SIGNUP',
  VERIFY = 'VERIFY',
}

interface CredentialsSignupProps {
  signinUrl: string;
}

export const CredentialsSignup: React.FC<CredentialsSignupProps> = ({
  signinUrl,
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
              window.location.replace(signinUrl);
            }
          }
        }}
      >
        <Form>
          <label
            className="block pt-2 pb-1 text-sm font-bold text-white"
            htmlFor="Email"
          >
            Email
          </label>
          <Field
            className="focus:shadow-outline block w-full appearance-none rounded border border-gray-300 bg-gray-200 py-2 px-4 text-gray-700 focus:outline-none"
            id="email"
            name="email"
          />
          <ErrorMessage
            component="a"
            className="text-sm text-red-500"
            name="email"
          />
          {authState === AuthState.VERIFY ? (
            <>
              <label
                className="block pt-2 pb-1 text-sm font-bold text-white"
                htmlFor="verificationCode"
              >
                Verification Code
              </label>
              <Field
                className="focus:shadow-outline block w-full appearance-none rounded border border-gray-300 bg-gray-200 py-2 px-4 text-gray-700 focus:outline-none"
                id="verificationCode"
                name="verificationCode"
              />
            </>
          ) : (
            <>
              <label
                className="block pt-2 pb-1 text-sm font-bold text-white"
                htmlFor="password"
              >
                Password
              </label>
              <Field
                className="focus:shadow-outline block w-full appearance-none rounded border border-gray-300 bg-gray-200 py-2 px-4 text-gray-700 focus:outline-none"
                id="password"
                name="password"
              />
            </>
          )}
          <ErrorMessage
            component="a"
            className="text-sm text-red-500"
            name="password"
          />
          <div className="mt-8 flex flex-col items-center">
            <button
              type="submit"
              className="w-full rounded bg-gray-700 py-2 px-4 font-bold text-white hover:bg-gray-600"
            >
              {authState === AuthState.PRE_SIGNUP ? 'Signup' : 'Verify'}
            </button>
            {signinUrl && (
              <a
                className="mt-2 text-white hover:cursor-pointer"
                href={signinUrl}
              >
                Sign in
              </a>
            )}
          </div>
        </Form>
      </Formik>
    </>
  );
};
