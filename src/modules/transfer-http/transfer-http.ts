import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { HttpOptions } from './http-options';
import { TransferState } from '../transfer-state/transfer-state';

@Injectable()
export class TransferHttp {
    baseHttpUrl = '';
    constructor(
        private http: Http,
        private httpOptions: HttpOptions,
        private transferState: TransferState
    ) {
        this.baseHttpUrl = httpOptions.pre + httpOptions.contextPath;
    }
    isNode() {
        return typeof window === 'undefined';
    }
    /**
     * get
     */
    get(url: string, params?: object): Promise<any> {
        return this.doRequest(url, params, 'get');
    }
    /**
     * post
     */
    post(url: string, params?: object): Promise<any> {
        return this.doRequest(url, params, 'post');
    }
    /**
     * payload
     */
    postByJson(url: string, params?: object): Promise<any> {
        return this.doRequest(url, params, 'json');
    }

    doRequest(url: string, params: object, type: string) {
        return new Promise((resolve, reject) => {
            let key = url + (params ? JSON.stringify(params) : '');
            let cacheData = this.getFromCache(key);
            if (cacheData) {
                if (!this.isNode() && cacheData.cacheType === 'server') {
                    //浏览器环境下，设置缓存
                    console.log('remove server cache');
                    this.removeCache(key);
                }
                return resolve(cacheData);
            }
            else {
                if (this.isNode()) {
                    var res = false;
                    var data = null;
                    var error = null;
                    //node请求使用了第三方request包，脱离了zone的控制，此处手动添加zone依赖
                    var task = Zone.current.scheduleMacroTask('ZoneMacroTaskConnection.noderequest', () => {
                        //onComplete
                        if (res) {
                            //服务端环境下，设置缓存
                            data.cacheType = 'server';
                            this.setCache(key, data);
                            console.log('server request ok,save cache');
                            resolve(data);
                        }
                        else {
                            console.log('server request error', error);
                            reject(error);
                        }
                    }, {}, () => null, () => {/*cancelTask*/ });
                    var ajaxCookie = '';
                    var cookies = this.httpOptions.cookie.split(';');
                    for (let i = 0; i < cookies.length; i++) {
                        let val = cookies[i].split('=');
                        if (val[0].trim() === 'documents') {
                            ajaxCookie = 'documents=' + val[1];
                        }
                    }
                    require('./noderequest.js').http(ajaxCookie, this.baseHttpUrl + url, type, params).subscribe((d) => {
                        res = true;
                        data = d;
                        task.invoke();
                    }, (e) => {
                        res = false;
                        error = e;
                        task.invoke();
                    });
                }
                else {
                    let o: any;
                    if (type === 'get') {
                        o = this.http.get(this.baseHttpUrl + url, new RequestOptions({
                            params: params,
                            headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
                        }))
                    }
                    else if (type === 'post') {
                        let body = new URLSearchParams();
                        for (let p in (params as any)) {
                            if (params.hasOwnProperty(p)) {
                                body.set(p, params[p]);
                            }
                        }
                        o = this.http.post(this.baseHttpUrl + url, body, new RequestOptions({
                            headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
                        }))
                    }
                    else {
                        let body = params;
                        o = this.http.post(this.baseHttpUrl + url, body, new RequestOptions({
                            headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8' })
                        }))
                    }
                    o.subscribe((res) => {
                        var data = res.json();
                        resolve(data);
                    }, (error: any) => {
                        reject(error);
                    })
                }
            }
        })
    }

    setCache(key, data) {
        return this.transferState.set(key, data);
    }

    removeCache(key): any {
        return this.transferState.delete(key);
    }

    getFromCache(key): any {
        return this.transferState.get(key);
    }
}
