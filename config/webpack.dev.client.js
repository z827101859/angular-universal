var path = require('path');
var webpack = require('webpack');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ngtools = require('@ngtools/webpack');
var root = require('./helpers');

module.exports = {
    entry: {
        main: root('./src/main.browser.ts'),
        angular: ['@angular/core', '@angular/platform-browser', '@angular/platform-browser-dynamic', '@angular/common', '@angular/router', '@angular/http', '@angular/forms'],
        polyfill: ['zone.js/dist/zone', 'reflect-metadata']
    },
    output: {
        path: root('build/client'),
        filename: 'js/[name].js',
        chunkFilename: "js/chunk-[id].js",
        publicPath: 'http://localhost:9000/documents/'
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
                    name: 'images/[name].[ext]',
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
            }, {
                test: /\.ejs$/,
                loader: 'ejs-loader'
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
        new webpack.optimize.CommonsChunkPlugin({
            name: ['main', 'angular', 'polyfill']
        }),
        new ExtractTextPlugin("css/[name].css"),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: root('./src/index.ejs'),
            title: '部署平台-开发'
        }),
        new ngtools.AotPlugin({
            skipCodeGeneration: true,   //默认false. false：使用AoT ; true：不使用AoT 
            tsConfigPath: root('src/tsconfig.browser.json')
        })
    ],
    externals: [function (context, request, callback) {
        if (/serversqlite.js$/.test(request) || /noderequest.js$/.test(request)) {
            console.log(`skip compile ${request}...`);
            callback(null, 'commonjs ' + request);
        } else {
            callback();
        }
    }],
    devtool: 'source-map' // 'eval' | cheap-module-source-map' | 'source-map'
}