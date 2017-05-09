import { Component } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/core'
import { Router, Event, NavigationEnd } from '@angular/router';
import { Common } from './common.service';
import { contextPath } from '../config';

@Component({
    selector: 'demo-app',
    template: `
        <div class="g-head">
            <div class="m-logo">
                文档部署平台
            </div>
            <a class="m-collapse" (click)="toggleMenu();">
                <i class="icon-equals"></i>
            </a>
            <a class="u-photo"></a>
            <a class="u-logout" (click)="logout();">
                退出
            </a>
            <a class="u-setting" (click)="setting();">
                设置
            </a>
            <a class="u-home" (click)="go('home');">
                回到首页
            </a>
        </div>
        <div class="g-bd">
            <div class="g-left-menu" [ngClass]="{'menu-hidden': !menuDisplay}">
                <div class="nav-bar">
                    <a class="nav-title" (click)="toggleTabs(0);">
                        <i class="icon-home"></i><span>文件部署</span>
                    </a>
                    <div class="nav-wrap nav-wrap1" [ngClass]="{'nav-hidden': !groups[0].open}">
                        <a class="nav-item" (click)="go('axure');" [ngClass]="{active: currentPath==='/axure'}">交互稿</a>
                        <a class="nav-item" (click)="go('sketch');" [ngClass]="{active: currentPath==='/sketch'}">视觉稿</a>
                        <a class="nav-item" (click)="go('custom');" [ngClass]="{active: currentPath==='/custom'}">自定义文件</a>
                    </div>
                </div>
            </div>
            <div class="g-right-container">
                <router-outlet></router-outlet>
            </div>
        </div>
	`
})
export class AppComponent {
    subscription: any;
    currentPath: string;
    menuDisplay = true;
    groups = [{
        open: false,
        tabs: ['/axure', '/sketch', '/custom']
    }];
    constructor(
        private router: Router,
        private common: Common
    ) { }
    /**
     * 设置
     */
    setting() {
        window.open(contextPath + '/setting');
    }
    /**
     * 跳转到对应的tab页
     * @param path 
     */
    go(path) {
        if (path === 'axure' || path === 'home') {
            this.router.navigate([path]);
        }
        else {
            alert('敬请期待');
        }
    }
    /**
     * 退出系统
     */
    logout() {
        alert('敬请期待');
    }
    /**
     * 点击左侧导航，关闭或打开
     */
    toggleMenu() {
        this.menuDisplay = !this.menuDisplay;
    }
    /**
     * 点击对应的一级菜单，关闭或打开
     * @param i 
     */
    toggleTabs(i) {
        this.groups.forEach((item, index) => {
            if (index === i) {
                item.open = !item.open;
            }
            else {
                item.open = false;
            }
        });
    }
    /**
     * 路由切换后，打开对应的一级菜单
     * @param path 
     */
    openTabsByPath(path) {
        this.groups.forEach((item, index) => {
            if (this.common.inArray(path, item.tabs) > -1) {
                item.open = true;
            }
        });
    }
    /**
     * 监听路由变化
     */
    ngAfterViewInit() {
        this.subscription = this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.currentPath = event.urlAfterRedirects.split(';')[0];
                this.openTabsByPath(this.currentPath);
            }
        });
    }
    /**
     * 销毁订阅
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
