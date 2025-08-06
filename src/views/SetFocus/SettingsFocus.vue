<template>
  <div class="setting-container">
    <!-- 左侧导航 -->
    <aside class="setting-sidebar">
      <div class="setting-brand">
        <h1>设置中心</h1>
      </div>
      <div class="setting-brand-avatar"></div>
      <nav class="setting-nav">
        <ul>
          <li v-for="tab in tabs" :key="tab.id" :class="{ active: activeTab === tab.id }" @click="handleTabClick(tab)">
            <span class="setting-icon" v-html="tab.icon"></span>
            <span>{{ tab.label }}</span>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- 右侧内容区 -->
    <main class="setting-main">
      <transition name="setting-fade" mode="out-in">
        <!-- 使用动态组件或单个根元素 -->
        <div :key="activeTab">
          <!-- 账户设置 -->
          <section v-if="activeTab === 'account'" class="setting-section">
            <h2><i class="setting-icon icon-user-cog"></i> 账户设置</h2>
            <div class="setting-card">
              <div class="setting-form-group">
                <label>用户名</label>
                <div class="setting-input-wrapper">
                  <input type="text" v-model="userInfo.username" placeholder="请输入新用户名">
                  <i class="setting-icon icon-edit"></i>
                </div>
              </div>
              <div class="setting-form-group">
                <label>电子邮箱</label>
                <div class="setting-input-wrapper">
                  <input type="email" v-model="userInfo.email" placeholder="name@example.com">
                </div>
              </div>
              <div class="setting-form-group">
                <label>输入新密码</label>
                <div class="setting-input-wrapper">
                  <input type="password" placeholder="请输入新密码">
                </div>
              </div>
              <div class="setting-form-group">
                <label>再次输入密码</label>
                <div class="setting-input-wrapper">
                  <input type="password" placeholder="请再次输入新密码">
                </div>
              </div>
              <button class="setting-btn setting-btn-primary">保存更改</button>
            </div>
          </section>

          <!-- 通知设置 -->
          <section v-else-if="activeTab === 'notifications'" class="setting-section">
            <h2><i class="setting-icon icon-bell"></i> 通知偏好</h2>
            <div class="setting-card">
              <div class="setting-switch-group">
                <div class="setting-switch-item">
                  <span>促销信息</span>
                  <label class="setting-switch">
                    <input type="checkbox" v-model="notifications.promotion">
                    <span class="setting-slider"></span>
                  </label>
                </div>
                <div class="setting-switch-item">
                  <span>行程提醒</span>
                  <label class="setting-switch">
                    <input type="checkbox" v-model="notifications.tripReminder">
                    <span class="setting-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </section>
          <section v-else-if="activeTab === 'security'" class="setting-section">
            <h2><i class="setting-icon icon-bell"></i> 安全设置</h2>
            <div class="setting-card">
              <div class="setting-switch-group">
                <div class="setting-switch-item">
                  <span>安全信息</span>
                </div>
              </div>
            </div>
          </section>
          <!-- 主题设置 -->
          <section v-else-if="activeTab === 'theme'" class="setting-section">
            <h2><i class="setting-icon icon-palette"></i> 个性化主题</h2>
            <div class="setting-card">
              <div class="setting-theme-options">
                <div v-for="theme in themes" :key="theme.id" class="setting-theme-option"
                  :style="{ backgroundColor: theme.color }" @click="selectTheme(theme)">
                  <i v-if="selectedTheme.id === theme.id" class="setting-icon icon-check"></i>
                </div>
              </div>
              <button class="setting-btn setting-btn-primary" @click="applyTheme">
                应用主题
              </button>
            </div>
          </section>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tabs = [
  { id: 'home', label: '主页', icon: homeIcon, isHome: true },
  { id: 'account', label: '账户设置', icon: usercog },
  { id: 'notifications', label: '通知偏好', icon: bell },
  { id: 'security', label: '安全设置', icon: iconlock },
  { id: 'theme', label: '个性化主题', icon: iconpalette }

]
const activeTab = ref('account')
// 处理标签点击
const handleTabClick = (tab) => {
  if (tab.isHome) {
    // 跳转到主页
    router.push('/systemhomeView')
  } else {
    activeTab.value = tab.id
  }
}
const homeIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"/>
      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"/>
    </svg>
  `;
const usercog = `
    <svg t="1743642547120" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8505">
      <path d="M748.48 302.464c0-140.8-108.8-256-249.6-262.4-140.8 0-256 108.8-262.4 249.6 0 89.6 44.8 179.2 121.6 224-166.4 57.6-281.6 217.6-275.2 396.8v32h320c19.2 0 38.4-12.8 38.4-32s-12.8-38.4-32-38.4h-256c12.8-179.2 166.4-320 345.6-320 44.8 0 89.6 6.4 134.4 25.6 19.2 6.4 38.4 0 44.8-19.2 6.4-12.8 0-32-19.2-38.4h-6.4c-6.4 0-19.2-6.4-25.6-6.4 76.8-38.4 128-121.6 121.6-211.2z m-256 185.6c-108.8 0-192-89.6-192-192 0-108.8 89.6-192 192-192s192 89.6 192 192-83.2 192-192 192z" fill="#ffffff" p-id="8506"></path>
      <path d="M940.48 750.464c-6.4-19.2-19.2-32-32-32s-25.6-12.8-25.6-25.6v-12.8c6.4-19.2 0-38.4-12.8-51.2l-51.2-25.6c-12.8-6.4-32 0-38.4 6.4-6.4 6.4-12.8 12.8-19.2 12.8-6.4 0-12.8-6.4-19.2-12.8-19.2 0-32-6.4-51.2 0l-51.2 25.6c-19.2 12.8-25.6 25.6-19.2 51.2v12.8c0 12.8-12.8 25.6-25.6 25.6s-25.6 12.8-32 25.6c-6.4 12.8-6.4 25.6-6.4 32 0 12.8 0 25.6 6.4 32 6.4 19.2 19.2 32 38.4 32 12.8 0 25.6 12.8 25.6 25.6v12.8c-6.4 19.2 0 38.4 12.8 51.2l38.4 25.6c19.2 6.4 32 0 51.2-6.4 6.4-12.8 19.2-19.2 32-12.8 6.4 0 12.8 6.4 12.8 12.8 6.4 6.4 19.2 12.8 25.6 12.8h12.8l51.2-25.6c12.8-12.8 19.2-32 12.8-51.2v-6.4c0-12.8 12.8-25.6 25.6-25.6s25.6-12.8 32-25.6c6.4-12.8 6.4-25.6 6.4-32v-51.2z m-51.2 44.8c-19.2 6.4-32 12.8-51.2 25.6-12.8 12.8-19.2 32-19.2 57.6v19.2l-19.2 12.8-6.4-6.4c-25.6-25.6-70.4-25.6-96 0l-6.4 6.4-19.2-6.4v-19.2c0-19.2-6.4-38.4-19.2-57.6-12.8-12.8-32-25.6-51.2-25.6v-25.6c19.2-6.4 32-12.8 51.2-25.6 12.8-12.8 19.2-32 19.2-57.6v-19.2l19.2-12.8 6.4 6.4c25.6 25.6 70.4 25.6 96 0l6.4-12.8 19.2 12.8v19.2c0 19.2 6.4 38.4 19.2 57.6 12.8 12.8 32 25.6 51.2 25.6v25.6z" fill="#ffffff" p-id="8507"></path>
      <path d="M742.08 705.664c-44.8 0-76.8 32-76.8 76.8s32 76.8 76.8 76.8 76.8-32 76.8-76.8-32-76.8-76.8-76.8z m0 102.4c-12.8 0-25.6-12.8-25.6-25.6s12.8-25.6 25.6-25.6 25.6 12.8 25.6 25.6c6.4 12.8-6.4 25.6-25.6 25.6z" fill="#ffffff" p-id="8508"></path>
    </svg>
