const tailwindConfig = require('../tailwind.config');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-tailwind-dark-mode',
    {
      name: '@storybook/addon-postcss',
      options: {
        cssLoaderOptions: {
          // When you have splitted your css over multiple files
          // and use @import('./other-styles.css')
          importLoaders: 1,
        },
        postcssLoaderOptions: {
          // When using postCSS 8
          implementation: require('postcss'),
        },
      },
    },
    'storybook-addon-next-router',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  env: (config) => ({
    ...config,
    PRIMARY_50: tailwindConfig.theme.extend.colors.primary[50],
    PRIMARY_100: tailwindConfig.theme.extend.colors.primary[100],
    PRIMARY_200: tailwindConfig.theme.extend.colors.primary[200],
    PRIMARY_300: tailwindConfig.theme.extend.colors.primary[300],
    PRIMARY_400: tailwindConfig.theme.extend.colors.primary[400],
    PRIMARY_500: tailwindConfig.theme.extend.colors.primary[500],
    PRIMARY_600: tailwindConfig.theme.extend.colors.primary[600],
    PRIMARY_700: tailwindConfig.theme.extend.colors.primary[700],
    PRIMARY_800: tailwindConfig.theme.extend.colors.primary[800],
    PRIMARY_900: tailwindConfig.theme.extend.colors.primary[900],
    SECONDARY_50: tailwindConfig.theme.extend.colors.secondary[50],
    SECONDARY_100: tailwindConfig.theme.extend.colors.secondary[100],
    SECONDARY_200: tailwindConfig.theme.extend.colors.secondary[200],
    SECONDARY_300: tailwindConfig.theme.extend.colors.secondary[300],
    SECONDARY_400: tailwindConfig.theme.extend.colors.secondary[400],
    SECONDARY_500: tailwindConfig.theme.extend.colors.secondary[500],
    SECONDARY_600: tailwindConfig.theme.extend.colors.secondary[600],
    SECONDARY_700: tailwindConfig.theme.extend.colors.secondary[700],
    SECONDARY_800: tailwindConfig.theme.extend.colors.secondary[800],
    SECONDARY_900: tailwindConfig.theme.extend.colors.secondary[900],
    ACCENT_50: tailwindConfig.theme.extend.colors.accent[50],
    ACCENT_100: tailwindConfig.theme.extend.colors.accent[100],
    ACCENT_200: tailwindConfig.theme.extend.colors.accent[200],
    ACCENT_300: tailwindConfig.theme.extend.colors.accent[300],
    ACCENT_400: tailwindConfig.theme.extend.colors.accent[400],
    ACCENT_500: tailwindConfig.theme.extend.colors.accent[500],
    ACCENT_600: tailwindConfig.theme.extend.colors.accent[600],
    ACCENT_700: tailwindConfig.theme.extend.colors.accent[700],
    ACCENT_800: tailwindConfig.theme.extend.colors.accent[800],
    ACCENT_900: tailwindConfig.theme.extend.colors.accent[900],
  }),
  webpackFinal: async (config) => {
    config.resolve.fallback = {
      tty: require.resolve('tty-browserify'),
    };

    // Return the altered config
    return config;
  },
};