define([
    "js/moduleA.js"
], function(moduleA) {
    let average = function average(...arg) {
        debugger
        if (arg.length === 0) return 0;
        if (arg.length === 1) return arg[0];
        return (moduleA.sum(...arg) / arg.length).toFixed(2)
    }
    return { average }
})