<template>
  <div class="phone-personal-center">

    <div class="phone-profile-container">
      <!-- 用户信息卡片 -->
      <div class="phone-profile-card">
        <div class="phone-profile-header">
          <div class="phone-avatar-container">
            <img :src="userData.image" alt="用户头像" class="phone-avatar">
            <div class="phone-online-status"></div>
          </div>
          <h2 class="phone-nickname">{{ userData.nickname }}</h2>
          <p class="phone-username">@{{ userData.username }}</p>
        </div>
        
        <div class="phone-profile-body">
          <div class="phone-info-item">
            <span class="phone-icon"><i class="fas fa-envelope"></i></span>
            <span class="phone-info-text">{{ userData.email }}</span>
          </div>
          <div class="phone-info-item">
            <span class="phone-icon"><i class="fas fa-phone"></i></span>
            <span class="phone-info-text">{{ userData.phone }}</span>
          </div>
          <div class="phone-info-item">
            <span class="phone-icon"><i class="fas fa-calendar-alt"></i></span>
            <span class="phone-info-text">注册时间: {{ formatDate(userData.createTime) }}</span>
          </div>
        </div>
        
        <div class="phone-profile-footer">
          <p class="phone-signature">{{ userData.signature }}</p>
        </div>
      </div>
      
      <!-- 经验/简介卡片 -->
      <div class="phone-experience-card">
        <div class="phone-card-header">
          <h3 class="phone-card-title">个人简介</h3>
          <div class="phone-decorative-line"></div>
        </div>
        <div class="phone-card-content">
          <p class="phone-experience-text">{{ userData.experience }}</p>
        </div>
      </div>
      
      <!-- 统计信息卡片 -->
      <div class="phone-stats-card">
        <div class="phone-stat-item">
          <div class="phone-stat-value">128</div>
          <div class="phone-stat-label">文章</div>
        </div>
        <div class="phone-stat-item">
          <div class="phone-stat-value">1.2K</div>
          <div class="phone-stat-label">粉丝</div>
        </div>
        <div class="phone-stat-item">
          <div class="phone-stat-value">356</div>
          <div class="phone-stat-label">关注</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const userData = ref({});
// 获取用户信息
const fetchUserInfo = async () => {
    const localUser = JSON.parse(localStorage.getItem('user') || {});
    userData.value = { ...localUser };
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.phone-personal-center {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}
.phone-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #ff9a9e 0%, #fad0c4 100%);
  border-radius: 2px;
}

.phone-profile-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

.phone-profile-card, 
.phone-experience-card, 
.phone-stats-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.phone-profile-card:hover, 
.phone-experience-card:hover, 
.phone-stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.phone-profile-card {
  position: relative;
}

.phone-profile-header {
  padding: 30px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
}

.phone-avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
}

.phone-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.phone-online-status {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 15px;
  height: 15px;
  background-color: #4CAF50;
  border-radius: 50%;
  border: 2px solid white;
}

.phone-nickname {
  font-size: 1.8rem;
  margin-bottom: 5px;
}

.phone-username {
  font-size: 0.9rem;
  opacity: 0.8;
}

.phone-profile-body {
  padding: 25px;
}

.phone-info-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.phone-info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.phone-icon {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.phone-info-text {
  color: #555;
}

.phone-profile-footer {
  padding: 20px;
  background: #f9f9f9;
  text-align: center;
}

.phone-signature {
  font-style: italic;
  color: #666;
}

.phone-experience-card {
  padding: 25px;
}

.phone-card-header {
  margin-bottom: 20px;
}

.phone-card-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.phone-decorative-line {
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #ff9a9e 0%, #fad0c4 100%);
  border-radius: 3px;
}

.phone-card-content {
  color: #555;
  line-height: 1.6;
}

.phone-experience-text {
  color: #555;
  line-height: 1.6;
}

.phone-stats-card {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 30px 20px;
  text-align: center;
}

.phone-stat-item {
  padding: 0 15px;
}

.phone-stat-value {
  font-size: 2rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 5px;
}

.phone-stat-label {
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .phone-profile-container {
    grid-template-columns: 1fr;
  }
  
  .phone-title {
    font-size: 2rem;
  }
  
  .phone-stat-value {
    font-size: 1.5rem;
  }
}
</style>