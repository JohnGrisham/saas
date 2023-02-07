import * as React from 'react';
import { Auth } from '@aws-amplify/auth';
import { Field } from '../input';
import { Form } from '../form';
import { RegistrationFlow } from '../registration';

enum RegistrationStatus {
  COMPLETE = 'COMPLETE',
  INCOMPLETE = 'INCOMPLETE',
  STARTED = 'STARTED',
}

enum AuthState {
  PRE_SIGNUP = 'PRE_SIGNUP',
  VERIFY = 'VERIFY',
}

export interface RegistrationState {
  status: RegistrationStatus;
  onRegister?: () => Promise<any>;
}

export interface CredentialsSignupProps {
  image: React.ReactNode;
  signInUrl: string;
  onSignup?: (email: string, password: string) => Promise<void>;
  disableRegistration?: boolean;
}

export const CredentialsSignup: React.FC<CredentialsSignupProps> = ({
  image,
  signInUrl,
  onSignup,
  disableRegistration = false,
}) => {
  const [registration, setRegistration] = React.useState<RegistrationState>(
    disableRegistration
      ? { status: RegistrationStatus.COMPLETE }
      : { status: RegistrationStatus.INCOMPLETE },
  );
  const [authState, setAuthState] = React.useState<AuthState>(
    AuthState.PRE_SIGNUP,
  );

  const postRegister = React.useCallback(async () => {
    try {
      if (registration.onRegister) {
        await registration.onRegister();
      }
    } catch (err: any) {
      console.error(`Registration failed: ${err.message}`);
    }
  }, [registration]);

  return (
    <section className="w-screen">
      <div className="flex flex-wrap items-center justify-center text-gray-800 g-6">
        <div className="w-7/12 -mt-10 md:mt-0 lg:w-5/12">{image}</div>
        <div className="lg:w-4/12">
          {registration.status === RegistrationStatus.STARTED ? (
            <RegistrationFlow onSubmit={postRegister} onSkip={postRegister} />
          ) : (
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

                  !disableRegistration
                    ? setRegistration({
                        onRegister: async () => {
                          if (onSignup) {
                            await onSignup(email, password);
                          }
                        },
                        status: RegistrationStatus.STARTED,
                      })
                    : null;

                  if (
                    verifyResponse === 'SUCCESS' &&
                    registration.status === RegistrationStatus.COMPLETE
                  ) {
                    onSignup ? await onSignup(email, password) : null;
                  }
                }
              }}
            >
              <Field name="email" label="Email" type="email" />
              {authState === AuthState.VERIFY ? (
                <Field name="verificationCode" label="Verification Code" />
              ) : (
                <Field label="Password" name="password" type="password" />
              )}
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
          )}
        </div>
      </div>
    </section>
  );
};
