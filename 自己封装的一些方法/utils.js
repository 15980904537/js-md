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

    /* 
     * 对象的深浅合并
     *  [合并的规律]
     *    A->obj1  B->obj2
     *    A/B都是对象：迭代B，依次替换A
     *    A不是对象，B是对象：B替换A
     *    A是对象，B不是对象：依然以A的值为主
     *    A/B都不是对象：B替换A
     */
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
        // 防止对象的循环嵌套导致的死递归问题
        cache = !Array.isArray(cache) ? [] : cache;
        if (cache.indexOf(obj2) >= 0) return obj2;
        cache.push(obj2);

        // 正常处理
        var isPlain1 = isPlainObject(obj1),
            isPlain2 = isPlainObject(obj2);
        if (!isPlain1 || !isPlain2) return shallowMerge(obj1, obj2);
        each(obj2, function(key, value) {
            obj1[key] = deepMerge(obj1[key], value, cache);
        });
        return obj1;
    };

    /*
     * 对象或者数组的深浅克隆 
     */
    var shallowClone = function shallowClone(obj) {
        var type = toType(obj),
            Ctor = null;
        // 其他特殊值的处理
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
        // 数组和纯粹对象，我们基于循环的方案来处理
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
        // 防止死递归
        cache = !Array.isArray(cache) ? [] : cache;
        if (cache.indexOf(obj) >= 0) return obj;
        cache.push(obj);
        // 正常的迭代处理
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