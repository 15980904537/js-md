function hasPubProperty(attr, obj) {
    //方案一：
    return attr in obj && !obj.hasOwnProperty(attr);
    //方案二：共有属性实在obj所属类的原型上，我们去获得这个obj的原型即可。如果没有共有属性，则遍历到Object的原型是null
    /*
    let proto = Object.getPrototypeOf(obj);
    if (proto !== null) {
        if (proto.hasOwnProperty(attr)) {
            return true;
        }
        proto = Object.getPrototypeOf(proto);
    }
    return false;
    */
}
let obj = {
    name: "hahha",
    age: "hahaha",
};
console.log(hasPubProperty("name", obj));
console.log(hasPubProperty("age", obj));