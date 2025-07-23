<template>
  <div class="homepagewebsite-container">
    <!-- 导航栏 -->
    <header>
      <Home_2 />
    </header>
    <!-- 英雄区域 -->
    <section class="homepagewebsite-hero">
      <div class="homepagewebsite-hero-content">
        <h1 class="homepagewebsite-hero-title">探索世界的奇迹</h1>
        <p class="homepagewebsite-hero-subtitle">发现地球上最令人惊叹的地方，创造终生难忘的回忆</p>
        <div class="homepagewebsite-search-box">
          <input type="text" placeholder="搜索目的地..." class="homepagewebsite-search-input">
          <button class="homepagewebsite-search-btn">
            <i class="fas fa-search"></i> 搜索
          </button>
        </div>
      </div>
      <div class="homepagewebsite-hero-overlay"></div>
      <div class="homepagewebsite-hero-slideshow">
        <div class="homepagewebsite-slide active"
          style="background-image: url('https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')">
        </div>
        <div class="homepagewebsite-slide"
          style="background-image: url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')">
        </div>
        <div class="homepagewebsite-slide"
          style="background-image: url('https://images.unsplash.com/photo-1470114716159-e389f8712fda?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')">
        </div>
      </div>
    </section>

    <!-- 特色目的地 -->
    <section class="homepagewebsite-featured">
      <div class="homepagewebsite-section-header">
        <h2 class="homepagewebsite-section-title">特色目的地</h2>
        <p class="homepagewebsite-section-subtitle">探索我们最受欢迎的旅游地点</p>
      </div>
      <div class="homepagewebsite-destinations">
        <div v-for="(destination, index) in destinations" :key="index" class="homepagewebsite-destination-card"
          @mouseenter="hoverDestination(index)" @mouseleave="unhoverDestination(index)"
          :class="{ 'hovered': destination.hovered }">
          <div class="homepagewebsite-destination-image" :style="{ backgroundImage: `url(${destination.image})` }">
          </div>
          <div class="homepagewebsite-destination-overlay"></div>
          <div class="homepagewebsite-destination-content">
            <h3>{{ destination.name }}</h3>
            <p>{{ destination.description }}</p>
            <button class="homepagewebsite-explore-btn">探索</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 特色套餐 -->
    <section class="homepagewebsite-packages">
      <div class="homepagewebsite-section-header">
        <h2 class="homepagewebsite-section-title">精选旅游套餐</h2>
        <p class="homepagewebsite-section-subtitle">我们为您精心策划的旅行体验</p>
      </div>
      <div class="homepagewebsite-package-list">
        <div v-for="(packageItem, index) in packages" :key="index" class="homepagewebsite-package-card"
          :style="{ '--delay': index * 0.1 + 's' }">
          <div class="homepagewebsite-package-badge" v-if="packageItem.discount">-{{ packageItem.discount }}%</div>
          <div class="homepagewebsite-package-image" :style="{ backgroundImage: `url(${packageItem.image})` }"></div>
          <div class="homepagewebsite-package-details">
            <h3>{{ packageItem.name }}</h3>
            <div class="homepagewebsite-package-meta">
              <span><i class="fas fa-calendar-alt"></i> {{ packageItem.duration }}</span>
              <span><i class="fas fa-map-marker-alt"></i> {{ packageItem.location }}</span>
            </div>
            <p class="homepagewebsite-package-description">{{ packageItem.description }}</p>
            <div class="homepagewebsite-package-price">
              <span class="homepagewebsite-original-price" v-if="packageItem.originalPrice">${{
                packageItem.originalPrice }}</span>
              <span class="homepagewebsite-current-price">${{ packageItem.price }}</span>
            </div>
            <button class="homepagewebsite-book-now-btn">立即预订</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 客户评价 -->
    <section class="homepagewebsite-testimonials">
      <div class="homepagewebsite-section-header">
        <h2 class="homepagewebsite-section-title">客户评价</h2>
        <p class="homepagewebsite-section-subtitle">听听我们的客户怎么说</p>
      </div>
      <div class="homepagewebsite-testimonial-carousel">
        <div v-for="(testimonial, index) in testimonials" :key="index" class="homepagewebsite-testimonial-card"
          :class="{ 'active': currentTestimonial === index }">
          <div class="homepagewebsite-testimonial-quote">
            <i class="fas fa-quote-left"></i>
          </div>
          <p class="homepagewebsite-testimonial-text">{{ testimonial.text }}</p>
          <div class="homepagewebsite-testimonial-author">
            <div class="homepagewebsite-testimonial-avatar" :style="{ backgroundImage: `url(${testimonial.avatar})` }">
            </div>
            <div class="homepagewebsite-testimonial-info">
              <h4>{{ testimonial.name }}</h4>
              <p>{{ testimonial.position }}</p>
            </div>
          </div>
        </div>
        <div class="homepagewebsite-testimonial-controls">
          <button v-for="(testimonial, index) in testimonials" :key="index" @click="currentTestimonial = index"
            :class="{ 'active': currentTestimonial === index }"></button>
        </div>
      </div>
    </section>

    <!-- 订阅区域 -->
    <section class="homepagewebsite-newsletter">
      <div class="homepagewebsite-newsletter-content">
        <h2 class="homepagewebsite-newsletter-title">订阅我们的通讯</h2>
        <p class="homepagewebsite-newsletter-subtitle">获取独家优惠和旅游灵感</p>
        <div class="homepagewebsite-newsletter-form">
          <input type="email" placeholder="您的电子邮箱地址" class="homepagewebsite-newsletter-input">
          <button class="homepagewebsite-newsletter-btn">订阅</button>
        </div>
      </div>
      <div class="homepagewebsite-newsletter-pattern"></div>
    </section>

    <!-- 页脚 -->
    <footer>
      <BottomPage />
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BottomPage from '../../components/DisplayBox/BottomPage.vue'
import Home_2 from '../../components/NavigationComponent/HomeHeader.vue'

