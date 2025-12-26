import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import App from './App.vue';
import router from './router';
import './assets/styles/global/tailwind.css';
import './assets/styles/global/transitions.css';

// 引入 Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far);

// 引入状态管理初始化函数
import { initializeStores } from './stores';

// 创建应用实例
const app = createApp(App);

// 注册全局组件
app.component('font-awesome-icon', FontAwesomeIcon);

// 注册虚拟滚动组件
app.use(VueVirtualScroller);

// 使用 Pinia 状态管理
const pinia = createPinia();
// 配置持久化插件
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

// 使用路由
app.use(router);

// 初始化状态管理
// 注意：这里使用异步初始化，确保所有store数据准备就绪
initializeStores().catch(error => {
  console.error('初始化状态管理失败:', error);
});

// 挂载应用
app.mount('#app');
