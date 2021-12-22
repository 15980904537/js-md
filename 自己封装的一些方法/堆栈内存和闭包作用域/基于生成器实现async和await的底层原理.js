function API(num) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(num);
        }, 1000);
    });
}
//基于promise中的then处理
API(10)
    .then((data) => {
        return data + 10;
    })
    .then((data) => {
        console.log(data); //20
    });
//基于async/await处理
async function func() {
    let data = await API(10);
    data = await API(data + 10);
    console.log(data);
}
func();

// 传递给我一个Generator函数，我可以把函数中的内容基于Iterator迭代器的特点一步步的执行
function asyncFunc(generator) {
    //创建一个迭代器函数，里面有方法next
    let iterator = generator();
    //创建next函数
    const next = (data) => {
        let { value, done } = iterator.next(data);
        if (done) return data;
        value.then((data) => {
            next(data);
        });
    };
    next();
}

asyncFunc(function*() {
    let data = yield API(100); //{value:API(100),done:false}
    data = yield API(data + 10); //{value:API(data + 10),done:false}
    console.log(data); //{value:undefined,done:true}
});