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

console.log('v0.73 修改样式');
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
