import { Component } from '@angular/core';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { TransferState } from '../../modules/transfer-state/transfer-state';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    url = '/xhr/data.do';
    text = '';
    subscription: any;
    constructor(
        private activatedRoute: ActivatedRoute,
        private http: TransferHttp,
        private cache: TransferState
    ) { }
    ngOnInit() {
        this.subscription = this.activatedRoute.params.subscribe((params: any) => {
            var cacheKey = this.url + (params ? JSON.stringify(params) : '');
            var data = this.cache.get(cacheKey);
            if (data) {
                this.text = `${data.greeting} ${data.name}`;
                console.log('数据已由服务端渲染生成，此处使用缓存数据，并在使用完毕后删除');
                this.cache.delete(cacheKey);
            }
            else {
                this.http.post(this.url, params).then(data => {
                    this.text = `${data.greeting} ${data.name}`;
                }, (error) => { });
            }
        });
    }
    ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
    }
}
