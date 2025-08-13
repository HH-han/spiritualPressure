<template>
  <div class="app-container">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="logo">项目导航</div>
      <nav class="nav-menu">
        <ul>
          <li v-for="(page, index) in pages" :key="index" :class="{ active: currentPage === page.component }"
            @click="switchPage(page.component)">
            <span class="nav-icon">
              <i :class="page.icon"></i>
            </span>
            <span class="nav-text">{{ page.name }}</span>
          </li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <div class="user-info">
          <img :src="userInfo.image" alt="用户头像" class="user-avatar">
          <span class="user-name">{{ userInfo.username }}当前用户</span>
        </div>
      </div>
    </aside>
    <!-- 顶部栏 -->
    <header class="header-bar">
      <div class="content-header">
        <div class="breadcrumb">当前位置：{{ currentPageName }}</div>
      </div>
    </header>
    <!-- 主内容区 -->
    <main class="main-content">
      <div class="content-container">
        <component :is="currentPage" />
      </div>
    </main>
    <!-- 返回按钮 -->
    <div class="back-home">
      <button class="Btn" @click="backhome">
        <span class="svgContainer">
          <svg t="1752997866226" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="12911" width="24" height="24">
            <path
              d="M512 0C229.160421 0 0 229.241263 0 512s229.160421 512 512 512c282.758737 0 512-229.241263 512-512S794.758737 0 512 0z m229.079579 686.295579c-13.473684 0-26.031158-3.503158-37.079579-9.566316l-2.263579 2.263579L511.919158 512l-185.263158 166.265263-1.536-1.536a75.964632 75.964632 0 0 1-103.289263-103.208421l-2.479158-2.56 12.288-11.048421c3.799579-4.257684 8.057263-8.111158 12.719158-11.425684l215.498105-193.374316h1.455158a74.213053 74.213053 0 0 1 102.992842 0h0.862316l219.297684 192.943158c4.581053 3.233684 8.757895 6.952421 12.665263 11.129263l12.988632 11.479579-2.694737 2.640842a76.045474 76.045474 0 0 1-66.344421 113.017263z"
              fill="#ffffff" p-id="12912"></path>
          </svg>
        </span>
        <span class="BG"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// 导入页面
import TestProjecthome from '@/views/TestProject/TestProjecthome.vue'
import TestProject001 from '@/views/TestProject/TestProject001.vue'
import TestProject002 from '@/views/TestProject/TestProject002.vue'
import TestProject003 from '@/views/TestProject/TestProject003.vue'
import TestProject004 from '@/views/TestProject/TestProject004.vue'
import TestProject005 from '@/views/TestProject/TestProject005.vue'
import TestProject006 from '@/views/TestProject/TestProject006.vue'
import TestProject007 from '@/views/TestProject/TestProject007.vue'
import TestProject008 from '@/views/TestProject/TestProject008.vue'
import TestProject009 from '@/views/TestProject/TestProject009.vue'
import TestProject010 from '@/views/TestProject/TestProject010.vue'
import TestProjectPage from '@/views/TestProject/TestProjectPage.vue'
import Richtext from '@/views/TestProject/Richtext.vue'
import FavoriteContent from '@/components/DisplayBox/FavoriteContent.vue';

const router = useRouter()
const route = useRoute()
// 页面配置
const pages = [
  { name: '项目主页', component: TestProjecthome, icon: 'fas fa-home' },
  { name: '项目一', component: TestProject001, icon: 'fas fa-project-diagram' },
  { name: '项目二', component: TestProject002, icon: 'fas fa-chart-line' },
  { name: '项目三', component: TestProject003, icon: 'fas fa-cogs' },
  { name: '项目四', component: TestProject004, icon: 'fas fa-database' },
  { name: '项目五', component: TestProject005, icon: 'fas fa-code' },
  { name: '项目六', component: TestProject006, icon: 'fas fa-chart-pie' },
  { name: '项目七', component: TestProject007, icon: 'fas fa-mobile-alt' },
  { name: '项目八', component: TestProject008, icon: 'fas fa-server' },
  { name: '项目九', component: TestProject009, icon: 'fas fa-cloud' },
  { name: '项目十', component: TestProject010, icon: 'fas fa-gift' },
  { name: '多语言翻译器', component: TestProjectPage, icon: 'fas fa-rocket' },
  { name: '富文本编辑器', component: Richtext, icon: 'fas fa-edit' },
  { name: '书籍阅读器', component: FavoriteContent, icon: 'fas fa-book' }

]

