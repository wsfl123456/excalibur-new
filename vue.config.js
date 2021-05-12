const openInEditor = require('launch-editor-middleware');

module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? '/v2/' : '/',
  configureWebpack: {
    devServer: {
      before(app) {
        app.use('/__open-in-editor', openInEditor('code'));
      },
    },
  },
  publicPath: 'v2',
  devServer: {
    port: 3000,
    // proxy: 'https://developer.normcore.com',
    proxy: 'https://excalibur.gaiyadata.com',
  },
};
