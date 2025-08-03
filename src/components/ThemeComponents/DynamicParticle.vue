<template>
  <div class="dynamic-background">
    <!-- 粒子背景 -->
    <canvas ref="canvas" class="particles"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 粒子系统
const canvas = ref(null)
let particles = []
let animationId = null

// 粒子类
class Particle {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = Math.random() * 3 + 1
    this.speedX = Math.random() * 2 - 1
    this.speedY = Math.random() * 2 - 1
    this.color = `hsl(${Math.random() * 60 + 180}, 80%, 60%)`
    this.alpha = Math.random() * 0.5 + 0.1
  }
  
  update() {
    this.x += this.speedX
    this.y += this.speedY
    
    if (this.x > this.canvas.width || this.x < 0) {
      this.speedX = -this.speedX
    }
    
    if (this.y > this.canvas.height || this.y < 0) {
      this.speedY = -this.speedY
    }
  }
  
  draw() {
    this.ctx.globalAlpha = this.alpha
    this.ctx.fillStyle = this.color
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    this.ctx.fill()
  }
}

// 初始化粒子
const initParticles = () => {
  const particleCount = Math.floor(window.innerWidth / 10)
  particles = []
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas.value))
  }
}

// 动画循环
const animate = () => {
  const ctx = canvas.value.getContext('2d')
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  // 绘制连接线
  drawConnections()
  
  // 更新并绘制粒子
  particles.forEach(particle => {
    particle.update()
    particle.draw()
  })
  
  animationId = requestAnimationFrame(animate)
}

// 绘制粒子之间的连接线
const drawConnections = () => {
  const ctx = canvas.value.getContext('2d')
  const maxDistance = 100
  
  for (let i = 0; i < particles.length; i++) {
    for (let j = i; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < maxDistance) {
        const opacity = 1 - distance / maxDistance
        ctx.strokeStyle = `rgba(150, 200, 255, ${opacity * 0.3})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      }
    }
  }
}

// 调整画布大小
const resizeCanvas = () => {
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  initParticles()
}

// 内容区域的动画盒子
const boxes = ref([
  { text: 'Vue3 Composition API', hue: 200 },
  { text: 'Script Setup Syntax', hue: 220 },
  { text: 'Dynamic Background', hue: 240 },
  { text: 'Particle Effects', hue: 260 }
])

// 生命周期钩子
onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  animate()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  cancelAnimationFrame(animationId)
})
</script>

<style scoped>
.dynamic-background {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>