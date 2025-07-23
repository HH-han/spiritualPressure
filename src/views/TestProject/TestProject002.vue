<template>
  <div class="admin-settings-container">
    <aside class="admin-sidebar">
      <div class="admin-logo">
        <div>
            <span>项目导航</span>
        </div>
        <div>
            <button @click="$emit('close')">关闭</button>
        </div>
      </div>
      <nav class="admin-nav-menu">
        <ul>
          <li v-for="(page, index) in pages" :key="index" :class="{ 'admin-active': currentPage === page.component }"
            @click="switchPage(page.component)">
            <span class="admin-nav-icon">
              <i :class="page.icon"></i>
            </span>
            <span class="admin-nav-text">{{ page.name }}</span>
          </li>
        </ul>
      </nav>
      <div class="admin-sidebar-footer">
        <div class="admin-user-info">
          <img :src="userInfo.image" alt="用户头像" class="admin-user-avatar">
          <span class="admin-user-name">{{ userInfo.username }}当前用户</span>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 关闭
const emit = defineEmits(['close']);
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

onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>

/* 侧边栏样式 */
.admin-sidebar {
  width: 250px;
  background: #fff;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  height: 100vh;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border-right: 2px solid rgba(0, 0, 0, 0.1);
}

.admin-logo {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  font-size: 1.2rem;
  font-weight: 800;
  text-align: center;
  color: #4e73df;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.admin-nav-menu {
  flex: 1;
  overflow-y: auto;
}

.admin-nav-menu ul {
  list-style: none;
  padding: 0.5rem 0;
}

.admin-nav-menu li {
  margin: 0.2rem 1rem;
  border-radius: 0.35rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.admin-nav-menu li:hover {
  background-color: rgba(78, 115, 223, 0.1);
}

.admin-nav-menu li.admin-active {
  background-color: #4e73df;
  color: #fff;
}

.admin-nav-menu li.admin-active .admin-nav-icon {
  color: #fff;
}

.admin-nav-icon {
  display: inline-block;
  width: 2.5rem;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  color: #4e73df;
  transition: all 0.3s ease;
}

.admin-nav-text {
  font-size: 0.85rem;
  font-weight: 600;
}

.admin-sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.admin-user-info {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.admin-user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin-right: 0.75rem;
  object-fit: cover;
}

.admin-user-name {
  font-size: 0.85rem;
  font-weight: 600;
}
</style>