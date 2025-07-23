<template>
  <div>
    <Login_1 />
  </div>
  <div class="loginName">
    <div class="loginpage-container">
      <div class="loginpage-card">
        <div class="loginpage-inner-card">
          <!-- 左侧装饰部分 -->
          <div class="loginpage-decoration">
            <div class="loginpage-decoration-image">
              <img src="@/assets/loging/lx.webp" alt="Welcome">
              <div class="loginpage-decoration-links">
                <button class="loginpage-decoration-btn loginpage-new-user" @click="enrolfirst">新用户注册 →</button>
                <button class="loginpage-decoration-btn loginpage-phone-login" @click="Fanginter">手机号登录 →</button>
                <button class="loginpage-decoration-btn loginpage-email-login" @click="EmailLogin">邮箱登录 →</button>
              </div>
            </div>
          </div>

          <!-- 右侧登录表单 -->
          <form @submit.prevent="handleLogin" class="loginpage-form">
            <!-- 二维码登录快捷入口 -->
            <div class="loginpage-qr-link" @click="showQrCode">
              <div class="loginpage-qr-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8-12v8h8V3h-8zm6 6h-4V5h4v4zm-6 6h8v-8h-8v8zm2-6h4v4h-4v-4z" />
                </svg>
              </div>
            </div>

            <h1 class="loginpage-title">欢迎回来</h1>
            <p class="loginpage-subtitle">请登录您的账户</p>

            <!-- 用户头像显示 -->
            <div class="loginpage-avatar-container">
              <div class="loginpage-avatar">
                <transition name="fade" mode="out-in">
                  <img :key="loginForm.hasInput ? 'user' : 'default'"
                    :src="loginForm.hasInput ? loginForm.image : defaultAvatar" alt="用户头像"
                    class="loginpage-avatar-img" />
                </transition>
              </div>
            </div>

            <!-- 错误消息 -->
            <transition name="slide-fade">
              <div v-if="errorMessage" class="loginpage-error-message">
                {{ errorMessage }}
              </div>
            </transition>

            <!-- 用户名输入框 -->
            <div class="userlogin-input-centainer">
              <div class="userlogin-inputContainer">
                <input required="required" id="userlogin-usernameField" placeholder="请输入账号" @input="handleUsernameInput"
                  v-model="loginForm.username" type="text">
                <label class="userlogin-usernameLabel" for="userlogin-usernameField">请输入账号</label>
                <svg t="1746095535223" class="userlogin-userIcon" viewBox="0 0 1024 1024" version="1.1" p-id="26266">
                  <path
                    d="M512 273.066667m-273.066667 0a273.066667 273.066667 0 1 0 546.133334 0 273.066667 273.066667 0 1 0-546.133334 0Z"
                    p-id="26267"></path>
                  <path
                    d="M375.466667 614.4h273.066666a341.333333 341.333333 0 0 1 341.333334 341.333333v68.266667H34.133333v-68.266667a341.333333 341.333333 0 0 1 341.333334-341.333333z"
                    p-id="26268"></path>
                </svg>
              </div>
              <!-- 密码输入框 -->
              <div class="userlogin-inputContainer">
                <input required="required" id="userlogin-passwordField" placeholder="请输入密码" v-model="loginForm.password"
                  type="password">
                <label class="userlogin-usernameLabel" for="userlogin-passwordField">请输入密码</label>
                <svg t="1746095118852" class="userlogin-userIcon" viewBox="0 0 1024 1024" version="1.1" p-id="21472">
                  <path
                    d="M808.435 370.238h-592.87A127.218 127.218 0 0 0 88.89 496.913v400.14a126.947 126.947 0 0 0 126.675 126.403h592.87A126.947 126.947 0 0 0 935.11 897.053v-400.14a127.218 127.218 0 0 0-126.675-126.675z m-244.65 347.948v131.296H459.4V717.915a105.744 105.744 0 1 1 105.2 0z"
                    p-id="21473"></path>
                  <path
                    d="M790.766 373.772h-81.55V278.63a197.08 197.08 0 0 0-394.16 0v95.142h-81.55V278.63a278.63 278.63 0 0 1 557.26 0z"
                    p-id="21474"></path>
                </svg>
              </div>
            </div>
            <!-- 登录按钮 -->
            <button type="submit" class="loginpage-submit-btn">
              <span class="loginpage-btn-text">登 录</span>
              <div class="loginpage-btn-loader">
                <svg viewBox="0 0 24 24">
                  <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                </svg>
              </div>
            </button>

            <!-- 底部选项 -->
            <div class="loginpage-options">
              <div class="loginpage-remember">
                <input type="checkbox" id="loginpage-remember" v-model="rememberMe" class="loginpage-checkbox" />
                <label for="loginpage-remember" class="loginpage-remember-label">
                  <span class="loginpage-checkbox-custom"></span>
                  记住我
                </label>
              </div>
              <button class="loginpage-decoration-btn loginpage-new-user-phone" @click="enrolfirst">新用户注册 →</button>
              <router-link to="/ForgotPassword" class="loginpage-forgot-link">
                忘记密码?
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-if="isPersonalCenterVisible" class="loginpage-modal" @click="close">
    <QRcodeLogin @click.stop />
  </div>
  <!-- !登录成功提示框 -->
  <div>
    <LoginSucceeded v-if="showSucceeded" :username="loginForm.username" :message="successMessage" @close="showSucceeded = false" />
  </div>
  <!-- 错误提示框 -->
   <div>
    <ErrorMessage v-if="showError" :message="errorMessage" @close="showError = false" />
  </div>

