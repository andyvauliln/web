/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
// @ts-ignore
const pathBuilder = (subpath) => path.join(process.cwd(), subpath);
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const coreConfig = {
  images: {
    remotePatterns: [{ hostname: "utfs.io" }],
  },
  // profiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },

  webpack: (config, { webpack }) => {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: pathBuilder('node_modules/cesium/Build/Cesium/Workers'),
            to: '../public/cesium/Workers',
            info: { minimized: true }
          },
          {
            from: pathBuilder('node_modules/cesium/Build/Cesium/ThirdParty'),
            to: '../public/cesium/ThirdParty',
            info: { minimized: true }
          },
          {
            from: pathBuilder('node_modules/cesium/Build/Cesium/Assets'),
            to: '../public/cesium/Assets',
            info: { minimized: true }
          },
          {
            from: pathBuilder('node_modules/cesium/Build/Cesium/Widgets'),
            to: '../public/cesium/Widgets',
            info: { minimized: true }
          }
        ]
      }),
      new webpack.DefinePlugin({ CESIUM_BASE_URL: JSON.stringify('/cesium') })
    );

    return config;
  },
  output: 'standalone'
};

import { withSentryConfig } from "@sentry/nextjs";

const config = withSentryConfig(
  coreConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "ouroboros-q2",
    project: "javascript-nextjs",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers. (increases server load)
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
);

export default config;
