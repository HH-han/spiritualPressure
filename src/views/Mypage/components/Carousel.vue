<template>
  <div class="food-carousel" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">
    <div class="carousel-viewport">
      <div class="carousel-track" :style="trackStyle" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
        @touchend="handleTouchEnd">
        <!-- 克隆最后一个项目放在前面 -->
        <div class="carousel-slide" v-if="items.length > 1">
          <div class="slide-content">
            <img :src="items[items.length - 1].image" class="slide-image" />
            <div class="slide-overlay"></div>
            <div class="slide-caption" v-if="items[items.length - 1].title">
              <h3>{{ items[items.length - 1].title }}</h3>
              <p v-if="items[items.length - 1].location">{{ items[items.length - 1].location }}</p>
              <p v-if="items[items.length - 1].description">{{ items[items.length - 1].description }}</p>
            </div>
          </div>
        </div>

        <!-- 正常项目 -->
        <div class="carousel-slide" v-for="(item, index) in items" :key="index">
          <div class="slide-content">
            <img :src="item.image" class="slide-image" />
            <div class="slide-overlay"></div>
            <div class="slide-caption" v-if="item.title">
              <h3>{{ item.title }}</h3>
              <p v-if="item.location">{{ item.location }}</p>
              <p v-if="item.description">{{ item.description }}</p>
            </div>
          </div>
        </div>

        <!-- 克隆第一个项目放在后面 -->
        <div class="carousel-slide" v-if="items.length > 1">
          <div class="slide-content">
            <img :src="items[0].image" class="slide-image" />
            <div class="slide-overlay"></div>
            <div class="slide-caption" v-if="items[0].title">
              <h3>{{ items[0].title }}</h3>
              <p v-if="items[0].location">{{ items[0].location }}</p>
              <p v-if="items[0].description">{{ items[0].description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航指示器 -->
    <div class="carousel-pagination" v-if="showIndicators && items.length > 1">
      <button v-for="(item, index) in items" :key="index" :class="{ 'active': currentIndex === index }"
        @click="goTo(index)" :aria-label="`Go to slide ${index + 1}`">
        <span class="progress-bar" v-if="currentIndex === index"></span>
      </button>
    </div>

    <!-- 导航箭头 -->
    <button class="carousel-nav prev" @click="prev" v-if="showArrows && items.length > 1"
      aria-label="Previous slide">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
    </button>
    <button class="carousel-nav next" @click="next" v-if="showArrows && items.length > 1" aria-label="Next slide">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: value => value.length > 0 && value.every(item => 'image' in item),
  },
  interval: {
    type: Number,
    default: 5000
  },
  transitionDuration: {
    type: Number,
    default: 600
  },
  showArrows: {
    type: Boolean,
    default: true
  },
  showIndicators: {
    type: Boolean,
    default: true
  },
  aspectRatio: {
    type: String,
    default: '16/9'
  }
})

const currentIndex = ref(0)
const autoPlayTimer = ref(null)
const isTransitioning = ref(false)
const touchStartX = ref(0)
const touchEndX = ref(0)
const progressInterval = ref(null)

// 计算轨道偏移量
const trackStyle = computed(() => {
  const offset = props.items.length > 1 ? -(currentIndex.value + 1) * 100 : -currentIndex.value * 100
  return {
    transform: `translateX(${offset}%)`,
    transition: isTransitioning.value ? `transform ${props.transitionDuration}ms cubic-bezier(0.16, 1, 0.3, 1)` : 'none'
  }
})

// 自动播放控制
const startAutoPlay = () => {
  if (props.items.length <= 1) return
  stopAutoPlay()
  autoPlayTimer.value = setInterval(() => {
    next()
  }, props.interval)

  // 进度条动画
  startProgressBar()
}

const pauseAutoPlay = () => {
  stopAutoPlay()
  clearProgressBar()
}

const stopAutoPlay = () => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
    autoPlayTimer.value = null
  }
}

// 进度条动画
const startProgressBar = () => {
  clearProgressBar()
  const progressBars = document.querySelectorAll('.progress-bar')
  if (progressBars[currentIndex.value]) {
    progressBars[currentIndex.value].style.transition = `width ${props.interval}ms linear`
    progressBars[currentIndex.value].style.width = '100%'
  }
}

const clearProgressBar = () => {
  const progressBars = document.querySelectorAll('.progress-bar')
  progressBars.forEach(bar => {
    bar.style.transition = 'none'
    bar.style.width = '0%'
  })
}

