let params = {
    url: "",
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    data: null,
    arr: [10, 20, 30],
    config: {
        xhr: {
            async: true,
            cache: false,
        },
    },
};

let options = {
    url: "http://www.zhufengpeixun.cn/api/",
    headers: {
        "X-Token": "EF00F987DCFA6D31",
    },
    data: {
        lx: 1,
        from: "weixin",
    },
    arr: [30, 40],
    config: {
        xhr: {
            cache: true,
        },
    },
};
options.a = options;

function isObj(value) {
    // 是否为普通对象
    return _.toType(value) === "object";
}
let merge = function merge(params, options = {}, cache) {
    /*
     * 几种情况的分析
     *   A->options中的key值  B->params中的key值
     *   1.A&B都是原始值类型:B替换A即可
     *   2.A是对象&B是原始值:抛出异常信息
     *   3.A是原始值&B是对象:B替换A即可
     *   4.A&B都是对象:依次遍历B中的每一项,替换A中的内容
     */
    cache = !Array.isArray(cache) ? [] : cache;
    if (cache.indexOf(options) > -1) return options;
    cache.push(options);
    _.each(options, (_, key) => {
        let isA = isObj(params[key]),
            isB = isObj(options[key]);
        if (isA && !isB) throw new TypeError(`${key} in params must be object`);
        if (isB && isA) {
            params[key] = merge(params[key], options[key], cache);
            return;
        }
        params[key] = options[key];
    });
    return params;
};
console.log(merge(params, options));