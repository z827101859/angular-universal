import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router';

@Component({
    selector: 'demo-app',
    template: `
        <h1>Universal Demo</h1>
        <a (click)="goHome();">Home</a>
        <a (click)="goLazy();">Lazy</a>
        <router-outlet></router-outlet>
	`,
    styles: [`
        h1 {
            color: green;
        }
    `]
})
export class AppComponent {
    constructor(
        private router: Router
    ) { }
    goHome() {
        this.router.navigate(['/home', { router: 'home' }]);
    }
    goLazy() {
        this.router.navigate(['/lazy', { router: 'lazy' }]);
    }
}