`;
const bell = `
    <svg t="1743642952311" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13129">
      <path d="M861.575529 783.058824a30.117647 30.117647 0 0 1-30.117647-30.117648V378.096941C831.457882 202.541176 689.152 60.235294 513.626353 60.235294 338.070588 60.235294 195.764706 202.541176 195.764706 378.096941V752.941176a30.117647 30.117647 0 0 1-30.117647 30.117648H105.411765v60.235294h813.17647v-60.235294h-57.012706zM918.588235 722.823529a60.235294 60.235294 0 0 1 60.235294 60.235295v60.235294a60.235294 60.235294 0 0 1-60.235294 60.235294H105.411765a60.235294 60.235294 0 0 1-60.235294-60.235294v-60.235294a60.235294 60.235294 0 0 1 60.235294-60.235295h30.117647V378.096941C135.529412 169.261176 304.790588 0 513.626353 0c208.805647 0 378.066824 169.261176 378.066823 378.096941V722.823529H918.588235z m-481.882353 210.82353h180.705883a90.352941 90.352941 0 0 1-180.705883 0z" fill="#ffffff" p-id="13130"></path>
    </svg>
`;
const iconlock = `
    <svg t="1743642709789" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10859">
      <path d="M511.710974 0.199328c86.608205 0 166.937564 9.986355 239.054591 26.660179 25.384476 5.860256 47.988321 12.188934 67.562373 18.537544 11.11256 3.607845 19.235194 6.528006 24.178539 8.491391 50.988214 17.451204 89.508434 73.801353 89.508434 129.354188v459.751034c0 51.825393-30.008896 114.05573-70.253307 144.612779L589.957351 993.951239c-44.171181 33.537009-112.241841 33.61674-156.502721 0L161.660344 787.606443c-40.074982-30.427486-70.253307-92.966782-70.253307-144.612779v-459.751034c0-55.911626 38.420556-112.500968 89.737661-129.443886 4.963278-1.963385 13.016147-4.863614 23.949311-8.401693a815.808427 815.808427 0 0 1 67.57234-18.537544C344.77341 10.175717 425.102769 0.199328 511.710974 0.199328z m0 76.422522c-80.54862 0-155.147287 9.278739-221.832615 24.696793-23.191863 5.351968-43.682826 11.082661-61.223729 16.773488a408.533593 408.533593 0 0 0-15.587483 5.351968c-2.461706 0.887012-3.996535 1.484997-4.584554 1.734158-0.976709 0.38869-1.963385 0.747482-2.969994 1.056441-19.195328 6.009752-37.683041 32.988856-37.68304 57.007932v459.751034c0 28.065444 19.255127 67.96103 40.045082 83.737875l271.804253 206.344796c16.932951 12.856684 47.200973 12.826785 64.094058 0L815.577206 726.731539c20.939452-15.906409 40.045082-55.503003 40.045082-83.737875v-459.751034c0-23.690184-18.657141-50.749019-38.211261-57.177362l-2.441773-0.887011c-1.524863-0.597985-3.049725-1.176038-4.584554-1.734158-4.34536-1.594627-9.557798-3.408516-15.587484-5.351968a744.136898 744.136898 0 0 0-61.223728-16.773488c-66.725193-15.418054-141.313894-24.696793-221.862514-24.696793z m164.007436 227.732737c14.919733-14.939666 39.108239-14.959599 54.037938-0.039866 14.9297 14.919733 14.949633 39.108239 0.039866 54.037938L475.443165 613.084432c-14.8998 14.919733-39.068373 14.959599-53.998073 0.079732L293.695499 485.94279A38.2292 38.2292 0 0 1 283.489883 448.937467a38.217241 38.217241 0 0 1 27.088734-27.198365c13.255341-3.53808 27.397693 0.298993 37.035223 10.056119l100.710692 100.292102 227.393878-227.732736z m0 0" fill="#ffffff" p-id="10860"></path>
    </svg>

