var path = require('path');
var webpack = require('webpack');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ngtools = require('@ngtools/webpack');
var root = require('./helpers');

module.exports = {
    entry: {
        browser: root('./src/main.browser.ts')
    },
    output: {
        path: root('build'),
        filename: '[name].js',
        chunkFilename: "[chunkhash:8].browser.chunk.js",
        publicPath: 'http://support.163.com:9000/'
    },
    target: 'web',
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
                exclude: [
                    root('src/app')
                ],
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader' })
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
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin("[name].css"),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: root('./src/index.ejs'),
            title: 'universal demo',
            linkDll: false
        }),
        new ngtools.AotPlugin({
            skipCodeGeneration: false,   //默认false. false：使用AoT ; true：不使用AoT 
            tsConfigPath: root('./config/tsconfig.browser.json')
        })
    ]
}