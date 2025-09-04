<template>
  <div class="custom-toast" :class="toastType" v-if="closeToastMessage">
    <span class="toast-icon">{{ toastType === 'success' ? '✓' : '✕' }}</span>
    <div class="toast-content">
      {{ toastMessage }}
    </div>
    <button class="toast-close" @click="closeToast">
      <svg t="1756953109422" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="4411">
        <path
          d="M839.28946946 914.1990408a71.89307854 71.89307854 0 0 1-52.48697483-22.52314629l-654.5789389-654.47838914c-29.96382854-29.96382854-29.96382854-77.42331536 0-104.87339988 30.06437829-30.06437829 77.42331536-30.06437829 104.97394964 0l654.5789389 651.96464513c29.96382854 29.96382854 29.96382854 77.42331536 0 104.97394964a69.58043406 69.58043406 0 0 1-52.48697481 24.93634054z"
          fill="#d81e06" p-id="4412"></path>
        <path
          d="M184.71053054 914.1990408a71.89307854 71.89307854 0 0 1-52.38642505-22.52314629c-30.06437829-29.96382854-30.06437829-77.42331536 0-104.87339988l651.96464513-654.5789389c29.96382854-29.96382854 77.42331536-29.96382854 104.97394964 0 29.96382854 30.06437829 29.96382854 77.42331536 0 104.97394964l-652.06519489 654.5789389a71.89307854 71.89307854 0 0 1-52.48697483 22.42259653z"
          fill="#d81e06" p-id="4413"></path>
      </svg>
    </button>
    <div class="progress-bar"></div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const closeToastMessage = ref(true)
const props = defineProps({
  toastMessage: {
    type: String,
    default: ''
  },
  toastType: {
    type: String,
    default: 'success'
  }
})
// 关闭当前toast
const closeToast = () => {
  closeToastMessage.value = false;
};
</script>
<style scoped>
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.success-btn {
  background: linear-gradient(to right, #4CAF50, #8BC34A);
  color: white;
}

.error-btn {
  background: linear-gradient(to right, #F44336, #FF9800);
  color: white;
}

.warning-btn {
  background: linear-gradient(to right, #FFC107, #FFEB3B);
  color: #333;
}

.info-btn {
  background: linear-gradient(to right, #2196F3, #03A9F4);
  color: white;
}

.custom-toast {
  display: flex;
  align-items: center;
  min-width: 320px;
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.442);
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  animation: slideIn 0.5s forwards;
  z-index: 1000;
}

.custom-toast.hide {
  animation: slideOut 0.5s forwards;
}

@keyframes slideIn {
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 15px;
  font-weight: bold;
  flex-shrink: 0;
}

.success .toast-icon {
  background: #4CAF50;
  color: white;
}

.error .toast-icon {
  background: #F44336;
  color: white;
}

.warning .toast-icon {
  background: #FFC107;
  color: #333;
}

.info .toast-icon {
  background: #2196F3;
  color: white;
}

.toast-content {
  flex: 1;
  text-align: left;
  font-size: 15px;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
  margin-left: 10px;
  padding: 0;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.toast-close:hover {
  background: #f5f5f5;
  color: #666;
}

.toast-close svg {
  width: 20px;
  height: 20px;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  border-radius: 0 0 0 12px;
  animation: progress 3s linear forwards;
}

.success .progress-bar {
  background: #4CAF50;
}

.error .progress-bar {
  background: #F44336;
}

.warning .progress-bar {
  background: #FFC107;
}

.info .progress-bar {
  background: #2196F3;
}

@keyframes progress {
  from {
    width: 100%;
  }

  to {
    width: 0%;
  }
}

.code-sample {
  background: #2d2d2d;
  color: #f8f8f2;
  border-radius: 12px;
  padding: 20px;
  margin-top: 30px;
  text-align: left;
  overflow-x: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

pre {
  white-space: pre-wrap;
  line-height: 1.5;
}

.comment {
  color: #75715e;
}

.selector {
  color: #a6e22e;
}

.property {
  color: #66d9ef;
}

.value {
  color: #ae81ff;
}
</style>