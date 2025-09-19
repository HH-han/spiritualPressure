<template>
    <div v-if="isMobile" class="container-mobile">
        <div class="card-mobile">
            <div class="content-section">
                <div class="mobile-warning">
                    <i class="fas fa-exclamation-circle warning-icon"></i>
                    <div>
                        <h2>移动端正在适配中</h2>
                        <p>请使用PC端进行访问以获得最佳体验</p>
                    </div>
                </div>

                <p>我们检测到您正在使用移动设备访问本站点。目前我们的移动版本仍在优化中，部分功能可能无法正常使用。</p>

                <ul class="feature-list">
                    <li><i class="fas fa-check-circle"></i> 响应式设计开发中</li>
                    <li><i class="fas fa-check-circle"></i> 触控交互优化中</li>
                    <li><i class="fas fa-check-circle"></i> 移动端性能调优中</li>
                </ul>

                <p>给您带来的不便，我们深表歉意。请您使用桌面设备访问，或稍后再试。</p>

                <div class="footer">
                    <p>© 2023 设备检测页面 | 为您提供更好的用户体验</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { createApp, ref, onMounted } from 'vue';

const isMobile = ref(false);
const userAgent = ref(navigator.userAgent);
const screenWidth = ref(window.innerWidth);
const screenHeight = ref(window.innerHeight);

const checkDevice = () => {
    // 多种方式检测移动设备
    const mobileAgents = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    // 检查用户代理
    const isMobileAgent = mobileAgents.some(agent =>
        navigator.userAgent.match(agent)
    );

    // 检查屏幕尺寸和触摸支持
    const hasTouchPoint = navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 768;

    // 综合判断是否为移动设备
    isMobile.value = isMobileAgent || (hasTouchPoint && isSmallScreen);

    // 更新屏幕信息
    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight;
};

onMounted(() => {
    checkDevice();
    window.addEventListener('resize', checkDevice);
});

</script>
<style scoped>
.container-mobile {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 100%;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    z-index: 1000;
    background-color: rgb(0, 0, 0);
}

.card-mobile {
    background: rgb(255, 255, 255);
    backdrop-filter: blur(10px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    transition: all 0.3s ease;
}

.content-section {
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.mobile-warning {
    background: #fff4f4;
    border-left: 5px solid #ff6b6b;
    padding: 20px;
    border-radius: 8px;
    margin: 25px 0;
    display: flex;
    align-items: center;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.4);
    }

    70% {
        box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
    }
}

.warning-icon {
    font-size: 28px;
    color: #ff6b6b;
    margin-right: 15px;
}

.feature-list {
    list-style: none;
    margin: 20px 0;
}

.feature-list li {
    padding: 10px 0;
    display: flex;
    align-items: center;
}

.feature-list i {
    color: #6e8efb;
    margin-right: 10px;
    font-size: 18px;
}

.footer {
    margin-top: 30px;
    text-align: center;
    color: #6c757d;
    font-size: 14px;
}
</style>