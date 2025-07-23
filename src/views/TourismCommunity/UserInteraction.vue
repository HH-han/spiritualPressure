<template>
  <div class="userinteraction-container">
    <!-- 头部保持不变 -->
    <div class="userinteraction-header">个人主页</div>

    <!-- 个人信息部分 -->
    <div class="userinteraction-profile-section">
      <div class="userinteraction-section-header">个人信息</div>
      <div class="userinteraction-profile-info">
        <div class="userinteraction-avatar">
          <img v-if="!userInfo.image" :src="defaultAvatar" alt="默认头像" />
          <img v-else :src="userInfo.image" alt="用户头像" />
        </div>
        <div class="userinteraction-profile-details">
          <div class="userinteraction-detail-item">
            <span class="userinteraction-detail-label">昵称：</span>
            <span class="userinteraction-detail-value">{{ userInfo.nickname }}</span>
          </div>
          <div class="userinteraction-detail-item">
            <span class="userinteraction-detail-label">签名：</span>
            <span class="userinteraction-detail-value">{{ userInfo.signature }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 旅行经历部分 -->
    <div class="userinteraction-profile-section">
      <div class="userinteraction-section-header">旅行经历</div>
      <div class="userinteraction-experience-content">
        <p>{{ userInfo.experience }}</p>
      </div>
    </div>

    <!-- 旅行照片部分 -->
    <div class="userinteraction-profile-section">
      <div class="userinteraction-section-header">我的旅行照片</div>
      <div class="userinteraction-gallery">
        <template v-if="Array.isArray(userInfo.travelmage)">
          <!-- 如果是多张图片，使用 v-for 循环渲染 -->
          <div v-for="(img, index) in userInfo.travelmage" :key="index" class="userinteraction-gallery-item">
            <img :src="img" :alt="`旅行照片 ${index + 1}`" loading="lazy">
          </div>
        </template>
        <template v-else>
          <!-- 如果是单张图片，直接渲染 -->
          <div class="userinteraction-gallery-item">
            <img :src="userInfo.travelmage" :alt="`旅行照片`" loading="lazy">
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const defaultAvatar = new URL('@/assets/defaultimage/mrtx.png', import.meta.url).href;
const router = useRouter();
// 响应式数据
const loading = ref(false);

// 用户信息
const userInfo = ref({
  signature: '',
  nickname: '',
  travelmage: '',
  experience: '',
  image: ''
});

// 原始用户信息备份
const originalUserInfo = ref({});

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    loading.value = true;
    // 检查是否有token
    const token = localStorage.getItem('token');
    if (!token) {
      ElMessage.error('请先登录');
      router.push('/login'); // 跳转到登录页
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
    } else {
      ElMessage.error(response.msg || '获取用户信息失败');
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败，请检查网络');
    console.error('获取用户信息失败:', error);
  } finally {
    loading.value = false;
  }
};

// 生命周期钩子
onMounted(() => {
  fetchUserInfo();
});
</script>
<style scoped>
.userinteraction-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.userinteraction-header {
  background: linear-gradient(135deg, #35f1f1 0%, #2e8cf1 100%);
  color: white;
  padding: 24px;
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 1px;
}

.userinteraction-profile-section {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.userinteraction-section-header {
  font-size: 20px;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.userinteraction-profile-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.userinteraction-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 36px;
  font-weight: bold;
}

.userinteraction-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.userinteraction-profile-details {
  flex: 1;
}

.userinteraction-detail-item {
  margin-bottom: 12px;
  font-size: 16px;
}

.userinteraction-detail-label {
  font-weight: 600;
  color: #666;
  margin-right: 8px;
}

.userinteraction-detail-value {
  color: #333;
}

.userinteraction-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.userinteraction-gallery-item {
  height: 150px;
  border-radius: 8px;
  background-color: #f0f0f0;
  transition: transform 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.userinteraction-gallery-item:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.userinteraction-gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.userinteraction-experience-content {
  line-height: 1.8;
  color: #555;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #6a11cb;
}
</style>