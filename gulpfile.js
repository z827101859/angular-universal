var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var os = require('os');
var webpack = require('webpack');
var express = require('express');
var argv = require('yargs').argv;
var runSequence = require('run-sequence');
var sharkAutomation = require('shark-automation');
var config = require('./shark-deploy-conf.js');

gulp.task('serve-express', function(cb) {
    var app = express();
    var router = sharkAutomation.registerServerRouter({
        baseConf: config,
        gulp: gulp
    });
    app.use(router);
    app.listen(config.port, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('express listening on %d', config.port);
        cb();
    });

});

gulp.task('serve', function(cb) {
    sharkAutomation.registerServerTasks({
        baseConf: config,
        gulp: gulp
    });
    runSequence(['browser-sync', 'serve-express'], 'open-url', cb);
});
