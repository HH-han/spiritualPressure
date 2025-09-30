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
          <button v-for="(img, index) in attraction.images" :key="index" class="carousel-dot"
            :class="{ active: currentImageIndex === index }" @click="currentImageIndex = index"></button>
        </div>
      </div>
      <!-- 景点详情 -->
      <div class="attraction-details">
        <!-- 景点评分/收藏数/ -->
        <div class="image-overlay-order">
          <span class="attraction-rating-order">
            <i class="fas fa-star"></i> {{ attraction.rating }}
          </span>
          <span class="attraction-location-order">
            <i class="fas fa-map-marker-alt"></i> {{ attraction.location }}
          </span>
        </div>
        <!-- 标题 -->
        <h1 class="attraction-title">{{ attraction.name }}</h1>
        <div class="attraction-tags">
          <span v-for="(tag, index) in attraction.tags" :key="index" class="tag">
            {{ tag }}
          </span>
        </div>
        <!-- 价格 -->
        <div class="attraction-description">
          <p>{{ attraction.details }}</p>
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
              <div v-for="day in calendarDays" :key="day.date" class="day" :class="{
                'disabled': !day.available,
                'selected': isSelectedDate(day.date),
                'today': isToday(day.date)
              }" @click="selectDate(day)">
                <span>{{ day.day }}</span>
                <div v-if="isToday(day.date)" class="today-marker"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 门票选择 -->
        <div class="ticket-selection">
          <h2>选择门票</h2>
          <div v-for="(ticket, index) in tickets" :key="index" class="ticket-option" :class="{
            'selected': selectedTicketIndex === index,
            'recommended': ticket.recommended
          }" @click="selectTicket(index)">
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
              <button class="quantity-btn liquid-btn" @click="decreaseQuantity" :disabled="quantity <= 1">
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity">{{ quantity }}</span>
              <button class="quantity-btn liquid-btn" @click="increaseQuantity">
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
        <button class="purchase-btn liquid-btn" :disabled="!canPurchase" @click="handlePurchase">
          <span class="btn-text">立即购买</span>
          <div class="liquid-effect"></div>
        </button>
        <!-- 加入购物车按钮 -->
        <button class="add-to-cart-btn liquid-btn" @click="addToCart">
          <span class="btn-text">加入购物车</span>
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
  <!-- 背景样式 -->
  <div class="background-overlay">
    <BackgroundStyle />
  </div>
  <!-- 关闭按钮 -->
  <div class="orderdetails-close-button">
    <button @click="goBack">返回</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BackgroundStyle from '@/components/ThemeComponents/BackgroundStyle.vue';
import { ElMessage} from 'element-plus';

const route = useRoute();
const router = useRouter();

