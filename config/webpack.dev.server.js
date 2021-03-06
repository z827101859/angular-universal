var path = require('path');
var webpack = require('webpack');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var ngtools = require('@ngtools/webpack');
var root = require('./helpers');

module.exports = {
    entry: {
        main: root('./src/server.ts')
    },
    output: {
        path: root('build/server'),
        filename: '[name].js',
        chunkFilename: "chunk-[id].js",
        publicPath: 'http://localhost:9000/documents/'
    },
    target: 'node',
    node: {
        __filename: false,
        __dirname: false
    },
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
                    name: 'images/[name].[ext]',
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
            tsConfigPath: root('src/tsconfig.server.json')
        })
    ],
    externals: [function (context, request, callback) {
        if (/serversqlite.js$/.test(request) || /noderequest.js$/.test(request)) {
            console.log(`skip compile ${request}...`);
            callback(null, 'commonjs ' + request);
        } else {
            callback();
        }
    }]
}