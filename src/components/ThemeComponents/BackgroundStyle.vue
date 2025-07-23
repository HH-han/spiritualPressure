<template>
  <div class="artistic-background">
    <!-- 背景元素 -->
    <div class="bg-elements">
      <div 
        v-for="(shape, index) in shapes" 
        :key="index"
        :class="['shape', shape.type]"
        :style="{
          left: `${shape.x}%`,
          top: `${shape.y}%`,
          width: `${shape.size}px`,
          height: `${shape.size}px`,
          transform: `rotate(${shape.rotation}deg)`,
          opacity: shape.opacity,
          backgroundColor: shape.color
        }"
      ></div>
    </div>
    
    <!-- 装饰性元素 -->
    <div class="decorative-elements">
      <div class="orbital-ring"></div>
      <div class="floating-dots">
        <div v-for="n in 15" :key="'dot'+n" class="dot"></div>
      </div>
    </div>
    
    <!-- 主内容区域 -->
    <div class="content-container">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// 形状配置
const shapes = ref([]);
const shapeTypes = ['circle', 'triangle', 'square', 'pentagon', 'hexagon'];
const colors = [
  'rgba(255, 107, 107, 0.6)',
  'rgba(255, 159, 67, 0.6)',
  'rgba(253, 227, 167, 0.6)',
  'rgba(46, 134, 222, 0.6)',
  'rgba(136, 84, 208, 0.6)',
  'rgba(88, 214, 141, 0.6)'
];

// 初始化形状
const initShapes = () => {
  const newShapes = [];
  for (let i = 0; i < 15; i++) {
    newShapes.push({
      type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 30 + Math.random() * 70,
      rotation: Math.random() * 360,
      opacity: 0.3 + Math.random() * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      xSpeed: (Math.random() - 0.5) * 0.05,
      ySpeed: (Math.random() - 0.5) * 0.05,
      rotationSpeed: (Math.random() - 0.5) * 0.5
    });
  }
  shapes.value = newShapes;
};

// 动画循环
let animationFrame;
const animate = () => {
  shapes.value = shapes.value.map(shape => {
    let newX = shape.x + shape.xSpeed;
    let newY = shape.y + shape.ySpeed;
    
    // 边界检查
    if (newX > 100 || newX < 0) shape.xSpeed *= -1;
    if (newY > 100 || newY < 0) shape.ySpeed *= -1;
    
    return {
      ...shape,
      x: newX,
      y: newY,
      rotation: shape.rotation + shape.rotationSpeed
    };
  });
  
  animationFrame = requestAnimationFrame(animate);
};

onMounted(() => {
  initShapes();
  animate();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
.artistic-background {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
}

.bg-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  filter: blur(1px);
  transition: all 0.5s ease-out;
  will-change: transform, opacity;
}

.circle {
  border-radius: 50%;
}

.triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  background-color: transparent;
  border: 1px solid;
}

.square {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.pentagon {
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
}

.hexagon {
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

.decorative-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.orbital-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vmin;
  height: 80vmin;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: rotate 60s linear infinite;
}

.orbital-ring::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  width: 20px;
  height: 20px;
  background: rgba(255, 107, 107, 0.8);
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.8);
}

.floating-dots {
  position: absolute;
  width: 100%;
  height: 100%;
}

.dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(253, 227, 167, 0.8);
  border-radius: 50%;
  animation: float 15s infinite ease-in-out;
  box-shadow: 0 0 10px rgba(253, 227, 167, 0.8);
}

/* 为每个点设置不同的位置和动画延迟 */
.dot:nth-child(1) {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}
.dot:nth-child(2) {
  top: 70%;
  left: 25%;
  animation-delay: -1s;
}
.dot:nth-child(3) {
  top: 30%;
  left: 75%;
  animation-delay: -2s;
}
.dot:nth-child(4) {
  top: 80%;
  left: 65%;
  animation-delay: -3s;
}
.dot:nth-child(5) {
  top: 10%;
  left: 50%;
  animation-delay: -4s;
}
.dot:nth-child(6) {
  top: 60%;
  left: 10%;
  animation-delay: -5s;
}
.dot:nth-child(7) {
  top: 40%;
  left: 90%;
  animation-delay: -6s;
}
.dot:nth-child(8) {
  top: 90%;
  left: 30%;
  animation-delay: -7s;
}
.dot:nth-child(9) {
  top: 15%;
  left: 35%;
  animation-delay: -8s;
}
.dot:nth-child(10) {
  top: 65%;
  left: 85%;
  animation-delay: -9s;
}
.dot:nth-child(11) {
  top: 25%;
  left: 60%;
  animation-delay: -10s;
}
.dot:nth-child(12) {
  top: 75%;
  left: 40%;
  animation-delay: -11s;
}

.content-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
}

/* 动画定义 */
@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(10px) translateX(-10px);
  }
  75% {
    transform: translateY(-10px) translateX(20px);
  }
}
</style>