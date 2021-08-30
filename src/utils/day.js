// 引入 Vue
import Vue from "vue";
// 引入 day.js
import dayjs from "dayjs";
// 引入语言配置
import "dayjs/locale/zh-cn";

// 全局使用语言配置
dayjs.locale("zh-cn");

let relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

Vue.prototype.dayjs = dayjs

// 注册为全局过滤器
Vue.filter("dateTo", val => {
  return dayjs().to(dayjs(val))
});

// 注册为全局过滤器
Vue.filter("datetime", val => {
  return dayjs().format('MM-DD HH:mm')
});

Vue.filter("birthday", () => {
  return dayjs().format('YY-MM-DD')
});