const currentTestimonial = ref(0);
const destinations = ref([
  {
    name: "巴黎, 法国",
    description: "浪漫之都，艺术与时尚的中心",
    image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    hovered: false
  },
  {
    name: "东京, 日本",
    description: "传统与现代完美融合的都市",
    image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    hovered: false
  },
  {
    name: "马尔代夫",
    description: "天堂般的海岛度假胜地",
    image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    hovered: false
  },
  {
    name: "纽约, 美国",
    description: "不夜城，世界文化的大熔炉",
    image: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    hovered: false
  }
]);

const packages = ref([
  {
    name: "欧洲经典之旅",
    duration: "14天",
    location: "法国, 意大利, 西班牙",
    description: "探索欧洲最迷人的城市，体验丰富的文化和历史。",
    price: 2499,
    originalPrice: 2999,
    discount: 17,
    image: "https://images.unsplash.com/photo-1493707553966-283afac8c358?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  },
  {
    name: "东南亚探险",
    duration: "10天",
    location: "泰国, 越南, 柬埔寨",
    description: "体验东南亚的异国风情，品尝地道美食，探索古老寺庙。",
    price: 1599,
    originalPrice: 1899,
    discount: 16,
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  },
  {
    name: "非洲野生动物园",
    duration: "7天",
    location: "肯尼亚, 坦桑尼亚",
    description: "近距离观察非洲野生动物，体验难忘的狩猎之旅。",
    price: 2899,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  }
]);

const testimonials = ref([
  {
    text: "GlobeTrotter为我们安排的蜜月旅行简直完美！每一个细节都考虑周到，我们完全不需要操心任何事情。",
    name: "Sarah & Michael",
    position: "新婚夫妇",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    text: "作为独自旅行者，我对GlobeTrotter的服务印象深刻。他们安排的当地导游非常专业，让我感到安全又舒适。",
    name: "Jessica Wong",
    position: "独自旅行者",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    text: "我们全家一起参加了GlobeTrotter的家庭套餐，孩子们玩得非常开心，大人们也能放松享受。完美的家庭假期！",
    name: "The Johnson Family",
    position: "家庭旅行",
    avatar: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  }
]);

const hoverDestination = (index) => {
  destinations.value[index].hovered = true;
};

const unhoverDestination = (index) => {
  destinations.value[index].hovered = false;
};

// 自动切换客户评价
onMounted(() => {
  setInterval(() => {
    currentTestimonial.value = (currentTestimonial.value + 1) % testimonials.value.length;
  }, 5000);
});

// 背景幻灯片自动切换
onMounted(() => {
  const slides = document.querySelectorAll('.homepagewebsite-slide');
  let currentSlide = 0;

  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 6000);
});

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

