(function() {
    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var fnToString = hasOwn.toString;
    var ObjectFunctionString = fnToString.call(Object);
    var getProto = Object.getPrototypeOf;

    var mapType = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error", "Symbol", "BigInt"];
    mapType.forEach(function(name) {
        class2type["[object " + name + "]"] = name.toLocaleLowerCase();
    });

    var toType = function toType(obj) {
        if (obj == null) {
            return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[toString.call(obj)] || "object" :
            typeof obj;
    };

    var isFunction = function isFunction(obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number";
    };

    var isWindow = function isWindow(obj) {
        return obj != null && obj === obj.window;
    };

    var isArrayLike = function isArrayLike(obj) {
        var length = !!obj && "length" in obj && obj.length,
            type = toType(obj);
        if (isFunction(obj) || isWindow(obj)) return false;
        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    };

    var isPlainObject = function isPlainObject(obj) {
        var proto, Ctor;
        if (!obj || toString.call(obj) !== "[object Object]") {
            return false;
        }
        proto = getProto(obj);
        if (!proto) return true;
        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    };

    var isEmptyObject = function isEmptyObject(obj) {
        if (obj == null) return false;
        if (typeof obj !== "object") return false;
        var keys = Object.keys(obj);
        if (hasOwn.call(Object, 'getOwnPropertySymbols')) {
            keys = keys.concat(Object.getOwnPropertySymbols(obj));
        }
        return keys.length === 0;
    };

    var isNumeric = function isNumeric(obj) {
        var type = toType(obj);
        return (type === "number" || type === "string") && !isNaN(+obj);
    };

    var each = function each(obj, callback) {
        var length, i = 0;
        if (isArrayLike(obj)) {
            length = obj.length;
            for (; i < length; i++) {
                var result = callback.call(obj[i], i, obj[i]);
                if (result === false) {
                    break;
                }
            }
        } else {
            var keys = Object.keys(obj);
            typeof Symbol !== "undefined" ? keys = keys.concat(Object.getOwnPropertySymbols(obj)) : null;
            for (; i < keys.length; i++) {
                var key = keys[i];
                if (callback.call(obj[key], key, obj[key]) === false) {
                    break;
                }
            }
        }
        return obj;
    }

    var shallowMerge = function shallowMerge(obj1, obj2) {
        var isPlain1 = isPlainObject(obj1),
            isPlain2 = isPlainObject(obj2);
        if (!isPlain1) return obj2;
        if (!isPlain2) return obj1;
        each(obj2, function(key, value) {
            obj1[key] = value;
        });
        return obj1;
    };

    var deepMerge = function deepMerge(obj1, obj2, cache) {
        cache = !Array.isArray(cache) ? [] : cache;
        if (cache.indexOf(obj2) >= 0) return obj2;
        cache.push(obj2);
        var isPlain1 = isPlainObject(obj1),
            isPlain2 = isPlainObject(obj2);
        if (!isPlain1 || !isPlain2) return shallowMerge(obj1, obj2);
        each(obj2, function(key, value) {
            obj1[key] = deepMerge(obj1[key], value, cache);
        });
        return obj1;
    };

    var shallowClone = function shallowClone(obj) {
        var type = toType(obj),
            Ctor = null;
        if (obj == null) return obj;
        Ctor = obj.constructor;
        if (/^(regexp|date)$/i.test(type)) return new Ctor(obj);
        if (/^(symbol|bigint)$/i.test(type)) return Object(obj);
        if (/^error$/i.test(type)) return new Ctor(obj.message);
        if (/^function$/i.test(type)) {
            return function anonymous() {
                return obj.apply(this, arguments);
            };
        }
        if (isPlainObject(obj) || type === "array") {
            var result = new Ctor();
            each(obj, function(key, value) {
                result[key] = value;
            });
            return result;
        }
        return obj;
    };

    var deepClone = function deepClone(obj, cache) {
        var type = toType(obj),
            Ctor = null,
            result = null;
        if (!isPlainObject(obj) && type !== "array") return shallowClone(obj);
        cache = !Array.isArray(cache) ? [] : cache;
        if (cache.indexOf(obj) >= 0) return obj;
        cache.push(obj);
        Ctor = obj.constructor;
        result = new Ctor();
        each(obj, function(key, value) {
            result[key] = deepClone(value, cache);
        });
        return result;
    };

    // 暴露到外部
    var utils = {
        toType: toType,
        isFunction: isFunction,
        isWindow: isWindow,
        isArrayLike: isArrayLike,
        isPlainObject: isPlainObject,
        isEmptyObject: isEmptyObject,
        isNumeric: isNumeric,
        each: each,
        shallowMerge: shallowMerge,
        deepMerge: deepMerge,
        shallowClone: shallowClone,
        deepClone: deepClone
    };
    if (typeof window !== "undefined") {
        window._ = window.utils = utils;
    }
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = utils;
    }
})();

