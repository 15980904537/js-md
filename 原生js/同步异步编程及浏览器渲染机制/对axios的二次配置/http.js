//1.要区分开发环境
let env = "dev";
switch (env) {
    case "dev":
        axios.defaults.baseUrl = "http://127.0.0.1:8888";
        break;
    case "test":
        axios.defaults.baseUrl = "http://124.0.0.1:8888"
        break;
    case "pro":
        axios.defaults.baseUrl = "http://api.zhufeng.cn"
        break;
}
axios.defaults.headers["Context - Type"] = 'application/x-www-form-urlencoded';
//处理请求主体的数据格式
/*
 * 统一设置POST系列请求下，请求主体传递的信息「data」的格式化的
 *   不设置：
 *     如果data是一个纯粹对象，则会默认处理为json格式的字符串
 *     如果是一个formData对象，则默认就是按照formData处理
 *     如果是一个BASE64的值，则默认转换为BASE64字符串传递给服务器
 *     ...
 *   设置了：
 *     在发送给服务器之前，必须先经过transformRequest的处理，这样导致formData等特殊格式，可能无法和纯粹对象处理方案一致，此时需要我们进行判断处理  => 可以基于请求头信息进行判断「要求必须设置对应格式的请求头」
 */
axios.defaults.transformRequest = function(data, headers) {
    let ContextType = headers["Context-Type"] || headers.common["Context - Type"] || headers.post["Context - Type"] || 'application/x-www-form-urlencoded';
    if (ContextType === 'application / json') {
        return JSON.stringify(data);
    }
    if (ContextType === 'application/x-www-form-urlencoded') {
        return Qs.stringify(data);
    }
    return data;
}

//常规配置
axios.defaults.timeout = 10000;
axios.defaults.withCredentails = true;
axios.defaults.validateStatus = function(status) {
    return status >= 200 && status < 300;
}

//请求拦截器
axios.interceptors.request.use(function(config) {
    let Token = localStorage.getItem("Token");
    if (Token) {
        config.headers['X-Token/Authorization'] = Token;
    }
    return config;
})

//响应拦截器
axios.interceptors.response.use(function(response) {
    return response.data
}, function(reason) {
    let response = reason.response;
    if (response) {
        //状态码失败
        switch (response.status) {
            //400 参数
            case 400:
                break;
                //401/403 Token
            case 401:
                break;
            case 403:
                break
                //404 地址
            case 404:
                break;
                //500/503 服务器
            case 500:
                break;
            case 503:
                break;
        }
    } else {
        //网络层面上的失败：网络超时或者中断请求
        //中断请求
        if (reason && reason.code === "ECONNABORTED") {
            alert();
        }
        //网络超时
        if (!navigator.onLine) {
            return
        }

    }
})

//业务层进一步封装：区分不同的业务 和 对业务层的失败做处理
const queryGet = function queryGet(url, config) {
    return axios.get(url, config).then(data => {
        let code = +data.code;
        if (code !== 0) return Promise.reject(data);
        return data.data;
    })
}

const queryFile = function queryFile(url, data, config) {
    config = Object.assign(config, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return axios.post(url, data, config);
}

const queryPost = function queryPost(url, data, config) {
    config = Object.assign(config, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    return axios.post(url, data, config);
}