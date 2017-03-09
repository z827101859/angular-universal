const { root } = require('./helpers');

const { AotPlugin } = require('@ngtools/webpack');

/**
 * This is a client config which should be merged on top of common config
 */
module.exports = {
  entry: root('./src/main.browser.ts'),
  output: {
    filename: 'client.js'
  },
  target: 'web'
};
