> 1.下面代码运行的结果

```javascript
function fun() {
  this.a = 0
  this.b = function () {
    alert(this.a)
  }
}
fun.prototype = {
  b: function () {
    this.a = 20
    alert(this.a)
  },
  c: function () {
    this.a = 30
    alert(this.a)
  },
}
var my_fun = new fun()
my_fun.b() //0
my_fun.c() //30
```

> 2.写出下面代码执行输出的结果

```javascript
function C1(name) {
  if (name) {
    this.name = name
  }
}
function C2(name) {
  this.name = name
}
function C3(name) {
  this.name = name || 'join'
}
C1.prototype.name = 'Tom'
C2.prototype.name = 'Tom'
C3.prototype.name = 'Tom'
alert(new C1().name + new C2().name + new C3().name) //“Tomundefinedjoin”
```

> 3.下面代码运行的结果？

```javascript
function Fn() {
    let a = 1;
    this.a = a;
}
Fn.prototype.say = function () {
    this.a = 2;
}
Fn.prototype = new Fn;
let f1 = new Fn;
​
Fn.prototype.b = function () {
    this.a = 3;
};
console.log(f1.a);//1
console.log(f1.prototype);//undefined
console.log(f1.b);//"function () {this.a = 3;}"
console.log(f1.hasOwnProperty('b'));//false
console.log('b' in f1);//true
console.log(f1.constructor == Fn);//true
```

> 4. 写出下面代码执行输出的结果

```javascript
function Foo() {
  getName = function () {
    console.log(1)
  }
  return this
}
Foo.getName = function () {
  console.log(2)
}
Foo.prototype.getName = function () {
  console.log(3)
}
var getName = function () {
  console.log(4)
}
function getName() {
  console.log(5)
}
Foo.getName() //2
getName() //4
Foo().getName() //1
getName() //1
new Foo.getName() //2
new Foo().getName() //3
new new Foo().getName() //3
```

> 5. 完成如下的需求

```javascript
let n = 10
let m = n.plus(10).minus(5)
console.log(m) //=>15（10+10-5）
```

================================

```javascript
Number.prototype.plus = function (m) {
  let self = this
  //先判断是否为数字类型，若不是数字类型转换成数字类型
  m = isNaN(+m) ? 0 : m
  return self + m
}
Number.prototype.minus = function (m) {
  let self = this
  //先判断是否为数字类型，若不是数字类型转换成数字类型
  m = isNaN(+m) ? 0 : m
  return self - m
}
let n = 10
let m = n.plus(10).minus(5)
console.log(m) //=>15（10+10-5）
```

> 6. 实现如下需求

```javascript
/*
 * 编写queryURLParams方法实现如下的效果（至少两种方案）
 */
let url = 'http://www.zhufengpeixun.cn/?lx=1&from=wx#video'
console.log(url.queryURLParams('from')) //=>"wx"
console.log(url.queryURLParams('_HASH')) //=>"video"
```

```javascript
String.prototype.queryURLParams = function (type) {
  let self = this
  //方法一：利用a标签的属性 search /hash
  let url = document.createElement('a'),
    search = '',
    hash = '',
    result = {}
  url.href = this
  search = url.search
  hash = url.hash
  //判断有无hash
  if (hash) {
    hash = hash.substring(1)
    result['_HASH'] = hash
  }
  //对search进行处理
  search = search.substring(1)
  search = search.split('&')
  search.forEach((item) => {
    item = item.split('=')
    result[item[0]] = item[1]
  })

  // 方法二：利用正则
  return type == null ? result : result[type]
}
```

> 7. 基于 ES6 中的 class 重构下面的代码

```javascript
function Modal(x, y) {
  this.x = x
  this.y = y
}
Modal.prototype.z = 10
Modal.prototype.getX = function () {
  console.log(this.x)
}
Modal.prototype.getY = function () {
  console.log(this.y)
}
Modal.n = 200
Modal.setNumber = function (n) {
  this.n = n
}
let m = new Model(10, 20)
```

=================================

```javascript
class Modal {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  getX() {
    console.log(this.x)
  }
  getY() {
    console.log(this.y)
  }
  static setNumber() {
    this.n = n
  }
}
Modal.prototype.z = 10
Modal.n = 200
let m = new Modal(10, 20)
console.log(m)
```

> 8.代码输出的结果

```javascript
let obj = {
  2: 3,
  3: 4,
  length: 2,
  push: Array.prototype.push,
}
obj.push(1)
obj.push(2)
console.log(obj)
```

===================================

