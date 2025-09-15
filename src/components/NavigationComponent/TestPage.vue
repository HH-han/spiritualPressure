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
      <CloseButton icon="back" @click="closethePage" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
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
import CloseButton from '@/components/PromptComponent/CloseButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
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
    return p.component === currentPage.value;
  });
  if (!page) return '未知页面';
  return page.name;
});
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

// 在onMounted中添加从路由或Pinia store恢复当前页面的逻辑
onMounted(() => {
  fetchUserInfo();
  
  // 从路由参数获取当前页面
  if (route.query.page) {
    const targetPage = pages.find(p => p.name === route.query.page);
    if (targetPage) {
      currentPage.value = targetPage.component;
      return;
    }
  }
  
  // 从Pinia store获取上次访问的页面
  if (authStore.currentComponentPath) {
    const targetPage = pages.find(p => p.name === authStore.currentComponentPath);
    if (targetPage) {
      currentPage.value = targetPage.component;
    }
  }
});

// 保留已修改的switchPage函数
const switchPage = (component) => {
  currentPage.value = component;
  // 找到对应的页面配置
  const pageConfig = pages.find(p => p.component === component);
  if (pageConfig) {
    // 保存页面名称到Pinia store
    authStore.currentComponentPath = pageConfig.name;
    // 更新路由参数
    router.replace({ 
      path: route.path, 
      query: { ...route.query, page: pageConfig.name }
    });
  }
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
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.sidebar::-webkit-scrollbar {
  width: 0;
  height: 0;

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
</style>