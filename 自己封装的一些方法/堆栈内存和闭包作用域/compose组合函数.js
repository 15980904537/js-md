//编写compose函数
const compose = function compose(...arg) {
    return function(m) {
        if (arg.length === 0) return m;
        if (arg.length === 1) return typeof arg[0] === "function" ? arg[0](m) : m;
        return arg.reduceRight((pre, next) => {
            if (typeof next !== "function") return pre;
            return next(pre);
        }, m);
    };
};

const add1 = (x) => x + 1;
const mul3 = (x) => x * 3;
const div2 = (x) => x / 2;
const operate = compose(div2, mul3, add1);
console.log(operate(0)); //=>相当于div2(mul3(add1(0)))
console.log(operate(2)); //=>相当于div2(mul3(add1(2)))