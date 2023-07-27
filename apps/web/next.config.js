const headers = [
  'Accept',
  'Accept-Version',
  'Cookie',
  'Content-Length',
  'Content-MD5',
  'Content-Type',
  'Date',
  'X-Api-Key',
  'X-Api-Version',
  'X-CSRF-Token',
  'X-Requested-With',
];

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    ALLOWED_NEXT_AUTH_URLS: [
      'https://(.+\\.|)example.com/?',
      // TODO: Dynamically add more depending on user custom domains.
    ],
    ALLOWED_HEADERS: headers.join(', '),
  },
  async headers() {
    return [
      {
        source: '/api/auth/:path*',
        has: [{ type: 'header', key: 'Origin', value: '(?<origin>.*)' }],
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: ':origin' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: headers.join(', '),
          },
        ],
      },
    ];
  },
  // TODO: Uncomment this when the above TODO is resolved.
  // redirect: async ({ url, baseUrl }) => {
  //   return Promise.resolve(
  //     process.env.ALLOWED_NEXT_AUTH_URLS.some((regex) => {
  //       const re = new RegExp(regex);
  //       if (re.test(url)) {
  //       }
  //       return re.test(url);
  //     })
  //       ? url
  //       : baseUrl,
  //   );
  // },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    config.module.rules.push({
      test: /\.html$/i,
      loader: 'html-loader',
    });

    config.resolve.fallback = { fs: false };

    return config;
  },
};