`;
const iconpalette = `
    <svg t="1743642803701" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="" p-id="12035">
      <path d="M710.144 375.296l168.448-168.448-61.44-61.44-168.448 168.448 61.44 61.44zM967.68 206.848c0 10.24-3.584 18.944-10.24 26.112L217.088 972.8c-6.656 6.656-16.384 10.752-26.112 10.24-9.728 0.512-18.944-3.584-26.112-10.24L51.2 858.624c-6.656-6.656-10.752-16.384-10.24-26.112 0-10.24 3.584-18.944 10.24-26.112L791.552 66.56c6.656-6.656 16.384-10.752 26.112-10.24 10.24 0 18.944 3.584 26.112 10.24L957.44 180.736c6.656 6.656 10.24 15.36 10.24 26.112zM189.952 97.28l56.32 17.408-56.32 17.408-17.408 56.32-17.408-56.32-56.32-17.408 56.32-17.408 17.408-56.32 17.408 56.32z m201.728 93.184l112.64 34.304-112.64 34.304-34.304 112.64-34.304-112.64-112.64-34.304 112.64-34.304 34.304-112.64 34.304 112.64z m535.04 274.944l56.32 17.408-56.32 17.408-17.408 56.32-17.408-56.32-56.32-17.408 56.32-17.408 17.408-56.32 17.408 56.32zM558.592 97.28l56.32 17.408-56.32 17.408-17.408 56.32-17.408-56.32-56.32-17.408 56.32-17.408 17.408-56.32 17.408 56.32z m0 0" p-id="12036" fill="#ffffff"></path>
    </svg>