(function() {
    //3.ajax内部功能的实现
    class Ajax {
        constructor(config) {
            //4.1 设置请求拦截器
            let [onResolveCallback] = ajax.interceptors.request.pond || [];
            if (_.toType(onResolveCallback) === "function") {
                config = onResolveCallback(config);
            }
            this.config = config;
            return this.request(config)
        }
        request() {
            let { method, timeout, withCredentials, validateStatus } = this.config;
            //3.1 发送ajax四步请求
            let promise = new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest;
                xhr.open(method.toUpperCase(), this.handleURL());
                //3.3 设置请求头及一些不相关参数
                timeout > 0 ? xhr.timeout = timeout : null;
                xhr.withCredentials = withCredentials;
                this.handleRequest(xhr);
                //3.4 处理响应信息
                xhr.onreadystatechange = () => {
                    let state = xhr.status,
                        readyState = xhr.readyState;

                    let result = null;
                    //axios层面上的失败
                    if (!validateStatus(state)) {
                        if (state === 0) return
                        reject(this.response(false, xhr, xhr.status));
                        return
                    }
                    //请求成功
                    if (readyState === 4) {
                        result = xhr.responseText;
                        switch ((responseType.toLowerCase())) {
                            case 'json':
                                result = JSON.parse(result);
                                break;
                            case 'document':
                                result = xhr.responseXML;
                                break;
                            case 'stream':
                                result = xhr.response;
                                break;
                        }
                        resolve(this.response(true, xhr, result));
                    }



                }

                //网络层的失败
                xhr.onerror = (err) => {
                    reject(this.response(false, xhr, {
                        message: "网络断开"
                    }));
                }

                //网络超时
                xhr.ontimeout = (err) => {
                    reject(this.response(false, xhr, {
                        message: "网络超时"
                    }));
                }

                //3.5 处理请求主体信息
                xhr.send(this.handleData);
            })

            //4.2 处理响应拦截器
            let [onResolveCallback, onRejectCallback] = ajax.interceptors.response.pond || [];
            if (_.toType(onResolveCallback) !== "function") {
                onResolveCallback = function(response) {
                    return response
                }
            }
            if (_.toType(onRejectCallback) !== "function") {
                onRejectCallback = reason => {
                    return Promise.reject(reason);
                };
            }

            return promise.then(onResolveCallback, onRejectCallback)
        }

        //处理将params转换成x-www-form形式        
        paramsSerializer(params) {
            let str = ``;
            _.each(params, (key, value) => {
                str += `&${key}=${value}`
            })
            return str.substring(1);
        }

        //3.2 处理url
        handleURL() {
            let {
                baseUrl,
                url,
                method,
                cache,
                params
            } = this.config;
            url = baseUrl + url;
            //params
            if (params && !_.isEmptyObject(params)) {
                if (_.toType(params) === "object") {
                    params = this.paramsSerializer(params);
                    url += `${url.includes("?") ? '&' : '?'}${params}`;
                }
            }

            //cache
            if (method_GET.includes(method.toUpperCase()) && cache === false) {
                url += `${url.includes('?')?'&':'?'}_=${Math.random()}`
            }

            return url
        }

        //3.3 处理请求头
        handleRequest(xhr) {
            let { headers, method } = this.config

            //先把header克隆一份
            let headers = _.deepClone(headers);

            let common = headers['common'] || {},
                methodObj = headers[method.toUpperCase()] || {};
            delete headers["common"];

            _.each(methods, (_, item) => {
                delete headers[item];
            })

            //合并请求头
            headers = _.deepMerge(headers, common);
            headers = _.deepMerge(headers, methodObj);

            //设置请求头
            _.each(headers, (key, value) => {
                xhr.setRequestHeader(key, value)
            })
        }

        //响应头
        handleResponseHeaders(xhr) {
            let headers = {},
                text = xhr.getAllResponseHeaders(),
                arr = text.split(/(?:\n|: )/g);
            for (let i = 0; i < arr.length; i += 2) {
                let key = arr[i],
                    value = arr[i + 1];
                if (key && value) {
                    headers[key] = value;
                }
            }
            return headers
        }

        //3.4 处理响应信息
        handleResponse(flag, xhr, data) {
            let {} = this.config;

            let response = {
                data: flag ? data : null,
                request: xhr,
                status: xhr.status,
                status: xhr.statusText,
                headers: this.handleResponseHeaders(xhr),
            }

            let reason = {
                message: data.message || data
            }
            if (flag) return response;

            typeof data === 'string' ? reason.response = response : null;

            return reason

        }

        //3.5 处理请求主体
        handleData() {
            let { method, headers, transformRequest, data } = this.config;
            if (!method_POST.includes(method.toUpperCase())) return null;
            data = transformRequest(data, headers);
            // 经过处理后，如果DATA还是一个对象（非formData对象）:可能是用户没有自己设置transformRequest，此时我们把其变为JSON格式的字符串
            if (data && typeof data === "object" && !(data instanceof FormData)) {
                try {
                    data = JSON.stringify(data);
                } catch (err) {
                    data = null;
                }
            }
            return data;

        }

    }

    const method_GET = ["get", "head", "options", "delete"],
        method_POST = ["post", "put", "patch"],
        methods = method_GET.concat(method_POST);
    //2.对参数进行处理
    //2.1 处理headers
    const headers = {
        common: {}
    }
    _.each(methods, (index, item) => {
        headers[item] = {};
    })

    //2.2 设置默认规则required,type,defaults
    const configRule = {
        baseUrl: {
            type: 'string',
            defaults: ''
        },
        url: {
            type: 'string',
            required: true,
        },
        method: {
            type: 'string',
            defaults: 'GET'
        },
        data: {
            type: ['object', 'string'],
            defaults: {}
        },
        transformRequest: {
            type: 'function',
            defaults: (data) => {
                return data
            }
        },
        cache: {
            type: 'boolean',
            defaults: true
        },
        params: {
            type: ['object', 'string'],
            defaults: {}
        },
        paramsSerializer: {
            type: 'function',
            defaults: (params) => {
                return Qs.stringify(params, { arrayFormat: "brackets" });
            }
        },
        headers: {
            type: 'object',
            defaults: headers
        },
        timeout: {
            type: 'number',
            defaults: 1000
        },
        withCredentials: {
            type: 'boolean',
            defaults: false
        },
        validateStatus: {
            type: 'function',
            defaults: (status) => {
                return status >= 200 && status < 300;
            }
        },
        responseType: {
            type: 'string',
            defaults: 'JSON'
        },
    }

    //2.3 按照规则对config进行校验
    const initParams = function initParams(config) {
        config = _.deepMerge(_.deepMerge({}, ajax.defaults), config);

        if (!_.isPlainObject(config)) config = {}
        _.each(configRule, (index, item) => {
            let {
                type,
                defaults,
                required
            } = item;

            let myValue = config[item],
                myType = _.toType(myValue);

            //1.我们没有传递值，如果要求是必须传递的，则报错，否则使用默认值即可 
            if (myValue === null) {
                if (required) throw new TypeError(`${key} must be required!`);
                config[item] = defaults
                return
            }

            //2.如果传递值，则根据类型判断是否符合，不符合报错，符合根据自己传递的值处理
            type = !Array.isArray(type) ? [type] : null;
            if (!type.includes(myType)) throw new TypeError(`${key} must be ${type}!`);
            if (_.isPlainObject(defaults) && _.isPlainObject(myValue)) {
                config[item] = _.deepMerge(_.deepMerge({}, defaults), myValue);
            } else {
                config[item] = myValue;
            }
        })

        // 特殊校验
        if (!methods.includes(config['method'].toLowerCase())) throw new TypeError('method must be a get/head/options/delete/post/put/patch!');
        return config
    }

    //1.整体架构
    const ajax = function ajax(config) {
        if (!_.isPlainObject(config)) config = {};
        //对config进行规则配置
        initParams(config);

        return new Ajax(config)
    }

    //1.1 处理all函数
    ajax.all = function(promises) {
        //判断传进来的是否是一个类数组或者数组
        if (!_.isArrayLike(promises)) throw new TypeError('promises must be a array or like-array!')
        return Promise.all(promises);
    }

    //1.2 处理get请求
    _.each(method_GET, (index, item) => {
        ajax[item] = function(url, config) {
            if (!_.isPlainObject(config)) config = {};
            config["url"] = url;
            config["method"] = item;
            return ajax(config)
        }
    })

    //1.3 处理post请求
    _.each(method_POST, (index, item) => {
        ajax[item] = function(url, data, config) {
            if (!_.isPlainObject(config)) config = {};
            config["url"] = url;
            config["method"] = item;
            config["data"] = data;
            return ajax(config)

        }
    })

    //4. 拦截器
    class InterceptorManager {
        constructor() {
            let self = this;
            self.request = {
                use: self.use
            }
            self.response = {
                use: self.use
            }
        }
        use(onResolveCallback, onRejectCallback) {
            let self = this;
            self.pond = [onResolveCallback, onRejectCallback];
        }
    }
    ajax.interceptors = new InterceptorManager

})();