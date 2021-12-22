let obj = {
    0: 1,
    1: 2,
    length: 2,
    [Symbol.iterator]: Array.prototype[Symbol.iterator],
};
for (let item of obj) {
    console.log(item);
}