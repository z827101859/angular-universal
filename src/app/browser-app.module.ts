import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { HttpOptions } from '../modules/transfer-http/http-options';
import { BrowserTransferStateModule } from '../modules/transfer-state/browser-transfer-state.module';

@NgModule({
    bootstrap: [AppComponent],
    providers: [
        {
            provide: HttpOptions,
            useValue: {
                contentPath: '',
                pre: window.location.protocol + '//' + window.location.host
            }
        }
    ],
    imports: [
        BrowserModule.withServerTransition({
            appId: 'my-app-id'
        }),
        BrowserTransferStateModule,
        AppModule
    ]
})
export class BrowserAppModule { }
