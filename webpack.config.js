const devClient = require('./config/webpack.dev.client.js');
const devServer = require('./config/webpack.dev.server.js');
const prodClient = require('./config/webpack.prod.client.js');
const prodServer = require('./config/webpack.prod.server.js');

module.exports = function (options) {
    var configs = [];
    if (options.dev) {
        configs.push(devClient, devServer);
    }
    else if (options.prod) {
        if (options.client) {
            configs.push(prodClient);
        }
        else if (options.server) {
            configs.push(prodServer);
        }
    }
    return configs;
}
