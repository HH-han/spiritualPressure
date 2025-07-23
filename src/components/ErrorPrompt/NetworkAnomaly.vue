<template>
    <div class="network-error-container">
        <div class="network-error-content">
            <div class="animation-container">
                <div class="wifi-icon">
                    <div class="wifi-circle first"></div>
                    <div class="wifi-circle second"></div>
                    <div class="wifi-circle third"></div>
                    <div class="wifi-circle fourth"></div>
                    <div class="wifi-dot"></div>
                </div>
                <div class="error-bolt">
                    <svg viewBox="0 0 24 24" width="48" height="48">
                        <path fill="currentColor" d="M11 15H6l7-14v8h5l-7 14v-8Z" />
                    </svg>
                </div>
            </div>
            <h1 class="error-title">连接异常</h1>
            <p class="error-message">
                无法连接到服务器，请检查您的网络设置
                <br />
                或者尝试以下解决方案
            </p>

            <div class="troubleshoot-steps">
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>检查有线网络或Wi-Fi</h3>
                        <p>确保您的设备已连接到网络并开启数据流量</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>联系技术支持</h3>
                        <p>如果问题仍然存在，请联系您的网络服务提供商</p>
                        <p>您也可以尝试访问我们的官方网站获取更多帮助</p>
                        <h3>电子邮箱:</h3>
                        <p><a href="mailto:support@qq.com">2560177364@qq.com</a></p>
                    </div>
                </div>
            </div>

            <div class="network-error-actions">
                <button @click="reloadPage" class="network-action-button primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                        <path
                            d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                    </svg>
                    重新加载
                </button>
                <button @click="openNetworkSettings" class="network-action-button secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path
                            d="M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6ZM6.646 4.646l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448c.82-1.641 1.717-2.753 2.093-3.13Z" />
                    </svg>
                    网络设置
                </button>
                <button @click="diagnoseConnection" class="network-action-button tertiary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 13V2a6 6 0 1 1 0 12Z" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3.5a.5.5 0 0 1-.5-.5v-4A.5.5 0 0 1 8 4Z" />
                    </svg>
                    诊断连接
                </button>
            </div>
        </div>
        <div class="network-status">
            <div class="status-item">
                <span class="status-label">网络状态:</span>
                <span class="status-value offline">离线</span>
            </div>
            <div class="status-item">
                <span class="status-label">最后在线:</span>
                <span class="status-value">{{ lastOnlineTime }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router';

const router = useRouter();
const lastOnlineTime = ref('刚刚')

function reloadPage() {
    console.log('重新加载页面...')
    router.push('/systemhomeView')
}
const openNetworkSettings = () => {
    // 在实际应用中，这里可以链接到设备的网络设置
    ElMessage.warning('请在设备设置中检查网络连接')
}

const diagnoseConnection = () => {
    // 模拟网络诊断
    ElMessage.success('开始诊断网络连接...')
}

// 模拟获取最后在线时间
onMounted(() => {
    const now = new Date()
    lastOnlineTime.value = now.toLocaleTimeString()
})
</script>

<style scoped>
.network-error-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%);
    color: white;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 2rem;
    text-align: center;
}

.network-error-content {
    max-width: 800px;
    width: 100%;
    animation: fadeIn 0.8s ease-out;
}

.animation-container {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto 2rem;
}

.wifi-icon {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto;
}

.wifi-circle {
    position: absolute;
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    border-top-color: transparent;
    border-left-color: transparent;
    transform: rotate(45deg);
    animation: wifiPulse 2s infinite ease-in-out;
}

.wifi-circle.first {
    width: 120px;
    height: 120px;
    top: 0;
    left: 0;
    animation-delay: 0s;
}

.wifi-circle.second {
    width: 90px;
    height: 90px;
    top: 15px;
    left: 15px;
    animation-delay: 0.2s;
}

.wifi-circle.third {
    width: 60px;
    height: 60px;
    top: 30px;
    left: 30px;
    animation-delay: 0.4s;
}

.wifi-circle.fourth {
    width: 30px;
    height: 30px;
    top: 45px;
    left: 45px;
    animation-delay: 0.6s;
}

.wifi-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    top: 56px;
    left: 56px;
}

.error-bolt {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ff4757;
    opacity: 0;
    animation: boltFlash 3s infinite;
}

.error-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.error-message {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.troubleshoot-steps {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin: 2rem 0;
    text-align: left;
}

.step {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    transition: transform 0.3s ease;
}

.step:hover {
    transform: translateX(5px);
    background: rgba(255, 255, 255, 0.15);
}

.step-number {
    background: white;
    color: #2c3e50;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
}

.step-content h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
}

.step-content p {
    margin: 0;
    opacity: 0.8;
    font-size: 0.95rem;
}
.step-content a {
    color: #4ca1af;
    text-decoration: none;
    font-size: 20px;

}
.step-content a:hover {
    text-decoration: underline;
}

.network-error-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 2rem;
}

.network-action-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    font-size: 1rem;
}

.network-action-button svg {
    transition: transform 0.3s ease;
}

.network-action-button:hover svg {
    transform: scale(1.1);
}

.primary {
    background: white;
    color: #2c3e50;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.primary:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.tertiary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid transparent;
}

.tertiary:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.network-status {
    margin-top: 3rem;
    display: flex;
    gap: 2rem;
    font-size: 0.9rem;
    opacity: 0.8;
}

.status-item {
    display: flex;
    gap: 0.5rem;
}

.status-label {
    font-weight: 600;
}

.status-value.offline {
    color: #ff6b81;
    font-weight: 600;
}

@keyframes wifiPulse {
    0% {
        opacity: 0.2;
    }

    50% {
        opacity: 0.05;
    }

    100% {
        opacity: 0.2;
    }
}

@keyframes boltFlash {

    0%,
    60%,
    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
    }

    10%,
    50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .error-title {
        font-size: 2rem;
    }

    .error-message {
        font-size: 1rem;
    }

    .network-error-actions {
        flex-direction: column;
        align-items: center;
    }

    .network-action-button {
        width: 100%;
        max-width: 250px;
        justify-content: center;
    }

    .network-status {
        flex-direction: column;
        gap: 0.5rem;
    }

    .step {
        padding: 1rem;
    }
}
</style>