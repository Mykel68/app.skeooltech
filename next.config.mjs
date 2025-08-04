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
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withPWA(nextConfig);
