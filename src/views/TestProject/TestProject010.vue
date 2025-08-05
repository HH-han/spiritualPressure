<template>
  <div class="attraction-container">
    <!-- 液态背景元素 -->
    <div class="liquid-bg liquid-blue"></div>
    <div class="liquid-bg liquid-purple"></div>
    
    <!-- 主卡片 -->
    <div class="attraction-card">
      <!-- 景点图片轮播 -->
      <div class="image-carousel">
        <img :src="currentImage" :alt="attraction.name" class="carousel-image">
        <div class="carousel-controls">
          <button 
            v-for="(img, index) in attraction.images" 
            :key="index"
            class="carousel-dot"
            :class="{ active: currentImageIndex === index }"
            @click="currentImageIndex = index"
          ></button>
        </div>
        <div class="image-overlay">
          <span class="attraction-rating">
            <i class="fas fa-star"></i> {{ attraction.rating }}
          </span>
          <span class="attraction-location">
            <i class="fas fa-map-marker-alt"></i> {{ attraction.location }}
          </span>
        </div>
      </div>
      
      <!-- 景点详情 -->
      <div class="attraction-details">
        <h1 class="attraction-title">{{ attraction.name }}</h1>
        <div class="attraction-tags">
          <span v-for="(tag, index) in attraction.tags" :key="index" class="tag">
            {{ tag }}
          </span>
        </div>
        
        <div class="attraction-description">
          <p>{{ attraction.description }}</p>
        </div>
        
        <!-- 日期选择 -->
        <div class="date-selector">
          <h2>选择日期</h2>
          <div class="calendar">
            <div class="calendar-header">
              <button class="nav-btn" @click="prevMonth">
                <i class="fas fa-chevron-left"></i>
              </button>
              <div class="month-display">
                {{ currentMonth }} {{ currentYear }}
              </div>
              <button class="nav-btn" @click="nextMonth">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            <div class="weekdays">
              <div v-for="day in weekdays" :key="day" class="weekday">
                {{ day }}
              </div>
            </div>
            <div class="days">
              <div 
                v-for="day in calendarDays" 
                :key="day.date"
                class="day"
                :class="{
                  'disabled': !day.available,
                  'selected': isSelectedDate(day.date),
                  'today': isToday(day.date)
                }"
                @click="selectDate(day)"
              >
                <span>{{ day.day }}</span>
                <div v-if="isToday(day.date)" class="today-marker"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 门票选择 -->
        <div class="ticket-selection">
          <h2>选择门票</h2>
          <div 
            v-for="(ticket, index) in tickets" 
            :key="index"
            class="ticket-option"
            :class="{ 
              'selected': selectedTicketIndex === index,
              'recommended': ticket.recommended
            }"
            @click="selectTicket(index)"
          >
            <div class="ticket-info">
              <h3>{{ ticket.type }}</h3>
              <p>{{ ticket.description }}</p>
              <div class="ticket-features">
                <span v-for="(feature, i) in ticket.features" :key="i">
                  <i class="fas fa-check-circle"></i> {{ feature }}
                </span>
              </div>
            </div>
            <div class="ticket-price">
              <div class="price">¥{{ ticket.price }}</div>
              <div v-if="ticket.originalPrice" class="original-price">
                ¥{{ ticket.originalPrice }}
              </div>
              <div v-if="ticket.recommended" class="recommended-badge">
                推荐
              </div>
            </div>
            <div class="ticket-selector">
              <div class="liquid-radio">
                <div class="liquid-radio-inner"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 数量选择 -->
        <div class="quantity-section">
          <div class="quantity-control">
            <h3>数量</h3>
            <div class="quantity-selector">
              <button 
                class="quantity-btn liquid-btn"
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
              >
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity">{{ quantity }}</span>
              <button 
                class="quantity-btn liquid-btn"
                @click="increaseQuantity"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <div class="total-price">
            <span>总计</span>
            <span class="price">¥{{ totalPrice }}</span>
          </div>
        </div>
        
        <!-- 购买按钮 -->
        <button 
          class="purchase-btn liquid-btn"
          :disabled="!canPurchase"
          @click="handlePurchase"
        >
          <span class="btn-text">立即购买</span>
          <div class="liquid-effect"></div>
        </button>
      </div>
    </div>
    
    <!-- 购买成功模态框 -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="success-modal liquid-modal">
        <div class="modal-content">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h2>购票成功!</h2>
          <p>您的{{ selectedTicket.type }}门票已预订成功，日期: {{ selectedDate }}</p>
          <div class="ticket-qrcode">
            <div class="qrcode-placeholder"></div>
            <p>请保存二维码，入园时出示</p>
          </div>
          <button class="confirm-btn liquid-btn" @click="closeModal">
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const product = reactive({
  name: "",
  images: [],
  price: 0,
  specs: [],
  details: [],
  detailImages: [],
  rating: 0,
  sales: 0,
});