`;

const userInfo = ref({
  username: '旅行者',
  email: 'user@travelgo.com'
})

const notifications = ref({
  promotion: true,
  tripReminder: true
})

const themes = [
  { id: 'blue', name: '碧海蓝天', color: '#409EFF' },
  { id: 'green', name: '森林之旅', color: '#67C23A' },
  { id: 'gold', name: '沙漠金辉', color: '#E6A23C' },
  { id: 'red', name: '落日红霞', color: '#F56C6C' },
  { id: 'purple', name: '薰衣草园', color: '#9254de' }
]

const selectedTheme = ref(themes[0])

const selectTheme = (theme) => {
  selectedTheme.value = theme
}

const applyTheme = () => {
  document.documentElement.style.setProperty('--primarysf-color', selectedTheme.value.color)
}
</script>

<style>
/* 基础样式 */
:root {
  --primarysf-color: #409EFF;
  --sidebar-width: 280px;
  --sidebar-bg: linear-gradient(145deg, #0d186d, #208bdc);
  --card-bg: rgba(255, 255, 255, 0.95);
  --text-color: #2c3e50;
  --text-light: rgba(255, 255, 255, 0.9);
  --border-radius: 12px;
  --box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

/* 布局样式 */
.setting-container {
  display: flex;
  min-height: 100vh;
}

.setting-sidebar {
  width: var(--sidebar-width);
  background: var(--sidebar-bg);
  padding: 2rem 1rem;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  color: var(--text-light);
}

.setting-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 2rem;
  font-size: 1.5rem;

}

.setting-brand-avatar {
  border-bottom: 1px solid rgba(106, 124, 133, 0.927);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.setting-nav ul {
  list-style: none;
}

.setting-nav li {
  padding: 15px 20px;
  margin: 8px 0;
  border-radius: var(--border-radius);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: var(--transition);
}

.setting-nav li:hover {
  background: rgba(255, 255, 255, 0.1);
}

.setting-nav li.active {
  background: var(--primarysf-color);
  font-weight: bold;
}

.setting-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* 卡片和表单样式 */
.setting-section {
  max-width: 800px;
  margin: 0 auto;
}

.setting-section h2 {
  color: var(--text-color);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
}

.setting-card {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
}

.setting-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.setting-form-group {
  margin-bottom: 1.5rem;
}

.setting-form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-color);
}

.setting-input-wrapper {
  position: relative;
}

.setting-input-wrapper input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
}

.setting-input-wrapper input:focus {
  border-color: var(--primarysf-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
}

.setting-input-wrapper .setting-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.setting-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.setting-icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

/* 开关样式 */
.setting-switch-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.setting-switch-item:last-child {
  border-bottom: none;
}

.setting-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.setting-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.setting-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: var(--transition);
  border-radius: 34px;
}

.setting-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: var(--transition);
  border-radius: 50%;
}

input:checked+.setting-slider {
  background-color: var(--primarysf-color);
}

input:checked+.setting-slider:before {
  transform: translateX(24px);
}

/* 主题选择器 */
.setting-theme-options {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
}

.setting-theme-option {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: var(--transition);
}

.setting-theme-option:hover {
  transform: scale(1.1);
}

/* 按钮样式 */
.setting-btn {
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.setting-btn-primary {
  background: var(--primarysf-color);
  color: white;
}

.setting-btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* 过渡动画 */
.setting-fade-enter-active,
.setting-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.setting-fade-enter-from,
.setting-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>