import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'

// Plugins
import './config/bootstrap-vue'
import './config/fontawesome'
import './config/sidebar-menu'
import './config/loading'
import './config/vee-validate'
import './config/vue-select'
import './config/select2-component'

// -------------------------------

// Router
import router from './router'

// Vuex Store
import store from './store'

// App
import App from './App.vue'

// Style
import './assets/scss/app.scss'
import '@/assets/css/main.css'

Vue.config.productionTip = false

export const bus = new Vue();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
