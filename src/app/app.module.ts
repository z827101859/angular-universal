import { NgModule } from '@angular/core';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { Common } from './common.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AxureComponent } from './axure/axure.component';
import { SettingComponent } from './setting/setting.component';
import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';
import { contextPath } from '../config';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        TransferHttpModule,
        RouterModule.forRoot([{
            path: '',
            redirectTo: '/home',
            pathMatch: 'full'
        }, {
            path: 'home',
            component: HomeComponent
        }, {
            path: 'axure',
            component: AxureComponent
        }, {
            path: 'setting',
            component: SettingComponent
        }])
    ],
    providers: [
        { provide: APP_BASE_HREF, useValue: contextPath },
        Common
    ],
    declarations: [AppComponent, HomeComponent, AxureComponent, SettingComponent],
    exports: [AppComponent]
})
export class AppModule { }
