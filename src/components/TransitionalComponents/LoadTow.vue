<template>
	<div class="loading-wrapper">
		<div class="loading-container">
			<div class="loading-header">
				<h1 class="glowing-text">Vue3应用</h1>
				<p class="loading-subtitle">使用Vue3的反应式系统体验Web应用程序的未来,优化的性能</p>
			</div>

			<div class="cube-container">
				<div class="preloader">
					<div class="spinner">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
			</div>

			<div class="progress-container">
				<div class="progress-bar" :style="{ width: progress + '%' }"></div>
			</div>
			<div class="progress-text">{{ progress }}% 完成</div>

			<div class="loading-info">
				<div class="info-item"><i class="fas fa-microchip"></i> 初始化组件</div>
				<div class="info-item"><i class="fas fa-database"></i> 加载数据</div>
				<div class="info-item"><i class="fas fa-paint-brush"></i> 渲染UI</div>
			</div>
		</div>

		<div class="particles" ref="particles"></div>

		<div class="loading-complete" :class="{ show: loadingComplete }">
			<div class="complete-content">
				<h2>准备完成！</h2>
				<p>您的Vue3应用程序已成功加载</p>
				<button class="launch-button" @click="startApplication">进入应用程序</button>
			</div>
		</div>
	</div>
	<div class="accountsettings-background">
		<img src="@/assets/scenery/风景2.webp" alt="background" />
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter();
const progress = ref(0);
const loadingComplete = ref(false);
const particles = ref(null);
let autoRedirectTimer = null;

const createParticles = () => {
	if (!particles.value) return;

	const count = 50;
	for (let i = 0; i < count; i++) {
		const particle = document.createElement('div');
		particle.classList.add('particle');

		const size = Math.random() * 10 + 2;
		particle.style.width = `${size}px`;
		particle.style.height = `${size}px`;

		const startX = Math.random() * window.innerWidth;
		const startY = Math.random() * window.innerHeight + window.innerHeight;
		particle.style.left = `${startX}px`;
		particle.style.top = `${startY}px`;

		const delay = Math.random() * 15;
		particle.style.animationDelay = `${delay}s`;

		particles.value.appendChild(particle);
	}
};

const simulateLoading = () => {
  const interval = setInterval(() => {
    progress.value += Math.floor(Math.random() * 10) + 3; // 增大增量
    
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(interval);
      setTimeout(() => {
        loadingComplete.value = true;
        autoRedirectTimer = setTimeout(() => {
          startApplication();
        }, 3000); // 缩短自动跳转等待时间
      }, 500); // 缩短完成延迟
    }
  }, 150); // 缩短更新间隔
};

const startApplication = () => {
	if (autoRedirectTimer) {
		clearTimeout(autoRedirectTimer);
		autoRedirectTimer = null;
	}
	router.push('/systemhomeView');
};

onMounted(() => {
	createParticles();
	simulateLoading();
});

onUnmounted(() => {
	if (autoRedirectTimer) {
		clearTimeout(autoRedirectTimer);
	}
});
</script>

<style scoped>
.loading-wrapper {
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(197, 197, 197, 0.2) 100%);
	backdrop-filter: blur(10px);
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	color: white;
	width: 100%;
	position: relative;
	z-index: 10;
}

.loading-container {
	width: 100%;
	max-width: 1000px;
	text-align: center;
	padding: 2rem;
	position: relative;
	z-index: 10;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 3rem;
}

.loading-header {
	margin-bottom: 1rem;
}

