import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuex from 'vuex';

require('@/assets/main.scss');
import Vuelidate from 'vuelidate'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import vmodal from 'vue-js-modal'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)
Vue.use(vmodal)
Vue.use(Vuelidate)
Vue.config.productionTip = false;
Vue.use(Vuex)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
