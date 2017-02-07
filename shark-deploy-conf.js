module.exports = {
    comment: 'angular2-first',
    version: '0.1.0',
    product: 'angular2',
    contextPath: '/angular2',
    protocol: 'http',
    browserPort: 9100,
    port: 9201,
    hostname: 'support.163.com',
    openurl: 'http://support.163.com:9100/angular2/index.html',
    rootPath: __dirname,
    tmpDir: '.tmp',
    webapp: 'src/main/webapp',
    mock: 'src/test/mock',
    scssPath: 'style/scss',
    cssPath: 'style/css',
    imgPath: 'style/img',
    videoPath: 'style/video',
    jsPath: 'script',
    fontPath: 'font',
    htmlPath: 'views',
    templatePath: 'WEB-INF/tmpl',
    staticVersion: '/20161206',
    ajaxPrefix: '/xhr',
    mimgPathPrefix: '/hxm',
    ifwebpack: false,
    projectType: '',
    mimgURLPrefix : {
        develop: '',
        online: '//mailpub.nosdn.127.net/hxm',       //nos.netease.com/mailpub/hxm              mailpub桶支持cdn
        test: '//nos.netease.com/mailpub-test/hxm'   //nos.netease.com/mailpub-test/hxm         mailpub-test桶不支持cdn
    }
};