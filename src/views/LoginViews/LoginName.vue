<template>
  <!-- 背景 -->
  <div>
    <login_1 />
  </div>
  <!-- 登录页面 -->
  <div class="auth-container">
    <span class="welcome-title">博览旅行-登录/注册</span>
    <div class="container-wrapper" :class="{ 'right-panel-active': isSignUpActive }">
      <div class="form-container sign-up-container">
        <!-- 注册页面-右侧 -->
        <form action="#" class="loginpage-form-SignUp">
          <div class="loginpage-decoration">
            <div class="loginpage-decoration-imbtn">
              <!-- 背景图片 -->
              <div class="loginpage-background">
                <img src="@/assets/loging/lx.webp" alt="Welcome">
              </div>
              <!-- 操作按钮 -->
              <div class="loginpage-decoration-links">
                <button class="loginpage-decoration-btn loginpage-new-user" @click="enrolfirst">
                  <div class="svg-wrapper-1">
                    <div class="svg-wrapper">
                      <svg t="1753966005787" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="5497" width="24" height="24">
                        <path
                          d="M789.779 984.843c-31.732 0-61.762-6.041-90.096-18.134-28.334-12.088-53.08-28.709-74.234-49.865-21.151-21.156-37.772-45.897-49.864-74.229-12.087-28.334-18.134-58.362-18.134-90.1 0-31.732 6.047-61.762 18.134-90.095 12.091-28.333 28.714-52.893 49.864-73.664 21.154-20.78 45.899-37.214 74.234-49.301 28.333-12.091 58.363-18.136 90.096-18.136 31.734 0 61.765 6.044 90.098 18.136 28.334 12.087 52.888 28.521 73.665 49.301 20.779 20.774 37.21 45.334 49.3 73.664 12.088 28.333 18.137 58.362 18.137 90.095 0 31.737-6.049 61.766-18.137 90.1s-28.521 53.073-49.3 74.229c-20.78 21.157-45.332 37.778-73.665 49.865C851.545 978.802 821.514 984.843 789.779 984.843L789.779 984.843zM904.244 715.118l-83.865 0 0-78.197c0-10.581-3.395-19.645-10.198-27.203-6.801-7.554-15.489-11.332-26.069-11.332-10.575 0-18.887 3.778-24.929 11.332-6.043 7.559-9.068 16.622-9.068 27.203l0 78.197-73.665 0c-10.575 0-19.641 3.773-27.197 11.334-7.556 7.553-11.333 16.623-11.333 27.197 0 10.575 3.777 18.512 11.333 23.803 7.557 5.288 16.622 7.928 27.197 7.928l73.665 0 0 80.466c0 10.581 3.025 19.645 9.068 27.2 6.042 7.559 14.354 11.332 24.929 11.332 10.58 0 19.267-3.774 26.069-11.332 6.802-7.556 10.198-16.619 10.198-27.2L820.379 785.38l83.865 0 0 2.27c10.579 0 19.644-3.021 27.198-9.063 7.56-6.048 11.333-14.36 11.333-24.936 0-10.574-3.774-19.645-11.333-27.197C923.889 718.892 914.823 715.118 904.244 715.118L904.244 715.118zM624.321 432.927c-3.023 12.086-6.049 23.042-9.07 32.865-3.021 8.311-6.801 16.811-11.332 25.498-4.534 8.688-9.442 15.301-14.731 19.833-6.801 5.289-11.522 10.957-14.167 17-2.645 6.042-4.915 12.271-6.802 18.697-1.887 6.423-3.966 13.03-6.229 19.832-2.271 6.802-6.049 13.602-11.332 20.399-17.383 22.664-30.416 44.578-39.104 65.732-8.688 21.155-14.731 41.554-18.133 61.201-3.398 19.643-4.345 39.102-2.836 58.362 1.513 19.269 4.533 37.969 9.069 56.1 3.022 13.597 7.555 27.764 13.597 42.499 6.048 14.73 14.925 29.844 26.632 45.333 11.711 15.488 26.634 30.595 44.77 45.332 18.13 14.731 40.794 28.896 67.998 42.499-18.135 3.774-39.291 7.177-63.467 10.199-20.402 2.271-45.521 4.343-75.362 6.229-29.845 1.896-64.036 2.836-102.566 2.836-19.646 0-42.499-0.753-68.564-2.265-26.068-1.512-52.885-3.401-80.465-5.666-27.574-2.269-54.779-4.913-81.599-7.935-26.816-3.022-51.376-6.232-73.665-9.634-22.286-3.397-41.178-6.989-56.666-10.767-15.484-3.776-25.119-7.177-28.898-10.197-6.8-6.049-12.085-22.86-15.864-50.436-3.779-27.57-2.645-63.652 3.398-108.229 3.778-24.933 13.789-44.009 30.032-57.235 16.245-13.22 35.321-23.605 57.235-31.165 21.907-7.555 44.764-14.544 68.563-20.968 23.799-6.419 44.768-15.295 62.902-26.627 14.355-9.067 25.311-17.57 32.864-25.501 7.553-7.935 12.843-16.055 15.864-24.368 3.022-8.306 4.534-17 4.534-26.064 0-9.065-0.377-18.888-1.133-29.469-1.514-15.865-6.984-28.333-16.432-37.396-9.445-9.069-19.456-18.136-30.032-27.199-6.049-4.537-11.333-11.331-15.87-20.401-4.533-9.063-8.307-17.753-11.333-26.063-3.774-9.824-6.797-20.779-9.065-32.865-5.29-1.511-10.198-3.778-14.73-6.801-3.779-3.021-7.936-7.559-12.469-13.603-4.532-6.042-8.688-15.107-12.468-27.199-3.779-11.333-5.101-21.908-3.966-31.729 1.132-9.824 3.214-18.134 6.236-24.936 3.022-8.311 7.177-15.49 12.463-21.531 0-25.688 1.516-51.376 4.539-77.069 3.022-21.907 7.741-45.333 14.167-70.26 6.419-24.936 16.811-47.225 31.166-66.864 13.597-18.892 28.144-34.382 43.628-46.466 15.489-12.091 31.546-21.532 48.166-28.333 16.621-6.802 33.244-11.521 49.867-14.167C380.28 1.323 396.149 0 411.26 0c19.643 0 38.529 2.27 56.664 6.802 18.133 4.531 34.943 10.575 50.433 18.134 15.492 7.553 29.279 16.054 41.365 25.499 12.091 9.441 21.913 19.074 29.468 28.896 17.376 21.909 30.031 46.09 37.969 72.53 7.93 26.446 13.783 51.376 17.563 74.799 3.779 27.199 5.291 54.396 4.534 81.602 4.533 3.774 8.312 8.306 11.332 13.596 3.02 4.532 5.29 10.581 6.801 18.134 1.513 7.553 1.513 17 0 28.333-1.512 14.355-4.534 25.688-9.063 34-4.538 8.313-9.445 14.73-14.736 19.269C637.541 426.878 631.117 430.657 624.321 432.927L624.321 432.927z"
                          fill="#ffffff" p-id="5498"></path>
                      </svg>
                    </div>
                  </div>
                  <span>用户注册</span>
                </button>
                <button class="loginpage-decoration-btn loginpage-phone-login" @click="Fanginter">
                  <div class="svg-wrapper-1">
                    <div class="svg-wrapper">
                      <svg t="1753966095810" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="9074" width="24" height="24">
                        <path
                          d="M694.897778 0H329.102222A146.773333 146.773333 0 0 0 182.897778 146.204444v731.591112A146.773333 146.773333 0 0 0 329.102222 1024H694.897778a146.773333 146.773333 0 0 0 146.204444-146.204444V146.204444A146.773333 146.773333 0 0 0 694.897778 0zM603.306667 932.408889H420.693333v-56.888889h182.613334zM751.786667 786.204444H274.488889V128H751.786667z m0 0"
                          fill="#ffffff" p-id="9075"></path>
                      </svg>
                    </div>
                  </div>
                  <span>手机登录</span>
                </button>
                <button class="loginpage-decoration-btn loginpage-email-login" @click="EmailLogin">
                  <div class="svg-wrapper-1">
                    <div class="svg-wrapper">
                      <svg t="1753966191213" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="15975" width="24" height="24">
                        <path
                          d="M0 170.666667a170.666667 170.666667 0 0 1 170.666667-170.666667h682.666666a170.666667 170.666667 0 0 1 170.666667 170.666667v682.666666a170.666667 170.666667 0 0 1-170.666667 170.666667H170.666667a170.666667 170.666667 0 0 1-170.666667-170.666667V170.666667z"
                          fill="#ffffff" fill-opacity=".1" p-id="15976"></path>
                        <path
                          d="M853.333333 758.741333a30.933333 30.933333 0 0 1-30.762666 30.592H263.424a30.72 30.72 0 0 1-30.805333-30.592v-31.018666h558.592v-360.533334l-248.277334 221.866667-310.314666-277.333333V265.685333a30.72 30.72 0 0 1 9.045333-21.930666 31.146667 31.146667 0 0 1 22.101333-9.088h558.506667c17.152 0 31.061333 13.781333 31.061333 30.805333v493.226667zM308.266667 296.32l234.752 209.877333 234.794666-209.877333H308.266667zM170.666667 604.458667h248.234666v61.653333H170.666667v-61.653333z m0-154.069334h155.178666V512H170.666667v-61.610667z"
                          fill="#ffffff" p-id="15977"></path>
                      </svg>
                    </div>
                  </div>
                  <span>邮箱登录</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="form-container sign-in-container">
        <!-- 登录页面-左侧 -->
        <form @submit.prevent="handleLogin" class="loginpage-form">
          <div>
            <h1>欢迎回来</h1>
            <p>请登录您的账户</p>
          </div>
          <!-- 二维码登录快捷入口 -->
          <div class="loginpage-qr-link" @click="showQrCode">
            <div class="loginpage-qr-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8-12v8h8V3h-8zm6 6h-4V5h4v4zm-6 6h8v-8h-8v8zm2-6h4v4h-4v-4z" />
              </svg>
            </div>
          </div>
          <!-- 用户头像显示 -->
          <div class="loginpage-avatar-container">
            <div class="loginpage-avatar">
              <transition name="fade" mode="out-in">
                <img :key="loginForm.hasInput ? 'user' : 'default'"
                  :src="loginForm.hasInput ? loginForm.image : defaultAvatar" alt="用户头像" class="loginpage-avatar-img" />
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
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>欢迎回来</h1>
            <p>请登录您的账户</p>
            <button class="ghost" @click="toggleSignUp(false)">登录</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>你好，朋友！</h1>
            <p>输入您的个人信息，开始与我们的旅程</p>
            <button class="ghost" @click="toggleSignUp(true)">注册</button>
          </div>
        </div>
      </div>
    </div>

    <footer>
      <p>
        Created with <i class="fa fa-heart"></i> by
        <a target="_blank" href="https://florin-pop.com">Florin Pop</a>
        - Read how I created this and how you can join the challenge
        <a target="_blank" href="https://www.florin-pop.com/blog/2019/03/double-slider-sign-in-up-form/">here</a>.
      </p>
    </footer>
  </div>
  <div v-if="isPersonalCenterVisible" class="loginpage-modal" @click="close">
    <QRcodeLogin @click.stop />
  </div>
  <!-- !登录成功提示框 -->
  <div>
    <LoginSucceeded v-if="showSucceeded" :username="loginForm.username" :message="successMessage"
      @close="showSucceeded = false" />
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

// 登录-注册切换
const isSignUpActive = ref(false)
const toggleSignUp = (active) => {
  isSignUpActive.value = active
}
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
