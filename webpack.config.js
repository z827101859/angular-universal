const devClient = require('./config/webpack.dev.client.js');
const devServer = require('./config/webpack.dev.server.js');
const prodClient = require('./config/webpack.prod.client.js');
const prodServer = require('./config/webpack.prod.server.js');

module.exports = function (options) {
    var configs = [];
    if (options.dev) {
        configs.push(devClient, devServer);
        var fse = require('fs-extra');
        fse.copySync('./src/serversqlite.js', './build/server/serversqlite.js');
        fse.copySync('./src/modules/transfer-http/noderequest.js', './build/server/noderequest.js');
        var watch = require('node-watch');
        watch(['./src/serversqlite.js', './src/modules/transfer-http/noderequest.js'], { recursive: true }, function (evt, name) {
            console.log(name, ' changed...');
            fse.copySync('./src/serversqlite.js', './build/server/serversqlite.js');
            fse.copySync('./src/modules/transfer-http/noderequest.js', './build/server/noderequest.js');
        });
    }
    else if (options.prod) {
        if (options.client) {
            configs.push(prodClient);
        }
        else if (options.server) {
            var fse = require('fs-extra');
            fse.copySync('./src/serversqlite.js', './build/server/serversqlite.js');
            fse.copySync('./src/modules/transfer-http/noderequest.js', './build/server/noderequest.js');
            configs.push(prodServer);
        }
    }
    return configs;
}