// 导航方法
const goTo = (index) => {
  if (isTransitioning.value || index === currentIndex.value) return

  isTransitioning.value = true
  currentIndex.value = index

  setTimeout(() => {
    isTransitioning.value = false
    startAutoPlay()
  }, props.transitionDuration)
}

const next = () => {
  if (isTransitioning.value) return

  isTransitioning.value = true
  currentIndex.value = (currentIndex.value + 1) % props.items.length

  setTimeout(() => {
    isTransitioning.value = false

    // 如果到达克隆的第一个项目（实际是最后一个），无动画跳转到真实位置
    if (currentIndex.value === props.items.length - 1) {
      setTimeout(() => {
        isTransitioning.value = false
        currentIndex.value = 0
      }, 50)
    }
  }, props.transitionDuration)
}

const prev = () => {
  if (isTransitioning.value) return

  isTransitioning.value = true
  currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length

  setTimeout(() => {
    isTransitioning.value = false

    // 如果到达克隆的最后一个项目（实际是第一个），无动画跳转到真实位置
    if (currentIndex.value === 0) {
      setTimeout(() => {
        isTransitioning.value = false
        currentIndex.value = props.items.length - 1
      }, 50)
    }
  }, props.transitionDuration)
}

// 触摸事件处理
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  pauseAutoPlay()
}

const handleTouchMove = (e) => {
  touchEndX.value = e.touches[0].clientX
}

const handleTouchEnd = () => {
  const diff = touchStartX.value - touchEndX.value
  if (Math.abs(diff) > 50) { // 滑动阈值
    if (diff > 0) {
      next()
    } else {
      prev()
    }
  } else {
    startAutoPlay()
  }
}

// 生命周期
onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
  clearProgressBar()
})
</script>

<style scoped>
.food-carousel {
  --carousel-aspect-ratio: v-bind('aspectRatio');
  --primary-color: #4f46e5;
  --text-color: #ffffff;
  --bg-overlay: rgba(0, 0, 0, 0.4);
  --nav-bg: rgba(255, 255, 255, 0.15);
  --nav-bg-hover: rgba(255, 255, 255, 0.3);
  --indicator-size: 15px;
  --indicator-gap: 8px;
  --border-radius: 12px;

  position: relative;
  width: 100%;
  max-height: 100vh;
  aspect-ratio: var(--carousel-aspect-ratio);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.carousel-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  height: 100%;
  width: 100%;
}

.carousel-slide {
  flex: 0 0 100%;
  min-width: 100%;
  position: relative;
}

.slide-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-overlay);
}

.slide-caption {
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  padding: 2rem;
  color: var(--text-color);
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.slide-caption h3 {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.slide-caption p {
  font-size: clamp(0.875rem, 1.5vw, 1.125rem);
  margin-bottom: 0;
  opacity: 0.9;
  line-height: 1.6;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: var(--nav-bg);
  color: var(--text-color);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.carousel-nav:hover {
  background: var(--nav-bg-hover);
  transform: translateY(-50%) scale(1.1);
}

.carousel-nav svg {
  width: 24px;
  height: 24px;
}

.prev {
  left: 2rem;
}

.next {
  right: 2rem;
}

.carousel-pagination {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
  padding: 6px;
  border-radius: 24px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.carousel-pagination button {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.33, 1, 0.68, 1);
  outline: none;
}

.carousel-pagination button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.carousel-pagination button:hover {
  transform: scale(1.3);
  background: rgba(255, 255, 255, 0.7);
}

.carousel-pagination button:active::before {
  transform: translate(-50%, -50%) scale(2);
  opacity: 0.4;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.carousel-pagination button.active {
  width: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
}

.carousel-pagination button.active .progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #3a7bd5, #00d2ff);
  animation: progress var(--duration, 5s) linear forwards;
  border-radius: 0 0 8px 8px;
}

@keyframes progress {
  from { width: 0%; }
  to { width: 100%; }
}

/* 触摸设备优化 */
@media (hover: none) {
  .carousel-pagination button:hover {
    transform: none;
    background: rgba(255, 255, 255, 0.4);
  }
}

@media (max-width: 768px) {
  .food-carousel {
    --border-radius: 8px;
  }

  .carousel-nav {
    width: 36px;
    height: 36px;
  }

  .prev {
    left: 1rem;
  }

  .next {
    right: 1rem;
  }

  .slide-caption {
    padding: 1.5rem;
  }
}
</style>