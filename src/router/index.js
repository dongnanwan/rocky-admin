import Vue from 'vue';
import Router from 'vue-router';
import routes from './path';

Vue.use(Router);

const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error);
};

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    sessionStorage.clear();
  }
  const user = sessionStorage.getItem('token');
  const pwdFlag = sessionStorage.getItem('pwdFlag') ? Number(sessionStorage.getItem('pwdFlag')) : 1;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!user) {
      next({ path: '/login' });
    } else if (!pwdFlag && to.path !== '/setting/resetPwd') {
      next({ path: '/setting/resetPwd' });
    } else {
      next();
    }
  } else {
    next(); // 确保一定要调用 next()
  }
});

export default router;
