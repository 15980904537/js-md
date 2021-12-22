(function() {
    let obj = {};
    let toString = ({}).toString;
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
    ].forEach((item) => {
        obj[`[object ${item}]`] = item.toLowerCase();
    });

    function toType(value) {
        if (value === null) {
            return value + "";
        }
        //如果是基本数据类型值用typeof检测，否则用Object.prototype.toString.call([value])
        return typeof value === "object" || typeof value === "function" ?
            obj[toString.call(value)] :
            typeof value;
    }


    //检测是否为函数
    function isFunction(obj) {

        //typeof obj.nodeType !== "number":防止在部分浏览器中，检测<object>元素对象结果也是"function"，但是它的nodeType=1，处理浏览器兼容问题
        return typeof obj === "function" && typeof obj.nodeType !== "number";
    }

    //检测是否为window
    function isWindow(obj) {
        return obj.window === obj && obj != null
    }

    //检测是否为数组或者类数组
    function isArraylike(obj) {
        //length的值为数字或者false
        let length = !!obj && "length" in obj && obj.length,
            type = toType(obj);

        //window.length=0 && Function.prototype.length=0
        if (isFunction(obj) || isWindow(obj)) return false
            // type === "array" 数组
            // length === 0 空的类数组
            // 最后一个条件判断的是非空的类数组「有length属性，并且最大索引在对象中」
        return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj
    }

    //检测是否为存粹的对象
    function isPlainObject() {

    }
    window.toType = toType;
    window.isFunction = isFunction;
    window.isWindow = isWindow;
    window.isArraylike = isArraylike;
})();
console.log(toType(1));
console.log(toType([]));
console.log(toType({}));
console.log(toType(/^$/));
console.log(toType(""));