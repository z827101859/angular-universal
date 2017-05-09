import { Component } from '@angular/core';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { TransferState } from '../../modules/transfer-state/transfer-state';

@Component({
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class SettingComponent {
    getGroupUrl = '/xhr/getGroups.do';
    addGroupUrl = '/xhr/addGroup.do';
    deleteGroupUrl = '/xhr/deleteGroup.do';
    groups = [];
    getProductUrl = '/xhr/getProducts.do';
    addProductUrl = '/xhr/addProduct.do';
    deleteProductUrl = '/xhr/deleteProduct.do';
    products = [];
    getUserListUrl = '/xhr/getUserList.do';
    addUserUrl = '/xhr/addUser.do';
    deleteUserUrl = '/xhr/deleteUser.do';
    users = [];
    searchForm = {
        groupId: '',
        groupName: '',
        productId: '',
        productName: '',
        userEmail: '',
        userType: '',
        userPages: '',
        userDatas: ''
    };
    demo = JSON.stringify([{"id":"datasmart","name":"严选智能数据","products":[{"id":"cockpit","name":"驾驶舱"}]}]);
    constructor(
        private http: TransferHttp
    ) { }
    ngOnInit() {
        this.getGroups();
        this.getProducts();
        this.getUserList();
    }
    //Groups
    getGroups() {
        this.http.post(this.getGroupUrl).then(res => {
            if (res.code === 200) {
                this.groups = res.data;
            }
        }, (error) => { });
    }
    addGroup() {
        if (!this.searchForm.groupId) {
            alert('请输入分组id');
            return;
        }
        if (!this.searchForm.groupName) {
            alert('请输入分组名称');
            return;
        }
        var params = {
            id: this.searchForm.groupId,
            name: this.searchForm.groupName
        };
        this.http.post(this.addGroupUrl, params).then(res => {
            if (res.code === 200 && res.data === true) {
                console.log('添加成功');
                this.getGroups();
            }
        }, (error) => { });
    }
    deleteGroup(item) {
        var params = {
            id: item.id
        };
        this.http.post(this.deleteGroupUrl, params).then(res => {
            if (res.code === 200 && res.data === true) {
                console.log('删除成功');
                this.getGroups();
            }
        }, (error) => { });
    }
    //Products
    getProducts() {
        this.http.post(this.getProductUrl).then(res => {
            if (res.code === 200) {
                this.products = res.data;
            }
        }, (error) => { });
    }
    addProduct() {
        if (!this.searchForm.groupId) {
            alert('请输入分组id');
            return;
        }
        if (!this.searchForm.productId) {
            alert('请输入项目id');
            return;
        }
        if (!this.searchForm.productName) {
            alert('请输入项目名称');
            return;
        }
        var params = {
            groupId: this.searchForm.groupId,
            id: this.searchForm.productId,
            name: this.searchForm.productName
        };
        this.http.post(this.addProductUrl, params).then(res => {
            if (res.code === 200 && res.data === true) {
                console.log('添加成功');
                this.getProducts();
            }
        }, (error) => { });
    }
    deleteProduct(item) {
        var params = {
            id: item.id,
            groupId: item.groupId
        };
        this.http.post(this.deleteProductUrl, params).then(res => {
            if (res.code === 200 && res.data === true) {
                console.log('删除成功');
                this.getProducts();
            }
        }, (error) => { });
    }
    //users
    getUserList() {
        this.http.post(this.getUserListUrl).then(res => {
            if (res.code === 200) {
                this.users = res.data;
            }
        }, (error) => { });
    }
    addUser() {
        if (!this.searchForm.userEmail) {
            alert('请输入用户邮箱');
            return;
        }
        if (!this.searchForm.userType) {
            alert('请输入用户类型');
            return;
        }
        var params = {
            uid: this.searchForm.userEmail,
            type: parseInt(this.searchForm.userType),
            page_perms: this.searchForm.userPages,
            data_perms: this.searchForm.userDatas
        };
        this.http.post(this.addUserUrl, params).then(res => {
            if (res.code === 200 && res.data === true) {
                console.log('添加成功');
                this.getUserList();
            }
        }, (error) => { });
    }
    deleteUser(item) {
        var params = {
            uid: item.uid
        };
        this.http.post(this.deleteUserUrl, params).then(res => {
            if (res.code === 200 && res.data === true) {
                console.log('删除成功');
                this.getUserList();
            }
        }, (error) => { });
    }
}
