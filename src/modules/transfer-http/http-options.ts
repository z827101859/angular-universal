import { NgModule, Injectable } from '@angular/core';

@Injectable()
export class HttpOptions {
    contextPath?: string;
    pre?: string;
    cookie?: string;
    uid?: number;
}