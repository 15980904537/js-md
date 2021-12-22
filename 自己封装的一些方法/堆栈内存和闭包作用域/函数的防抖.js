/*
防抖案例：
1. 编写对应的html结构和css样式
2. 封装一个debouce函数， 参数为函数， 等待时间， 是否立即执行； 返回值是一个函数
3. 对参数进行判断, 如果不符合退出
4. 当疯狂点击时， 我们在500ms内只触发一次
点击触发最后一次情况：
    +
    设置一个定时器： 在里面执行传递进来的函数， 在这之前清除上一个定时器
点击之后立即执行的情况：
    +
    如果immdiate为true并且timer = null， 则立即执行。 +
    设置一个定时器等待时间， 但是此时不执行传递的函数。 之后高频触发timer值不为null， 所以不会再执行 +
    当过了等待时间， 让timer的值为null。
*/

let button = document.querySelector(".button");
const debouce = function(func, wait, immdiate) {
    //对参数进行处理
    if (typeof func !== "function") return;
    if (typeof wait !== "number") {
        if (typeof wait === "boolean") {
            immdiate = wait;
        }
    }
    if (typeof wait === "undefined") {
        wait = 500;
    }
    if (typeof immdiate === "undefined") {
        immdiate = false;
    }
    let timer = null;

    return function(...arg) {
        let self = this;
        let now = immdiate && !timer ? true : false;
        //清除定时器
        clearTimeout(timer);
        timer = setTimeout(function() {
            timer = null;
            //执行func的时候确保this是Dom元素，并且闯进去的参数有事件对象
            !immdiate ? func.call(self, ...arg) : null;
        }, wait);
        now ? func.call(self, ...arg) : null;
    };
};

button.onclick = debouce(
    function() {
        console.log("ok");
    },
    5000,
    true
); //true代表点击之后立即执行，false代表疯狂点击的最后一次执行