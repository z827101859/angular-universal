/***********module***************/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
/***********router***************/
import { RouterModule } from '@angular/router';
/***********components***************/
import { AppRoot } from './app.component';
import { HomeComponent } from './home.component';
import { ListComponent } from './list.component';

const routes = [{
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
}, {
    path: 'home',
    component: HomeComponent
}, {
    path: 'list',
    component: ListComponent
}, {
    path: 'detail',
    loadChildren: './detail/detail.module#DetailModule'
}];
var routing = RouterModule.forRoot(routes, { useHash: true });

@NgModule({
    imports: [BrowserModule, routing],
    declarations: [HomeComponent, ListComponent, AppRoot],
    bootstrap: [AppRoot]
})
export class AppModule { }
