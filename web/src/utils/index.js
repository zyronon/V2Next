export function throttle(fn, threshold, scope) {
    let timer;
    return function () {
        let context = scope || this, args = arguments;
        if (!timer) {
            timer = setTimeout(function () {
                fn.apply(context, args);
                timer = null;
            }, threshold)
        }
    }
}

export function debounce(fn, delay, scope) {
    let timer = null;
    // 返回函数对debounce作用域形成闭包
    return function () {
        // setTimeout()中用到函数环境总是window,故需要当前环境的副本；
        let context = scope || this, args = arguments;
        // 如果事件被触发，清除timer并重新开始计时
        if (!timer) {
            fn.apply(context, args);
            timer = setTimeout(function () {
                timer = null
            }, delay);
            return
        }
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
            timer = null
        }, delay);
    }
}