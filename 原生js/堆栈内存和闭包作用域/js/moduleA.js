define(function() {
    let sum = function sum(...arg) {
        if (arg.length === 0) return 0;
        if (arg.length === 1) return arg[0];
        return arg.reduce((pre, next) => {
            return pre + next
        }, 0)
    }
    return { sum }
})