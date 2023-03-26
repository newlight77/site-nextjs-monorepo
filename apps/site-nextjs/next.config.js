/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const Dotenv = require('dotenv-webpack');

const envDefaultFile = path.join(__dirname, '.env.default');
const envFile = path.join(__dirname, '.env');

const config_webpack = {
  webpack: config => {
    config.plugins = config.plugins || [];
    config.plugins = [
      ...config.plugins,
      new Dotenv({
        path: envDefaultFile,
        systemvars: true
      }),
      envFile ? new Dotenv({
        path: envFile,
        systemvars: true
      }) : console.error('missing .env file')
    ];
    return config;
  },
};

const config_rewrites = {
  async rewrites() {
    return [
      {
        source: '/api/notion/:path*',
        destination: 'https://api.notion.com/:path*',
      },
    ];
  },
};

const config_log = {
  removeConsole: {
    exclude: ["error", "warn", "info"],
  },
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config_static_assets = {
    staticPageGenerationTimeout: 300,
    images: {
      domains: [
        'www.notion.so',
        'notion.so',
        'images.unsplash.com',
        'pbs.twimg.com',
        'abs.twimg.com',
        's3.us-west-2.amazonaws.com',
        'transitivebullsh.it'
      ],
      formats: ['image/avif', 'image/webp'],
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
    }
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})


module.exports = withBundleAnalyzer(
  {...config_webpack, ...config_rewrites, ...config_log, ...config_static_assets}
)