:root {
  --homepagewebsite-primary: #6c5ce7;
  --homepagewebsite-secondary: #a29bfe;
  --homepagewebsite-accent: #fd79a8;
  --homepagewebsite-dark: #2d3436;
  --homepagewebsite-light: #f5f6fa;
  --homepagewebsite-gradient: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  --homepagewebsite-gradient-accent: linear-gradient(135deg, #fd79a8 0%, #fab1a0 100%);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.homepagewebsite-container {
  width: 100%;
  overflow: hidden;
}

/* 英雄区域样式 */
.homepagewebsite-hero {
  position: relative;
  height: 100vh;
  min-height: 700px;
  width: 100%;
  overflow: hidden;
}

.homepagewebsite-hero-slideshow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.homepagewebsite-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.homepagewebsite-slide.active {
  opacity: 1;
}

.homepagewebsite-hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.homepagewebsite-hero-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 10%;
  max-width: 1200px;
  margin: 0 auto;
  color: white;
  animation: fadeInUp 1s ease-out;
}

.homepagewebsite-hero-title {
  font-size: 64px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.homepagewebsite-hero-subtitle {
  font-size: 20px;
  margin-bottom: 40px;
  max-width: 600px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.homepagewebsite-search-box {
  display: flex;
  width: 100%;
  max-width: 700px;
  animation: fadeInUp 1s ease-out 0.3s both;
}

.homepagewebsite-search-input {
  flex: 1;
  padding: 18px 25px;
  border: none;
  border-radius: 50px 0 0 50px;
  font-size: 16px;
  outline: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.homepagewebsite-search-btn {
  padding: 0 30px;
  background: var(--homepagewebsite-gradient-accent);
  color: white;
  border: none;
  border-radius: 0 50px 50px 0;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
}

.homepagewebsite-search-btn i {
  margin-right: 8px;
}

.homepagewebsite-search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 25px rgba(0, 0, 0, 0.3);
}

/* 特色目的地样式 */
.homepagewebsite-featured {
  padding: 100px 5%;
  background-color: white;
}

.homepagewebsite-section-header {
  text-align: center;
  margin-bottom: 60px;
}

.homepagewebsite-section-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--homepagewebsite-dark);
  margin-bottom: 15px;
  position: relative;
  display: inline-block;
}

.homepagewebsite-section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: var(--homepagewebsite-gradient);
  border-radius: 2px;
}

.homepagewebsite-section-subtitle {
  font-size: 18px;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
}

.homepagewebsite-destinations {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 50px;
}

.homepagewebsite-destination-card {
  position: relative;
  height: 350px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
}

.homepagewebsite-destination-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.homepagewebsite-destination-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
}

.homepagewebsite-destination-card:hover .homepagewebsite-destination-image {
  transform: scale(1.1);
}

.homepagewebsite-destination-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100%);
  opacity: 0.8;
  transition: all 0.5s ease;
}

.homepagewebsite-destination-card:hover .homepagewebsite-destination-overlay {
  opacity: 0.9;
}

.homepagewebsite-destination-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30px;
  color: white;
  transform: translateY(20px);
  transition: all 0.5s ease;
  opacity: 0;
}

.homepagewebsite-destination-card.hovered .homepagewebsite-destination-content {
  transform: translateY(0);
  opacity: 1;
}

.homepagewebsite-destination-content h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
}

.homepagewebsite-destination-content p {
  font-size: 14px;
  margin-bottom: 20px;
  opacity: 0.9;
}

.homepagewebsite-explore-btn {
  padding: 8px 20px;
  background: transparent;
  border: 2px solid white;
  color: white;
  border-radius: 30px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.homepagewebsite-explore-btn:hover {
  background: white;
  color: var(--homepagewebsite-dark);
}

/* 特色套餐样式 */
.homepagewebsite-packages {
  padding: 100px 5%;
  background-color: #f9f9f9;
}

.homepagewebsite-package-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 50px;
}

.homepagewebsite-package-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.5s ease-out var(--delay) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.homepagewebsite-package-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.homepagewebsite-package-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--homepagewebsite-accent);
  color: white;
  padding: 5px 15px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 3px 10px rgba(253, 121, 168, 0.3);
}

.homepagewebsite-package-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.homepagewebsite-package-details {
  padding: 25px;
}

.homepagewebsite-package-details h3 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 15px;
  color: var(--homepagewebsite-dark);
}

