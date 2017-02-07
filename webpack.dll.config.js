var path = require('path');
var webpack = require('webpack');
var config = require('./shark-deploy-conf.js');

module.exports = {
    entry: {
        angular2: [path.join(__dirname, config.webapp, config.jsPath, 'lib/angular2/angular2.ts')]
    },
    output: {
        path: path.join(__dirname, config.webapp, config.jsPath, 'lib/angular2'),
        filename: '[name].dll.js',
        /**
         * output.library
         * 将会定义为 window.${output.library}
         * 在这次的例子中，将会定义为`window.angular2_library`
         */
        library: '[name]_library'
    },
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'awesome-typescript-loader'
        }]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new webpack.DllPlugin({
            /**
             * path
             * 定义 manifest 文件生成的位置
             * [name]的部分由entry的名字替换
             */
            path: path.join(__dirname, config.webapp, config.jsPath, 'lib/angular2', '[name]-manifest.json'),
            /**
             * name
             * dll bundle 输出到那个全局变量上
             * 和 output.library 一样即可。 
             */
            name: '[name]_library'
        })
    ]
};
