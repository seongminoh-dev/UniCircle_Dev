/** @type {import('next').NextConfig} */

const path = require("path");
const { parsed: localEnv } = require("dotenv").config({
  path: "./.env.local",
});

const nextConfig = {
  // loader: "sass-loader",
  // options: {
  //   implementation: require("sass"),
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
    prependData: `@import "variables.scss";`,
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
  output: "standalone",
};

module.exports = nextConfig;
