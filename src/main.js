import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/global/tailwind.css'
import './assets/styles/global/transitions.css'

// 引入 Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
library.add(fas, far)

// 创建应用实例
const app = createApp(App)

// 注册全局组件
app.component('font-awesome-icon', FontAwesomeIcon)

// 使用 Pinia 状态管理
const pinia = createPinia()
app.use(pinia)

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')
