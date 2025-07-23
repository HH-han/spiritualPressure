<template>
  <div class="notfindpage-404-container">
    <div class="notfindpage-404-content">
      <div class="notfindpage-404-number">
        <span class="notfindpage-404-digit">4</span>
        <span class="notfindpage-404-digit">0</span>
        <span class="notfindpage-404-digit">4</span>
      </div>
      <div class="notfindpage-404-message">
        <h1 class="notfindpage-404-title">页面未找到</h1>
        <p class="notfindpage-404-description">
          您访问的页面似乎已经迷失在数字宇宙中...
        </p>
        <button class="notfindpage-404-button" @click="goHome">返回首页</button>
      </div>
    </div>
    
    <div class="notfindpage-404-stars">
      <div v-for="(star, index) in stars" :key="index" 
           class="notfindpage-404-star" 
           :style="star.style"></div>
    </div>
    
    <div class="notfindpage-404-planet"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stars = ref([])

const goHome = () => {
  router.push('/')
}

const createStars = () => {
  const count = 100
  const newStars = []
  
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 3
    const animationDuration = 5 + Math.random() * 15
    const delay = Math.random() * 5
    const opacity = 0.5 + Math.random() * 0.5
    
    newStars.push({
      style: {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${animationDuration}s`,
        animationDelay: `${delay}s`,
        opacity: opacity
      }
    })
  }
  
  stars.value = newStars
}

onMounted(() => {
  createStars()
})
</script>

<style scoped>
.notfindpage-404-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: 'Arial', sans-serif;
}

.notfindpage-404-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.notfindpage-404-number {
  display: flex;
  margin-bottom: 2rem;
}

.notfindpage-404-digit {
  font-size: 10rem;
  font-weight: 900;
  margin: 0 0.5rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  animation: notfindpage-404-bounce 2s infinite alternate;
}

.notfindpage-404-digit:nth-child(1) {
  animation-delay: 0.1s;
  color: #ffffff;
}
.notfindpage-404-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.notfindpage-404-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.8;
  max-width: 500px;
}

.notfindpage-404-button {
  padding: 0.8rem 2rem;
  background: linear-gradient(45deg, #4bc6ff, #247fed);
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.notfindpage-404-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.notfindpage-404-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #247fed, #4bc6ff);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.notfindpage-404-button:hover::before {
  opacity: 1;
}

.notfindpage-404-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.notfindpage-404-star {
  position: absolute;
  background-color: white;
  border-radius: 50%;
  animation: notfindpage-404-twinkle infinite alternate;
}

.notfindpage-404-planet {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #4ecdc4, #302b63);
  right: 10%;
  bottom: 10%;
  box-shadow: 0 0 50px rgba(78, 205, 196, 0.5);
  animation: notfindpage-404-float 8s infinite ease-in-out;
}

@keyframes notfindpage-404-bounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-20px);
  }
}

@keyframes notfindpage-404-twinkle {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.5);
    opacity: 1;
  }
}

@keyframes notfindpage-404-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@media (max-width: 768px) {
  .notfindpage-404-digit {
    font-size: 6rem;
  }
  
  .notfindpage-404-title {
    font-size: 1.8rem;
  }
  
  .notfindpage-404-planet {
    width: 120px;
    height: 120px;
    right: 5%;
    bottom: 5%;
  }
}
</style>