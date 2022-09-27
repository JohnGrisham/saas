import * as React from 'react';
import Link from 'next/link';
import {
  SignOutParams,
  signIn,
  signOut,
  useSession,
  SignInOptions,
} from 'next-auth/react';

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.

export interface HeaderProps {
  signInOptions?: SignInOptions;
  signoutOptions?: SignOutParams;
}

export const Header: React.FC<HeaderProps> = ({
  signInOptions,
  signoutOptions,
}) => {
  const { data: session } = useSession();

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className="flex w-full items-center justify-center border border-transparent bg-white px-8">
        {!session?.user?.email && (
          <>
            <span>You are not signed in:&nbsp;</span>
            <a
              href={`/api/auth/signin`}
              onClick={(e) => {
                e.preventDefault();
                signIn(undefined, signInOptions);
              }}
            >
              Sign in
            </a>
          </>
        )}
        {session?.user?.email && (
          <>
            <nav className="flex w-full">
              <ul className="grid w-full grid-cols-3 gap-x-5">
                <li>
                  <Link href="/">
                    <a>Home</a>
                  </Link>
                </li>
                <li>
                  <Link href="/">
                    <a>Protected</a>
                  </Link>
                </li>
                <li>
                  <Link href="/account">
                    <a>Me</a>
                  </Link>
                </li>
              </ul>
            </nav>
            <a
              href={`/api/auth/signout`}
              onClick={async (e) => {
                e.preventDefault();
                await signOut(signoutOptions);
              }}
            >
              Sign out
            </a>
          </>
        )}
      </div>
    </header>
  );
};
