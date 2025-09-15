<template>
    <div class="error-container">
        <div class="error-content">
            <div class="error-animation">
                <div class="circle circle-1"></div>
                <div class="circle circle-2"></div>
                <div class="circle circle-3"></div>
                <div class="error-icon">500</div>
            </div>
            <h1 class="error-title">服务器内部错误</h1>
            <p class="error-message">
                抱歉，服务器遇到了意外情况，无法完成您的请求。
                <br />
                我们的工程师已经收到通知，正在努力解决问题。
            </p>
            <div class="error-actions">
                <button @click="reloadPage" class="action-button primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                        <path
                            d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                    </svg>
                    刷新页面
                </button>
                <button @click="goHome" class="action-button secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path
                            d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z" />
                    </svg>
                    返回首页
                </button>
                <button @click="goLogin" class="action-button login">
                    <svg t="1751639639241" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="4645" width="16" height="16">
                        <path
                            d="M575.215 547.318c53.367-24.316 90.562-78.011 90.562-140.522 0-85.257-69.149-154.383-154.406-154.383-85.299 0-154.427 69.126-154.427 154.383 0 62.49 37.172 116.185 90.562 140.522-87.156 27.24-150.586 108.698-150.586 204.715 0 12.071 9.779 21.827 21.827 21.827s21.827-9.756 21.827-21.827c0-94.161 76.613-170.774 170.776-170.774 94.184 0 170.797 76.613 170.797 170.774 0 12.071 9.756 21.827 21.827 21.827 12.07 0 21.827-9.756 21.827-21.827 0.021-95.994-63.43-177.475-150.586-204.715zM400.621 406.817c0-61.072 49.678-110.729 110.773-110.729 61.072 0 110.75 49.657 110.75 110.729 0 61.094-49.678 110.794-110.75 110.794-61.095 0-110.773-49.7-110.773-110.794z"
                            p-id="4646" fill="#ffffff"></path>
                        <path
                            d="M511.371 960.81c-246.951 0-447.869-200.918-447.869-447.891 0-246.93 200.919-447.871 447.869-447.871 246.973 0 447.892 200.919 447.892 447.871 0 246.973-200.919 447.891-447.892 447.891z m0-854.269c-224.098 0-406.398 182.301-406.398 406.377s182.3 406.397 406.398 406.397c224.099 0 406.42-182.321 406.42-406.397S735.47 106.541 511.371 106.541z"
                            p-id="4647" fill="#ffffff"></path>
                    </svg>
                    返回登录
                </button>
                <button @click="contactSupport" class="action-button tertiary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path
                            d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                    </svg>
                    联系支持
                </button>
            </div>
        </div>
        <div class="error-footer">
            <p>© 2023 您的公司名称. 保留所有权利.</p>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const reloadPage = () => {
    window.location.reload()
}

const goHome = () => {
   router.push({ name: 'systemhomeView' });
}
const goLogin = () => {
    router.push('/login')
}
const contactSupport = () => {
    window.location.href = 'mailto:support@example.com'
}
</script>

<style scoped>
.error-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 2rem;
    text-align: center;
}

.error-content {
    max-width: 800px;
    width: 100%;
    animation: fadeIn 0.8s ease-out;
}

.error-animation {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto 2rem;
}

.circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: pulse 3s infinite ease-in-out;
}

.circle-1 {
    width: 200px;
    height: 200px;
    animation-delay: 0s;
}

.circle-2 {
    width: 160px;
    height: 160px;
    top: 20px;
    left: 20px;
    animation-delay: 0.5s;
}

.circle-3 {
    width: 120px;
    height: 120px;
    top: 40px;
    left: 40px;
    animation-delay: 1s;
}

.error-icon {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 50px;
    left: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    font-weight: bold;
    color: white;
    background: rgba(255, 0, 0, 0.7);
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
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

.error-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.action-button {
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

.action-button svg {
    transition: transform 0.3s ease;
}

.action-button:hover svg {
    transform: scale(1.1);
}

.primary {
    background: white;
    color: #764ba2;
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
.login {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid transparent;
}
.login:hover { 
    background: rgba(255, 255, 255, 0.2);
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

.error-footer {
    margin-top: 3rem;
    opacity: 0.7;
    font-size: 0.9rem;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 0.7;
    }

    50% {
        transform: scale(1.05);
        opacity: 0.3;
    }

    100% {
        transform: scale(1);
        opacity: 0.7;
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

    .error-actions {
        flex-direction: column;
        align-items: center;
    }

    .action-button {
        width: 100%;
        max-width: 250px;
        justify-content: center;
    }
}
</style>