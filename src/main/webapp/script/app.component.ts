import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: '../views/root.html'
})
export class AppRoot {
    name: String;
    constructor() {
        new Promise((resolve,reject)=>{
        	setTimeout(()=>{
        		console.log('name ready..');
        		resolve();
        	},1000);
        }).then(()=>{
        	this.name = 'sweetyx';
        });
    }
    ngAfterViewInit(){
    	var timeDom = $('#app-init-time');
    	timeDom.text('App初始化时间：' + new Date().toString());
    }
};
