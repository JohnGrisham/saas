import { signIn, SignInOptions } from 'next-auth/react';
import { Button } from '../../button';
import { Field } from '../input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form } from '../form';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

interface CredentialsSignupProps {
  backgroundImage: React.ReactNode;
  signupUrl?: string;
  signInOptions?: SignInOptions;
}

export const CredentialsSignin: React.FC<CredentialsSignupProps> = ({
  backgroundImage,
  signupUrl,
  signInOptions,
}) => (
  <section className="w-screen">
    <div className="g-6 flex flex-wrap items-center justify-center text-gray-800">
      <div className="-mt-10 w-7/12 md:mt-0 lg:w-5/12">{backgroundImage}</div>
      <div className="lg:w-4/12">
        <Form
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={async ({ email, password }) => {
            const response = await signIn('credentials', {
              ...signInOptions,
              username: email,
              password,
            });

            if (response?.ok && signInOptions?.callbackUrl) {
              window.location.replace(signInOptions.callbackUrl);
            }
          }}
          innerFormProps={{ className: 'lg:w-10/12' }}
        >
          {({ isValid }) => (
            <>
              <Field name="email" label="Email" type="email" required />
              <Field
                label="Password"
                name="password"
                type="password"
                required
              />
              <div className="mb-6 flex items-center justify-between">
                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    className="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top text-white transition duration-200 checked:border-primary-600 checked:bg-primary-600 focus:outline-none"
                    id="remember-me"
                  />
                  <label
                    className="form-check-label inline-block text-primary-600"
                    htmlFor="remember-me"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#!"
                  className="text-primary-600 transition duration-200 ease-in-out hover:text-primary-700 focus:text-primary-700 active:text-primary-800"
                >
                  Forgot password?
                </a>
              </div>
              <Button
                disabled={!isValid}
                type="submit"
                className="inline-block w-full rounded bg-primary-600 py-3 px-7 text-sm font-medium uppercase leading-snug text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
              >
                Sign in
              </Button>
              <div className="font-small flex flex-col items-center px-7 text-xs uppercase">
                {signupUrl && (
                  <a
                    className="mt-2 text-primary-600 hover:cursor-pointer dark:text-white"
                    href={signupUrl}
                  >
                    Sign up
                  </a>
                )}
              </div>
              <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-gray-300 after:mt-0.5 after:flex-1 after:border-t after:border-gray-300">
                <p className="mx-4 mb-0 text-center font-semibold text-primary-600">
                  OR
                </p>
              </div>
              <a
                className="mb-3 flex w-full items-center justify-center rounded py-3 px-7 text-sm font-medium uppercase leading-snug text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
                style={{ backgroundColor: '#0F9D58' }}
                href="#!"
                role="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                onClick={async () => await signIn('google', signInOptions)}
              >
                <FontAwesomeIcon icon={faGoogle} />
                &nbsp; Continue with Google
              </a>
            </>
          )}
        </Form>
      </div>
    </div>
  </section>
);
