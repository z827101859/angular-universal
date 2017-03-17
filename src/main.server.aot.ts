import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'rxjs';
import { enableProdMode } from '@angular/core';
import { ServerAppModuleNgFactory } from './ngfactory/app/server-app.module.ngfactory';
import { ngExpressEngine } from './modules/ng-express-engine/express-engine';
import { ROUTES } from './routes';
import * as express from 'express';
import * as bodyParser from 'body-parser';
enableProdMode();
const app = express();
const api = new App();
const port = 9000;
const baseUrl = `http://localhost:${port}`;

app.set('view engine', 'html');
app.set('views', 'src');

app.use('/', express.static('build', { index: false }));

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home*', (req, res) => {
    res.render('../build/index', {
        req: req,
        res: res
    });
});

app.get('/lazy*', (req, res) => {
    res.render('../build/index', {
        req: req,
        res: res
    });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/xhr/data.do', (req, res) => {
    console.log(req.body);
    api.getData().then((data) => {
        res.json(data);
    }, () => { });
});

app.listen(port, () => {
    console.log(`Listening at ${baseUrl}`);
});
