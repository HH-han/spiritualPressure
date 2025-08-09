<template>
    <div>
        <Login_background />
    </div>
    <div class="login-container">
        <h2>邮箱验证码登录</h2>
        <form @submit.prevent="handleSubmit" class="login-form">
            <div class="form-group">
                <label>邮箱:</label>
                <input v-model="email" type="email" required placeholder="请输入邮箱">
            </div>

            <div class="form-group">
                <label>验证码:</label>
                <input v-model="code" type="text" required placeholder="请输入验证码">
            </div>
            <div class="form-group code-group">
                <button type="button" @click="sendCode" :disabled="isSending">
                    {{ sendBtnText }}
                </button>
            </div>
            <button type="submit" class="login-btn">登录</button>
        </form>
    </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import Login_background from '@/components/LoginComponent/Login_background.vue';
import { ElMessage } from 'element-plus';
import { Emaillogin, EmailCaptcha } from '@/api/user';
import { useRouter } from 'vue-router';

// 定义响应式数据
const email = ref('');
const code = ref('');
const isSending = ref(false);
const countdown = ref(0);
const timer = ref(null);

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
        isSending.value = false;
        countdown.value = 0;
        clearInterval(timer.value);
    }
};

// 提交表单
const handleSubmit = async () => {
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
            router.push('/systemhomeView');
        } else {
            ElMessage.error('登录失败/使用账号密码登录');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }
    } catch (error) {
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
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-width: 420px;
    padding: 2.5rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
    border-radius: 15px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2),
        0 5px 15px rgba(0, 0, 0, 0.1);
    font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
}

.login-container:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25),
        0 8px 20px rgba(0, 0, 0, 0.15);
}

.login-container h2 {
    text-align: center;
    color: #3a4a6d;
    margin-bottom: 2rem;
    font-size: 1.8rem;
    font-weight: 600;
    letter-spacing: 1px;
    position: relative;
}

.login-container h2::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, #6a11cb, #2575fc);
    margin: 0.5rem auto 0;
    border-radius: 3px;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    position: relative;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #5a6a8a;
    font-size: 0.9rem;
    font-weight: 500;
}

.form-group input {
    width: 100%;
    padding: 0.8rem 1.2rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
    transition: all 0.3s ease;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.form-group input:focus {
    outline: none;
    border-color: #6a11cb;
    box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
    background: white;
}

.form-group input::placeholder {
    color: #b8c2d9;
}

.code-group {
    position: relative;
    display: flex;
    justify-content: flex-end;
}

.code-group button {
    width: 100%;
    height: 40px;
    padding: 0 1.2rem;
    background: linear-gradient(to right, #4778dc, #60f6bc);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(106, 17, 203, 0.3);
}

.code-group button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(106, 17, 203, 0.4);
}

.code-group button:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: translateY(50%);
    box-shadow: none;
}

.login-btn {
    width: 100%;
    padding: 0.9rem;
    background: linear-gradient(to right, #6a11cb, #2575fc);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 0.5rem;
    box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
    letter-spacing: 0.5px;
}

.login-btn:hover {
    background: linear-gradient(to right, #5a0cb0, #1a68f0);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
}

.login-btn:active {
    transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 480px) {
    .login-container {
        padding: 1.5rem;
        margin: 2vh auto;
    }

    .code-group button {
        position: relative;
        transform: none;
        top: auto;
        right: auto;
        margin-top: 0.8rem;
        width: 100%;
    }
}
</style>