.glowing-text {
	font-size: 3.5rem;
	font-weight: 800;
	letter-spacing: 2px;
	text-transform: uppercase;
	background: linear-gradient(90deg, #ffffff, #c2e9fb);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	background-size: 300% 300%;
	animation: gradient-shift 4s ease infinite;
	text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

@keyframes gradient-shift {
	0% {
		background-position: 0% 50%;
	}

	50% {
		background-position: 100% 50%;
	}

	100% {
		background-position: 0% 50%;
	}
}

.loading-subtitle {
	font-size: 1.2rem;
	color: rgba(255, 255, 255, 0.8);
	max-width: 600px;
	margin: 0 auto;
	line-height: 1.6;
}

.cube-container {
	perspective: 800px;
	margin: 0 auto;
	width: 200px;
}

/* From Uiverse.io by himanshu9682 */
.preloader {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.spinner {
	width: 100px;
	height: 100px;
	position: relative;
	animation: spinner 1.6s infinite ease;
	transform-style: preserve-3d;
}

.spinner>div {
	background-color: rgba(255, 255, 255, 0.1);
	height: 100%;
	position: absolute;
	width: 100%;
	border: 4px solid rgb(218, 218, 218);
	border-radius: 50%;
}

.spinner div:nth-of-type(1) {
	transform: translateZ(-35px) rotateY(180deg);
}

.spinner div:nth-of-type(2) {
	transform: rotateY(-270deg) translateX(50%);
	transform-origin: top right;
}

.spinner div:nth-of-type(3) {
	transform: rotateY(270deg) translateX(-50%);
	transform-origin: center left;
}

.spinner div:nth-of-type(4) {
	transform: rotateX(90deg) translateY(-50%);
	transform-origin: top center;
}

.spinner div:nth-of-type(5) {
	transform: rotateX(-90deg) translateY(50%);
	transform-origin: bottom center;
}

.spinner div:nth-of-type(6) {
	transform: translateZ(35px);
}

@keyframes spinner {
	0% {
		transform: rotate(0deg) rotateX(0deg) rotateY(0deg);
	}

	50% {
		transform: rotate(180deg) rotateX(180deg) rotateY(180deg);
	}

	100% {
		transform: rotate(360deg) rotateX(360deg) rotateY(360deg);
	}
}

.particles {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 1;
}

.particle {
	position: absolute;
	background: rgba(255, 255, 255, 0.6);
	border-radius: 50%;
	animation: float 15s infinite linear;
	backdrop-filter: blur(2px);
}

.progress-container {
	width: 80%;
	max-width: 500px;
	height: 12px;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 10px;
	overflow: hidden;
	position: relative;
	backdrop-filter: blur(5px);
	border: 1px solid rgba(255, 255, 255, 0.2);
}

.progress-bar {
	height: 100%;
	background: linear-gradient(90deg, #ff4e50, #f9d423, #ec008c, #00c9ff);
	width: 0%;
	border-radius: 10px;
	transition: width 0.5s ease;
	box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.progress-text {
	margin-top: 10px;
	font-size: 1.1rem;
	color: rgba(255, 255, 255, 0.9);
}

.loading-info {
	display: flex;
	justify-content: center;
	gap: 2rem;
	margin-top: 1.5rem;
	flex-wrap: wrap;
}

.info-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.9rem;
	background: rgba(255, 255, 255, 0.1);
	padding: 0.5rem 1rem;
	border-radius: 20px;
	backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.2);
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

@keyframes rotate {
	0% {
		transform: rotateX(0) rotateY(0) rotateZ(0);
	}

	100% {
		transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
	}
}

@keyframes float {
	0% {
		transform: translateY(0) translateX(0) rotate(0deg);
		opacity: 0;
	}

	10% {
		opacity: 1;
	}

	90% {
		opacity: 1;
	}

	100% {
		transform: translateY(-100vh) translateX(100px) rotate(360deg);
		opacity: 0;
	}
}

.loading-complete {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(10px);
	z-index: 20;
	opacity: 0;
	pointer-events: none;
	transition: opacity 1s ease;
}

.loading-complete.show {
	opacity: 1;
	pointer-events: all;
}

.complete-content {
	text-align: center;
	max-width: 600px;
	padding: 2rem;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10px);
	border-radius: 16px;
	border: 1px solid rgba(255, 255, 255, 0.2);
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.complete-content h2 {
	font-size: 3rem;
	margin-bottom: 1.5rem;
	color: white;
	text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.complete-content p {
	font-size: 1.2rem;
	margin-bottom: 2rem;
	line-height: 1.6;
	color: rgba(255, 255, 255, 0.9);
}

.launch-button {
	background: rgba(255, 255, 255, 0.9);
	color: #0f0c29;
	border: none;
	padding: 12px 40px;
	font-size: 1.2rem;
	font-weight: bold;
	border-radius: 30px;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(5px);
	border: 1px solid rgba(255, 255, 255, 0.3);
}

.launch-button:hover {
	transform: translateY(-3px);
	background: rgba(255, 255, 255, 1);
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* 固定背景层 */
.accountsettings-background {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 0;
}

.accountsettings-background img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	filter: blur(10px) brightness(0.8);
}

@media (max-width: 768px) {
	.glowing-text {
		font-size: 2.5rem;
	}

	.cube-container {
		width: 150px;
		height: 150px;
	}

	.cube-face {
		width: 150px;
		height: 150px;
		font-size: 2rem;
	}

	.front {
		transform: translateZ(75px);
	}

	.back {
		transform: rotateY(180deg) translateZ(75px);
	}

	.right {
		transform: rotateY(90deg) translateZ(75px);
	}

	.left {
		transform: rotateY(-90deg) translateZ(75px);
	}

	.top {
		transform: rotateX(90deg) translateZ(75px);
	}

	.bottom {
		transform: rotateX(-90deg) translateZ(75px);
	}
}
</style>