import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'rxjs';
import * as express from 'express';
import { ServerAppModule } from './app/server-app.module';
import { ngExpressEngine } from './modules/ng-express-engine/express-engine';
import { ROUTES } from './routes';
import { App } from './api/app';
import { enableProdMode } from '@angular/core';
enableProdMode();
const app = express();
const api = new App();
const port = 9000;
const baseUrl = `http://localhost:${port}`;

app.engine('html', ngExpressEngine({
    bootstrap: ServerAppModule
}));

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

app.use('/data', (req, res) => {
    res.json(api.getData());
});

app.listen(port, () => {
    console.log(`Listening at ${baseUrl}`);
});
