<template>
  <div class="artistic-order-container">
    <!-- 顶部艺术装饰 -->
    <div class="artistic-header">
      <div class="brush-stroke"></div>
      <div class="watercolor-blob"></div>
      <h1 class="artistic-title">旅程确认</h1>
    </div>

    <!-- 主要内容区域 -->
    <div class="order-content">
      <!-- 旅游卡片 - 带有艺术装饰 -->
      <div class="artistic-card" @click="toggleCardDetails">
        <div class="card-painting-effect"></div>
        <img :src="trip.image" :alt="trip.title" class="trip-image" />
        <div class="card-content">
          <h2 class="trip-title">{{ trip.title }}</h2>
          <div class="trip-meta">
            <span class="trip-date">
              <i class="icon-calendar"></i> {{ trip.date }}
            </span>
            <span class="trip-duration">
              <i class="icon-clock"></i> {{ trip.duration }}
            </span>
          </div>
          <transition name="fade-slide">
            <div v-if="showCardDetails" class="trip-details">
              <p>{{ trip.description }}</p>
              <div class="trip-highlights">
                <div v-for="(highlight, index) in trip.highlights" :key="index" class="highlight-item">
                  <i class="icon-star"></i> {{ highlight }}
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div class="card-price">
          <div class="price-tag">¥{{ trip.price }}</div>
        </div>
      </div>

      <!-- 订单表单 -->
      <div class="artistic-form">
        <h3 class="form-title">填写订单信息</h3>
        
        <div class="form-group" v-for="(field, index) in formFields" :key="index">
          <label :for="field.id" class="artistic-label">{{ field.label }}</label>
          <input 
            :type="field.type" 
            :id="field.id" 
            v-model="formData[field.model]" 
            class="artistic-input"
            @focus="animateInput(index)"
            :data-index="index"
          />
          <div class="input-underline"></div>
        </div>
        
        <div class="form-group">
          <label class="artistic-label">出行人数</label>
          <div class="artistic-counter">
            <button class="counter-btn" @click="decrementGuests" :disabled="guests <= 1">
              -
            </button>
            <span class="counter-value">{{ guests }}</span>
            <button class="counter-btn" @click="incrementGuests" :disabled="guests >= 5">
              +
            </button>
          </div>
        </div>
      </div>

      <!-- 价格汇总 -->
      <div class="artistic-summary">
        <h3 class="summary-title">费用明细</h3>
        <div class="summary-item" v-for="(item, index) in summaryItems" :key="index">
          <span>{{ item.label }}</span>
          <span>¥{{ item.value }}</span>
        </div>
        <div class="summary-total">
          <span>总计</span>
          <span class="total-price">¥{{ totalPrice }}</span>
        </div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <div class="artistic-actions">
      <button class="action-btn secondary" @click="goBack">
        <i class="icon-arrow-left"></i> 返回
      </button>
      <button class="action-btn primary" @click="submitOrder" :disabled="!formValid">
        确认支付 <i class="icon-check"></i>
      </button>
    </div>

    <!-- 支付成功动画 -->
    <transition name="zoom-fade">
      <div v-if="paymentSuccess" class="success-overlay">
        <div class="success-content">
          <div class="success-icon">
            <svg viewBox="0 0 100 100">
              <path class="checkmark" d="M20,50 L40,70 L80,30" />
            </svg>
          </div>
          <h2>支付成功!</h2>
          <p>您的旅程已确认，期待与您相遇!</p>
          <button class="success-btn" @click="closeSuccess">完成</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 组件状态
const showCardDetails = ref(false)
const guests = ref(2)
const formData = ref({
  name: '',
  phone: '',
  email: '',
  notes: ''
})
const paymentSuccess = ref(false)

// 模拟旅游数据
const trip = ref({
  title: '水墨江南艺术之旅',
  date: '2023-11-15 至 2023-11-18',
  duration: '4天3晚',
  price: 1680,
  image: 'https://example.com/watertown.jpg',
  description: '沉浸于江南水乡的诗意画卷中，体验传统水墨艺术与现代生活的完美融合。漫步古镇小巷，参与手工造纸，感受东方美学的独特魅力。',
  highlights: [
    '专业艺术导游讲解',
    '传统手工艺体验',
    '特色艺术民宿住宿',
    '水墨画创作工作坊'
  ]
})

