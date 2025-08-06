<template>
  <div class="personalcenter-container">
    <!-- 侧边栏 -->
    <div class="personalcenter-sidebar">
      <div class="personalcenter-sidebar-header">
        <div class="personalcenter-sidebar-title">个人中心</div>
      </div>
      <div class="personalcenter-sidebar-menu-gap">
        <div 
          v-for="personalcenter in personalcenters" 
          :key="personalcenter.id"
          class="personalcenter-menu-item"
          :class="{ 
            active: activeMenu === personalcenter.id,
            'has-submenu': personalcenter.subItems
          }"
          @click="toggleSubMenu(personalcenter)"
        >
          {{ personalcenter.title }}
          <span 
            v-if="personalcenter.subItems" 
            class="submenu-arrow"
            :class="{ 'submenu-arrow-open': showSubMenu === personalcenter.id }"
          >
            ▼
          </span>
          
          <!-- 二级菜单 -->
          <div 
            v-if="personalcenter.subItems && showSubMenu === personalcenter.id"
            class="submenu"
          >
            <div
              v-for="subItem in personalcenter.subItems"
              :key="subItem.id"
              class="submenu-item"
              :class="{ 'active': activeSubMenu === subItem.id }"
              @click.stop="changeSubMenu(subItem)"
            >
              {{ subItem.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 主内容区 -->
    <main class="personalcenter-main">
      <!-- 固定背景层 -->
      <div class="accountsettings-background">
        <img src="@/assets/scenery/风景2.webp" alt="background" />
      </div>
      
      <!-- 可滚动内容区域 -->
      <div class="accountsettings-content">
        <component 
          :is="activeComponent" 
          v-if="activeComponent" 
          class="accountsettings-component"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, shallowRef, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MyRelease from '@/views/MyCenter/MyRelease.vue';
import MessageNotification from '@/views/MyCenter/MessageNotification.vue';
import ChangePassword from '@/views/MyCenter/ChangePassword.vue';
import PersonalCenter from '@/views/MyCenter/PersonalCenter.vue';
import MyOrder from '@/views/MyCenter/MyOrder.vue';
import DeleteOrder from '@/views/MyCenter/DeleteOrder.vue';
import PersonalPosts from '@/views/MyCenter/PersonalPosts.vue';
import PersonalNotes from '@/views/MyCenter/PersonalNotes.vue';


const router = useRouter();
const DEFAULT_PERSONALCENTER_ID = 'personal';
const activeMenu = ref(localStorage.getItem('activeMenu') || 2);
const showSubMenu = ref(null);
const activeSubMenu = ref(null);

const personalcenters = reactive([
  { id: 'home', title: '返回首页', component: null, ishome: true },
  { id: 'personal', title: '个人中心', component: PersonalCenter },
  { id: 'password', title: '修改密码', component: ChangePassword },
  { 
    id: 'orders', 
    title: '我的购物车',
    subItems: [
      { id: 'shopping-cart', title: '购物车', component: MyOrder },
      { id: 'order-history', title: '订单历史', component: DeleteOrder }
    ]
  },
  { id: 'messages', title: '消息通知', component: MessageNotification },
  { id: 'posts', title: '我的发布', component: MyRelease },
  { id: 'postsdelete', title: '发布管理', component: PersonalPosts },
  { id: 'note', title: '我的笔记', component: PersonalNotes }
]);

const activeComponent = shallowRef(PersonalCenter);

const toggleSubMenu = (personalcenter) => {
  if (!personalcenter?.id) return;
  
  if (personalcenter.ishome) {
    localStorage.removeItem('activeMenu');
    router.push({ name: 'systemhomeView' });
    return;
  }
  
  if (personalcenter.subItems) {
    showSubMenu.value = showSubMenu.value === personalcenter.id ? null : personalcenter.id;
    // 如果没有子菜单被选中，默认选中第一个
    if (showSubMenu.value && !activeSubMenu.value) {
      changeSubMenu(personalcenter.subItems[0]);
    }
  } else {
    showSubMenu.value = null;
    activeMenu.value = personalcenter.id;
    localStorage.setItem('activeMenu', personalcenter.id);
    activeComponent.value = personalcenter.component;
  }
};

const changeSubMenu = (subItem) => {
  activeSubMenu.value = subItem.id;
  activeMenu.value = subItem.id;
  localStorage.setItem('activeMenu', subItem.id);
  activeComponent.value = subItem.component;
};

onMounted(() => {
  const savedMenuId = localStorage.getItem('activeMenu') || DEFAULT_PERSONALCENTER_ID;
  
  // 检查是否是子菜单项
  let selectedItem = null;
  for (const item of personalcenters) {
    if (item.subItems) {
      const subItem = item.subItems.find(s => s.id === savedMenuId);
      if (subItem) {
        selectedItem = subItem;
        showSubMenu.value = item.id;
        break;
      }
    } else if (item.id === savedMenuId) {
      selectedItem = item;
      break;
    }
  }
  
  // 如果没有找到匹配的，使用默认
  if (!selectedItem) {
    selectedItem = personalcenters.find(p => p.id === DEFAULT_PERSONALCENTER_ID);
  }
  
  if (selectedItem) {
    activeMenu.value = selectedItem.id;
    activeComponent.value = selectedItem.component;
    
    // 如果是子菜单项，设置activeSubMenu
    if (selectedItem.id !== DEFAULT_PERSONALCENTER_ID) {
      const parentItem = personalcenters.find(p => 
        p.subItems && p.subItems.some(s => s.id === selectedItem.id)
      );
      if (parentItem) {
        showSubMenu.value = parentItem.id;
        activeSubMenu.value = selectedItem.id;
      }
    }
  }
});
</script>

<style scoped>
/* 基础重置样式 */
.personalcenter-reset {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
}

/* 主容器 - 添加渐变背景 */
.personalcenter-container {
  display: flex;
  min-height: 100vh;
}
/* 玻璃拟态侧边栏 */
.personalcenter-sidebar {
  width: 260px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 2rem 1.5rem;
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  color: #2a2a72;
  position: fixed;
  height: 100vh;
  z-index: 10;
}

.personalcenter-sidebar-header {
  padding: 1rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
}

.personalcenter-sidebar-title {
  font-size: 1.6rem;
  font-weight: 700;
  text-align: center;
  color: #2a2a72;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.3);
}

/* 玻璃拟态菜单项 */
.personalcenter-sidebar-menu-gap {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.personalcenter-menu-item {
  padding: 0.9rem 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.personalcenter-menu-item:hover {
  background: rgba(255, 255, 255, 0.45);
  transform: translateY(-2px);
}

.personalcenter-menu-item.active {
  background: rgba(100, 149, 237, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 
    0 4px 16px rgba(100, 149, 237, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.has-submenu {
  position: relative;
}

.submenu-arrow {
  position: absolute;
  right: 1.5rem;
  top: 1.1rem;
  font-size: 0.7rem;
  transition: all 0.3s ease;
  color: #4a4a8a;
}

.submenu-arrow-open {
  transform: rotate(180deg);
}

/* 玻璃拟态子菜单 */
.submenu {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.submenu-item {
  padding: 0.8rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 0.9rem;
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.4);
}

.submenu-item.active {
  background: rgba(100, 149, 237, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-weight: 500;
}
/* 主容器 */
.personalcenter-main {
  position: relative;
  flex: 1;
  margin-left: 260px;
  min-height: 100vh;
  overflow: hidden; /* 防止背景溢出 */
}

/* 固定背景层 */
.accountsettings-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.accountsettings-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(10px);
}

/* 内容区域 - 玻璃拟态效果 */
.accountsettings-content {
  position: relative;
  z-index: 1;
  padding: 2.5rem;
  min-height: 100vh;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 
    inset 4px 0 8px -4px rgba(255, 255, 255, 0.6),
    0 0 24px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.8s ease-out;
}

/* 动态组件容器 */
.accountsettings-component {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .personalcenter-container {
    flex-direction: column;
  }
  
  .personalcenter-sidebar {
    width: 100%;
    height: auto;
    position: relative;
    padding: 1.5rem;
    backdrop-filter: blur(12px);
  }
  
  .personalcenter-sidebar-menu-gap {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 1rem;
    gap: 0.5rem;
  }
  
  .personalcenter-menu-item {
    white-space: nowrap;
    min-width: 120px;
    padding: 0.8rem 1rem;
  }
  
  .personalcenter-main {
    margin-left: 0;
    padding: 1.8rem;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
  }
  
  .submenu {
    position: absolute;
    width: auto;
    min-width: 180px;
    z-index: 20;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
}
</style>