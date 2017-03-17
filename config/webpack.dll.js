var root = require('./helpers');
var webpack = require('webpack');

module.exports = {
    entry: {
        angular: ['@angular/core', '@angular/platform-browser', '@angular/platform-browser-dynamic', '@angular/common', '@angular/router', '@angular/http', '@angular/forms'],
    },
    output: {
        path: root('src/lib'),
        filename: '[name].dll.js',
        library: '[name]_library'
    },
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: [
                'awesome-typescript-loader'
            ]
        }]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new webpack.DllPlugin({
            path: root('src/lib/[name]-manifest.json'),
            name: '[name]_library'
        })
    ]
};
