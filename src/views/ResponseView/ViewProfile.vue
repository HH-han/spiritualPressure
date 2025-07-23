<template>
  <header>
    <Header />
  </header>
  <main>
    <div class="accountsettings-background">
      <img src="@/assets/scenery/风景2.webp" alt="background" />
    </div>
    <div class="navigationbar-container">
      <div class="navigationbar-header">
        <div class="navigationbar-avatar">
          <img v-if="!userInfo.image" :src="defaultAvatar" alt="默认头像" class="navigationbar-avatar-img">
          <img v-else :src="userInfo.image" alt="用户头像" class="navigationbar-avatar-img" />
          <div class="navigationbar-avatar-ring"></div>
        </div>
        <h2 class="navigationbar-username">{{ userInfo.nickname }}</h2>
      </div>

      <nav class="navigationbar-menu">
        <router-link v-for="item in menuItems" :key="item.id" :to="item.path" class="navigationbar-item"
          :class="{ 'navigationbar-item-active': activeItem === item.id }" @click="setActiveItem(item.id)">
          <i :class="['navigationbar-icon', item.icon]"></i>
          <span class="navigationbar-text">{{ item.text }}</span>
          <span class="navigationbar-badge" v-if="item.badge">{{ item.badge }}</span>
          <div class="navigationbar-indicator"></div>
        </router-link>
      </nav>
      <div class="navigationbar-footer" v-if="userInfo.id == null">
        <button class="navigationbar-logout" @click="handleLogin">
          <i class="navigationbar-icon fas fa-sign-out-alt"></i>
          <span>登录</span>
        </button>
      </div>
    </div>
  </main>
  <footer>
    <Footer />
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/ResponseComponent/NavigationHeader.vue'
import Footer from '@/components/ResponseComponent/NavigationFooter.vue'
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

const defaultAvatar = new URL('../../assets/defaultimage/mrtx.png', import.meta.url).href
const router = useRouter()
// 获取用户数据
const fetchUserInfo = async () => {
  try {
    loading.value = true;
    // 检查是否有token
    const token = localStorage.getItem('token');
    if (!token) {
      ElMessage.warning('请先登录');
      return;
    }

    // 先从本地存储获取，优化用户体验
    const localUser = JSON.parse(localStorage.getItem('user') || {});
    userInfo.value = { ...localUser };

    //从服务器获取最新数据
    const response = await request.get('/api/public/user/info');

    if (response.code === '0') {
      userInfo.value = response.data;
      originalUserInfo.value = { ...response.data };
      localStorage.setItem('user', JSON.stringify(response.data));
    }
  } finally {
    loading.value = false;
  }
};
const loading = ref(false);
// 用户信息
const userInfo = ref({
  nickname: '',
  signature: '',
  image: ''
});
// 原始用户信息备份
const originalUserInfo = ref({});
// 菜单项
const menuItems = computed(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    return [
      { id: 5, text: '设置', icon: 'fas fa-cog', path: '/setting', badge: '' },
      { id: 6, text: '帮助中心', icon: 'fas fa-question-circle', path: '/helpcenter', badge: '' }
    ];
  }
  return [
    { id: 1, text: '个人资料', icon: 'fas fa-user-edit', path: '/personaldata', badge: '' },
    { id: 2, text: '我的订单', icon: 'fas fa-clipboard-list', path: '/orders', badge: '3' },
    { id: 3, text: '收藏夹', icon: 'fas fa-heart', path: '/favorites', badge: '' },
    { id: 4, text: '消息中心', icon: 'fas fa-envelope', path: '/messagecenter', badge: '12' },
    { id: 5, text: '设置', icon: 'fas fa-cog', path: '/setting', badge: '' },
    { id: 6, text: '帮助中心', icon: 'fas fa-question-circle', path: '/helpcenter', badge: '' }
  ];
})

// 设置激活项
const setActiveItem = (id) => {
  activeItem.value = id
}
// 登录
const handleLogin = () => {
  console.log('用户登录')
  router.push('/login')
}
// 生命周期钩子
onMounted(
  fetchUserInfo
);
</script>

<style scoped>
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

/* 基础样式 */
.navigationbar-container {
  height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 5px 0 30px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  padding: 40px 0px 70px 0px;
}

/* 头部样式 */
.navigationbar-header {
  padding: 40px 20px 30px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.navigationbar-avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto 15px;
  position: relative;
}

.navigationbar-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.navigationbar-avatar-ring {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px solid transparent;
  border-radius: 50%;
  background: linear-gradient(45deg, #6473ff, #ff64c8) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  animation: rotate 8s linear infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

.navigationbar-username {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: linear-gradient(45deg, #fff, #a5b4fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.navigationbar-userdesc {
  margin: 5px 0 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 300;
}

/* 菜单项样式 */
.navigationbar-menu {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.navigationbar-item {
  display: flex;
  align-items: center;
  padding: 15px 25px;
  margin: 5px 10px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background-color: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  border: 2px solid #b2b2b2;
}

.navigationbar-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(100, 115, 255, 0.2), rgba(255, 100, 200, 0.2));
  transition: all 0.4s ease;
}

.navigationbar-item:hover {
  color: white;
  transform: translateX(5px);
}

.navigationbar-item:hover::before {
  left: 0;
}

.navigationbar-item-active {
  background: rgba(100, 115, 255, 0.15);
  color: white;
  box-shadow: inset 3px 0 0 #6473ff;
}

.navigationbar-item-active .navigationbar-text {
  font-weight: 500;
}

.navigationbar-item-active .navigationbar-icon {
  color: #6473ff;
  text-shadow: 0 0 10px rgba(100, 115, 255, 0.5);
}

.navigationbar-icon {
  font-size: 1.1rem;
  width: 25px;
  margin-right: 15px;
  transition: all 0.3s ease;
}

.navigationbar-text {
  flex: 1;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.navigationbar-badge {
  background: #ff4757;
  color: white;
  font-size: 0.7rem;
  padding: 3px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.navigationbar-indicator {
  position: absolute;
  right: 20px;
  width: 8px;
  height: 8px;
  background: #6473ff;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px #6473ff;
}

.navigationbar-item-active .navigationbar-indicator {
  opacity: 1;
  transform: scale(1.2);
}

/* 底部样式 */
.navigationbar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.navigationbar-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.navigationbar-logout:hover {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
}

.navigationbar-logout .navigationbar-icon {
  margin-right: 10px;
}

/* 背景装饰元素 */
.navigationbar-container::after {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(100, 115, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.navigationbar-container::before {
  content: '';
  position: absolute;
  bottom: -80px;
  left: -80px;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(255, 100, 200, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}
</style>