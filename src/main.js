import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入axios
import axios from 'axios'

Vue.config.productionTip = false// 阻止启动生产消息
Vue.prototype.$http = axios// 将axios挂载到Vue实例中的$http属性上
axios.defaults.baseURL = 'http://localhost:3000'// 设置默认请求的基础URL

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
