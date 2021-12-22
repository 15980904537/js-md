Function.prototype.myCall = function myCall(content, ...params) {
    //this==>fn content==>obj 参数==>params  返回值fn执行的返回值
    /*
    1.先判断content有无传递值，若无则为window,并且保证是对象属性
    2.给content添加this属性，记录唯一的symbol属性值
    3.this执行，并且传递参数，该函数返回的是this执行的返回值
    4.执行往后删除this属性
    */
    if (content == null) return (content = window);
    !/^(object|function)$/.test(typeof content) ?
        (content = Object(content)) :
        null;
    let self = this,
        key = Symbol("key");
    content[key] = self;
    let result = content[key](...params);
    delete content[key];
    return result;
};

function fn(x, y) {
    console.log(this, x, y);
}
let obj = {
    name: "zhufeng",
    fn: 100,
};

fn.myCall(obj, 10, 20);

