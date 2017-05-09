const sqlite3 = require('sqlite3').verbose();

function getConnection() {
    return new sqlite3.Database('deploy-documents.db');
}

function InitDataBase() {
    var db = getConnection();
    db.serialize(function () {
        db.run(`CREATE TABLE IF NOT EXISTS GROUPS (id TEXT PRIMARY KEY, name TEXT);`);
        db.run(`CREATE TABLE IF NOT EXISTS PRODUCTS (id TEXT, name TEXT, group_id TEXT,CONSTRAINT pk_id_group_id PRIMARY KEY (id,group_id));`);
        db.run(`CREATE TABLE IF NOT EXISTS URLS (url TEXT PRIMARY KEY, type TEXT, groups TEXT, products TEXT, versions TEXT, uid TEXT);`);
        db.run(`CREATE TABLE IF NOT EXISTS USERS (uid TEXT PRIMARY KEY, type INTEGER, page_perms TEXT, data_perms TEXT);`);
        var stmt = db.prepare("INSERT OR REPLACE INTO USERS (uid, type, page_perms, data_perms) VALUES (?,?,?,?);");
        stmt.run('hzzhanghao2015@corp.netease.com', 0, null, null);
        stmt.finalize();
    });
    db.close();
}

function getProt() {
    var protArgv = process.argv[2];
    var port;
    if (protArgv) {
        port = parseInt(protArgv.split(':')[1]) || 9000;
    }
    else {
        port = 9000;
    }
    return port;
}

function successCallBack(res, data, db) {
    if (db) {
        db.close();
    }
    res.json(data);
}

function failCallBack(res, db) {
    if (db) {
        db.close();
    }
    res.status(500);
}