// 景点数据
const attraction = ref({
  name: "",
  images: [],
  price: 0,
  specs: [],
  tags: ["景点", "户外", "娱乐"],
  details: [],
  detailImages: [],
  rating: 0,
  sales: 0,
  favorites: [],
  location: ""
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

// 返回上一页
function goBack() {
  router.go(-1);
  ElMessage.warning('即将返回！')
}
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
// 跳转结算页面
const handlePurchase = () => {
  router.push({
    name: 'payviews',
    query: {
      item: JSON.stringify({
        price: Number(totalPrice.value),
        list: attraction.value,
        quantity: quantity.value,
        selectedTicketIndex: selectedTicketIndex.value
      }),
    },
  });
  if (canPurchase.value) {
    showSuccessModal.value = true;
  }
};

const closeModal = () => {
  showSuccessModal.value = false;
};
//跳转支付页面
const addToCart = () => {
  router.push({
    name: 'shopcartviews',
    query: {
      item: JSON.stringify({
        price: Number(totalPrice.value),
        list: attraction.value,
        quantity: quantity.value,
        selectedTicketIndex: selectedTicketIndex.value
      }),
    },
  });
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
    Object.assign(attraction.value, {
      id: item.id,
      name: item.name,
      images: [item.image],
      price: item.price,
      specs: ["默认规格"],
      details: item.details,
      detailImages: [item.image],
      rating: item.rating,
      sales: item.sales,
      favorites: item.favorites,
      location: item.location
    });

    // 基于传递的价格更新门票数据
    tickets.value = tickets.value.map(ticket => ({
      ...ticket,
      price: Math.round(item.price * (ticket.price / 198)),
      originalPrice: ticket.originalPrice ? Math.round(item.price * (ticket.originalPrice / 198)) : undefined
    }));
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Noto Sans SC', sans-serif;
}

.attraction-container {
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  z-index: 1000;
}

.background-overlay {
  width: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }

  50% {
    transform: translate(50px, 50px) rotate(5deg);
  }
}

.attraction-card {
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.35);
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

.image-overlay-order {
  position: absolute;
  top: 25px;
  left: 25px;
  display: flex;
  gap: 15px;
  z-index: 2;
}

.attraction-rating-order,
.attraction-location-order {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.attraction-rating-order i {
  color: #ffcc00;
  text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
}

.attraction-location-order i {
  color: #ff6b6b;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
}

.attraction-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  padding: .5rem;
}

.attraction-title {
  font-size: 2.5rem;
  margin-bottom: 1.2rem;
  color: #1a1a1a;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.attraction-tags {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.tag {
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.attraction-description {
  color: #4a5568;
  line-height: 1.8;
  font-size: 1.1rem;
  background: rgba(247, 250, 252, 0.8);
  padding: 1.5rem;
  border-radius: 16px;
  border-left: 4px solid #667eea;
}

.date-selector h2,
.ticket-selection h2 {
  font-size: 1.6rem;
  color: #2d3748;
  position: relative;
  display: inline-block;
  font-weight: 700;
}

.date-selector h2::after,
.ticket-selection h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
}

.calendar {
  background: rgba(247, 250, 252, 0.9);
  border-radius: 20px;
  padding: 1.5rem;
  margin-top: 1rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.month-display {
  font-weight: 700;
  font-size: 1.3rem;
  color: #2d3748;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-btn {
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.3);
  color: #667eea;
  font-size: 1.1rem;
  cursor: pointer;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  color: #4a5568;
  font-size: 1rem;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.8rem;
}

.day {
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
}

.day:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  border-color: rgba(102, 126, 234, 0.3);
}

.day.disabled {
  color: #cbd5e0;
  cursor: not-allowed;
  background: rgba(237, 242, 247, 0.5);
  box-shadow: none;
}

.day.selected {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: scale(1.08);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  border-color: rgba(102, 126, 234, 0.5);
}

.today-marker {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
}

.day.selected .today-marker {
  background: white;
}


.ticket-option {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 20px;
  background: rgba(247, 250, 252, 0.9);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid transparent;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.ticket-option::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s ease;
}

.ticket-option:hover::before {
  left: 100%;
}

.ticket-option:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.ticket-option.selected {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
}

.ticket-option.recommended::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #ff6b6b, #ffa502, #ff6b6b);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.ticket-info {
  flex: 1;
}

.ticket-info h3 {
  font-size: 1.4rem;
  margin-bottom: 0.8rem;
  color: #1a1a1a;
  font-weight: 700;
}

.ticket-info p {
  font-size: 1rem;
  color: #718096;
  margin-bottom: 1.2rem;
  line-height: 1.6;
}

.ticket-features {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.95rem;
  color: #4a5568;
}

.ticket-features span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.ticket-features span:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateY(-1px);
}

.ticket-features i {
  color: #48bb78;
  font-size: 1rem;
}

.ticket-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 2rem;
}

.price {
  font-weight: 800;
  color: #667eea;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
}

.original-price {
  font-size: 1rem;
  color: #a0aec0;
  text-decoration: line-through;
  margin-bottom: 0.8rem;
}