</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Login_1 from '@/components/LoginComponent/Login_1.vue';
import LoginSucceeded from '@/components/PromptComponent/LoginSucceeded.vue';
import ErrorMessage from '@/components/PromptComponent/ErrorMessage.vue';
import { loginname } from '@/api/user.js';
import QRcodeLogin from '@/views/LoginViews/QRcodeLogin.vue'

// 二维码登录
const isPersonalCenterVisible = ref(false);
const showQrCode = () => {
  isPersonalCenterVisible.value = true;
};
const close = () => {
  isPersonalCenterVisible.value = false;
};
// 页面跳转
const Fanginter = () => {
  // 注册
  router.push('/Fanginter');
};
const enrolfirst = () => {
  // 手机号
  router.push('/enrolfirst');
};
const EmailLogin = () => {
  // 登录
  router.push('/emaillogin');
};
// 用户信息
const router = useRouter();
// 图片引入
const defaultAvatar = new URL('@/assets/defaultimage/mrtx.png', import.meta.url).href
// 状态管理
const showError = ref(false);
const showSucceeded = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// 登录表单数据
const loginForm = ref({
  username: '',
  password: '',
  image: defaultAvatar,
  hasInput: false
});

// 记住用户名功能
const rememberMe = ref(false);

// 用户名输入处理（简化版，不再尝试预加载头像）
const handleUsernameInput = () => {
  loginForm.value.hasInput = loginForm.value.username.trim() !== '';

  // 仅当本地有匹配的已登录用户时才显示头像
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  if (storedUser && storedUser.username === loginForm.value.username.trim()) {
    loginForm.value.image = storedUser.image || defaultAvatar;
  } else {
    loginForm.value.image = defaultAvatar;
  }
};

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
      const response = await loginname({
        username: loginForm.value.username,
        password: loginForm.value.password
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

      // 处理头像URL（确保包含完整路径）
      let fullImageUrl = defaultAvatar;
      if (user.image) {
        fullImageUrl = user.image.startsWith('http')
          ? user.image
          : `http://localhost:2025${user.image.startsWith('/') ? '' : '/'}${user.image}`;
      }

      // 存储用户数据
      const userData = {
        ...user,
        image: fullImageUrl
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // 更新界面显示
      loginForm.value.image = fullImageUrl;

      // 记住用户名处理
      if (rememberMe.value) {
        localStorage.setItem('rememberedUsername', user.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }

      successMessage.value = '登录成功！';
      showSucceeded.value = true;

      setTimeout(() => {
        router.push('/systemhomeView');
      }, 2000);
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

    // 从本地存储加载用户数据
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedUser?.username === rememberedUsername) {
      // 确保头像URL有效
      loginForm.value.image = storedUser.image || defaultAvatar;
    }
  }
});
</script>
<style scoped>
/* 局部引入自定义 CSS 文件UserLogin */
@import '@/css/Login/UserLogin.css';
</style>
