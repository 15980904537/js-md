const instanceB = axios.create({
    baseURL: 'https://some-domain.com/api/',
    headers: {
        'X-Custom-Header': 'foobar'
    },
    // ...
});
// instance.interceptors.request.ues(...)
// instance.interceptors.response.ues(...)


// 发送请求
// instanceB.get()