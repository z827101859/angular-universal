var path = require('path');
var webpack = require('webpack');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var ngtools = require('@ngtools/webpack');
var root = require('./helpers');

module.exports = {
    entry: {
        server: root('./src/main.server.ts')
    },
    output: {
        path: root('build'),
        filename: '[name].js',
        chunkFilename: "[chunkhash:8].server.chunk.js",
        publicPath: 'http://support.163.com:9000/'
    },
    target: 'node',
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: [
                    '@ngtools/webpack'
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 100
                }
            },
            {
                test: /\.scss$/,
                include: [
                    root('src/app')
                ],
                loaders: [
                    'to-string-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new DefinePlugin({
            'ENV': '"dev"'
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new ngtools.AotPlugin({
            skipCodeGeneration: true,   //默认false. false：使用AoT ; true：不使用AoT 
            tsConfigPath: root('./src/tsconfig.server.json')
        })
    ],
    devtool: 'source-map' //'cheap-module-source-map' | 'source-map'
}