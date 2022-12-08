import { Formik, Field, Form, ErrorMessage, validateYupSchema } from 'formik';
import { signIn, SignInOptions } from 'next-auth/react';
//import { loginSchema } from './validation/loginSchema'

interface CredentialsSignupProps {
  signupUrl?: string;
  signInOptions?: SignInOptions;
}

export const CredentialsSignin: React.FC<CredentialsSignupProps> = ({
  signupUrl,
  signInOptions,
}) => (
  <>
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      // validationSchema={loginSchema}
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
        <label
          className="block pt-2 pb-1 text-sm font-bold text-white"
          htmlFor="Email"
        >
          Password
        </label>
        <Field
          className="focus:shadow-outline block w-full appearance-none rounded border border-gray-300 bg-gray-200 py-2 px-4 text-gray-700 focus:outline-none"
          id="password"
          name="password"
        />
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
            Login
          </button>
          {signupUrl && (
            <a
              className="mt-2 text-white hover:cursor-pointer"
              href={signupUrl}
            >
              Sign up
            </a>
          )}
        </div>
      </Form>
    </Formik>
  </>
);
