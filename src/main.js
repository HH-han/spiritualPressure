// main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import '@/css/Block/block.css';


const app = createApp(App);

// 使用 Pinia 状态管理
app.use(createPinia());
// 使用 Vue Router
app.use(router);
// 使用 Element Plus 并设置语言为中文
app.use(ElementPlus, {
  locale: zhCn
});

// 挂载应用
app.mount('#app');