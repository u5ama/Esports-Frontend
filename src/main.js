import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSession from 'vue-session'
import Vuelidate from 'vuelidate'
import moment from 'moment'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';
import FlashMessage from '@smartweb/vue-flash-message';

Vue.use(VueSession)
Vue.prototype.$session.start();
var isLogin = Vue.prototype.$session.get("isLogin");
var user_detail = Vue.prototype.$session.get("user_detail");
if(isLogin){
    axios.interceptors.request.use(function (config) {
        config.headers = {
            'Authorization': 'Bearer '+user_detail.token,
        }
        return config
    }, function (error) {
        // Do something with request error
        return Promise.reject(error)
    });
}

Vue.use(VueAxios, axios);
Vue.use(VueRouter);
Vue.config.productionTip = false;
Vue.prototype.moment = moment;
Vue.use(ElementUI, {locale});
Vue.use(Vuelidate);
Vue.use(FlashMessage);

import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)
import VuejsDialog from 'vuejs-dialog';

// Tell Vue to install the plugin.
Vue.use(VuejsDialog);

//Vue.prototype.$servername = 'https://esportsssm-dev.serverdatahost.com:5011'
Vue.prototype.$servername = 'http://localhost:5011'
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
