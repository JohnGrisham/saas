/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { Dropdown, DropdownItem } from '../../dropdown';
import { SignOutParams, signOut, useSession } from 'next-auth/react';
import { useBreakpointEffect } from 'tailwind-config';
import { Avatar } from '../../avatar';
import { Button } from '../../button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { Toggle } from '../../toggle';
import cn from 'classnames';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useThemeContext } from '../../../hooks';

export interface NavItem {
  id: string;
  href: string;
  title: string;
  type: 'simple';
}

export interface CustomNavItem {
  id: string;
  component: React.ReactNode;
  type: 'custom';
}

export interface LogoSettings {
  title: string;
  src: string;
  href?: string;
}

export interface NavbarProps {
  navItems: Array<NavItem | CustomNavItem>;
  logoProps: LogoSettings;
  classNames?: string;
  profileItems?: DropdownItem[];
  signoutOptions?: SignOutParams;
}

export const Navbar: React.FC<NavbarProps> = ({
  classNames,
  logoProps,
  navItems,
  signoutOptions,
  profileItems = [],
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { data: session, status } = useSession();
  const { isDarkMode, setDarkMode } = useThemeContext();
  const { pathname } = useRouter();

  const navbarStyles = React.useMemo(() => {
    return cn([
      `flex border-gray-200 bg-white px-2 py-2.5 dark:bg-gray-900 sm:px-4 relative`,
      classNames,
    ]);
  }, [classNames]);

  const navWrapperStyles = React.useMemo(() => {
    return cn([
      `items-center w-full md:flex md:w-auto md:space-x-8 md:mr-20`,
      {
        hidden: !mobileMenuOpen,
        ['absolute left-0 top-12']: mobileMenuOpen,
      },
    ]);
  }, [mobileMenuOpen]);

  const navStyles = React.useMemo(() => {
    return cn([
      `mt-4 mx-2 flex flex-col text-gray-700 dark:text-gray-400 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:text-sm md:font-medium md:dark:bg-gray-900`,
    ]);
  }, []);

  const postNavStyles = React.useMemo(() => {
    return cn([`flex items-center absolute right-16 top-[1.3rem]`]);
  }, []);

  const profileDropdownItems = React.useMemo(() => {
    const options = profileItems.concat({
      title: 'Sign Out',
      href: `/api/auth/signout`,
      onSelect: async (e) => {
        e.preventDefault();
        await signOut(signoutOptions);
      },
    });

    if (session && session.user?.email) {
      options.unshift({
        title: 'Profile',
        href: '/account',
      });
      options.unshift({
        classNames: 'bg-primary-700 text-white',
        title: session.user.email,
        disabled: true,
      });
    }

    return options;
  }, [profileItems, signoutOptions, session]);

  const getNavItemStyles = React.useCallback(
    (href: string) => {
      return cn([
        `block rounded py-2 pl-3 pr-4 hover:bg-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent hover:text-primary-500 md:dark:hover:bg-transparent md:dark:hover:text-white`,
        {
          ['text-primary-700']: pathname === href,
        },
      ]);
    },
    [pathname],
  );

  useBreakpointEffect('md', (match: any) => {
    if (match) {
      setMobileMenuOpen(false);
    }
  });

  return (
    <nav className={navbarStyles}>
      <div className="container flex flex-wrap items-center justify-between mx-auto h-14">
        <a href={logoProps.href ?? '#'} className="flex items-center">
          <img
            src={logoProps.src}
            className="h-6 mr-3"
            alt={`${logoProps.title} Logo`}
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            {logoProps.title}
          </span>
        </a>
        <div className="flex h-full">
          {status === 'authenticated' && session && (
            <>
              <div className={navWrapperStyles} id="navbar-items-wrapper">
                <ul className={navStyles}>
                  {navItems.map((item) => (
                    <li key={item.id} className="p-2 nav-item">
                      {item.type === 'simple' ? (
                        <Link href={item.href}>
                          <a className={getNavItemStyles(item.href)}>
                            {item.title}
                          </a>
                        </Link>
                      ) : (
                        item.component
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={postNavStyles}>
                <Button
                  className="inline-flex items-center p-2 ml-3 mr-1 text-sm text-gray-500 rounded-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
                  aria-controls="navbar-items-wrapper"
                  aria-expanded="false"
                  onClick={() => setMobileMenuOpen((current) => !current)}
                >
                  <span className="sr-only">Open main menu</span>
                  <FontAwesomeIcon icon={faBars} size={'lg'} />
                </Button>
                <Dropdown listClassNames="right-0" items={profileDropdownItems}>
                  <Avatar
                    imageSrc="https://mdbcdn.b-cdn.net/img/new/avatars/8.webp"
                    width={7}
                  />
                </Dropdown>
              </div>
            </>
          )}
        </div>
      </div>
      <Toggle
        checked={isDarkMode}
        classNames="mb-1.5 ml-2 toggle-dark-mode"
        onChange={() => setDarkMode((currentMode) => !currentMode)}
      />
    </nav>
  );
};