```javascript
Array.prototype.push = function (value) {
  //this=arr value=arr
  //把value添加到this末尾
  //把arr.length+1
  //返回arr
  let self = this
  self[self.length] = value
  ++self.length
  return self
}

let obj = {
  2: 3,
  3: 4,
  length: 2,
  push: Array.prototype.push,
}
obj.push(1) //value=1  self=obj  obj.length=2 obj[2]=1  obj.length=3
obj.push(2) //value=2  self=obj  obj.length=3 obj[3]=2  obj.length=4
console.log(obj) //{ 2: 1, 3: 2,length: 4, push: Array.prototype.push,}
```

> 9. a 等于什么值会让下面条件成立

```javascript
var a = ?;
if (a == 1 && a == 2 && a == 3) {
    console.log('OK');
}
```

==================================

```javascript
//方案一：数据类型转换
let a = {
  i: 0,
  //处理三
  [Symbol.toPrimitive]() {
    return ++this.i
  },
}
//处理一
a.valueOf = function () {
  // this -> a
  return ++this.i
}
//处理二
a.toString = function () {
  // this -> a
  return ++this.i
}

//处理四
let a = [1, 2, 3]
a.toString = a.shift

//方案二：数据劫持
//  + 在全局上下文中基于var / function声明变量，相当于给window设置对应的属性 -> window.a
//   + Object.defineProperty劫持对象中某个属性的获取和设置等操作
let i = 0
Object.defineProperty(window, 'a', {
  get() {
    return ++i
  },
})
if (a == 1 && a == 2 && a == 3) {
  console.log('OK')
}
```

> 10. 实现如下需求

```javascript
let utils = (function () {
  /*
   * toArray：转换为数组的方法
   *   @params
   *      不固定数量，不固定类型
   *   @return
   *      [Array] 返回的处理后的新数组
   * by zhufengpeixun on 2020
   */
  function toArray() {
    //=>实现你的代码（多种办法实现）
  }

  return {
    toArray,
  }
})()
let ary = utils.toArray(10, 20, 30) //=>[10,20,30]
ary = utils.toArray('A', 10, 20, 30) //=>['A',10,20,30]
```

===========================

```javascript
let utils = (function () {
  /*
   * toArray：转换为数组的方法
   *   @params
   *      不固定数量，不固定类型
   *   @return
   *      [Array] 返回的处理后的新数组
   * by zhufengpeixun on 2020
   */
  function toArray(...ary) {
    //=>实现你的代码（多种办法实现）
    return ary
  }

  return {
    toArray,
  }
})()
console.log(utils.toArray(10, 20, 30)) //=>[10,20,30]
console.log(utils.toArray('A', 10, 20, 30)) //=>['A',10,20,30]
```

> 11. 对象(数组)的深克隆和浅克隆（头条）

```javascript
//=>浅克隆：只复制对象或者数组的第一级内容
//=>深克隆：克隆后数组的每一级都和原始数组没有关联
//那么请说出，浅克隆都怎么去实现，如何实现深度克隆
let obj = {
    a: 100,
    b: [10, 20, 30],
    c: {
        x: 10
    },
    d: /^\d+$/
};

let arr = [10, [100, 200], {
    x: 10,
    y: 20
}];

=============================
关于浅克隆：
    对于数组：
        1. es6的运算符      [...arr]
        2. Array内置类上的方法     arr.sclice()
        3. 创造一个空数组，循环遍历arr数组的每一项，让给在把每一项传给空数组

    对于对象：
        1. es6的运算符      {...obj}
        2. Object内置类上的方法     Object.assign({},obj)
        3. 创造一个空对象，循环遍历obj对象的每一项，让给在把每一项传给空对象

关于深克隆：
    JSON.stringify/JSON.parse
    =======》弊端：  1. bigInt会报错
                    2. Symbol/undefined/函数为空
                    3. 正则对象转换成空对象
                    4. 日期对象会转换成字符串后转换不过来
                    5. ArrayBuffer...

我们可以自己封装一个浅克隆和深克隆的方法



```

> 12. 已知基于 instanceof 可以实现检测：实例是否属于某个类，现在需要自己编写这样的一个方法，实现出 instanceof 的效果

```javascript
//=>example：要检测的实例
//=>classFunc:要检测的类
function instance_of(example, classFunc) {
  //...
}
let res = instance_of([12, 23], Array)
console.log(res) //=>true
```

=====================================

```javascript
//=>example：要检测的实例
//=>classFunc:要检测的类
function instance_of(example, classFunc) {
  //初始化参数
  if (typeof classFunc !== 'function')
    return new TypeError('classFunc must be an function')
  if (example == null) return

  //基于Symbol处理
  if (typeof Symbol !== null) {
    return classFunc[Symbol.hasInstance](example)
  }
  //基于原型链来处理
  let proto = Object.getPrototypeOf(example)
  if (proto) {
    if (proto === classFunc.prototype) {
      return true
    }
    proto = Object.getPrototypeOf(proto)
  }
  return false
}
let res = instance_of([12, 23], Array)
console.log(res) //=>true
```

