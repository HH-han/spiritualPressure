<template>
  <div class="destination-management-container">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h3>目的地管理</h3>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li 
            v-for="menu in menuItems" 
            :key="menu.id"
            :class="{ active: activeMenu === menu.id }"
            @click="setActiveMenu(menu.id)"
            class="menu-item"
          >
            <span class="menu-icon">{{ menu.icon }}</span>
            <span class="menu-text">{{ menu.name }}</span>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- 主内容区域 -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- 动态组件渲染 -->
        <component :is="activeComponent" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BasicDestinationManagement from "@/views/ManagementViews/Destinationmanagement/BasicDestinationManagement.vue";
import CityManagement from "@/views/ManagementViews/Destinationmanagement/CityManagement.vue";
import ComprehensiveQueryManagement from "@/views/ManagementViews/Destinationmanagement/ComprehensiveQueryManagement.vue";
import RegionTabManagement from "@/views/ManagementViews/Destinationmanagement/RegionTabManagement.vue";
import TravelDestinationManagement from "@/views/ManagementViews/Destinationmanagement/TravelDestinationManagement.vue";
import TravelRecommendationManagement from "@/views/ManagementViews/Destinationmanagement/TravelRecommendationManagement.vue";

// 当前激活的菜单项
const activeMenu = ref('basic');

// 菜单项配置
const menuItems = ref([
  { id: 'basic', name: '基础目的地管理', icon: '🏠', component: BasicDestinationManagement },
  { id: 'city', name: '城市管理', icon: '🏙️', component: CityManagement },
  { id: 'query', name: '综合查询管理', icon: '🔍', component: ComprehensiveQueryManagement },
  { id: 'region', name: '地区标签管理', icon: '🏷️', component: RegionTabManagement },
  { id: 'travel', name: '旅游目的地管理', icon: '🗺️', component: TravelDestinationManagement },
  { id: 'recommendation', name: '旅游推荐管理', icon: '⭐', component: TravelRecommendationManagement }
]);

// 计算当前激活的组件
const activeComponent = computed(() => {
  const menu = menuItems.value.find(item => item.id === activeMenu.value);
  return menu ? menu.component : BasicDestinationManagement;
});

// 设置激活菜单
const setActiveMenu = (menuId) => {
  activeMenu.value = menuId;
};

// 页面加载时设置默认菜单
onMounted(() => {
  console.log('目的地管理页面已加载');
});
</script>

<style scoped>
.destination-management-container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 侧边栏样式 */
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #34495e;
  text-align: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.sidebar-nav {
  flex: 1;
  padding: 10px 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.menu-item:hover {
  background-color: #34495e;
  border-left-color: #3498db;
}

.menu-item.active {
  background-color: #34495e;
  border-left-color: #3498db;
  font-weight: 600;
}

.menu-icon {
  font-size: 18px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.menu-text {
  font-size: 14px;
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.content-wrapper {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 40px);
  padding: 20px;
}

</style>
