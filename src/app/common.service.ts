import { Injectable } from '@angular/core';

@Injectable()
export class Common {
    constructor() { }
    inArray(obj, array, key?) {
        for (var i = 0; i < array.length; i++) {
            if (typeof key !== 'undefined') {
                if (array[i][key] === obj[key]) {
                    return i;
                }
            }
            else {
                if (array[i] === obj) {
                    return i;
                }
            }
        }
        return -1;
    }
    isEqual(x, y) {
        var in1 = x instanceof Object;
        var in2 = y instanceof Object;
        if (!in1 || !in2) {
            return x === y;
        }
        if (Object.keys(x).length !== Object.keys(y).length) {
            return false;
        }
        for (var p in x) {
            var a = x[p] instanceof Object;
            var b = y[p] instanceof Object;
            if (a && b) {
                return this.isEqual(x[p], y[p]);
            }
            else if (x[p] !== y[p]) {
                return false;
            }
        }
        return true;
    }
    createUUID(){
        var uuidRegEx = /[xy]/g;
        var uuidReplacer = function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 3 | 8);
            return v.toString(16);
        };
        return function() {
            return 'uuid-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(uuidRegEx, uuidReplacer).toUpperCase();
        };
    }
}
