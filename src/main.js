import Vue from 'vue'
import Ionic from '@ionic/vue'

import App from './App.vue'
import router from './router'
import store from './store'
import '@/misc/register-service-worker'
import '@/misc/handle-network-status'
import '@/firebase/init'
import '@/firebase/authentication'
import '@/misc/handle-apple-install-prompt'
import 'pwacompat'

Vue.use(Ionic)

Vue.config.productionTip = false
// Vue.config.ignoredElements = [/^ion-/]

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

console.log('🍱 This app was bootstrapped with bento-starter 🍱')
