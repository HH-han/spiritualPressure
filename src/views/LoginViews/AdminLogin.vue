<template>
  <div class="admin-login-container">
    <div class="admin-login-form-container">
      <div class="admin-login-header">
        <h2 class="admin-login-title">管理员登录</h2>
        <p class="admin-login-subtitle">欢迎回来，请登录您的账户</p>
      </div>

      <form @submit.prevent="handleLogin" class="admin-login-form">
        <div class="admin-login-form-group">
          <label for="username" class="admin-login-label">用户名</label>
          <input type="text" id="username" v-model="loginForm.username" class="admin-login-input" placeholder="请输入用户名"
            required />
          <span class="admin-login-focus-border"></span>
        </div>

        <div class="admin-login-form-group">
          <label for="password" class="admin-login-label">密码</label>
          <input type="password" id="password" v-model="loginForm.password" class="admin-login-input"
            placeholder="请输入密码" required />
          <span class="admin-login-focus-border"></span>
        </div>

        <div class="admin-login-options">
          <label class="admin-login-remember">
            <input type="checkbox" v-model="rememberMe" />
            <span class="admin-login-checkmark"></span>
            记住我
          </label>
          <a href="#" class="admin-login-forgot">忘记密码?</a>
        </div>

        <button type="submit" class="admin-login-button">
          <span class="admin-login-button-text">登录</span>
          <span class="admin-login-button-loader" v-if="loading"></span>
        </button>
      </form>

      <div class="admin-login-footer">
        <p class="admin-login-copyright">© 博览 系统管理后台. 保留所有权利.</p>
      </div>
    </div>
  </div>
  <div>
    <!-- 背景样式 -->
    <DynamicParticle />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';
import DynamicParticle from '@/components/ThemeComponents/DynamicParticle.vue';

const router = useRouter();

// 状态管理
const showError = ref(false);
const errorMessage = ref('');

// 登录表单数据
const loginForm = ref({
  username: '',
  password: ''
});

// 记住用户名功能
const rememberMe = ref(false);

/**
 * 处理登录逻辑
 */
const handleLogin = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  errorMessage.value = '';
  showError.value = false;

  if (!loginForm.value.username || !loginForm.value.password) {
    errorMessage.value = '请输入账号和密码';
    showError.value = true;
    return;
  }

  try {
    const response = await request.post('/api/public/user/adminlogin', {
      username: loginForm.value.username,
      password: loginForm.value.password,
    });

    console.log('登录响应:', response);

    if (response.code === '0') {
      // 严格验证响应数据结构
      if (!response.data?.token || !response.data?.user) {
        throw new Error('响应数据不完整');
      }

      const { user, token } = response.data;

      // 验证必要字段
      if (!token || !user?.username) {
        throw new Error('无效的用户数据');
      }
      // 记住用户名处理
      if (rememberMe.value) {
        localStorage.setItem('rememberedUsername', user.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
      // 保存token和用户信息到本地存储
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      // 如果是admin账号，跳转到指定页面
      if (user.permissions === 1) {
        router.push('/AdminLayout');
      } else {
        ElMessage.error('请输入管理员账号登录');
      }
    } else {
      errorMessage.value = response.msg || '登录失败';
      showError.value = true;
    }
  } catch (error) {
    errorMessage.value = error.message || '登录失败，请检查账户/密码';
    showError.value = true;
    console.error('登录失败:', error);
  }
};

// 挂载逻辑
onMounted(() => {
  const rememberedUsername = localStorage.getItem('rememberedUsername');
  if (rememberedUsername) {
    loginForm.value.username = rememberedUsername;
    loginForm.value.hasInput = true;
    rememberMe.value = true;
  }
});
</script>

<style scoped>
/* 基础样式 */
.admin-login-container {
  position: absolute;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 登录表单容器 */
.admin-login-form-container {
  animation: fadeInUp 1s ease-out;
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  backdrop-filter: blur(8px);
  padding: 40px;
  margin: 20px;
  transition: all 0.3s ease;
}

.admin-login-form-container:hover {
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.25);
}

/* 头部样式 */
.admin-login-header {
  text-align: center;
  margin-bottom: 30px;
}

.admin-login-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  /* 新增标准属性 */
  -webkit-text-fill-color: transparent;
}

.admin-login-subtitle {
  font-size: 14px;
  color: #7f8c8d;
}

/* 表单样式 */
.admin-login-form-group {
  position: relative;
  margin-bottom: 25px;
}

.admin-login-label {
  width: 50px;
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.admin-login-input {
  width: 100%;
  padding: 12px 15px;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.admin-login-input:focus {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.admin-login-focus-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.admin-login-input:focus~.admin-login-focus-border {
  width: 100%;
}

/* 选项样式 */
.admin-login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 14px;
}

.admin-login-remember {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #7f8c8d;
}

.admin-login-remember input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.admin-login-checkmark {
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.admin-login-remember input:checked~.admin-login-checkmark {
  background-color: #667eea;
  border-color: #667eea;
}

.admin-login-checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.admin-login-remember input:checked~.admin-login-checkmark:after {
  display: block;
}

.admin-login-forgot {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.admin-login-forgot:hover {
  color: #764ba2;
}

/* 按钮样式 */
.admin-login-button {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.admin-login-button:hover {
  background: linear-gradient(135deg, #5a6fd1 0%, #6a4092 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.admin-login-button-text {
  position: relative;
  z-index: 2;
}

.admin-login-button-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: admin-login-spin 1s ease-in-out infinite;
  z-index: 2;
}

@keyframes admin-login-spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* 页脚样式 */
.admin-login-footer {
  margin-top: 30px;
  text-align: center;
}

.admin-login-copyright {
  font-size: 12px;
  color: #bdc3c7;
}
</style>