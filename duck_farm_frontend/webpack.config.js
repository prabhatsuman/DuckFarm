const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
  // Other webpack config
  plugins: [
    // Other plugins
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
};
