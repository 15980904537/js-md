(function() {
    let obj = {};
    let str = Object.prototype.toString;
    let ultis = {};
    ["Number", "String", "Boolean", "null", "undefined", "Bigint", "Symbol", "Array", "Date",
        "RegExp",
        "Object",
        "Function",
    ].forEach((key) => {
            obj[`[object ${key}]`] = key.toLowerCase();
        })
        //检测数据类型
    let toType = function toType(type) {
        if (type === null) {
            return type + "";
        }
        return typeof type === "object" || typeof type === "function" ? obj[str.call(type)] : typeof type
    }
    ultis.toType = toType;
    // 检测是否为函数/window
    let isFunction = function isFunction(obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number";
    };
    let isWindow = function isWindow(obj) {
        return obj != null && obj === obj.window;
    };
    // 检测是否为数据或者类数组
    let isArrayLike = function isArrayLike(obj) {
            let length = !!obj && "length" in obj && obj.length,
                type = toType(obj);
            if (isFunction(obj) || isWindow(obj)) return false;
            return type === "array" || length === 0 ||
                typeof length === "number" && length > 0 && (length - 1) in obj;
        }
        //遍历数组和对象
    let each = function each(obj, callback) {
        callback = callback || Function.prototype;
        //如果是数组
        if (isArrayLike(obj)) {
            for (let i = 0; i < obj.length; i++) {
                let result = callback.call(obj[i], obj[i], i);
                if (result === false) break;
            }
            return obj;
        }
        //如果是对象（遍历symbol）
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let result = callback.call(obj[key], obj[key], key);
                if (result === false) break;
            }
        }
        return obj;
    }
    ultis.each = each;
    let isObj = function isObj(value) {
        // 是否为普通对象
        return toType(value) === "object";
    }
    ultis.isObj = isObj;
    // 暴露API：支持浏览器导入和CommonJS/ES6Module规范
    if (typeof window !== "undefined") {
        window._ = window.ultis = ultis;
    }
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = ultis;
    }
})()