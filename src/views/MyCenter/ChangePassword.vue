<template>
    <div class="change-password-container">
        <div class="change-password-card">
            <h2 class="title">修改密码</h2>
            <div class="input-group">
                <input type="password" id="oldPassword" v-model="oldPassword" required>
                <label for="oldPassword">旧密码</label>
                <div class="underline"></div>
            </div>
            <div class="input-group">
                <input type="password" id="newPassword" v-model="newPassword" required @input="checkPassword">
                <label for="newPassword">新密码</label>
                <div class="underline"></div>
            </div>
            <div class="input-group">
                <input type="password" id="confirmPassword" v-model="confirmPassword" required>
                <label for="confirmPassword">确认新密码</label>
                <div class="underline"></div>
            </div>
            <div class="password-strength">
                <div class="strength-bar" :style="{
                    'background': strength.color,
                    'width': strength.width
                }"></div>
                <div class="strength-text">密码强度: {{ strength.text }}</div>
            </div>
            <div class="button-group">
                <button class="save-btn" @click="saveChanges" :disabled="loading">
                    {{ loading ? '处理中...' : '保存更改' }}
                </button>
                <button class="cancel-btn" @click="cancelChanges" :disabled="loading">取消</button>
            </div>
            <div class="change-password-rules">
                <h4><i class="fas fa-shield-alt"></i> 密码安全要求</h4>
                <ul class="change-rules-list">
                    <li><i class="fas fa-check-circle"></i> 长度至少8个字符</li>
                    <li><i class="fas fa-check-circle"></i> 包含大小写字母</li>
                    <li><i class="fas fa-check-circle"></i> 至少包含一个数字</li>
                    <li><i class="fas fa-check-circle"></i> 至少包含一个特殊字符 (!@#$%^&*)</li>
                    <li><i class="fas fa-check-circle"></i> 不能与旧密码相同</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { changePassword, getUserInfo } from '@/api/user';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);

// 表单数据
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// 密码强度
const strength = ref({
    level: 0,    // 0: 无, 1: 弱, 2: 中, 3: 强
    text: '无',
    width: '0%',
    color: 'transparent'
});

// 用户信息
const userInfo = ref({
    password: '',
});
const originalUserInfo = ref({});

// 获取用户信息
const fetchUserInfo = async () => {
    try {
        loading.value = true;
        const token = localStorage.getItem('token');
        if (!token) {
            ElMessage.error('请先登录');
            router.push('/login');
            return;
        }

        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        userInfo.value = { ...localUser };

        const response = await getUserInfo();

        if (response.code === '0') {
            userInfo.value = response.data;
            originalUserInfo.value = { ...response.data };
            localStorage.setItem('user', JSON.stringify(response.data));
        } else {
            ElMessage.error(response.msg || '获取用户信息失败');
        }
    } catch (error) {
        ElMessage.error('获取用户信息失败，请检查网络');
        console.error('获取用户信息失败:', error);
    } finally {
        loading.value = false;
    }
};

// 检查密码强度
const checkPassword = () => {
    const password = newPassword.value;
    let score = 0;

    // 长度检测
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // 包含数字
    if (/\d/.test(password)) score += 1;

    // 包含小写字母
    if (/[a-z]/.test(password)) score += 1;

    // 包含大写字母
    if (/[A-Z]/.test(password)) score += 1;

    // 包含特殊字符
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    // 确定强度等级
    let level, text, color;
    if (password.length === 0) {
        level = 0;
        text = '无';
        color = 'transparent';
    } else if (score <= 2) {
        level = 1;
        text = '弱';
        color = '#ff4757';
    } else if (score <= 4) {
        level = 2;
        text = '中';
        color = '#ffa502';
    } else {
        level = 3;
        text = '强';
        color = '#2ed573';
    }

    // 计算宽度百分比
    const width = password.length > 0 ? `${Math.min(100, (score / 6) * 100)}%` : '0%';

    strength.value = { level, text, width, color };
};

