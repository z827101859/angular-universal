import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: '../views/root.html'
})
export class AppRoot {
    name: String;
    constructor() {
        this.name = 'sweetyx';
    }
};
