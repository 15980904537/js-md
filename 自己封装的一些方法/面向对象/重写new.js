function Dog(name) {
    this.name = name;
}
Dog.prototype.bark = function() {
    console.log("wangwang");
};
Dog.prototype.sayName = function() {
    console.log("my name is " + this.name);
};
/*
        let sanmao = new Dog('三毛');
        sanmao.sayName();
        sanmao.bark();
*/
function _new(Ctor, ...params) {
    //=>完成你的代码
    //1.创建一个对象并让对象的__proto__指向Ctor的原型
    let obj = Object.create(Ctor.prototype);
    //2.将ctor执行，并且让this变为obj
    let result = Ctor.call(obj, ...params);
    //3.返回值如果是应用数据类型，则返回该函数的返回值
    if (result !== null && /^(function|object)$/.test(typeof result))
        return result;
    return obj;
}
let sanmao = _new(Dog, "三毛");
sanmao.bark(); //=>"wangwang"
sanmao.sayName(); //=>"my name is 三毛"
console.log(sanmao instanceof Dog); //=>true