**附加题（偏难）**

> 1. 实现如下需求

```javascript
//=>编写toType方法，实现数据类型检测
function toType( obj ) {
   //完成你的代码
}
console.log(toType(1)); //=>"number"
console.log(toType(NaN)); //=>"number"
console.log(toType([])); //=>"array"
console.log(toType(/^\d+$/)); //=>"regexp"
console.log(toType({})); //=>"object"
...
```

===================================

```javascript
let result = {},
  toString = Object.prototype.toString
;[
  'Function',
  'Array',
  'Object',
  'RegExp',
  'Date',
  'Number',
  'Symbol',
  'String',
  'null',
  'undefined',
  'BigInt',
  'Boolean',
  'Error',
].forEach((item) => {
  result[`[object ${item}]`] = item.toLocaleLowerCase()
})
//=>编写toType方法，实现数据类型检测
function toType(obj) {
  if (obj == null) return obj + ''
  return typeof obj !== 'function' && typeof obj !== 'object'
    ? typeof obj
    : result[toString.call(obj)]
}
console.log(toType(1)) //=>"number"
console.log(toType(NaN)) //=>"number"
console.log(toType([])) //=>"array"
console.log(toType(/^\d+$/)) //=>"regexp"
console.log(toType({})) //=>"object"
```

> 2. 完成如下需求

```javascript
~(function () {
  function change() {
    //=>实现你的代码
  }
  Function.prototype.change = change
})()
let obj = { name: 'zhufeng' }
function func(x, y) {
  this.total = x + y
  return this
}
let res = func.change(obj, 100, 200)
//res => {name:'Alibaba',total:300}
```

==================================

```javascript
~(function () {
  function change(context, ...arg) {
    //=>实现你的代码/相耽于call方法
    //this=》func   obj=>context  arg=>[200,300]
    //初始化参数
    if (context == null) return
    let self = this,
      result = null,
      //存放唯一值属性
      keys = Symbol('KEY')
    //往context中存放keys属性
    context[keys] = self
    //将this执行
    result = context[keys](...arg)
    //将keys属性释放
    delete context[keys]
    return result
  }
  Function.prototype.change = change
})()
let obj = {
  name: 'zhufeng',
}

function func(x, y) {
  this.total = x + y
  return this
}
let res = func.change(obj, 100, 200)
console.log(res)
//res => {name:'Alibaba',total:300}
```

> 3. 完成如下需求

```javascript
~(function () {
  //=>bind方法在IE6~8中不兼容，接下来我们自己基于原生JS实现这个方法
  function bind() {}
  Function.prototype.bind = bind
})()
var obj = { name: 'zhufeng' }
function func() {
  console.log(this, arguments)
  //=>当点击BODY的时候，执行func方法，输出：obj [100,200,MouseEvent事件对象]
}
document.body.onclick = func.bind(obj, 100, 200)
```

============================================

```javascript
~(function () {
  function call(context, ...arg) {
    //=>实现你的代码/相耽于call方法
    //this=》func   obj=>context  arg=>[200,300]
    //初始化参数
    if (context == null) return
    let self = this,
      result = null,
      //存放唯一值属性
      keys = Symbol('KEY')
    //往context中存放keys属性
    context[keys] = self
    //将this执行
    result = context[keys](...arg)
    //将keys属性释放
    delete context[keys]
    return result
  }
  //=>bind方法在IE6~8中不兼容，接下来我们自己基于原生JS实现这个方法
  function bind(context, ...arg) {
    let self = this
    return function (inner) {
      return self.call(context, ...[arg.concat(inner)])
    }
  }
  Function.prototype.bind = bind
  Function.prototype.call = call
})()
var obj = {
  name: 'zhufeng',
}

function func() {
  console.log(this, arguments)
  //=>当点击BODY的时候，执行func方法，输出：obj [100,200,MouseEvent事件对象]
}
document.body.onclick = func.bind(obj, 100, 200)
```

> 4. 下面代码的输出结果？为什么？

```javascript
var name = '珠峰培训'
function A(x, y) {
  var res = x + y //NaN
  console.log(res, this.name)
}
function B(x, y) {
  var res = x - y //10
  console.log(res, this.name)
}
B.call(A, 40, 30) //10,"A"
B.call.call(A, 40, 30) //   ==>this：A  B.CALL(40,30)   ===>A执行  this 40     NaN undefined
B.call.call.call(A, 20, 10) //NaN undefined
Function.prototype.call(A, 60, 50) //啥也不处理
Function.prototype.call.call.call(A, 80, 70) //NaN undefined
```
