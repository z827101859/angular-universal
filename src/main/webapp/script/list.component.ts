import { Component } from '@angular/core';

@Component({
    selector: 'list',
    templateUrl: '../views/list.html'
})
export class ListComponent {
    itemList = [{ id: 1001, name: 'test1' }, { id: 1002, name: 'test2' }, { id: 1003, name: 'test3' }];
    constructor() { }
};
