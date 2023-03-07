import { signIn, SignInOptions } from 'next-auth/react';
import { Button } from '../../button';
import { Field } from '../input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form } from '../form';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

interface CredentialsSignupProps {
  backgroundImage: React.ReactNode;
  children?: React.ReactNode;
  signupUrl?: string;
  signInOptions?: SignInOptions;
}

export const CredentialsSignin: React.FC<CredentialsSignupProps> = ({
  backgroundImage,
  children,
  signupUrl,
  signInOptions,
}) => (
  <section className="w-screen">
    <div className="flex flex-wrap items-center justify-center text-gray-800 g-6">
      <div className="w-7/12 -mt-10 md:mt-0 lg:w-5/12">{backgroundImage}</div>
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
              <div className="flex items-center justify-between mb-6">
                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    className="float-left w-4 h-4 mt-1 mr-2 text-white align-top transition duration-200 bg-white bg-center bg-no-repeat bg-contain border border-gray-300 rounded-sm appearance-none cursor-pointer form-check-input checked:border-primary-600 checked:bg-primary-600 focus:outline-none"
                    id="remember-me"
                  />
                  <label
                    className="inline-block form-check-label text-primary-600"
                    htmlFor="remember-me"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#!"
                  className="transition duration-200 ease-in-out text-primary-600 hover:text-primary-700 focus:text-primary-700 active:text-primary-800"
                >
                  Forgot password?
                </a>
              </div>
              <Button
                disabled={!isValid}
                type="submit"
                className="inline-block w-full py-3 text-sm font-medium leading-snug text-white uppercase transition duration-150 ease-in-out rounded shadow-md bg-primary-600 px-7 hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
              >
                Sign in
              </Button>
              <div className="flex flex-col items-center text-xs uppercase font-small px-7">
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
                <p className="mx-4 mb-0 font-semibold text-center text-primary-600">
                  OR
                </p>
              </div>
              <a
                className="flex items-center justify-center w-full py-3 mb-3 text-sm font-medium leading-snug text-white uppercase transition duration-150 ease-in-out rounded shadow-md px-7 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
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
              {children}
            </>
          )}
        </Form>
      </div>
    </div>
  </section>
);
