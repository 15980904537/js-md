//创建迭代器
function createIterator(item) {
    let i = 0;
    return {
        next() {
            let done = i >= item.length;
            let value = !done ? item[i++] : undefined;
            return {
                value,
                done,
            };
        },
    };
}
let arr = [22, 33, 44, 55];
let it = createIterator(arr);
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());