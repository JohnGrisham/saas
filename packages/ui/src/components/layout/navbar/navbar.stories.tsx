import { Navbar } from './navbar';

const navbar = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Navbar',
  component: Navbar,
};

export default navbar;

export const Basic = () => (
  <Navbar
    logoProps={{
      title: 'SaaS',
      src: 'https://flowbite.com/docs/images/logo.svg',
    }}
    navItems={[
      { id: 'home', href: '/', title: 'Home', type: 'simple' },
      { id: 'about', href: '/about', title: 'About', type: 'simple' },
    ]}
  />
);