// 当前页面
const currentPage = ref(TestProjecthome)

// 获取当前页面名称
const currentPageName = computed(() => {
  const page = pages.find(p => {
    return p.component.__name === currentPage.value.__name;
  });
  if (!page) return '未知页面';
  return page.name;
});
// 返回主页
const backhome = () => {
  router.push('/systemhomeView')
}
// 用户信息
const userInfo = ref({
  image: '',
  username: '',
});
const loading = ref(false);
// 获取用户信息
const fetchUserInfo = async () => {
  // 先从本地存储获取，优化用户体验
  const localUser = JSON.parse(localStorage.getItem('user') || '{}');
  userInfo.value = { ...localUser };
};

// 在onMounted中添加从路由或本地存储恢复当前页面的逻辑
onMounted(() => {
  fetchUserInfo();
  
  // 从路由参数获取当前页面
  if (route.query.page) {
    const targetPage = pages.find(p => p.component.__name === route.query.page);
    if (targetPage) {
      currentPage.value = targetPage.component;
      return;
    }
  }
  
  // 从本地存储获取上次访问的页面
  const lastPage = localStorage.getItem('lastPage');
  if (lastPage) {
    const targetPage = pages.find(p => p.component.__name === lastPage);
    if (targetPage) {
      currentPage.value = targetPage.component;
    }
  }
});

// 保留已修改的switchPage函数
const switchPage = (component) => {
  currentPage.value = component;
  // 保存到本地存储
  localStorage.setItem('lastPage', component.name);
  // 更新路由参数
  router.replace({ 
    path: route.path, 
    query: { ...route.query, page: component.name }
  });
};
</script>

<style scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 应用容器 */
.app-container {
  display: flex;
  min-height: 100vh;
}

/* 侧边栏样式 */
.sidebar {
  width: 180px;
  background: #fff;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  position: fixed;
  height: 100vh;
  z-index: 100;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 1.5rem 1rem;
  font-size: 1.2rem;
  font-weight: 800;
  text-align: center;
  color: #4e73df;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.nav-menu {
  flex: 1;
  overflow-y: auto;
}

.nav-menu ul {
  list-style: none;
  padding: 0.5rem 0;
}

.nav-menu li {
  margin: 0.2rem 1rem;
  border-radius: 0.35rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-menu li:hover {
  background-color: rgba(78, 115, 223, 0.1);
}

.nav-menu li.active {
  background-color: #4e73df;
  color: #fff;
}

.nav-menu li.active .nav-icon {
  color: #fff;
}

.nav-icon {
  display: inline-block;
  width: 2.5rem;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  color: #4e73df;
  transition: all 0.3s ease;
}

.nav-text {
  font-size: 0.85rem;
  font-weight: 600;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin-right: 0.75rem;
  object-fit: cover;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 600;
}

/* 主内容区样式 */
.main-content {
  flex: 1;
  margin-left: 180px;
  padding: 1rem;
  min-height: 100vh;
  margin-top: 80px;
}

.content-container {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  padding: 1rem;
  min-height: calc(100vh - 8rem);
}

.header-bar {
  position: fixed;
  background: #ffffff;
  color: #000;
  display: flex;
  width: 100%;
  height: 80px;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.content-header {
  width: 100%;
  padding: 24px 26px;
  font-size: 1.2rem;
  font-weight: 800;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: flex-end;
}

.content-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.breadcrumb {
  font-size: 0.85rem;
  color: #777;
}

/* 返回按钮样式 */
.back-home {
  position: fixed;
  top: 100px;
  left: 200px;
  z-index: 1000;
}

/* From Uiverse.io by vinodjangid07 */
.Btn {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  position: relative;
  /* overflow: hidden; */
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.3s;
}

.svgContainer {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  backdrop-filter: blur(0px);
  letter-spacing: 0.8px;
  border-radius: 10px;
  transition: all 0.3s;
  border: 1px solid rgba(156, 156, 156, 0.466);
}

.BG {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  background: #f48024;
  z-index: -1;
  border-radius: 10px;
  pointer-events: none;
  transition: all 0.3s;
}

.Btn:hover .BG {
  transform: rotate(35deg);
  transform-origin: bottom;
}

.Btn:hover .svgContainer {
  background-color: rgba(202, 202, 202, 0.466);
  backdrop-filter: blur(4px);
}
</style>