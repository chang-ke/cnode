//滚动条在Y轴上的滚动距离

const ScrollTop = () => {
  let scrollTop = 0,
    bodyScrollTop = 0,
    documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop = bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop;
  return scrollTop;
};

//文档的总高度

const ScrollHeight = () => {
  let scrollHeight = 0,
    bodyScrollHeight = 0,
    documentScrollHeight = 0;
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight;
  }
  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight;
  }
  scrollHeight = bodyScrollHeight - documentScrollHeight > 0 ? bodyScrollHeight : documentScrollHeight;
  return scrollHeight;
};

//浏览器视口的高度

const WindowHeight = () => {
  let windowHeight = 0;
  if (document.compatMode === "CSS1Compat") {
    windowHeight = document.documentElement.clientHeight;
  } else {
    windowHeight = document.body.clientHeight;
  }
  return windowHeight;
};

const toBottom = () => {
  if (/(Android.+Chrome)|((iPhone|iPad).+(Safari|Chrome))/.test(navigator.userAgent))
    return Math.abs(ScrollTop() + WindowHeight() - ScrollHeight()) < 75;
  return Math.abs(ScrollTop() + WindowHeight() - ScrollHeight()) < 23;
};

const formatTime = data => {
  const date = new Date(data);
  const time = new Date().getTime() - date.getTime(); //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
  if (time < 0) {
    return "";
  } else if (time / 1000 < 60) {
    return "刚刚";
  } else if (time / 60000 < 60) {
    return parseInt(time / 60000, 10) + "分钟前";
  } else if (time / 3600000 < 24) {
    return parseInt(time / 3600000, 10) + "小时前";
  } else if (time / 86400000 < 31) {
    return parseInt(time / 86400000, 10) + "天前";
  } else if (time / 2592000000 < 12) {
    return parseInt(time / 2592000000, 10) + "月前";
  } else {
    return parseInt(time / 31536000000, 10) + "年前";
  }
};
const setCookie = (name, value) => {
  let Days = 999;
  let exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
};

//读取cookies
const getCookie = name => {
  let arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  arr = document.cookie.match(reg);
  if (arr) return unescape(arr[2]);
  else return null;
};

//删除cookies
const delCookie = name => {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cval = getCookie(name);
  if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};

const throttle = function(func, wait, options) {
  //固定时间调用
  /* options的默认值
   *  表示首次调用返回值方法时，会马上调用func；否则仅会记录当前时刻，当第二次调用的时间间隔超过wait时，才调用func。
   *  options.leading = true;
   * 表示当调用方法时，未到达wait指定的时间间隔，则启动计时器延迟调用func函数，若后续在既未达到wait指定的时间间隔和func函数又未被调用的情况下调用返回值方法，则被调用请求将被丢弃。
   *  options.trailing = true; 
   * 注意：当options.trailing = false时，效果与上面的简单实现效果相同
   */
  let context, args, result;
  let timeout = null;
  let previous = 0;
  if (!options) options = {};
  let later = function() {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    let current = new Date().getTime();
    if (!previous && options.leading === false) previous = current;
    // 计算剩余时间
    let remaining = wait - (current - previous);
    context = this;
    args = arguments;
    // 当到达wait指定的时间间隔，则调用func函数
    // 精彩之处：按理来说remaining <= 0已经足够证明已经到达wait的时间间隔，但这里还考虑到假如客户端修改了系统时间则马上执行func函数。
    if (remaining <= 0 || remaining > wait) {
      // 由于setTimeout存在最小时间精度问题，因此会存在到达wait的时间间隔，但之前设置的setTimeout操作还没被执行，因此为保险起见，这里先清理setTimeout操作
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = current;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      // options.trailing=true时，延时执行func函数
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};
const debounce = function(func, wait, immediate) {
  //wait时间间隔内触发debounce不调用
  // immediate默认为false
  let timeout, args, context, timestamp, result;

  let later = function() {
    // 当wait指定的时间间隔期间多次调用_.debounce返回的函数，则会不断更新timestamp的值，导致last < wait && last >= 0一直为true，从而不断启动新的计时器延时执行func
    let last = new Date().getTime() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function() {
    context = this;
    args = arguments;
    timestamp = new Date().getTime();
    // 第一次调用该方法时，且immediate为true，则调用func函数
    let callNow = immediate && !timeout;
    // 在wait指定的时间间隔内首次调用该方法，则启动计时器定时调用func函数
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
};
export { toBottom, getCookie, setCookie, delCookie, ScrollTop, formatTime, throttle, debounce };
