(function() {
    let obj = {};
    let str = {}.toString();
    [
        "Number",
        "String",
        "Boolean",
        "null",
        "undefined",
        "Bigint",
        "Symbol",
        "Array",
        "Date",
        "RegExp",
        "Object",
        "Function",
    ].forEach((key) => {
        obj[`[object ${key}]`] = key.toLowerCase();
    });
    //检测数据类型
    let toType = function toType(type) {
        return type === null && /^(function|object)$/i.test(typeof obj) ?
            obj[str.call(type)] :
            typeof obj;
    };
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
        return (
            type === "array" ||
            length === 0 ||
            (typeof length === "number" && length > 0 && length - 1 in obj)
        );
    };
    //遍历数组和对象
    let each = function each(obj, callback) {
        callback = callback || Function.prototype;
        //如果是数组
        if (isArrayLike(obj)) {
            for (let i = 0; i < obj.length; i++) {
                let item = obj[i],
                    result = callback.call(item, item, i);
                if (result === false) { break };
            }
            return obj;
        }
        //如果是对象（遍历symbol）
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let item = obj[key],
                    result = callback.call(item, key);
                if (result === false) { break };
            }
        }
        return obj;
    };
    window.toType = toType;
    window.each = each;
})();
//实现数组和对象的浅克隆
function shallowClone(obj) {
    //obj必须是数组或者对象，return的结果是克隆后的数组和对象
    /*
              1.对传进来的参数进行判断（只要是数组和对象我们进行正常克隆。如果是基本数据类型，返回传进来的参数；如果是symbol，返回Object（obj）；如果是bigInt，返回new obj.constructor）
              2.创建一个新数组和新对象，封装一个方法能实现数组和对象的遍历
              */
    let type = toType(obj),
        ctor = obj.constructor;
    if (obj == null) return obj;
    //如果obj是symbol，bigInt
    if (/^(symbol|bigInt)$/i.test(type)) return Object(obj);
    //如果obj是regexp，date
    if (/^(regexp|date)$/i.test(type)) return new ctor(obj);
    //对于错误对象的处理
    if (/^error$/i.test(type)) return new ctor(obj.message);
    //如果obj是function
    if (/^function$/i.test(type)) {
        // 返回新函数：新函数执行还是把原始函数执行，实现和原始函数相同的效果
        return function() {
            return obj.call(this, ...arguments);
        };
    }
    if (/^(object|array)$/i.test(type)) {
        //创建数组或者对象
        let newObj = new ctor();
        each(obj, (item, index) => {
            newObj[index] = obj[index];
        });
        return newObj;
    }
    return obj;
}

//实现数组和对象的深克隆

function deepClone(obj, cache = new Set()) {
    let type = toType(obj),
        Ctor = obj.constructor;
    if (!/^(object|array)$/i.test(type)) return shallowClone(obj);
    // 避免无限套娃
    if (cache.has(obj)) return obj;
    cache.add(obj);

    let keys = [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)];
    let newObj = new Ctor();
    each(keys, (item) => {
        newObj[item] = deepClone(obj[item], cache);
    });

    return newObj;
}

let obj = {
    name: "hahah",
    age: 13,
    class1: {
        wuwu: "haah",
        age1: 14,
    },
};
let newObj = deepClone(obj);
console.log(newObj);