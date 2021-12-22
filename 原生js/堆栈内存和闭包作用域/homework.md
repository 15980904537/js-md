# 2020 年 07 期在线 JS 高级（第一周作业）

## 一、变量提升的作业

```javascript
1.
console.log(a, b, c); //undefined undefined undefined
var a = 12,
    b = 13,
    c = 14;
function fn(a) {
    console.log(a, b, c); //10 13 14
    a = 100;
    c = 200;
    console.log(a, b, c); //100 13 200
}
b = fn(10);
console.log(a, b, c);// 12 undefined 200
2
var i = 0;
function A() {
    var i = 10;
    function x() {
        console.log(i);
    }
    return x;
}
var y = A();
y();//10
function B() {
    var i = 20;
    y();
}
B(); //10
3
var a=1;
var obj ={
   name:"tom"
}
function fn(){
   var a2 = a;
   obj2 = obj;
   a2 =a;
   obj2.name ="jack";
}
fn();
console.log(a);//1
console.log(obj);//{ name:"jack"}
4
var a = 1;
function fn(a){
    console.log(a); //"function a(){}"
    var a = 2;
    function a(){}
}
fn(a);
5
console.log(a); //undefined
var a=12;
function fn(){
    console.log(a); //undefined
    var a=13;
}
fn();
console.log(a);//12

----

console.log(a); //undefined
var a=12;
function fn(){
    console.log(a);//12
    a=13;
}
fn();
console.log(a);//13

----

console.log(a);//报错
a=12;
function fn(){
    console.log(a);
    a=13;
}
fn();
console.log(a);
6
var foo='hello';
(function(foo){
   console.log(foo);//'hello'
   var foo=foo||'world';
   console.log(foo);//'hello'
})(foo);
console.log(foo); //'hello'
7
{
    function foo() {}
    foo = 1;
}
console.log(foo);//"function foo() {}"

----

{
    function foo() {}
    foo = 1;
    function foo() {}
}
console.log(foo);//1

----

{
    function foo() {}
    foo = 1;
    function foo() {}
    foo = 2;
}
console.log(foo);//1
8.
var x=1;
function func(x,y=function anonymous1(){x=2}){
    x=3;
    y();
    console.log(x);//2
}
func(5);
console.log(x);//1


--------
var x=1;
function func(x,y=function anonymous1(){x=2}){
    var x=3;
    y();
    console.log(x);//3
}
func(5);
console.log(x);//1

-------
var x=1;
function func(x,y=function anonymous1(){x=2}){
    var x=3;
    var y=function anonymous1(){x=4};
    y();
    console.log(x);//4
}
func(5);
console.log(x);//1

```

## 二、数据类型和基础知识作业

```javascript
1
let result = 100 + true + 21.2 + null + undefined + "Tencent" + [] + null + 9 + false;
console.log(result); //"NaNTencentnull9false"
2
{}+0?alert('ok'):alert('no'); //"no"
0+{}?alert('ok'):alert('no');//"ok"
3
let res = Number('12px');//NaN
if(res===12){
    alert(200);
}else if(res===NaN){
    alert(NaN);
}else if(typeof res==='number'){
    alert('number');
}else{
    alert('Invalid Number');
}
输出'number'
4
let arr = [27.2,0,'0013','14px',123];
arr = arr.map(parseInt);
console.log(arr);//[27,NaN,1,1,27]
```

## 三、闭包作用域的作业

```javascript
1
var a = 10,
  b = 11,
  c = 12
function test(a) {
  a = 1
  var b = 2
  c = 3
}
test(10)
console.log(a, b, c) //10,11,3
2
var a = 4
function b(x, y, a) {
  console.log(a) //3
  arguments[2] = 10
  console.log(a) //10
}
a = b(1, 2, 3)
console.log(a) //undefined
3
var a = 9
function fn() {
  a = 0
  return function (b) {
    return b + a++
  }
}
var f = fn()
console.log(f(5)) //5
console.log(fn()(5)) //5
console.log(f(5)) //6
console.log(a) //2
4
var test = (function (i) {
  return function () {
    alert((i *= 2))
  }
})(2)
test(5) //‘4’
5
var x = 4
function func() {
  return function (y) {
    console.log(y + --x)
  }
}
var f = func(5)
f(6) //9
func(7)(8) //10
f(9) //10
console.log(x) //1
6
var x = 5,
  y = 6
function func() {
  x += y
  func = function (y) {
    console.log(y + --x)
  }
  console.log(x, y)
}
func(4) //11,6
func(3) //13
console.log(x, y) //10,6
7
function fun(n, o) {
  console.log(o)
  return {
    fun: function (m) {
      return fun(m, n)
    },
  }
}
var c = fun(0).fun(1) //o=undefined;o=0
c.fun(2) //o=1
c.fun(3) //o=1
```

