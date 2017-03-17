import "./styles/scss/index.scss";

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAppModule } from './app/browser-app.module';

platformBrowserDynamic().bootstrapModule(BrowserAppModule);
