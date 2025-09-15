<template>
  <div class="section-container-background">
    <div class="settings-container">
      <div class="sidebar">
        <div class="logo">
          <h1><i class="fas fa-cog"></i> 设置中心</h1>
        </div>
        <div class="nav-items">
          <div class="nav-item" :class="{ active: activeTab === 'general' }" @click="activeTab = 'general'">
            <i class="fas fa-sliders-h"></i>
            <span>通用设置</span>
          </div>
          <div class="nav-item" :class="{ active: activeTab === 'notifications' }" @click="activeTab = 'notifications'">
            <i class="fas fa-bell"></i>
            <span>通知</span>
          </div>
          <div class="nav-item" :class="{ active: activeTab === 'privacy' }" @click="activeTab = 'privacy'">
            <i class="fas fa-lock"></i>
            <span>隐私与安全</span>
          </div>
          <div class="nav-item" :class="{ active: activeTab === 'appearance' }" @click="activeTab = 'appearance'">
            <i class="fas fa-palette"></i>
            <span>外观</span>
          </div>
          <div class="nav-item" :class="{ active: activeTab === 'language' }" @click="activeTab = 'language'">
            <i class="fas fa-globe"></i>
            <span>语言与地区</span>
          </div>
          <div class="nav-item" :class="{ active: activeTab === 'account' }" @click="activeTab = 'account'">
            <i class="fas fa-user-shield"></i>
            <span>账户安全</span>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="header">
          <h2>{{
            activeTab === 'general' ? '通用设置' :
              activeTab === 'notifications' ? '通知设置' :
                activeTab === 'privacy' ? '隐私与安全' :
                  activeTab === 'appearance' ? '外观设置' :
                    activeTab === 'language' ? '语言与地区' :
                      activeTab === 'account' ? '账户安全' : '设置'
          }}</h2>
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="搜索设置..." v-model="searchQuery">
          </div>
        </div>

        <!-- 通用设置 -->
        <div v-if="activeTab === 'general'" class="settings-section">
          <div class="section-header">
            <i class="fas fa-cog"></i>
            <h3>常规设置</h3>
          </div>
          <div class="settings-grid">
            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-title">自动更新</div>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="autoUpdate">
                  <span class="slider"></span>
                </label>
              </div>
              <div class="setting-desc">
                启用后，系统将在后台自动下载并安装更新
              </div>
            </div>

            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-title">性能模式</div>
                <label class="toggle-switch">
                  <input type="checkbox" checked>
                  <span class="slider"></span>
                </label>
              </div>
              <div class="setting-desc">
                提升系统性能，但可能会增加电量消耗
              </div>
            </div>

            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-title">数据备份</div>
              </div>
              <div class="setting-desc">
                上次备份: 2023-10-15 14:30
              </div>
              <div class="button-group">
                <button class="btn btn-primary">立即备份</button>
                <button class="btn btn-secondary">恢复备份</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 通知设置 -->
        <div v-if="activeTab === 'notifications'" class="settings-section">
          <div class="section-header">
            <i class="fas fa-bell"></i>
            <h3>通知偏好</h3>
          </div>
          <div class="settings-grid">
            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-title">邮件通知</div>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="emailNotifications">
                  <span class="slider"></span>
                </label>
              </div>
              <div class="setting-desc">
                接收重要更新和公告的邮件通知
              </div>
            </div>

            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-title">推送通知</div>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="pushNotifications">
                  <span class="slider"></span>
                </label>
              </div>
              <div class="setting-desc">
                在您的设备上接收推送通知
              </div>
            </div>

            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-title">通知声音</div>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="notificationSound">
                  <span class="slider"></span>
                </label>
              </div>
              <div class="setting-desc">
                播放通知声音提醒
              </div>
            </div>

            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-title">通知音量</div>
              </div>
              <div class="setting-desc">
                调整通知音量的强度
              </div>
              <div class="slider-container">
                <input type="range" min="0" max="100" v-model="notificationVolume">
                <div class="slider-value">{{ notificationVolume }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 隐私与安全 -->
        <div v-if="activeTab === 'privacy'" class="settings-section">
          <div class="section-header">
            <i class="fas fa-lock"></i>
            <h3>隐私设置</h3>
          </div>
          <div class="settings-grid">
            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-title">个人资料可见性</div>
              </div>
              <div class="setting-desc">
                谁可以查看您的个人资料
              </div>
              <select v-model="profileVisibility">
                <option value="public">公开</option>
                <option value="friends">仅好友</option>
                <option value="private">私密</option>
              </select>
            </div>

            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-title">数据分享</div>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="dataSharing">
                  <span class="slider"></span>
                </label>
              </div>
              <div class="setting-desc">
                允许我们匿名收集使用数据以改进产品
              </div>
            </div>

            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-title">个性化广告</div>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="personalizedAds">
                  <span class="slider"></span>
                </label>
              </div>
              <div class="setting-desc">
                根据您的兴趣显示相关广告
              </div>
            </div>
          </div>
        </div>

        <!-- 外观设置 -->
        <div v-if="activeTab === 'appearance'" class="settings-section">
          <div class="section-header">
            <i class="fas fa-palette"></i>
            <h3>主题与外观</h3>
          </div>
          <div class="settings-grid">
            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-title">主题模式</div>
              </div>
              <div class="setting-desc">
                选择浅色或深色主题
              </div>
              <select v-model="theme">
                <option value="light">浅色模式</option>
                <option value="dark">深色模式</option>
                <option value="auto">跟随系统</option>
              </select>
            </div>

            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-title">强调色</div>
              </div>
              <div class="setting-desc">
                选择您喜欢的主题颜色
              </div>
              <div class="color-picker">
                <div v-for="(color, index) in colorOptions" :key="index" class="color-option"
                  :class="{ active: accentColor === color }" :style="{ backgroundColor: color }"
                  @click="accentColor = color"></div>
              </div>
            </div>

            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-title">字体大小</div>
              </div>
              <div class="setting-desc">
                调整界面字体大小
              </div>
              <div class="slider-container">
                <input type="range" min="12" max="24" v-model="fontSize">
                <div class="slider-value">{{ fontSize }}px</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="settings-section">
          <div class="button-group">
            <button class="btn btn-primary" @click="saveSettings">
              <i class="fas fa-save"></i> 保存更改
            </button>
            <button class="btn btn-secondary" @click="resetSettings">
              <i class="fas fa-undo"></i> 恢复默认
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 关闭按钮 -->
  <div class="settings-close-button">
    <CloseButton />
  </div>
</template>

<script setup>
import { ref, createApp } from 'vue'
import CloseButton from '@/components/PromptComponent/CloseButton.vue'

const activeTab = ref('general');
const searchQuery = ref('');

// 通知设置
const emailNotifications = ref(true);
const pushNotifications = ref(false);
const notificationSound = ref(true);
const notificationVolume = ref(80);

// 隐私设置
const profileVisibility = ref('public');
const dataSharing = ref(false);
const personalizedAds = ref(true);

// 主题设置
const theme = ref('light');
const accentColor = ref('#667eea');
const fontSize = ref(16);

// 语言设置
const language = ref('zh-CN');
const timezone = ref('Asia/Shanghai');

// 账户设置
const twoFactorAuth = ref(false);
const autoUpdate = ref(true);

const colorOptions = ref([
  '#667eea', '#764ba2', '#f093fb', '#f5576c',
  '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
]);

const saveSettings = () => {
  console.log('设置已保存');
  // 这里可以添加保存设置的逻辑
};

const resetSettings = () => {
  console.log('设置已重置');
  // 这里可以添加重置设置的逻辑
};
</script>

<style scoped>
.section-container-background{
  width: 100%;
  height: 100vh;
  background: url('@/assets/scenery/风景3.webp');
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.settings-container {
  width: 95%;
  max-width: 1200px;
  height: 90vh;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  overflow: hidden;
  display: flex;
}

.sidebar {
  width: 260px;
  background: rgba(255, 255, 255, 0.1);
  padding: 25px 0;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 0 25px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
}

.logo h1 {
  color: white;
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo i {
  background: linear-gradient(135deg, #ff6fd8 0%, #3813c2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-item {
  padding: 12px 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: linear-gradient(to bottom, #ff6fd8, #3813c2);
}

.content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h2 {
  color: white;
  font-size: 28px;
  font-weight: 600;
}

.search-box {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 300px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.search-box input {
  background: transparent;
  border: none;
  outline: none;
  color: white;
  width: 100%;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.settings-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 25px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  color: white;
}

.section-header i {
  font-size: 20px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.setting-card {
  background: rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 15px;
  transition: transform 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.12);
}

.setting-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.setting-title {
  color: white;
  font-weight: 500;
}

.setting-desc {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-bottom: 15px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.3);
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked+.slider {
  background: linear-gradient(135deg, #ff6fd8 0%, #3813c2 100%);
}

input:checked+.slider:before {
  transform: translateX(26px);
}

select,
input[type="text"],
input[type="number"] {
  width: 100%;
  padding: 10px 15px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  outline: none;
}

select option {
  background: rgba(0, 0, 0, 0.8);
  color: white;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #ff6fd8 0%, #3813c2 100%);
  color: white;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.slider-container {
  margin-top: 10px;
}

.slider-value {
  color: white;
  text-align: right;
  font-size: 14px;
}

input[type="range"] {
  width: 100%;
  height: 5px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ff6fd8;
  cursor: pointer;
}

.color-picker {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
}

.color-option.active {
  border-color: white;
}

.settings-close-button{
  position: absolute;
  top: 30px;
  left: 40px;
}
/* 响应式设计 */
@media (max-width: 900px) {
  .settings-container {
    flex-direction: column;
    height: auto;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 15px;
  }

  .logo {
    padding: 0 0 15px;
    margin-bottom: 15px;
  }

  .nav-items {
    display: flex;
    flex-direction: column;
    overflow-x: auto;
    gap: 5px;
    padding-bottom: 5px;
  }

  .nav-item {
    padding: 10px 15px;
    border-radius: 8px;
    white-space: nowrap;
  }

  .content {
    padding: 20px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .search-box {
    width: 100%;
  }
}
</style>