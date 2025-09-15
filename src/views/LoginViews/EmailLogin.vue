<template>
    <div>
        <Login_background />
    </div>
    <div class="login-container">
        <h2>邮箱验证码登录</h2>
        <form @submit.prevent="handleSubmit" class="login-form">
            <div class="form-group">
                <div class="input-group">
                    <label>邮箱:</label>
                    <input v-model="email" type="email" required placeholder="请输入邮箱">
                </div>
                <div class="code-group">
                    <label>验证码:</label>
                    <button type="button" @click="sendCode" :disabled="isSending">
                        {{ sendBtnText }}
                    </button>
                </div>
            </div>
        </form>
    </div>
    <!-- 验证码弹窗 -->
    <div>
        <Captcha v-if="showCaptcha" @verify="receivedCode => {
            code = receivedCode
            showCaptcha = false
            handleSubmit()
        }" />
    </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import Login_background from '@/components/LoginComponent/Login_background.vue';
import Captcha from '@/components/PromptComponent/CaptchamodalBox.vue';
import { ElMessage } from 'element-plus';
import { Emaillogin, EmailCaptcha } from '@/api/user';
import { useRouter } from 'vue-router';

// 定义响应式数据
const email = ref('');
const code = ref('');
const isSending = ref(false);
const countdown = ref(0);
const timer = ref(null);
const showCaptcha = ref(false);

// 路由实例
const router = useRouter();

// 计算属性：发送按钮的文本
const sendBtnText = computed(() => {
    return countdown.value > 0 ? `${countdown.value}秒后重试` : '获取验证码';
});

// 发送验证码
const sendCode = async () => {
    if (!email.value || !email.value.trim()) {
        ElMessage.warning('请输入有效的邮箱地址');
        showCaptcha.value = false;
        return;
    }

    if (isSending.value) return;

    isSending.value = true;
    countdown.value = 60;

    try {
        const response = await EmailCaptcha({
            email: email.value
        });

        ElMessage.success('验证码已发送，请查收邮箱');
        showCaptcha.value = true;

        // 开始倒计时
        timer.value = setInterval(() => {
            countdown.value--;
            if (countdown.value <= 0) {
                clearInterval(timer.value);
                isSending.value = false;
            }
        }, 1000);
    } catch (error) {
        ElMessage.error('发送验证码失败: ' + (error.response?.data?.message || error.message));
        showCaptcha.value = false;
        isSending.value = false;
        countdown.value = 0;
        clearInterval(timer.value);
    }
};

// 提交表单
const handleSubmit = async () => {
    console.log('提交表单:', email.value, code.value);
    if (!email.value || !code.value) {
        ElMessage.warning('请输入邮箱和验证码');
        return;
    }

    if (!email.value.trim()) {
        ElMessage.error('邮箱不能为空');
        return;
    }

    try {
        // 清除旧的token和用户数据
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        const response = await Emaillogin({
            email: email.value.trim(),
            code: code.value
        });

        console.log('登录响应:', response);

        if (response.code === '0') {
            // 严格验证响应数据结构
            if (!response.data?.token || !response.data?.user) {
                throw new Error('响应数据不完整');
            }

            const { user, token } = response.data;

            // 验证必要字段
            if (!token || !user?.email) {
                throw new Error('无效的用户数据');
            }

            // 存储用户数据
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            ElMessage.success('登录成功！');
            // 跳转
            router.push({ name: 'systemhomeView' });
        } else {
            ElMessage.error('登录失败/使用账号密码登录');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }
    } catch (error) {
        showCaptcha.value = true;
        ElMessage.error('登录失败: ' + (error.response?.data?.message || error.message));
    }

};

// 组件销毁时清除定时器
onUnmounted(() => {
    clearInterval(timer.value);
});
</script>

<style scoped>
.login-container {
    color: white;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    max-width: 480px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.18);
    transition: all 0.3s ease;
}

.login-container:hover {
    
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.5);
}

/* 标题样式 */
.login-container h2 {
    color: #fff;
    text-align: center;
    margin-bottom: 30px;
    font-weight: 600;
    font-size: 28px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 表单组样式 */
.form-group {
    position: relative;
    display: flex;
    gap: 10px;
}

.input-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}

/* 标签样式 */
.input-group label,
.code-group label {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
}

/* 输入框样式 */
.input-group input {
    width: 100%;
    padding: 14px 16px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-size: 15px;
    outline: none;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.input-group input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.input-group input:focus {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

/* 验证码按钮组 */
.code-group {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
}

/* 按钮样式 */
.code-group button {
    padding: 14px 20px;
    background: rgba(255, 255, 255, 0.3);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.code-group button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.code-group button:active:not(:disabled) {
    transform: translateY(0);
}

.code-group button:disabled {
    background: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 480px) {
    .login-container {
        width: 90%;
        padding: 30px 25px;
    }
    
    .login-container h2 {
        font-size: 24px;
    }
}
</style>