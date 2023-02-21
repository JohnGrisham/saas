import { signIn, SignInOptions } from 'next-auth/react';
import { Button } from '../../button';
import { Field } from '../input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form } from '../form';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

interface CredentialsSignupProps {
  image: React.ReactNode;
  signupUrl?: string;
  signInOptions?: SignInOptions;
}

export const CredentialsSignin: React.FC<CredentialsSignupProps> = ({
  image,
  signupUrl,
  signInOptions,
}) => (
  <section className="w-screen">
    <div className="flex flex-wrap items-center justify-center text-gray-800 g-6">
      <div className="w-7/12 -mt-10 md:mt-0 lg:w-5/12">{image}</div>
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
                onClick={async () => await signIn('google')}
              >
                <FontAwesomeIcon icon={faGoogle} />
                &nbsp; Continue with Google
              </a>
              <a
                className="flex items-center justify-center w-full py-3 text-sm font-medium leading-snug text-white uppercase transition duration-150 ease-in-out rounded shadow-md px-7 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
                style={{ backgroundColor: '#55acee' }}
                href="#!"
                role="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="mr-2 h-3.5 w-3.5"
                >
                  <path
                    fill="currentColor"
                    d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                  />
                </svg>
                Continue with Twitter
              </a>
            </>
          )}
        </Form>
      </div>
    </div>
  </section>
);
