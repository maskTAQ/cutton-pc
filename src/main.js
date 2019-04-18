import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(ElementUI);
Vue.use(iView);

Vue.config.productionTip = false

console.table([
  ["version", "info"],
  ["0.29", "调用PCUpdateGetExcel接口时提供控件数据"]
]);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
