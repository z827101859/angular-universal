import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'rxjs';
import { ngExpressEngine } from './modules/ng-express-engine/express-engine';
import { Api } from './api/api';
import { contextPath } from './config';
import { ServerAppModule } from './app/server-app.module';
const api = new Api();
var ngEngine = ngExpressEngine({
    aot: false,
    bootstrap: ServerAppModule
});
var serverSqlite = require('./serversqlite.js');
serverSqlite.InitApp(ngEngine, api, contextPath);