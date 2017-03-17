var path = require('path');
var webpack = require('webpack');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var ngtools = require('@ngtools/webpack');
var root = require('./helpers');

module.exports = {
    entry: {
        main: root('./src/main.server.aot.ts')
    },
    output: {
        path: root('build/server'),
        filename: '[name].js',
        chunkFilename: "chunk-[id].js",
        publicPath: 'http://localhost:9000/'
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
                    name: 'images/[name]-[hash:8].[ext]',
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
            'ENV': '"prod"'
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new ngtools.AotPlugin({
            skipCodeGeneration: false,   //默认false. false：使用AoT ; true：不使用AoT 
            tsConfigPath: root('src/tsconfig.server.json')
        })
    ]
}