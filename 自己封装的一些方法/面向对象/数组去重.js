Array.prototype.myUnique = function myUnique() {
    let obj = {},
        self = this;
    for (let i = 0; i < self.length; i++) {

        const item = self[i];
        if (obj.hasOwnProperty(item)) {
            self.slice(i, 1);
            i--;
            continue;
        }
        obj[item] = item;
    }
    return self; //实现链式写法
}

let arr = [10, 20, 30, 40, 30, 50, 60, 20];
arr = arr.myUnique();
console.log(arr);