// 保存修改
const saveChanges = async () => {
    try {
        loading.value = true;

        // 验证输入
        if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
            ElMessage.warning('所有密码字段不能为空');
            return;
        }

        if (newPassword.value !== confirmPassword.value) {
            ElMessage.warning('新密码与确认密码不一致');
            return;
        }

        if (strength.value.level < 2) {
            ElMessage.warning('密码强度不足，请使用更复杂的密码');
            return;
        }

        // 构造请求数据
        const data = {
            oldPassword: oldPassword.value,
            password: newPassword.value,
            nickname: userInfo.value.nickname,
            email: userInfo.value.email,
            phone: userInfo.value.phone
        };

        // 发送请求
        const response = await changePassword(data);

        if (response.code === '0') {
            ElMessage.success('密码修改成功');
            // 清空表单
            oldPassword.value = '';
            newPassword.value = '';
            confirmPassword.value = '';
            strength.value = {
                level: 0,
                text: '无',
                width: '0%',
                color: 'transparent'
            };

            // 重新获取用户信息
            await fetchUserInfo();
        } else {
            ElMessage.error(response.msg || '密码修改失败');

            // 处理认证失败情况
            if (response.msg.includes('未登录') || response.msg.includes('401')) {
                localStorage.removeItem('user');
                router.push('/login');
            }
        }
    } catch (error) {
        console.error('密码修改失败:', error);

        if (error.response?.status === 401) {
            ElMessage.error('登录已过期，请重新登录');
            localStorage.removeItem('user');
            router.push('/login');
        } else if (error.response?.data?.msg) {
            ElMessage.error(error.response.data.msg);
        } else {
            ElMessage.error('网络错误，请稍后重试');
        }
    } finally {
        loading.value = false;
    }
};

// 取消修改
const cancelChanges = () => {
    oldPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    strength.value = {
        level: 0,
        text: '无',
        width: '0%',
        color: 'transparent'
    };
};

// 组件挂载时获取用户信息
onMounted(() => {
    fetchUserInfo();
});
</script>

<style scoped>
.change-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 450px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 20px;
}

.change-password-card {
    width: 100%;
    padding: 2rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.351) 0%, rgba(197, 197, 197, 0.477) 100%);
    backdrop-filter: blur(25px);
    color: #fff;
    border-radius: 25px;
    max-width: 450px;
    transform: translateY(0);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.change-password-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.title {
    color: #2c3e50;
    text-align: center;
    margin-bottom: 30px;
    font-weight: 600;
    font-size: 28px;
    position: relative;
}

.title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(to right, #667eea, #764ba2);
    border-radius: 3px;
}

.input-group {
    position: relative;
    margin-bottom: 30px;
}

.input-group input {
    width: 100%;
    padding: 10px 0;
    font-size: 16px;
    color: #333;
    border: none;
    border-bottom: 1px solid #ccc;
    outline: none;
    background: transparent;
    transition: all 0.3s;
}

.input-group label {
    position: absolute;
    top: 10px;
    left: 0;
    color: #3a3a3a;
    font-size: 16px;
    pointer-events: none;
    transition: all 0.3s;
}

.input-group input:focus~label,
.input-group input:valid~label {
    top: -15px;
    left: 0;
    color: #764ba2;
    font-size: 12px;
}

.underline {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(to right, #667eea, #764ba2);
    transition: width 0.4s;
}

.input-group input:focus~.underline {
    width: 100%;
}

.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
}

button {
    padding: 12px 25px;
    border: none;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.save-btn {
    background: linear-gradient(to right, #667eea, #764ba2);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.save-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(102, 126, 234, 0.6);
}

.cancel-btn {
    background: transparent;
    color: #ffffff;
    border: 1px solid #ccc;
}

.cancel-btn:hover {
    background: #f5f5f5;
    color: #333;
}

.password-strength {
    margin-top: 30px;
}

.strength-bar {
    height: 5px;
    background: #eee;
    border-radius: 5px;
    margin-bottom: 8px;
    overflow: hidden;
    position: relative;
}

.strength-bar::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 30%;
    background: #ff4757;
    transition: all 0.3s;
}

.strength-text {
    font-size: 12px;
    color: #8d3e7c;
    text-align: right;
}

/* 密码强度变化的动态效果 */
.password-strength {
    margin-top: 10px;
    width: 100%;
}

.strength-bar {
    height: 4px;
    border-radius: 2px;
    transition: all 0.3s ease;
    margin-bottom: 5px;
}

.strength-text {
    font-size: 12px;
    transition: all 0.3s ease;
}

.change-password-rules {
    background-color: rgba(255, 255, 255, 0.25);
    border-radius: 12px;
    padding: 20px;
    margin-top: 30px;
}

.change-password-rules h4 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 1.2rem;
}

.change-rules-list {
    color: #000;
    list-style-type: none;
}

.change-rules-list li {
    padding: 8px 0;
    display: flex;
    align-items: center;
}

.change-rules-list li i {
    margin-right: 10px;
    color: #3498db;
}
</style>