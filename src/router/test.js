import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './index.config';
import { routerList } from '@/common/js/url-white-list';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'hash',
  // mode: 'history',
  base: __dirname,
  routes,
  // 在顶部点击当前路由菜单回到顶部
  scrollBehavior() {
    return {
      x: 0,
      y: 0,
    };
    /* 跳转页面返回顶部 */
  },
});

router.beforeEach((to, from, next) => { // 简单的判断
  const pwdFlag = window.sessionStorage.getItem('pwdFlag'); // 用户角色
  const token = window.sessionStorage.getItem('token');// 是否登录
  if (!token) {
    next({
      path: '/login',
    });
  } else if (pwdFlag) { // 没权限
    next({
      path: '/jurisd',
    });
  } else {
    next();
  }
});

export default router;
