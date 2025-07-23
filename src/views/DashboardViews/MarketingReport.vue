<template>
  <div class="dashboard-card">
    <h3 class="dashboard-card-title">营销报告</h3>
    <div class="marketing-content">
      <div class="marketing-data-center">
        <div class="marketing-data-left">
          <div v-for="(item, index) in marketingData" :key="index" class="marketing-item">
            <div class="marketing-icon" :style="{ backgroundColor: item.color }">
              <span>{{ item.emoji }}</span>
            </div>
            <div class="marketing-details">
              <div class="marketing-value">{{ item.value }}</div>
              <div class="marketing-label">{{ item.label }}</div>
            </div>
          </div>
        </div>
        <div>
          <div class="marketing-item-img">
          </div>
        </div>
      </div>

      <div class="progress-container">
        <div class="circular-progress" ref="progressCircle">
          <div class="progress-content">
            <div class="progress-value">24.3</div>
            <div class="progress-label">千米</div>
          </div>
        </div>
      </div>

      <a href="#" class="learn-more">了解如何管理 →</a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const marketingData = [
  { emoji: '📈', value: '+2.9k', label: '谷歌广告', color: 'rgba(108, 92, 231, 0.1)' },
  { emoji: '🔄', value: '1.22', label: '转介', color: 'rgba(0, 184, 148, 0.1)' },
  { emoji: '📍', value: '24.3 千米', label: '奥克兰距离', color: 'rgba(253, 203, 110, 0.1)' }
]

const progressCircle = ref(null)

onMounted(() => {
  const circle = progressCircle.value
  if (!circle || !circle.r) return

  const radius = circle.r.baseVal.value
  const circumference = radius * 2 * Math.PI

  circle.style.strokeDasharray = `${circumference} ${circumference}`
  circle.style.strokeDashoffset = circumference

  const offset = circumference - (70 / 100) * circumference
  setTimeout(() => {
    circle.style.strokeDashoffset = offset
  }, 500)
})
</script>

<style scoped>
.marketing-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.marketing-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.marketing-data-center {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.marketing-data-left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.marketing-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: var(--transition);
}

.marketing-icon:hover {
  transform: rotate(15deg) scale(1.1);
}

.marketing-details {
  flex: 1;
}

.marketing-value {
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--dark);
}

.marketing-label {
  font-size: 0.9rem;
  color: var(--dark);
  opacity: 0.7;
}

.marketing-item-img {
  width: 300px;
  height: 200px;
  background-image: url(@/assets/scenery/jingwailipei.png);
  background-size: cover;
  background-position: center;
}

.progress-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 1.5rem auto;
}

.circular-progress {
  width: 100%;
  height: 100%;
}

.circular-progress circle {
  fill: none;
  stroke: var(--primary);
  stroke-width: 8;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 1s ease-out;
}

.progress-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.progress-label {
  font-size: 0.8rem;
  color: var(--dark);
  opacity: 0.7;
}

.learn-more {
  display: block;
  text-align: center;
  color: var(--primary);
  font-weight: 500;
  text-decoration: none;
  transition: var(--transition);
  margin-top: 1rem;
}

.learn-more:hover {
  letter-spacing: 1px;
}

svg {
  width: 100%;
  height: 100%;
}
</style>