// 景点数据
const attraction = ref({
  name: "梦幻水上乐园",
  rating: 4.8,
  location: "上海市浦东新区",
  tags: ["水上乐园", "家庭娱乐", "刺激项目"],
  description: "梦幻水上乐园是华东地区最大的水上主题公园，拥有30多项世界级水上游乐设施，包括亚洲最高的水上滑梯和最大的造浪池。适合全家游玩，夏日消暑的最佳去处。",
  images: [
    "https://example.com/waterpark1.jpg",
    "https://example.com/waterpark2.jpg",
    "https://example.com/waterpark3.jpg"
  ]
});


// 门票数据
const tickets = ref([
  {
    type: "成人票",
    description: "18岁及以上游客使用",
    price: 198,
    originalPrice: 258,
    features: ["全天通玩", "免费储物柜", "部分餐饮折扣"],
    recommended: false
  },
  {
    type: "儿童票",
    description: "1.2m-1.5m儿童使用",
    price: 128,
    features: ["全天通玩", "需成人陪同"],
    recommended: false
  },
  {
    type: "家庭套票",
    description: "2大1小(1.2m-1.5m)",
    price: 428,
    originalPrice: 524,
    features: ["全天通玩", "免费储物柜", "餐饮85折", "快速通道"],
    recommended: true
  },
  {
    type: "VIP票",
    description: "尊享VIP特权",
    price: 328,
    features: ["全天通玩", "VIP储物柜", "餐饮8折", "无限次快速通道", "专属休息区"],
    recommended: false
  }
]);

// 日历相关数据
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
const currentDate = new Date();
const currentMonth = ref(currentDate.getMonth());
const currentYear = ref(currentDate.getFullYear());

// 图片轮播
const currentImageIndex = ref(0);
const currentImage = computed(() => attraction.value.images[currentImageIndex.value]);

// 门票选择
const selectedTicketIndex = ref(null);
const selectedTicket = computed(() => 
  selectedTicketIndex.value !== null ? tickets.value[selectedTicketIndex.value] : null
);

// 日期选择
const selectedDate = ref(null);
const calendarDays = ref([]);

// 数量
const quantity = ref(1);
const showSuccessModal = ref(false);

// 计算属性
const totalPrice = computed(() => {
  if (selectedTicketIndex.value === null) return 0;
  return tickets.value[selectedTicketIndex.value].price * quantity.value;
});

const canPurchase = computed(() => {
  return selectedTicketIndex.value !== null && selectedDate.value !== null;
});

const displayMonth = computed(() => {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  return months[currentMonth.value];
});

// 方法
const generateCalendarDays = () => {
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  
  // 上个月的最后几天
  const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate();
  const firstDayOfWeek = firstDay.getDay();
  
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    days.push({
      day,
      date: `${currentYear.value}-${currentMonth.value}-${day}`,
      available: false,
      currentMonth: false
    });
  }
  
  // 当前月的日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(currentYear.value, currentMonth.value, i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isAvailable = !isWeekend || (i % 2 === 0); // 模拟可用日期
    
    days.push({
      day: i,
      date: `${currentYear.value}-${currentMonth.value + 1}-${i}`,
      available: isAvailable,
      currentMonth: true
    });
  }
  
  // 下个月的前几天
  const daysNeeded = 42 - days.length; // 6行x7天
  for (let i = 1; i <= daysNeeded; i++) {
    days.push({
      day: i,
      date: `${currentYear.value}-${currentMonth.value + 2}-${i}`,
      available: false,
      currentMonth: false
    });
  }
  
  calendarDays.value = days;
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  generateCalendarDays();
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  generateCalendarDays();
};

