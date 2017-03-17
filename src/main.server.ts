import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'rxjs';
import { ServerAppModule } from './app/server-app.module';
import { ngExpressEngine } from './modules/ng-express-engine/express-engine';
import { Api } from './api/api';
import * as express from 'express';
import * as bodyParser from 'body-parser';
const app = express();
const api = new Api();
const port = 9000;
const baseUrl = `http://localhost:${port}`;

app.engine('html', ngExpressEngine({
    aot: false,
    bootstrap: ServerAppModule
}));
app.set('view engine', 'html');
app.set('views', 'build/client');

app.use('/', express.static('build/client', { index: false }));

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home*', (req, res) => {
    res.render('index', {
        req: req,
        res: res
    });
});

app.get('/lazy*', (req, res) => {
    res.render('index', {
        req: req,
        res: res
    });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/xhr/data.do', (req, res) => {
    console.log('请求参数：',req.body);
    api.getData().then((data) => {
        res.json(data);
    }, () => { });
});

app.listen(port, () => {
    console.log(`Listening at ${baseUrl}`);
});
