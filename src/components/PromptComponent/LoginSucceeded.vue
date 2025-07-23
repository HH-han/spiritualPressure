<template>
  <transition name="fade">
    <div v-if="visible" class="success-notification">
      <div class="success-content">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" class="checkmark">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        <div class="success-text">
          <h3 class="success-title">登录成功!</h3>
          <p class="success-message">欢迎回来，{{ username }}！即将跳转到首页...</p>
        </div>
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  username: {
    type: String,
    default: '用户'
  },
  duration: {
    type: Number,
    default: 2000
  }
})

const emit = defineEmits(['close'])

const visible = ref(false)
const progress = ref(0)
let intervalId = null
let timeoutId = null

const show = () => {
  visible.value = true
  startProgress()
}

const hide = () => {
  visible.value = false
  clearInterval(intervalId)
  clearTimeout(timeoutId)
  emit('close')
}

const startProgress = () => {
  const steps = 100
  const interval = props.duration / steps
  
  intervalId = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 1
    } else {
      clearInterval(intervalId)
      hide()
    }
  }, interval)
}

onMounted(() => {
  show()
})

onUnmounted(() => {
  clearInterval(intervalId)
  clearTimeout(timeoutId)
})

// 暴露方法，供父组件调用
defineExpose({
  show,
  hide
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.success-notification {
  position: fixed;
  top: 5%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 350px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.success-content {
  position: relative;
  padding: 20px;
  display: flex;
  align-items: center;
}

.success-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(79, 172, 254, 0.3);
  animation: pulse 2s infinite;
}

.checkmark {
  width: 24px;
  height: 24px;
  fill: white;
  stroke: white;
  stroke-width: 2;
  animation: checkmark 0.6s ease;
}

.success-text {
  flex-grow: 1;
}

.success-title {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
}

.success-message {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
  line-height: 1.4;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 0 0 0 12px;
  transition: width 0.1s linear;
}

@keyframes pulse {
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

@keyframes checkmark {
  0% {
    stroke-dashoffset: 50;
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    stroke-dashoffset: 0;
    transform: scale(1);
  }
}
</style>