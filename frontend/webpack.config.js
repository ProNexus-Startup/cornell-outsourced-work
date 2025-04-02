const path = require("path");

module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"), // Use a browser-friendly crypto polyfill
      stream: require.resolve("stream-browserify"), // Ensures streaming support
      buffer: require.resolve("buffer/"), // Required for packages relying on Buffer
    },
    alias: {
      uuid: require.resolve("uuid/dist/browser.js"), // Ensure proper UUID resolution
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"], // Fixes missing Buffer issues
    }),
  ],
};
