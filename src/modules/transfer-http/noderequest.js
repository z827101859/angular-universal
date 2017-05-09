const ob = require('rxjs/Observable');
const request = require('request');

function http(ajaxCookie, url, type, params) {
    return new ob.Observable((responseObserver) => {
        var options;
        if (type === 'get') {
            var options = {
                method: type,
                headers: {
                    'Cookie': ajaxCookie,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            url = url + '?_timestamp=' + Date.now();
            for (var p in params) {
                if (params.hasOwnProperty(p)) {
                    url = url + '&' + p + '=' + params[p];
                }
            }
            options.url = url;
        }
        else if (type === 'post') {
            options = {
                url: url,
                method: 'POST',
                headers: {
                    'Cookie': ajaxCookie,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                form: params
            };
        }
        else {
            options = {
                url: url,
                method: 'POST',
                headers: {
                    'Cookie': ajaxCookie,
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(params)
            };
        }
        request(options, (error, response, body) => {
            if (error) {
                responseObserver.error(error);
            }
            else {
                if (response && response.statusCode === 200) {
                    try {
                        var resData = JSON.parse(body);
                        if (resData && resData.code === 200) {
                            responseObserver.next(resData);
                            responseObserver.complete();
                        }
                        else {
                            console.log('server request error code:' + resData.code);
                            console.log('message:' + resData.message);
                            responseObserver.error(resData);
                        }
                    } catch (e) {
                        responseObserver.error(e);
                    }
                }
                else {
                    responseObserver.error();
                }
            }
        })
    });
}

module.exports = {
    http: http
};