function InitApp(ngEngine, api, contextPath) {
    InitDataBase();
    var express = require('express');
    var session = require('express-session');
    var SQLiteStore = require('connect-sqlite3')(session);
    var compression = require('compression');
    var bodyParser = require('body-parser');
    var port = getProt();

    var app = express();
    // angular engine
    app.engine('html', ngEngine);
    app.set('view engine', 'html');
    app.set('views', 'build/client');
    //gzip
    app.use(compression());
    //添加session
    app.use(session({
        secret: 'aa1234',
        name: 'documents',          //这里的name值得是cookie的name，默认cookie的name是：connect.sid
        cookie: { maxAge: 1000 * 60 * 60 },  //设置60分钟后session和相应的cookie失效过期
        resave: false,
        saveUninitialized: true,
        store: new SQLiteStore
    }));
    //openid认证
    var OpenIDDecoractor = require('shark-node-openid');
    OpenIDDecoractor.init(app, 'express', {
        contextPath: '/documents',
        sqlUrl: 'sqlite://deploy-documents.db'
    });

    // css/js/font
    app.use(contextPath + '/', express.static('build/client', { index: false }));
    app.use(contextPath + '/font', express.static('font'));

    // url router
    app.get(contextPath + '/', (req, res) => {
        res.redirect(contextPath + '/home');
    });
    app.get(contextPath + '/home*', OpenIDDecoractor.needLogin((req, res) => {
        res.render('index', {
            req: req,
            res: res
        });
    }));
    app.get(contextPath + '/axure*', OpenIDDecoractor.needLogin((req, res) => {
        res.render('index', {
            req: req,
            res: res
        });
    }));
    app.get(contextPath + '/setting*', OpenIDDecoractor.needLogin((req, res) => {
        var db = getConnection();
        var params = {
            uid: req.session.openid.email
        };
        api.getUser(db, params).then((resData) => {
            db.close();
            if (resData.data && resData.data.type === 0) {
                //超级管理员才能设置
                res.render('index', {
                    req: req,
                    res: res
                });
            }
            else {
                res.status(200).send('权限不足.').end();
            }
        }, () => {
            db.close();
            res.status(200).send('权限不足.').end();
        });
    }));

    // ajax
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    //groups
    //server端请求没有cookie，通不过验证，列表请求暂时不验证
    app.post(contextPath + '/xhr/getGroups.do', OpenIDDecoractor.ajaxNeedLogin((req, res) => {
        console.log('---getGroups---');
        var params = {
            uid: req.session.openid.email
        };
        var db = getConnection();
        api.getUser(db, params).then((resData) => {
            if (resData.data && resData.data.type === 0) {
                //超级管理员返回所有分组
                api.getGroups(db).then((data) => {
                    successCallBack(res, data, db);
                }, () => { failCallBack(res, db); });
            }
            else {
                //非超级管理员返回对应权限分组
                var groups = [];
                if (resData.data && resData.data.data_perms) {
                    let dataPerms = JSON.parse(resData.data.data_perms);
                    dataPerms && dataPerms.forEach((item, index) => {
                        groups.push(item);
                    });
                }
                successCallBack(res, {
                    code: 200,
                    data: groups
                }, db);
            }
        }, () => { failCallBack(res, db); });
    }));
    app.post(contextPath + '/xhr/addGroup.do', OpenIDDecoractor.ajaxNeedLogin((req, res) => {
        console.log('---addGroup---');
        var params = {
            id: req.body.id || '',
            name: req.body.name || ''
        };
        var db = getConnection();
        api.addGroup(db, params).then((data) => {
            successCallBack(res, data, db);
        }, () => { failCallBack(res, db); });
    }));
    app.post(contextPath + '/xhr/deleteGroup.do', OpenIDDecoractor.ajaxNeedLogin((req, res) => {
        console.log('---deleteGroup---');
        var params = {
            id: req.body.id || ''
        };
        var db = getConnection();
        api.deleteGroup(db, params).then((data) => {
            successCallBack(res, data, db);
        }, () => { failCallBack(res, db); });
    }));
    //products
    app.post(contextPath + '/xhr/getProducts.do', OpenIDDecoractor.ajaxNeedLogin((req, res) => {
        console.log('---getProducts---');
        var params = {
            uid: req.session.openid.email
        };
        var db = getConnection();
        api.getUser(db, params).then((resData) => {
            if (resData.data && resData.data.type === 0) {
                //超级管理员返回所有项目
                api.getProducts(db, {
                    groupId: req.body.groupId || ''
                }).then((data) => {
                    successCallBack(res, data, db);
                }, () => { failCallBack(res, db); });
            }
            else {
                //非超级管理员返回对应权限项目
                var products = [];
                if (resData.data && resData.data.data_perms) {
                    let dataPerms = JSON.parse(resData.data.data_perms);
                    dataPerms && dataPerms.forEach((item, index) => {
                        if (item.id === req.body.groupId) {
                            products = item.products;
                        }
                    });
                }
                successCallBack(res, {
                    code: 200,
                    data: products
                }, db);
            }
        }, () => { failCallBack(res, db); });
    }));
    app.post(contextPath + '/xhr/addProduct.do', OpenIDDecoractor.ajaxNeedLogin((req, res) => {
        console.log('---addProduct---');
        var params = {
            id: req.body.id || '',
            groupId: req.body.groupId || '',
            name: req.body.name || ''
        };
        var db = getConnection();
        api.addProduct(db, params).then((data) => {
            successCallBack(res, data, db);
        }, () => { failCallBack(res, db); });
    }));
    app.post(contextPath + '/xhr/deleteProduct.do', OpenIDDecoractor.ajaxNeedLogin((req, res) => {
        console.log('---deleteProduct---');
        var params = {
            id: req.body.id || '',
            groupId: req.body.groupId || ''
        };
        var db = getConnection();
        api.deleteProduct(db, params).then((data) => {
            successCallBack(res, data, db);
        }, () => { failCallBack(res, db); });
    }));
    //users
    app.post(contextPath + '/xhr/getUserList.do', OpenIDDecoractor.ajaxNeedLogin((req, res) => {
        console.log('---getUserList---');
        var params = {
            uid: req.session.openid.email
        };
        var db = getConnection();
        api.getUserList(db, params).then((data) => {
            successCallBack(res, data, db);
        }, () => { failCallBack(res, db); });
    }));
    app.post(contextPath + '/xhr/addUser.do', OpenIDDecoractor.ajaxNeedLogin((req, res) => {
        console.log('---addUser---');
        var params = {
            uid: req.body.uid || '',
            type: typeof req.body.type === 'undefined' ? 1 : req.body.type,
            page_perms: req.body.page_perms || '',
            data_perms: req.body.data_perms || ''
        };
        var db = getConnection();
        api.addUser(db, params).then((data) => {
            successCallBack(res, data, db);
        }, () => { failCallBack(res, db); });
    }));
    app.post(contextPath + '/xhr/deleteUser.do', OpenIDDecoractor.ajaxNeedLogin((req, res) => {
        console.log('---deleteUser---');
        var params = {
            uid: req.body.uid || ''
        };
        var db = getConnection();
        api.deleteUser(db, params).then((data) => {
            successCallBack(res, data, db);
        }, () => { failCallBack(res, db); });
    }));
    //Sources
    app.post(contextPath + '/xhr/getSources.do', OpenIDDecoractor.ajaxNeedLogin((req, res) => {
        console.log('---getSources---');
        var params = {
            uid: req.session.openid.email
        };
        var db = getConnection();
        api.getSources(db, params).then((data) => {
            successCallBack(res, data, db);
        }, () => { failCallBack(res, db); });
    }));
    //upload
    app.post(contextPath + '/xhr/axure/upload.do', OpenIDDecoractor.ajaxNeedLogin((req, res) => {
        console.log('---axure upload---');
        var params = {
            uid: req.session.openid.email
        };
        var db = getConnection();
        api.uploadAxure(db, params, req, res).then((data) => {
            successCallBack(res, data, db);
        }, () => { failCallBack(res, db); });
    }));

    //start serve
    app.listen(port, (err) => {
        if (err) {
            console.log(err);
        }
        console.log(`Listening at ${port}`);
    });
}

module.exports = {
    InitApp: InitApp
};