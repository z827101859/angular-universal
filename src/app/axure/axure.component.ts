import { Component } from '@angular/core';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { TransferState } from '../../modules/transfer-state/transfer-state';
import { ActivatedRoute } from '@angular/router';
import { Common } from '../common.service';
import { contextPath } from '../../config';

@Component({
    templateUrl: './axure.component.html',
    styleUrls: ['./axure.component.scss']
})
export class AxureComponent {
    groupUrl = '/xhr/getGroups.do';
    productUrl = '/xhr/getProducts.do';
    uploadUrl = '/xhr/axure/upload.do';
    groups = [];
    products = [];
    searchForm = {
        groupId: '',
        productId: '',
        version: 'default',
        file: null
    };
    inputId;
    result: any;
    isDeploying = false;
    errmsg = '';
    constructor(
        private activatedRoute: ActivatedRoute,
        private http: TransferHttp,
        private common: Common
    ) {
        this.inputId = this.common.createUUID();
    }
    ngOnInit() {
        this.getGroups();
    }
    getGroups() {
        this.http.post(this.groupUrl).then(res => {
            if (res.code === 200) {
                this.groups = res.data;
            }
        }, (error) => { });
    }
    getProducts() {
        if (this.searchForm.groupId) {
            var params = {
                groupId: this.searchForm.groupId
            };
            this.http.post(this.productUrl, params).then(res => {
                if (res.code === 200) {
                    this.products = res.data;
                }
            }, (error) => { });
        }
        else {
            this.searchForm.productId = '';
            this.products = [];
        }
    }
    selectFile() {
        var input = null;
        input = document.getElementById(this.inputId);
        if (input) {
            input.remove();
            input = null;
        }
        input = document.createElement('input');
        input.id = this.inputId;
        input.type = 'file';
        input.accept = '.zip';
        input.style.display = 'none';
        document.body.appendChild(input);
        input.onchange = (e) => {
            var files = e.target.files;
            if (files && files.length > 0) {
                var file = files[0];
                if (file.size > (1024 * 1024 * 50)) {
                    //文件不超过20M
                    alert('文件不超过50M');
                }
                else {
                    this.searchForm.file = file;
                }
            }
        };
        input.click();
    }
    deploy(progressBar) {
        if (!this.searchForm.groupId) {
            this.errmsg = '请选择分组';
            return;
        }
        if (!this.searchForm.productId) {
            this.errmsg = '请选择项目';
            return;
        }
        if (!this.searchForm.version) {
            this.errmsg = '请输入版本号';
            return;
        }
        if (!this.searchForm.file) {
            this.errmsg = '请选择压缩包';
            return;
        }
        this.errmsg = '';
        this.isDeploying = true;
        var xhr = new XMLHttpRequest();
        if (xhr.upload) {
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    var percent = Math.floor(e.loaded / this.searchForm.file.size * 100);
                    percent >= 100 ? percent = 100 : percent;
                    percent <= 0 ? percent = 0 : percent;
                    percent === 100 ? percent = 99 : percent; //不立即上传结束，等待请求返回后再设置为100%
                    progressBar.style.width = percent + '%';
                    progressBar.innerText = percent + '%';
                }
            }
        }
        xhr.addEventListener('load', (evt) => {
            this.isDeploying = false;
            var target = (evt.target as any);
            if (target.readyState === 4 && target.status === 200) {
                this.result = JSON.parse(target.response);
                if (this.result && this.result.code === 200) {
                    progressBar.style.width = '100%';
                    progressBar.innerText = '100%';
                }
            }
        });
        var data = new FormData();
        data.append('file', this.searchForm.file);
        data.append('groupId', this.searchForm.groupId);
        data.append('productId', this.searchForm.productId);
        data.append('version', this.searchForm.version);
        xhr.open('POST', contextPath + this.uploadUrl);
        xhr.send(data);
    }
    lookImg($event) {
        window.open($event.target.src);
    }
}
