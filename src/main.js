import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueFirestore from 'vue-firestore';
import vuetify from './plugins/vuetify';
import JsonExcel from 'vue-json-excel'
import "./plugins/vuetify-mask.js";

Vue.component('downloadExcel', JsonExcel)

Vue.config.productionTip = false

Vue.use(VueFirestore);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')