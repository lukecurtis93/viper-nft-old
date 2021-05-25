import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  async created() {
    await this.$store.dispatch('initEthereum')
    // Ethereum successfully initialised
    await this.$store.dispatch('initVipers')

  },
  render: h => h(App)
}).$mount('#app')
