import type { NextConfig } from "next";

const NextConfig = {
  experimental: {
    turbopack: {
      root: __dirname,
    },
  },
};

module.exports = NextConfig;
