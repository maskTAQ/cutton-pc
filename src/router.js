import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home/index.vue'
import store from './store';
import Login from './views/login/index.vue';
import CloudOfferTool from './views/cloud-offer-tool/index.vue';
import QuotationList from './views/quotation-list.vue';
import Auth from './views/auth';
import { Message } from 'element-ui';

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: CloudOfferTool
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/cloud-offer-tool',
      name: 'cloud-offer-tool',
      component: CloudOfferTool
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth
    },
    {
      path: '/quotation-list',
      name: 'quotation-list',
      component: QuotationList
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
router.beforeEach((to, from, next) => {
  const { status } = store.state.data.user;
  if (to.name === 'login') {
    if (status === 'success') {
      Message.error('已登录,请勿重复操作');
      next({
        path:from.fullPath
      });
    } else {
      next();
    }
  } else {
    if (status === 'success') {
      next();
    } else {
      Message.error('请先登录');
      next({
        path: 'login',
        query: { redirect: to.fullPath }
      })
    }
  }

})
export default router;