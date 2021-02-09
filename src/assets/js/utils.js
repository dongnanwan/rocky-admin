import { Message } from 'ant-design-vue';

const utils = {
  format(val) {
    const valTemp = Number(val);
    return (valTemp < 10 ? `0${valTemp}` : valTemp);
  },
  now() {
    const date = new Date();
    const o = {
      yyyy: date.getFullYear(),
      m: this.format((date.getMonth() + 1)),
      dd: this.format(date.getDate()),
      hh: this.format(date.getHours()),
      mm: this.format(date.getMinutes()),
      ss: this.format(date.getSeconds()),
      S: date.getMilliseconds(),
    };
    return (`${o.yyyy}-${o.m}-${o.dd} ${o.hh}:${o.mm}:${o.ss}.${o.S}`);
  },
  randomString(len) { // 随机字符串
    // eslint-disable-next-line
    len = len || 32;
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*** */
    const maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len; i += 1) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },
  dateRangeFormat(range, type) { // 格式化时间段
    let time = '';
    if (range.length === 0) {
      return '';
    }
    switch (type) {
      case 'begin':
        time = range[0].format('YYYY-MM-DD');
        break;
      case 'end':
        time = range[1].format('YYYY-MM-DD');
        break;
      default:
    }
    return time;
  },
  mixRule(rule, msg) { // 格式化规则
    const ruleTemp = JSON.parse(JSON.stringify(rule));
    if (typeof rule[0].pattern !== 'undefined') {
      ruleTemp[0].pattern = rule[0].pattern;
    }
    ruleTemp[0].message = msg;
    // ruleTemp[0].validator = validator
    return ruleTemp;
  },
  add_msg(a, b) { // 数组b相对于数组a所删除的数据
    return a.filter(i => b.indexOf(i) === -1);
  },
  delete_msg(a, b) { // 数组b相对于数组a所删除的数据
    return b.filter(i => a.indexOf(i) === -1);
  },
  valWidthAndHeight(file, validWidth, validHeight) { // 限制上传图片大小
    return new Promise(((resolve, reject) => {
      const URL = window.URL || window.webkitURL;
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = function () {
        const valid = image.width === validWidth && image.height === validHeight;
        valid ? resolve() : reject();
      };
    })).then(() => file,
      () => {
        Message.error(`上传图片尺寸不符合,只能是${validWidth}*${validHeight}!`);
        return Promise.reject();
      });
  },
  getCookie(name) { // 获取指定名称的cookie值
    // (^| )name=([^;]*)(;|$),match[0]为与整个正则表达式匹配的字符串，match[i]为正则表达式捕获数组相匹配的数组；
    const arr = document.cookie.match(new RegExp(`(^| )${name}=([^;]*)(;|$)`));
    if (arr != null) {
      return unescape(arr[2]);
    }
    return null;
  },
};

export default utils;
