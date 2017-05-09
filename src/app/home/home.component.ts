import { Component } from '@angular/core';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { TransferState } from '../../modules/transfer-state/transfer-state';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    getSourceUrl = '/xhr/getSources.do';
    sources = [];
    constructor(
        private http: TransferHttp
    ) { }
    ngOnInit() {
        this.getSources();
    }
    //Sources
    getSources() {
        this.http.post(this.getSourceUrl).then(res => {
            if (res.code === 200) {
                this.sources = res.data;
            }
        }, (error) => { });
    }
}
