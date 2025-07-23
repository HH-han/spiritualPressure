<template>
  <div class="errorview404-not-found-container">
    <!-- 粒子背景 -->
    <vue-particles
      id="tsparticles"
      :options="particlesOptions"
    />
  
    <div class="errorview404-content">
      <!-- 3D数字效果 -->
      <div class="errorview404-error-code">
        <span class="errorview404-digit">4</span>
        <span class="errorview404-digit">0</span>
        <span class="errorview404-digit">4</span>
      </div>
  
      <!-- 动画文字 -->
      <div class="errorview404-error-message">
        <h1 class="errorview404-glitch" data-text="页面未找到">页面未找到</h1>
        <p class="errorview404-animated-text">看起来你迷路了...让我们带你回家</p>
      </div>
  
      <!-- 交互按钮 -->
      <div class="errorview404-actions">
        <button @click="goHome" class="errorview404-neon-button">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          返回首页
        </button>
        <button @click="contactSupport" class="errorview404-neon-button">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          联系支持
        </button>
      </div>
  
      <!-- 浮动元素 -->
      <div class="errorview404-floating-elements">
        <div v-for="i in 8" :key="i" class="errorview404-floating-element" :style="getFloatingStyle(i)"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from "element-plus";

    const router = useRouter();

    // 粒子效果配置
    const particlesOptions = {
      background: {
        color: {
          value: "#0f0f1a",
        },
      },
      fpsLimit: 60,
      interactivity: {
        detectsOn: "canvas",
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
          resize: true,
        },
        modes: {
          bubble: {
            distance: 400,
            duration: 2,
            opacity: 0.8,
            size: 40,
          },
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        collisions: {
          enable: true,
        },
        move: {
          direction: "none",
          enable: true,
          outMode: "bounce",
          random: true,
          speed: 2,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            value_area: 800,
          },
          value: 60,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          random: true,
          value: 5,
        },
      },
      detectRetina: true,
    };

    // 获取浮动元素的随机样式
    const getFloatingStyle = (index) => {
      const size = Math.random() * 20 + 10;
      const colors = ['#ff3366', '#20a4f3', '#2ec4b6', '#f6f7f8', '#ff9f1c'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        backgroundColor: color,
        animationDelay: `${index * 0.2}s`,
        opacity: Math.random() * 0.5 + 0.3,
      };
    };

    // 导航方法
    const goHome = () => {
      router.push('/home_5');
    };

    const contactSupport = () => {
      // 这里可以替换为实际的联系支持逻辑
      ElMessage.success("请联系我们的支持团队: bolan@example.com");
      router.push('/aboutweb');
      
    };

    // 页面加载时的动画
    onMounted(() => {
      const digits = document.querySelectorAll('.errorview404-digit');
      digits.forEach((digit, index) => {
        setTimeout(() => {
          digit.style.opacity = '1';
          digit.style.transform = 'translateY(0)';
        }, index * 200);
      });
    });
</script>

<style scoped>
.errorview404-not-found-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
  color: white;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
}

#tsparticles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.errorview404-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
  max-width: 800px;
}

.errorview404-error-code {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.errorview404-digit {
  font-family: 'Orbitron', sans-serif;
  font-size: 12rem;
  font-weight: 700;
  margin: 0 0.5rem;
  color: transparent;
  background: linear-gradient(45deg, #ff3366, #20a4f3, #2ec4b6);
  background-clip: text;
  -webkit-background-clip: text;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  opacity: 0;
  transform: translateY(-50px);
  transition: all 0.5s ease-out;
}

.errorview404-error-message h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  position: relative;
}

.errorview404-glitch {
  position: relative;
  color: white;
  animation: errorview404-glitch 2s infinite linear alternate-reverse;
}

.errorview404-glitch::before {
  content: attr(data-text);
  position: absolute;
  left: -2px;
  text-shadow: -5px 0 magenta;
  background: #0f0f1a;
  overflow: hidden;
  clip: rect(0, 900px, 0, 0);
  animation: errorview404-noise-anim-1 2s infinite linear alternate-reverse;
}

.errorview404-glitch::after {
  content: attr(data-text);
  position: absolute;
  left: 2px;
  text-shadow: -5px 0 lightgreen;
  background: #0f0f1a;
  overflow: hidden;
  clip: rect(0, 900px, 0, 0);
  animation: errorview404-noise-anim-2 2s infinite linear alternate-reverse;
}

.errorview404-animated-text {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  animation: errorview404-fadeInOut 3s infinite;
}

.errorview404-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.errorview404-neon-button {
  position: relative;
  display: inline-block;
  padding: 12px 30px;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-decoration: none;
  font-size: 1rem;
  overflow: hidden;
  transition: 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 15px;
}

.errorview404-neon-button:hover {
  color: #255784;
  background: #20a4f3;
  box-shadow: 0 0 10px #20a4f3, 0 0 40px #20a4f3, 0 0 80px #20a4f3;
  transition-delay: 0.5s;
}

.errorview404-neon-button span {
  position: absolute;
  display: block;
}

.errorview404-neon-button span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #20a4f3);
}

