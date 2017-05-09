import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'rxjs';
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from './modules/ng-express-engine/express-engine';
import { Api } from './api/api';
import { contextPath } from './config';
import { ServerAppModuleNgFactory } from './ngfactory/app/server-app.module.ngfactory';
const api = new Api();
var ngEngine = ngExpressEngine({
    aot: true,
    bootstrap: ServerAppModuleNgFactory
});
enableProdMode();
var serverSqlite = require('./serversqlite.js');
serverSqlite.InitApp(ngEngine, api, contextPath);