.homepagewebsite-package-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;
}

.homepagewebsite-package-meta i {
  margin-right: 5px;
  color: var(--homepagewebsite-primary);
}

.homepagewebsite-package-description {
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.6;
}

.homepagewebsite-package-price {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.homepagewebsite-original-price {
  text-decoration: line-through;
  color: #999;
  margin-right: 15px;
  font-size: 16px;
}

.homepagewebsite-current-price {
  font-size: 24px;
  font-weight: 700;
  color: var(--homepagewebsite-primary);
}

.homepagewebsite-book-now-btn {
  width: 100%;
  padding: 12px;
  background: var(--homepagewebsite-gradient);
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);
}

.homepagewebsite-book-now-btn:hover {
  background: var(--homepagewebsite-gradient-accent);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(253, 121, 168, 0.4);
}

/* 客户评价样式 */
.homepagewebsite-testimonials {
  padding: 100px 5%;
  background-color: white;
}

.homepagewebsite-testimonial-carousel {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  padding: 50px 0;
}

.homepagewebsite-testimonial-card {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.5s ease;
}

.homepagewebsite-testimonial-card.active {
  opacity: 1;
  transform: scale(1);
  position: relative;
}

.homepagewebsite-testimonial-quote {
  font-size: 36px;
  color: var(--homepagewebsite-primary);
  opacity: 0.3;
  margin-bottom: 20px;
}

.homepagewebsite-testimonial-text {
  font-size: 18px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 30px;
  font-style: italic;
}

.homepagewebsite-testimonial-author {
  display: flex;
  align-items: center;
  justify-content: center;
}

.homepagewebsite-testimonial-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin-right: 15px;
  border: 3px solid var(--homepagewebsite-secondary);
}

.homepagewebsite-testimonial-info h4 {
  font-size: 18px;
  color: var(--homepagewebsite-dark);
  margin-bottom: 5px;
}

.homepagewebsite-testimonial-info p {
  font-size: 14px;
  color: #777;
}

.homepagewebsite-testimonial-controls {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.homepagewebsite-testimonial-controls button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: #ddd;
  margin: 0 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.homepagewebsite-testimonial-controls button.active {
  background: var(--homepagewebsite-primary);
  transform: scale(1.2);
}

/* 订阅区域样式 */
.homepagewebsite-newsletter {
  position: relative;
  padding: 80px 5%;
  background: var(--homepagewebsite-gradient);
  color: white;
  overflow: hidden;
}

.homepagewebsite-newsletter-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.homepagewebsite-newsletter-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 15px;
}

.homepagewebsite-newsletter-subtitle {
  font-size: 18px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.homepagewebsite-newsletter-form {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
}

.homepagewebsite-newsletter-input {
  flex: 1;
  padding: 18px 25px;
  border: none;
  border-radius: 50px 0 0 50px;
  font-size: 16px;
  outline: none;
}

.homepagewebsite-newsletter-btn {
  padding: 0 30px;
  background: var(--homepagewebsite-accent);
  color: white;
  border: none;
  border-radius: 0 50px 50px 0;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.homepagewebsite-newsletter-btn:hover {
  background: #ff5d9e;
}

.homepagewebsite-newsletter-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.3;
}


@media (max-width: 768px) {
  .homepagewebsite-nav {
    display: none;
  }

  .homepagewebsite-auth {
    display: none;
  }

  .homepagewebsite-mobile-menu {
    display: block;
  }

  .homepagewebsite-hero-title {
    font-size: 36px;
  }

  .homepagewebsite-hero-subtitle {
    font-size: 16px;
  }

  .homepagewebsite-search-box {
    flex-direction: column;
  }

  .homepagewebsite-search-input {
    border-radius: 50px;
    margin-bottom: 10px;
  }

  .homepagewebsite-search-btn {
    border-radius: 50px;
  }

  .homepagewebsite-newsletter-form {
    flex-direction: column;
  }

  .homepagewebsite-newsletter-input {
    border-radius: 50px;
    margin-bottom: 10px;
  }

  .homepagewebsite-newsletter-btn {
    border-radius: 50px;
  }
}

@media (max-width: 576px) {
  .homepagewebsite-hero {
    min-height: 600px;
  }

  .homepagewebsite-section-title {
    font-size: 28px;
  }

  .homepagewebsite-package-list {
    grid-template-columns: 1fr;
  }
}
</style>