.recommended-badge {
  background: linear-gradient(135deg, #ff6b6b, #ffa502);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.liquid-radio {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 2rem;
  background: white;
}

.ticket-option.selected .liquid-radio {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.liquid-radio-inner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ticket-option.selected .liquid-radio-inner {
  background: #667eea;
  transform: scale(1);
  animation: liquidPulse 2s infinite;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
}

@keyframes liquidPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.quantity-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  border-top: 2px solid rgba(226, 232, 240, 0.8);
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.quantity-control h3 {
  font-size: 1.3rem;
  color: #2d3748;
  font-weight: 600;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(247, 250, 252, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  border: 2px solid rgba(226, 232, 240, 0.6);
}

.quantity-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.quantity-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.quantity {
  font-size: 1.5rem;
  font-weight: 700;
  min-width: 50px;
  text-align: center;
  color: #2d3748;
}

.total-price {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: .5rem 1rem;
  border-radius: 20px;
  color: white;
}

.total-price span:first-child {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.total-price .price {
  font-size: 2.2rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.liquid-btn {
  position: relative;
  padding: 1.5rem 3rem;
  border: none;
  border-radius: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-weight: 700;
  font-size: 1.3rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.liquid-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
}

.liquid-btn:disabled {
  background: #cbd5e0;
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}

.liquid-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s ease;
}

.liquid-btn:hover .liquid-effect {
  left: 100%;
}

.btn-text {
  position: relative;
  z-index: 1;
  font-weight: 700;
}

.purchase-btn {
  font-size: 1.2rem;
  padding: .5rem;
  background: linear-gradient(135deg, #64ff9a, #dfff50);
  box-shadow: 0 8px 25px rgba(100, 255, 154, 0.4);
}

.purchase-btn:hover {
  box-shadow: 0 12px 35px rgba(100, 255, 154, 0.6);
}

.add-to-cart-btn {
  font-size: 1.2rem;
  padding: .5rem;
  background: linear-gradient(135deg, #649dff, #a550ff);
  box-shadow: 0 8px 25px rgba(100, 157, 255, 0.4);
}

.add-to-cart-btn:hover {
  box-shadow: 0 12px 35px rgba(100, 157, 255, 0.6);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.liquid-modal {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 28px;
  padding: 3rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.25),
    0 10px 20px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.liquid-modal::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  animation: rotate 15s linear infinite;
  z-index: 0;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.modal-content {
  position: relative;
  z-index: 1;
}

.success-icon {
  font-size: 6rem;
  color: #48bb78;
  margin-bottom: 2rem;
  animation: bounce 0.6s ease;
  text-shadow: 0 4px 8px rgba(72, 187, 120, 0.3);
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.liquid-modal h2 {
  margin-bottom: 1.5rem;
  color: #1a1a1a;
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.liquid-modal p {
  color: #718096;
  margin-bottom: 2.5rem;
  line-height: 1.7;
  font-size: 1.1rem;
}

.ticket-qrcode {
  margin: 2rem 0;
}

.qrcode-placeholder {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f7fafc, #edf2f7);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 2px dashed #cbd5e0;
}

.qrcode-placeholder::before,
.qrcode-placeholder::after {
  content: '';
  position: absolute;
  background: #e2e8f0;
}

.qrcode-placeholder::before {
  width: 180px;
  height: 180px;
  border-radius: 8px;
}

.qrcode-placeholder::after {
  width: 140px;
  height: 140px;
  border-radius: 4px;
}

.confirm-btn {
  padding: 1.2rem 3rem;
  margin-top: 1.5rem;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #48bb78, #38a169);
  box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
}

.confirm-btn:hover {
  box-shadow: 0 8px 25px rgba(72, 187, 120, 0.6);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .attraction-container {
    padding: 1rem;
  }

  .image-carousel {
    height: 280px;
  }

  .attraction-details {
    padding: 1.5rem;
  }

  .attraction-title {
    font-size: 2rem;
  }

  .ticket-option {
    flex-direction: column;
    padding: .5rem;
    text-align: center;
  }

  .ticket-price {
    align-items: center;
    margin-left: 0;
    margin-top: 1.5rem;
  }

  .liquid-radio {
    margin-left: 0;
    margin-top: 1rem;
  }

  .quantity-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
  }

  .total-price {
    align-items: flex-start;
    width: 100%;
    text-align: left;
  }

  .liquid-btn {
    padding: 1.3rem 2rem;
    font-size: 1.2rem;
  }
}

/* 关闭按钮 */
.orderdetails-close-button {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 3000;
  display: flex;
  align-items: center;
}

.orderdetails-close-button button {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.orderdetails-close-button button:hover {
  background: rgba(255, 107, 107, 0.9);
  transform: rotate(-45deg) scale(1.1);
  box-shadow: 0 12px 35px rgba(255, 107, 107, 0.5);
}
</style>