// 表单字段配置
const formFields = ref([
  { id: 'name', label: '姓名', type: 'text', model: 'name' },
  { id: 'phone', label: '手机号', type: 'tel', model: 'phone' },
  { id: 'email', label: '电子邮箱', type: 'email', model: 'email' },
  { id: 'notes', label: '特殊要求', type: 'text', model: 'notes' }
])

// 计算属性
const summaryItems = computed(() => [
  { label: '基础费用', value: trip.value.price },
  { label: '人数', value: guests.value },
  { label: '小计', value: trip.value.price * guests.value }
])

const totalPrice = computed(() => trip.value.price * guests.value)

const formValid = computed(() => {
  return formData.value.name && 
         formData.value.phone && 
         formData.value.email &&
         /^1[3-9]\d{9}$/.test(formData.value.phone) &&
         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.value.email)
})

// 方法
const toggleCardDetails = () => {
  showCardDetails.value = !showCardDetails.value
}

const incrementGuests = () => {
  if (guests.value < 5) {
    guests.value++
  }
}

const decrementGuests = () => {
  if (guests.value > 1) {
    guests.value--
  }
}

const animateInput = (index) => {
  const underlines = document.querySelectorAll('.input-underline')
  if (underlines[index]) {
    underlines[index].style.transform = 'scaleX(1)'
    underlines.forEach((underline, i) => {
      if (i !== index) {
        underline.style.transform = 'scaleX(0)'
      }
    })
  }
}

const submitOrder = () => {
  // 模拟支付处理
  setTimeout(() => {
    paymentSuccess.value = true
  }, 1500)
}

const closeSuccess = () => {
  paymentSuccess.value = false
  // 这里可以添加跳转到首页或其他页面的逻辑
}

const goBack = () => {
  // 返回上一页逻辑
  console.log('返回上一页')
}

// 初始化动画
onMounted(() => {
  setTimeout(() => {
    document.querySelector('.artistic-header').classList.add('animate-in')
  }, 100)
})
</script>

<style scoped>
/* ========= 去统一颜色变量版 ========= */

/* 基础样式与艺术风格配色（已移除 :root 变量） */

.artistic-order-container {
  max-width: 100%;
  min-height: 100vh;
  background-color: #f9f7f7;
  font-family: 'Brush Script MT', 'Segoe UI', cursive, sans-serif;
  color: #333;
  padding: 0 20px 100px;
  position: relative;
  overflow-x: hidden;
}

/* 艺术风格头部 */
.artistic-header {
  position: relative;
  padding: 30px 0;
  margin-bottom: 20px;
  text-align: center;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.8s ease-out;
}

.artistic-header.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.brush-stroke {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%) rotate(-5deg);
  width: 200px;
  height: 40px;
  background-color: #8a2be2;
  opacity: 0.3;
  border-radius: 50%;
  z-index: 0;
}

.watercolor-blob {
  position: absolute;
  top: 0;
  right: 10%;
  width: 100px;
  height: 100px;
  background-color: rgba(106, 90, 205, 0.1);
  border-radius: 50% 30% 70% 40%;
  filter: blur(10px);
  z-index: 0;
}

.artistic-title {
  position: relative;
  z-index: 1;
  font-size: 2.2rem;
  color: #6a5acd;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0;
  font-weight: 700;
  letter-spacing: 1px;
}

/* 艺术卡片样式 */
.artistic-card {
  position: relative;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  transition: all 0.3s ease;
  cursor: pointer;
  z-index: 1;
}

.artistic-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.card-painting-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent 65%, rgba(106, 90, 205, 0.1) 95%);
  z-index: 1;
  pointer-events: none;
}

.trip-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

.card-content {
  padding: 20px;
  position: relative;
  z-index: 2;
}

.trip-title {
  font-size: 1.5rem;
  margin: 0 0 10px;
  color: #6a5acd;
}

.trip-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #666;
}

.trip-meta i {
  margin-right: 5px;
  color: #20b2aa;
}

