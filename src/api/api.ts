import * as fs from 'fs';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as multiparty from 'multiparty';
import * as exec from 'sync-exec';

const Axure = 'axure';
const filePath = './tmpFileDir';
const staticsServerConfig = {
    name: 'statics',
    cntentPath: 'app'
};
const publicPath = path.resolve(__dirname, '../../..');
fse.ensureDirSync(filePath);

export class Api {
    //Users
    getUser(db, params) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM USERS WHERE uid="${params.uid}"`;
            db.all(sql, function (err, res) {
                if (err) {
                    console.log(err);
                    reject({
                        code: 500
                    })
                }
                else {
                    resolve({
                        code: 200,
                        data: res[0] || null
                    });
                }
            });
        });
    }
    //getSources
    getSources(db, params) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM URLS WHERE uid="${params.uid}" ORDER BY type,groups,products,versions DESC`;
            db.all(sql, function (err, res) {
                if (err) {
                    console.log(err);
                    reject({
                        code: 500
                    })
                }
                else {
                    resolve({
                        code: 200,
                        data: res
                    });
                }
            });
        });
    }
    //Groups
    getGroups(db) {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM GROUPS", function (err, res) {
                if (err) {
                    console.log(err);
                    reject({
                        code: 500
                    })
                }
                else {
                    resolve({
                        code: 200,
                        data: res
                    });
                }
            });
        });
    }
    addGroup(db, params) {
        return new Promise((resolve, reject) => {
            var stmt = db.prepare("INSERT OR REPLACE INTO GROUPS (id, name) VALUES (?,?)");
            stmt.run(params.id, params.name);
            stmt.finalize();
            resolve({
                code: 200,
                data: true
            });
        });
    }
    deleteGroup(db, params) {
        return new Promise((resolve, reject) => {
            var stmt = db.prepare("DELETE FROM GROUPS WHERE id=?");
            stmt.run(params.id);
            stmt.finalize();
            resolve({
                code: 200,
                data: true
            });
        });
    }
    //Products
    getProducts(db, params) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT group_id as groupId,id,name FROM PRODUCTS';
            if (params.groupId) {
                sql = sql + ' WHERE group_id="' + params.groupId + '"';
            }
            db.all(sql, function (err, res) {
                if (err) {
                    console.log(err);
                    reject({
                        code: 500
                    })
                }
                else {
                    resolve({
                        code: 200,
                        data: res
                    });
                }
            });
        });
    }
    addProduct(db, params) {
        return new Promise((resolve, reject) => {
            var stmt = db.prepare("INSERT OR REPLACE INTO PRODUCTS (id, name, group_id) VALUES (?,?,?)");
            stmt.run(params.id, params.name, params.groupId);
            stmt.finalize();
            resolve({
                code: 200,
                data: true
            });
        });
    }
    deleteProduct(db, params) {
        return new Promise((resolve, reject) => {
            var stmt = db.prepare("DELETE FROM PRODUCTS WHERE id=? AND group_id=?");
            stmt.run(params.id, params.groupId);
            stmt.finalize();
            resolve({
                code: 200,
                data: true
            });
        });
    }
    //Users
    getUserList(db, params) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM USERS`;
            db.all(sql, function (err, res) {
                if (err) {
                    console.log(err);
                    reject({
                        code: 500
                    })
                }
                else {
                    resolve({
                        code: 200,
                        data: res
                    });
                }
            });
        });
    }
    addUser(db, params) {
        return new Promise((resolve, reject) => {
            var stmt = db.prepare("INSERT OR REPLACE INTO USERS (uid, type, page_perms, data_perms) VALUES (?,?,?,?)");
            stmt.run(params.uid, params.type, params.page_perms, params.data_perms);
            stmt.finalize();
            resolve({
                code: 200,
                data: true
            });
        });
    }
    deleteUser(db, params) {
        return new Promise((resolve, reject) => {
            var stmt = db.prepare("DELETE FROM USERS WHERE uid=?");
            stmt.run(params.uid);
            stmt.finalize();
            resolve({
                code: 200,
                data: true
            });
        });
    }
    //upload Axure
    uploadAxure(db, params, req, res) {
        return new Promise((resolve, reject) => {
            new multiparty.Form({ uploadDir: filePath }).parse(req, function (err, fields, files) {
                if (err) { reject(err) };
                var group = (fields['groupId'] && fields['groupId'][0]) || 'default';
                var product = (fields['productId'] && fields['productId'][0]) || 'default';
                var version = (fields['version'] && fields['version'][0]) || 'default';
                var file = files.file[0];
                // 目标路径
                var targetPath = path.resolve(publicPath, staticsServerConfig.name, staticsServerConfig.cntentPath, Axure, group, product, version);
                var targetFile = path.resolve(targetPath, file.originalFilename);
                // 创建文件夹
                fse.ensureDir(targetPath, (err) => {
                    if (err) { reject(err) };
                    // 清空文件夹
                    fse.emptyDir(targetPath, (err) => {
                        if (err) { reject(err) };
                        // 重命名为真实文件名
                        fs.rename(file.path, targetFile, (err) => {
                            if (err) { reject(err) };
                            //解压缩
                            exec('unzip -o -d ' + targetPath + ' ' + targetFile, 10000);
                            //返回路径
                            if (fs.existsSync(path.resolve(targetPath, 'index.html'))) {
                                var url = req.protocol + '://' + req.get('host') + '/' + staticsServerConfig.name + '/' + Axure + '/' + group + '/' + product + '/' + version + '/index.html';
                                var stmt = db.prepare("INSERT OR REPLACE INTO URLS (url, type, groups, products, versions, uid) VALUES (?,?,?,?,?,?)");
                                stmt.run(url, 'Axure', group, product, version, params.uid);
                                stmt.finalize();
                                resolve({
                                    code: 200,
                                    data: url
                                });
                            }
                            else {
                                resolve({ code: 200, data: '上传成功，但不能获取到url（原因：压缩包未按规范命名），请自行拼装路径' });
                            }
                            //解压缩后删除源文件
                            fse.remove(targetFile, err => { });
                        });
                    });
                });
            });
        });
    }
}
