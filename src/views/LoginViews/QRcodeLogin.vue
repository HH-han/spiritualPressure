<template>
  <div class="QRCode-container">
    <div class="QRCode-card">
      <form class="QRCode-form">
        <h1 class="QRCode-title">扫码登录</h1>

        <!-- 二维码区域 -->
        <div class="QRCode-display">
          <div class="QRCode-wrapper" :class="{ 'QRCode-pulse': refreshing }">
            <transition name="QRCode-fade" mode="out-in">
              <img :key="currentPlatform" :src="qrCodeImage" alt="QR Code" class="QRCode-image" />
            </transition>
            <div class="QRCode-refresh" @click="refreshQRCode" v-if="!refreshing">
              <svg viewBox="0 0 24 24">
                <path
                  d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
              </svg>
            </div>
            <div class="QRCode-loading" v-if="refreshing">
              <div class="QRCode-spinner"></div>
            </div>
          </div>
          <p class="QRCode-hint">使用{{ platformNames[currentPlatform] }}扫描二维码登录</p>
        </div>

        <!-- 平台选择 -->
        <div class="QRCode-platforms">
          <button v-for="platform in platforms" :key="platform" @click="generateQRCode(platform)" :class="{
            'QRCode-platform-btn': true,
            'QRCode-platform-active': currentPlatform === platform
          }">
            <img :src="platformIcons[platform]" :alt="platformNames[platform]" class="QRCode-platform-icon" />
            <span class="QRCode-platform-name">{{ platformNames[platform] }}</span>
          </button>
        </div>

        <!-- 返回按钮 -->
        <button class="QRCode-back-btn" @click.prevent="navigateToLoginName">
          <svg viewBox="0 0 24 24" class="QRCode-back-icon">
            <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
          </svg>
          返回账号密码登录
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 平台数据
const platforms = ['wechat', 'qq', 'alipay']
const platformIcons = {
  wechat: new URL('@/assets/social/WX.webp', import.meta.url).href,
  qq: new URL('@/assets/social/QQ.png', import.meta.url).href,
  alipay: new URL('@/assets/social/ZFB.png', import.meta.url).href
}
const platformNames = {
  wechat: '微信',
  qq: 'QQ',
  alipay: '支付宝'
}

// 状态
const currentPlatform = ref('wechat')
const qrCodeImage = ref('')
const refreshing = ref(false)

// 生成二维码
const generateQRCode = (platform) => {
  currentPlatform.value = platform
  refreshQRCode()
}

// 刷新二维码
const refreshQRCode = () => {
  refreshing.value = true
  // 模拟API请求延迟
  setTimeout(() => {
    // 这里应该是实际获取二维码的API调用
    // 模拟不同平台的二维码图片
    qrCodeImage.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      `${platformNames[currentPlatform.value]}登录:${Date.now()}`
    )}`
    refreshing.value = false
  }, 800)
}

// 返回账号密码登录
const navigateToLoginName = () => {
  router.push('/login')
}

// 初始化
onMounted(() => {
  refreshQRCode()
})
</script>

<style scoped>
/* 基础样式 */
.QRCode-container {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.QRCode-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  min-width: 400px;
  overflow: hidden;
  transform: translateY(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.QRCode-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.QRCode-form {
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 标题样式 */
.QRCode-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
  position: relative;
}

.QRCode-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 3px;
}

/* 二维码显示区域 */
.QRCode-display {
  margin-bottom: 30px;
  text-align: center;
}

.QRCode-wrapper {
  width: 200px;
  height: 200px;
  margin: 0 auto 15px;
  border-radius: 12px;
  background: white;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.QRCode-pulse {
  animation: QRCode-pulse 1.5s infinite;
}

@keyframes QRCode-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(79, 172, 254, 0.4);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(79, 172, 254, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(79, 172, 254, 0);
  }
}

.QRCode-image {
  width: 180px;
  height: 180px;
  object-fit: contain;
  border-radius: 8px;
}

.QRCode-hint {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}

/* 刷新按钮 */
.QRCode-refresh {
  position: absolute;
  bottom: -15px;
  right: -15px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 2;
}

.QRCode-refresh:hover {
  transform: rotate(90deg) scale(1.1);
}

.QRCode-refresh svg {
  width: 20px;
  height: 20px;
  fill: white;
}

/* 加载状态 */
.QRCode-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.QRCode-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(79, 172, 254, 0.2);
  border-top: 4px solid #4facfe;
  border-radius: 50%;
  animation: QRCode-spin 1s linear infinite;
}

@keyframes QRCode-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 平台选择 */
.QRCode-platforms {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  width: 100%;
}

.QRCode-platform-btn {
  flex: 1;
  max-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  background: white;
  border: 1px solid #eee;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.QRCode-platform-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.QRCode-platform-active {
  border-color: #4facfe;
  background: rgba(79, 172, 254, 0.05);
}

.QRCode-platform-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
  margin-bottom: 8px;
}

.QRCode-platform-name {
  font-size: 12px;
  color: #666;
}

/* 返回按钮 */
.QRCode-back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.QRCode-back-btn:hover {
  background: #f9f9f9;
  border-color: #4facfe;
  color: #4facfe;
}

.QRCode-back-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  fill: currentColor;
}

/* 过渡动画 */
.QRCode-fade-enter-active,
.QRCode-fade-leave-active {
  transition: opacity 0.5s ease;
}

.QRCode-fade-enter-from,
.QRCode-fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .QRCode-form {
    padding: 30px 20px;
  }

  .QRCode-platforms {
    gap: 10px;
  }

  .QRCode-platform-btn {
    padding: 8px 0;
  }
}
</style>