> 8 简述你对闭包的理解，以及其优缺点？

    1.当函数执行的时候，会形成私有上下文，而私有变量则是保存在私有变量对象中，这样可以避免和全局变量发生冲突，避免全局污染。而且当私有上下文中的内容被外部占用时，该私有上下文是不会被释放的，所以私有变量就可以保存下来以供其下级上下文调用。这种既能保护又能保存私有变量的上下文我们称之为闭包。

    2.在真实项目中，我们进行多人协助开发时，经常用闭包来开发我们自己写的代码，以防止变量和其他人冲突。而且在没有es6中的let时，我们实现事件循环绑定的业务都是基于闭包实现的。

    3.很多js高阶编程技巧都是基于闭包原理实现的，例如：单例设计模式，惰性函数，curring函数，compose组合函数等等

    4.在一些常用框架中，例如vue，react源码都是基于闭包实现的

    5.但是，闭包会使堆栈内存不被释放，占用内存，从而影响浏览器渲染速度

> 9 简述 let 和 var 的区别？

    1.var存在变量提升，所以在声明变量之前使用变量都不会报错。而let不存在变量提升，所以必须声明变量在使用。在真实项目中，为了 代码的严谨，我们都是使用es6 let创建变量。而且创建函数基本都是用函数表达式创建，这样保证函数在创建之后执行。

    2.let不允许重复声明，这样尽可能把每个模块都用闭包包起来，防止重复声明

    3.let声明的变量不和全局对象产生映射关系。

    4.let能解决暂时性死区问题   `typeof n; let n`会报错

    5.let会形成块级作用域。这也是循环事件绑定实现的原理。

> 10 下面代码输出的结果是多少，为什么？如何改造一下，就能让其输出 20 10？

```javascript
var b = 10;
(function b() {
    b = 20;
    console.log(b);//这个自执行函数
})();/。
console.log(b);//10

--------改造后-----
var b = 10;
(function b() {
    var b = 20;
    console.log(b);//20
})();
console.log(b);//10
```

> 11 实现函数 fn，让其具有如下功能（百度二面）

```javascript
let res = fn(1,2)(3);
console.log(res); //=>6  1+2+3


-----实现效果-----
let fn = function fn(...arg) {
            return function(m) {
                if (typeof arg === "undefined") return m
                //添加m
                arg.unshift(m)
                return arg.reduce((pre, next) => pre + next)
            }
        }

let res = fn(1, 2)(3);
console.log(res); //=>6  1+2+3
```

## 四、THIS 的作业题

```javascript
1
var num = 10;
var obj = {
    num: 20
};
obj.fn = (function (num) {
    this.num = num * 3;
    num++;
    return function (n) {
        this.num += n;
        num++;
        console.log(num);
    }
})(obj.num);
var fn = obj.fn;
fn(5);//22
obj.fn(10);//23
console.log(num, obj.num);//65 30
2
let obj = {
    fn: (function () {
        return function () {
            console.log(this);
        }
    })()
};
obj.fn();//obj
let fn = obj.fn;
fn();//window
3
var fullName = 'language';
var obj = {
    fullName: 'javascript',
    prop: {
        getFullName: function () {
            return this.fullName;
        }
    }
};
console.log(obj.prop.getFullName());//'javascript'
var test = obj.prop.getFullName;
console.log(test());//'language'
4
var name = 'window';
var Tom = {
    name: "Tom",
    show: function () {
        console.log(this.name);
    },
    wait: function () {
        var fun = this.show;
        fun();
    }
};
Tom.wait();//'window'
5
window.val = 1;//4
var json = {
    val: 10,//20
    dbl: function () {
        this.val *= 2;
    }
}
json.dbl();
var dbl = json.dbl;
dbl();
json.dbl.call(window);
alert(window.val + json.val);//"24"
6
(function () {
    var val = 1;//2
    var json = {
        val: 10,
        dbl: function () {
            val *= 2;
        }
    };
    json.dbl();
    alert(json.val + val);
})();
输出：“12”
```
