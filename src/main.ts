import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './filters';

import App from './App.vue';
import router from './router/index';
import store from './store';
import './registerServiceWorker';
import VueClipboard from 'vue-clipboard2'

import VueAnalytics from 'vue-analytics'

Vue.use(ElementUI);
Vue.use(VueAnalytics, {
  id: 'UA-145234507-1',
  router,
  autoTracking: {
    pageviewTemplate (route: any) {
      return {
        page: route.path,
        title: document.title,
        location: window.location.href
      }
    }
  }
})


VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
