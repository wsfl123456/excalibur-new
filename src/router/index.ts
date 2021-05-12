import Vue from 'vue';
import Router from 'vue-router';
import Resource from './resource';
import Growth from './growth';
import Main from '@/views/Main.vue';
import Home from '@/views/Home/index.vue';
import Search from '@/views/Search/index.vue';
import { getCookie } from '../util/index';
import { Message } from 'element-ui';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  base: '/', // 不使用Vue.conf 里面的路由路径，使用根路径，并结合环境根路由与404Handler来实现双系统路由分割
  routes: [
    {
      path: process.env.BASE_URL,
      component: {
        name: 'v2',
        render: h => h('router-view'),
      },
      children: [
        {
          path: '/',
          name: 'main',
          component: Main,
          children: [
            {
              path: 'home',
              name: 'home',
              component: Home,
            },
            {
              path: 'search',
              name: 'search',
              component: Search,
            },
            Resource, // 资源管理模块路由
            Growth, //成长计划路由
          ],
        },
      ],
    },
    {
      path: '*',
      name: '404',
    },
  ],
});

router.beforeEach((to, from, next) => {
  const cookie = getCookie('token')
  /* 将不属于新系统的路由指向老系统 */
  if (to.name === '404' && process.env.NODE_ENV === 'production') {
    window.location.href = to.fullPath;
    return;
  }

  if (!cookie) {
    Message.error({
      message: '身份验证失败，即将跳转至登录界面',
      onClose() {
        window.location.href = `/?redirect=${to.fullPath}`
      },
    });
    return;
  }
  
  next();
});


export default router;
