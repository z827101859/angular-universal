var path = require('path');
var webpack = require('webpack');
var config = require('./shark-deploy-conf.js');

module.exports = {
    entry: {
        'bootstrap.aot': [path.join(__dirname, config.webapp, config.jsPath, 'bootstrap.aot.ts')]
    },
    output: {
        path: path.join(__dirname, config.webapp, config.jsPath),
        filename: '[name].js',
        publicPath: 'http://support.163.com:9100/angular2/script/',
        chunkFilename: '[id]-prod.chunk.js'
    },
    module: {
        loaders: [{
            test: /\.ts$/,
            loaders: [
                'awesome-typescript-loader',
                'angular-router-loader?aot=true&genDir=aot-ts'
            ]
        }]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: require(path.join(__dirname, config.webapp, config.jsPath, 'lib/angular2/angular2-manifest.json'))
        // })
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     },
        //     output: {
        //         comments: false
        //     },
        //     sourceMap: false
        // })
    ]
};
