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
        angular: ['@angular/core', '@angular/platform-browser', '@angular/common', '@angular/router', '@angular/http', '@angular/forms'],
        polyfill: ['zone.js/dist/zone', 'reflect-metadata']
    },
    output: {
        path: root('build/client'),
        filename: 'js/[name]-[hash:8].js',
        chunkFilename: "js/chunk-[chunkhash:8].js",
        publicPath: 'http://localhost:9000/'
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
                    name: 'images/[name]-[hash:8].[ext]',
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
        new webpack.optimize.CommonsChunkPlugin({
            name: ['main', 'angular', 'polyfill']
        }),
        new ExtractTextPlugin("css/[name]-[hash:8].css"),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: root('./src/index.ejs'),
            title: 'universal'
        }),
        new ngtools.AotPlugin({
            skipCodeGeneration: false,   //默认false. false：使用AoT ; true：不使用AoT 
            tsConfigPath: root('src/tsconfig.browser.json')
        })
    ]
}