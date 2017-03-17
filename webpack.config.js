const devClient = require('./config/webpack.dev.client.js');
const devServer = require('./config/webpack.dev.server.js');
const prodClient = require('./config/webpack.prod.client.js');
const prodServer = require('./config/webpack.prod.server.js');

module.exports = function (options) {
    var configs = [];
    if (options.dev) {
        configs.push(devClient, devServer);
    } else if (options.prod) {
        configs.push(prodClient, prodServer);
    }
    return configs;
}