.trip-details {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #ddd;
}

.trip-details p {
  margin: 0 0 10px;
  line-height: 1.6;
}

.trip-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.highlight-item {
  background-color: rgba(32, 178, 170, 0.1);
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.85rem;
  color: #20b2aa;
}

.highlight-item i {
  margin-right: 5px;
}

.card-price {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 3;
}

.price-tag {
  background-color: #ff7f50;
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(255, 127, 80, 0.3);
}

/* 艺术表单样式 */
.artistic-form {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.artistic-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: linear-gradient(to bottom, #6a5acd, #20b2aa);
}

.form-title {
  font-size: 1.3rem;
  margin: 0 0 20px;
  color: #6a5acd;
  position: relative;
  padding-left: 15px;
}

.form-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 70%;
  background-color: #ff7f50;
  border-radius: 3px;
}

.form-group {
  margin-bottom: 25px;
  position: relative;
}

.artistic-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.95rem;
  color: #555;
  font-weight: 500;
}

.artistic-input {
  width: 100%;
  padding: 12px 0;
  border: none;
  border-bottom: 1px solid #ddd;
  font-size: 1rem;
  background: transparent;
  transition: all 0.3s ease;
  font-family: inherit;
}

.artistic-input:focus {
  outline: none;
  border-bottom-color: transparent;
}

.input-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, #6a5acd, #20b2aa);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

/* 艺术计数器 */
.artistic-counter {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
}

.counter-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #6a5acd;
  color: white;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.counter-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.counter-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(106, 90, 205, 0.3);
}

.counter-value {
  font-size: 1.2rem;
  min-width: 30px;
  text-align: center;
  font-weight: bold;
  color: #6a5acd;
}

/* 艺术价格汇总 */
.artistic-summary {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.summary-title {
  font-size: 1.3rem;
  margin: 0 0 20px;
  color: #6a5acd;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed #eee;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding: 15px 0 5px;
  font-weight: bold;
  font-size: 1.1rem;
}

.total-price {
  color: #ff7f50;
  font-size: 1.3rem;
}

/* 艺术操作按钮 */
.artistic-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 15px 20px;
  background: white;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.action-btn {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-btn i {
  font-size: 1.1rem;
}

.primary {
  background: linear-gradient(to right, #6a5acd, #20b2aa);
  color: white;
  margin-left: 15px;
  box-shadow: 0 4px 15px rgba(106, 90, 205, 0.3);
}

.primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.primary:not(:disabled):hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(106, 90, 205, 0.4);
}

.secondary {
  background: white;
  color: #6a5acd;
  border: 1px solid #6a5acd;
}

.secondary:hover {
  background-color: rgba(106, 90, 205, 0.1);
}

/* 成功支付动画 */
.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.success-content {
  text-align: center;
  max-width: 300px;
  padding: 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: linear-gradient(to bottom right, #20b2aa, #6a5acd);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounceIn 0.6s ease-out;
}

.success-icon svg {
  width: 50px;
  height: 50px;
}

.checkmark {
  fill: none;
  stroke: white;
  stroke-width: 8;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: drawCheckmark 0.6s ease-out forwards;
  animation-delay: 0.3s;
}

.success-content h2 {
  color: #6a5acd;
  margin: 20px 0 10px;
}

.success-content p {
  color: #666;
  margin-bottom: 25px;
}

.success-btn {
  padding: 12px 30px;
  background: #6a5acd;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.success-btn:hover {
  background: #20b2aa;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(32, 178, 170, 0.3);
}

/* 动画效果（保持不变） */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.zoom-fade-enter-active,
.zoom-fade-leave-active {
  transition: all 0.5s ease;
}

.zoom-fade-enter-from,
.zoom-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@keyframes drawCheckmark {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

/* 响应式调整（保持不变） */
@media (min-width: 768px) {
  .artistic-order-container {
    max-width: 500px;
    margin: 0 auto;
    padding-bottom: 120px;
  }
  
  .artistic-actions {
    max-width: 500px;
    margin: 0 auto;
    border-radius: 50px 50px 0 0;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 40px);
  }
}
</style>