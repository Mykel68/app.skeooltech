import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: process.env.NODE_ENV === "production",
  aggressiveFrontEndCaching: process.env.NODE_ENV === "production",
  reloadOnline: process.env.NODE_ENV === "production",
  disable: process.env.NODE_ENV === "development",
  swcMinify: true,
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /\/manifest\.json$/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "manifest",
          expiration: {
            maxEntries: 1,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
      {
        urlPattern: /^\/_next\/static\//,
        handler: "CacheFirst",
        options: {
          cacheName: "next-static",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
      {
        urlPattern: /\/\?_rsc=.*/,
        handler: "NetworkFirst", // or StaleWhileRevalidate
        options: {
          cacheName: "rsc-cache",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 5, // 5 minutes
          },
          cacheableResponse: {
            statuses: [200],
          },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withPWA(nextConfig);