const selectDate = (day) => {
  if (day.available) {
    selectedDate.value = day.date;
  }
};

const isSelectedDate = (date) => {
  return selectedDate.value === date;
};

const isToday = (date) => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  return date === todayStr;
};

const selectTicket = (index) => {
  selectedTicketIndex.value = index;
};

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const handlePurchase = () => {
  if (canPurchase.value) {
    showSuccessModal.value = true;
  }
};

const closeModal = () => {
  showSuccessModal.value = false;
};

// 生命周期钩子
onMounted(() => {
  generateCalendarDays();
  // 默认选择今天（如果可用）
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const todayDay = calendarDays.value.find(day => day.date === todayStr);
  if (todayDay && todayDay.available) {
    selectedDate.value = todayStr;
  }
  if (route.query.item) {
    const item = JSON.parse(route.query.item);
    Object.assign(product, {
      id: item.id,
      name: item.name,
      images: [item.image],
      price: item.price,
      specs: ["默认规格"],
      details: [item.details],
      detailImages: [item.image],
      rating: item.rating,
      sales: item.sales,
    });
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Noto Sans SC', sans-serif;
}

.attraction-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f2 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.liquid-bg {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(60px);
  z-index: 0;
  animation: float 15s infinite ease-in-out;
}

.liquid-blue {
  top: -200px;
  left: -200px;
  background: linear-gradient(45deg, rgba(100, 115, 255, 0.1) 0%, rgba(100, 200, 255, 0.2) 100%);
}

.liquid-purple {
  right: -200px;
  bottom: -200px;
  background: linear-gradient(45deg, rgba(255, 100, 200, 0.1) 0%, rgba(255, 200, 100, 0.2) 100%);
  animation-delay: 5s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(50px, 50px) rotate(5deg);
  }
}

.attraction-card {
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.image-carousel {
  position: relative;
  height: 350px;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.attraction-card:hover .carousel-image {
  transform: scale(1.03);
}

.carousel-controls {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 2;
}

.carousel-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-dot.active {
  background: white;
  transform: scale(1.2);
}

.image-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  z-index: 2;
}

.attraction-rating, .attraction-location {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.attraction-rating i {
  color: #ffcc00;
}

.attraction-location i {
  color: #ff6b6b;
}

.attraction-details {
  padding: 2rem;
}

.attraction-title {
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 700;
}

.attraction-tags {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.tag {
  background: rgba(100, 115, 255, 0.1);
  color: #6473ff;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.attraction-description {
  margin-bottom: 2rem;
  color: #555;
  line-height: 1.7;
  font-size: 1rem;
}

.date-selector {
  margin-bottom: 2rem;
}

.date-selector h2, .ticket-selection h2 {
  font-size: 1.4rem;
  margin-bottom: 1.2rem;
  color: #444;
  position: relative;
  display: inline-block;
}

.date-selector h2::after, .ticket-selection h2::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #6473ff, #9d50ff);
  border-radius: 3px;
}

.calendar {
  background: rgba(240, 242, 246, 0.5);
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.month-display {
  font-weight: 600;
  font-size: 1.1rem;
  color: #444;
}

.nav-btn {
  background: none;
  border: none;
  color: #6473ff;
  font-size: 1rem;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(100, 115, 255, 0.1);
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #666;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.day:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.day.disabled {
  color: #ccc;
  cursor: not-allowed;
  background: rgba(240, 240, 240, 0.5);
}

.day.selected {
  background: linear-gradient(135deg, #6473ff, #9d50ff);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(100, 115, 255, 0.4);
}

.today-marker {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6473ff;
}

.day.selected .today-marker {
  background: white;
}

.ticket-selection {
  margin-bottom: 2rem;
}

.ticket-option {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 15px;
  background: rgba(240, 242, 246, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.ticket-option:hover {
  background: rgba(240, 242, 246, 0.8);
}

.ticket-option.selected {
  border-color: #6473ff;
  background: rgba(100, 115, 255, 0.1);
}

.ticket-option.recommended::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ff6b6b, #ffa502);
}

.ticket-info {
  flex: 1;
}

.ticket-info h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.ticket-info p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.8rem;
}

.ticket-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  font-size: 0.85rem;
  color: #555;
}

.ticket-features span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.ticket-features i {
  color: #4caf50;
  font-size: 0.9rem;
}

.ticket-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 1.5rem;
}

.price {
  font-weight: bold;
  color: #6473ff;
  font-size: 1.4rem;
  margin-bottom: 0.3rem;
}

.original-price {
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
}

.recommended-badge {
  background: linear-gradient(90deg, #ff6b6b, #ffa502);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.liquid-radio {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-left: 1.5rem;
}

.ticket-option.selected .liquid-radio {
  border-color: #6473ff;
}

.liquid-radio-inner {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.3s ease;
}

.ticket-option.selected .liquid-radio-inner {
  background: #6473ff;
  transform: scale(1);
  animation: liquidPulse 1.5s infinite;
}

@keyframes liquidPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

.quantity-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-top: 1px solid #eee;
  margin-bottom: 1.5rem;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.quantity-control h3 {
  font-size: 1.1rem;
  color: #444;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f0f2f6;
  color: #6473ff;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-size: 1.3rem;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}

.total-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.total-price span:first-child {
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.3rem;
}

.total-price .price {
  font-size: 1.8rem;
  font-weight: 700;
  color: #6473ff;
}

.liquid-btn {
  position: relative;
  padding: 1.2rem 2.5rem;
  border: none;
  border-radius: 50px;
  background: linear-gradient(45deg, #6473ff, #9d50ff);
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(100, 115, 255, 0.4);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.liquid-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(100, 115, 255, 0.6);
}

.liquid-btn:disabled {
  background: #ccc;
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}

.liquid-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.liquid-btn:hover .liquid-effect {
  transform: translateX(100%);
}

.btn-text {
  position: relative;
  z-index: 1;
}

.purchase-btn {
  font-size: 1.2rem;
  padding: 1.3rem;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.liquid-modal {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 450px;
  width: 90%;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.liquid-modal::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(100, 115, 255, 0.1), transparent);
  animation: rotate 15s linear infinite;
  z-index: 0;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.modal-content {
  position: relative;
  z-index: 1;
}

.success-icon {
  font-size: 5rem;
  color: #4caf50;
  margin-bottom: 1.5rem;
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.liquid-modal h2 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.8rem;
}

.liquid-modal p {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1rem;
}

.ticket-qrcode {
  margin: 1.5rem 0;
}

.qrcode-placeholder {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  background: #f5f5f5;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.qrcode-placeholder::before, .qrcode-placeholder::after {
  content: '';
  position: absolute;
  background: #ddd;
}

.qrcode-placeholder::before {
  width: 160px;
  height: 160px;
  border-radius: 5px;
}

.qrcode-placeholder::after {
  width: 120px;
  height: 120px;
  border-radius: 3px;
}

.confirm-btn {
  padding: 1rem 2.5rem;
  margin-top: 1rem;
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .attraction-container {
    padding: 1rem;
  }
  
  .image-carousel {
    height: 250px;
  }
  
  .attraction-details {
    padding: 1.5rem;
  }
  
  .attraction-title {
    font-size: 1.8rem;
  }
  
  .ticket-option {
    flex-direction: column;
    padding: 1.2rem;
  }
  
  .ticket-price {
    align-items: flex-start;
    margin-left: 0;
    margin-top: 1rem;
  }
  
  .quantity-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  
  .total-price {
    align-items: flex-start;
    width: 100%;
  }
}
</style>