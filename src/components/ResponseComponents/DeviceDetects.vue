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

                <p>我们检测到您正在使用移动设备访问本站点。目前我的移动版本仍在优化中，部分功能可能无法正常使用。</p>

                <ul class="feature-list">
                    <li><i class="fas fa-check-circle"></i> 响应式设计开发中</li>
                    <li><i class="fas fa-check-circle"></i> 触控交互优化中</li>
                    <li><i class="fas fa-check-circle"></i> 移动端性能调优中</li>
                </ul>

                <p>给您带来的不便，我深表歉意。请您使用桌面设备访问，或稍后再试。</p>

                <div class="footer">
                    <p>© 2025 设备检测页面 | 为您提供更好的用户体验</p>
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

defineExpose({ isMobile });

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

    // 保存旧的屏幕尺寸用于比较
    const oldWidth = screenWidth.value;
    const oldHeight = screenHeight.value;

    // 更新屏幕信息
    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight;

    // 综合判断是否为移动设备
    isMobile.value = isMobileAgent || (hasTouchPoint && isSmallScreen);

    // 检测到屏幕尺寸发生显著变化时刷新页面
    if (Math.abs(oldWidth - screenWidth.value) > 50 || Math.abs(oldHeight - screenHeight.value) > 50) {
        window.location.reload();
    }
};

onMounted(() => {
    checkDevice();
    window.addEventListener('resize', checkDevice);
});

</script>
<style scoped>
.container-mobile {
    width: 100%;
    height: 100%;
    max-width: 500px;
    position: fixed;
    z-index: 1000;
    background: linear-gradient(135deg, #1a2a6c, #1f92b2, #1a2a6c);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
}
@keyframes gradientBG {
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
.card-mobile {
    width: 90%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
    animation: cardEntrance 0.6s ease-out;
}

.content-section {
    padding: 35px 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.mobile-warning {
    background: linear-gradient(135deg, #fff6f6 0%, #ffecec 100%);
    border-left: 5px solid #ff6b6b;
    padding: 25px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 15px;
    animation: pulse 2s infinite;
    margin-bottom: 10px;
}

.warning-icon {
    font-size: 36px;
    color: #ff6b6b;
    flex-shrink: 0;
}

.mobile-warning h2 {
    color: #d14545;
    font-size: 22px;
    margin-bottom: 5px;
    font-weight: 600;
}

.mobile-warning p {
    color: #e67272;
    font-size: 16px;
    font-weight: 500;
}

.content-section>p {
    color: #555;
    line-height: 1.6;
    font-size: 16px;
    text-align: center;
}

.feature-list {
    list-style: none;
    margin: 15px 0;
    background: #f8f9ff;
    border-radius: 12px;
    padding: 20px;
    border: 1px solid #e6e9ff;
}

.feature-list li {
    padding: 12px 0;
    display: flex;
    align-items: center;
    color: #4a5568;
    font-size: 16px;
    border-bottom: 1px solid #edf2f7;
}

.feature-list li:last-child {
    border-bottom: none;
}

.feature-list i {
    color: #6e8efb;
    margin-right: 12px;
    font-size: 20px;
}

.footer {
    margin-top: 15px;
    text-align: center;
    color: #718096;
    font-size: 14px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.4);
    }

    70% {
        box-shadow: 0 0 0 12px rgba(255, 107, 107, 0);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
    }
}

@keyframes cardEntrance {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>