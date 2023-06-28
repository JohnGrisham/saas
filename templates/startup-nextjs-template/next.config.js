const { name } = require('./package.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: `/${name}`,
  experimental: {
    appDir: true,
  },
  images: {
    loader: 'custom',
    loaderFile: './loader.js',
  },
};

module.exports = nextConfig;
