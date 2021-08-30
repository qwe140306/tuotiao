import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";



// 引入axios
import "@/utils/axios";

// 引入 Vant ui
import Vant from "vant";
// 引入 Vant ui 组件
import "vant/lib/index.css";
// 全局注册 Vant 中的组件
Vue.use(Vant);
// 全局样式放在 vant 样式后面 可以覆盖 vant 的样式
// 引入全局样式
import "./styles/index.less";

// 自动设置 Rem 基准值 html 标签字体大小
import "amfe-flexible";

// 引入时间格式处理
import  '@/utils/day'

// 关闭生产提示
Vue.config.productionTip = false;

// Vue 实例
new Vue({
  router,
  store,
  // 渲染App根组件   渲染到 #app 节点
  render: h => h(App)
}).$mount("#app");