.errorview404-neon-button:hover span:nth-child(1) {
  left: 100%;
  transition: 0.5s;
}

.errorview404-neon-button span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #20a4f3);
}

.errorview404-neon-button:hover span:nth-child(2) {
  top: 100%;
  transition: 0.5s;
  transition-delay: 0.125s;
}

.errorview404-neon-button span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #20a4f3);
}

.errorview404-neon-button:hover span:nth-child(3) {
  right: 100%;
  transition: 0.5s;
  transition-delay: 0.25s;
}

.errorview404-neon-button span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #20a4f3);
}

.errorview404-neon-button:hover span:nth-child(4) {
  bottom: 100%;
  transition: 0.5s;
  transition-delay: 0.375s;
}

.errorview404-floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.errorview404-floating-element {
  position: absolute;
  border-radius: 50%;
  animation: errorview404-float 15s infinite linear;
}

@keyframes errorview404-float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-100px) rotate(180deg);
  }
  100% {
    transform: translateY(0) rotate(360deg);
  }
}

@keyframes errorview404-glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-3px, 3px);
  }
  40% {
    transform: translate(-3px, -3px);
  }
  60% {
    transform: translate(3px, 3px);
  }
  80% {
    transform: translate(3px, -3px);
  }
  100% {
    transform: translate(0);
  }
}

@keyframes errorview404-noise-anim-1 {
  0% {
    clip: rect(31px, 9999px, 94px, 0);
  }
  10% {
    clip: rect(112px, 9999px, 76px, 0);
  }
  20% {
    clip: rect(85px, 9999px, 77px, 0);
  }
  30% {
    clip: rect(27px, 9999px, 97px, 0);
  }
  40% {
    clip: rect(64px, 9999px, 98px, 0);
  }
  50% {
    clip: rect(61px, 9999px, 85px, 0);
  }
  60% {
    clip: rect(99px, 9999px, 114px, 0);
  }
  70% {
    clip: rect(34px, 9999px, 115px, 0);
  }
  80% {
    clip: rect(98px, 9999px, 129px, 0);
  }
  90% {
    clip: rect(43px, 9999px, 96px, 0);
  }
  100% {
    clip: rect(82px, 9999px, 64px, 0);
  }
}

@keyframes errorview404-noise-anim-2 {
  0% {
    clip: rect(65px, 9999px, 119px, 0);
  }
  10% {
    clip: rect(79px, 9999px, 66px, 0);
  }
  20% {
    clip: rect(24px, 9999px, 15px, 0);
  }
  30% {
    clip: rect(88px, 9999px, 53px, 0);
  }
  40% {
    clip: rect(9px, 9999px, 35px, 0);
  }
  50% {
    clip: rect(53px, 9999px, 43px, 0);
  }
  60% {
    clip: rect(11px, 9999px, 1px, 0);
  }
  70% {
    clip: rect(28px, 9999px, 87px, 0);
  }
  80% {
    clip: rect(55px, 9999px, 99px, 0);
  }
  90% {
    clip: rect(7px, 9999px, 98px, 0);
  }
  100% {
    clip: rect(28px, 9999px, 54px, 0);
  }
}

@keyframes errorview404-fadeInOut {
  0%, 100% {
    opacity: 0.7;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }
  50% {
    opacity: 1;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.7);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .errorview404-digit {
    font-size: 8rem;
  }
  
  .errorview404-error-message h1 {
    font-size: 2rem;
  }
  
  .errorview404-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .errorview404-neon-button {
    padding: 10px 20px;
  }
}

@media (max-width: 480px) {
  .errorview404-digit {
    font-size: 5rem;
  }
  
  .errorview404-error-message h1 {
    font-size: 1.5rem;
  }
  
  .errorview404-animated-text {
    font-size: 1rem;
  }
}
</style>