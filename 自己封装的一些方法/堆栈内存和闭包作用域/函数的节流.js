/*
            节流案例：
            1.编写对应的html和css结构和样式
            2.封装一个throttle函数，参数是函数，时间触发频率，返回一个函数
            3.对参数进行判断：如果不符合就退出
            4.当我们鼠标滚动时，让事件每隔500ms触发一次：
                先判断两次触发的时间间隔：（记录上次触发的时间和这次触发的时间）
                    1.两次触发时间间隔超过500ms：
                        =》让此次事件立即执行
                        =》让现在时间等于上次的时间
                    2.两次触发时间间隔小于500ms：
                        =》设置一个定时器，并且记录当前时间,让当前时间等于上次时间。
                        =》如果下次间隔时间小于500ms。
                            》不再执行！timer
                            》让定时器的timer=null
                        =》如果下次间隔时间超过500ms。
                            》让timer=null
                    特例：如果间隔小于500ms的等待时间恰好有触发了一次，清除定时器。
*/
const throttle = function throttle(func, interval) {
    //对参数初始化
    if (typeof func !== "function") return;
    if (typeof interval === "undefined") {
        interval = 500;
    }
    let pre = 0, //上次触发的时间
        timer = null;
    return function(...args) {
        let now = new Date(),
            self = this;
        let remaining = interval - (now - pre);
        //两次触发的时间间隔大于500ms==》立即执行
        if (remaining <= 0) {
            clearTimeout(timer);
            timer = null; //让下次如果没有超过500能实行定时器
            pre = now;
            func.call(self, ...args);
        } else if (!timer) {
            //两次触发时间间隔小于500ms==》
            timer = setTimeout(() => {
                clearTimeout(timer); //如果间隔小于500ms的等待时间恰好有触发了一次，清除定时器
                timer = null;
                pre = new Date();
                func.call(self, ...args);
            }, remaining);
        }
    };
};
window.onscroll = throttle(function() {
    console.log("ok");
}, 5000);