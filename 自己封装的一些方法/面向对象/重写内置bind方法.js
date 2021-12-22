Function.prototype.myBind = function myBind(content, ...params) {
    let self = this;
    return function(...innerArg) {
        self.call(content, ...params.concat(innerArg));
    };

};

function fn(x, y, ev) {
    console.log(this, x, y, ev);
}
let obj = {
    name: "zhufeng",
};
document.body.onclick = fn.bind(obj, 10, 20);