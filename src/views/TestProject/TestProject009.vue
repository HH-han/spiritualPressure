<template>
  <div class="auth-container">
    <h2></h2>
    <div class="container-wrapper" :class="{ 'right-panel-active': isSignUpActive }">
      <div class="form-container sign-up-container">
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
      <div class="form-container sign-in-container">
        <form action="#" class="loginpage-form-SignUp">
          <div class="loginpage-decoration">
            <div class="loginpage-decoration-image">
              <img src="@/assets/loging/31d494f83e7fef6eed32f2ac1d746e79dd387cd7bc439-5C2vFY_fw1200webp.webp" alt="Welcome">
              <div class="loginpage-decoration-links">
                <button class="loginpage-decoration-btn loginpage-new-user" @click="enrolfirst">新用户注册 →</button>
                <button class="loginpage-decoration-btn loginpage-phone-login" @click="Fanginter">手机号登录 →</button>
                <button class="loginpage-decoration-btn loginpage-email-login" @click="EmailLogin">邮箱登录 →</button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>欢迎回来</h1>
            <p>请登录您的账户</p>
            <button class="ghost" @click="toggleSignUp(true)">登录</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>你好，朋友！</h1>
            <p>输入您的个人信息，开始与我们的旅程</p>
            <button class="ghost" @click="toggleSignUp(false)">注册</button>
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Login_1 from '@/components/LoginComponent/Login_1.vue';
import LoginSucceeded from '@/components/PromptComponent/LoginSucceeded.vue';
import ErrorMessage from '@/components/PromptComponent/ErrorMessage.vue';
import { loginname } from '@/api/user.js';
import QRcodeLogin from '@/views/LoginViews/QRcodeLogin.vue'

// 登录/注册切换
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
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: 'Montserrat', sans-serif;
  height: 100vh;
  margin: -20px 0 50px;
}

.container-wrapper {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 1000px;
  max-width: 100%;
  min-height: 550px;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container-wrapper.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container-wrapper.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {

  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.container-wrapper.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.overlay {
  background: #FF416C;
  background: -webkit-linear-gradient(to right, #FF4B2B, #FF416C);
  background: linear-gradient(to right, #FF4B2B, #FF416C);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #FFFFFF;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.container-wrapper.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.container-wrapper.right-panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.container-wrapper.right-panel-active .overlay-right {
  transform: translateX(20%);
}

.social-container {
  margin: 20px 0;
}

.social-container a {
  border: 1px solid #DDDDDD;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
}
.ghost {
	border-radius: 20px;
	border: 1px solid #FF4B2B;
	background-color: #FF4B2B;
	color: #FFFFFF;
	font-size: 12px;
	font-weight: bold;
	padding: 12px 45px;
  margin-top: 20px;
	letter-spacing: 1px;
	text-transform: uppercase;
	transition: transform 80ms ease-in;
}

.ghost:active {
	transform: scale(0.95);
}

.ghost:focus {
	outline: none;
}

.ghost {
	background-color: transparent;
	border-color: #FFFFFF;
}

footer {
    background-color: #222;
    color: #fff;
    font-size: 14px;
    bottom: 0;
    position: fixed;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 999;
}

footer p {
    margin: 10px 0;
}

footer i {
    color: red;
}

footer a {
    color: #3c97bf;
    text-decoration: none;
}
/* 登录表单样式 */
/* 基础样式 */
.loginName {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.loginpage-container {
  width: 100%;
  min-width: 1000px;
  padding: 20px;
}

.loginpage-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  height: 100%;
}

.loginpage-inner-card {
  display: flex;
  width: 100%;
  height: 100%;
}

/* 左侧装饰部分 */
.loginpage-form-SignUp{
  flex: 1;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
}
.loginpage-decoration {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  height: 100%;
}

.loginpage-decoration::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(174, 174, 174, 0.667) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.loginpage-decoration-image {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 20px;
}

.loginpage-decoration-image img {
  max-width: 80%;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.5s ease;
}

.loginpage-decoration-image:hover img {
  transform: scale(1.05);
}

.loginpage-decoration-links {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 15px;
}

.loginpage-decoration-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.loginpage-decoration-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  z-index: -1;
  transition: all 0.3s ease;
}

.loginpage-decoration-btn:hover::before {
  background: rgba(255, 255, 255, 0.2);
}

.loginpage-new-user {
  background: #fff;
  color: #6e8efb;
}

.loginpage-phone-login {
  background: transparent;
  color: #fff;
  border: 2px solid #fff;
}

.loginpage-new-user-phone {
  display: none;
}

.loginpage-email-login {
  background: transparent;
  color: #ffffff;
  border: 2px solid #fff;
}

/* 右侧表单部分 */
.loginpage-form {
  flex: 1;
  height: 100%;
  padding: 50px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.loginpage-qr-link {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6e8efb;
  background: rgba(110, 142, 251, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.loginpage-qr-link:hover {
  background: rgba(110, 142, 251, 0.2);
  transform: scale(1.1);
}

.loginpage-qr-icon svg {
  width: 20px;
  height: 20px;
}
/* 头像样式 */
.loginpage-avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.loginpage-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  padding: 3px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.loginpage-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid white;
}

/* 错误消息 */
.loginpage-error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

/* 二维码 */
.loginpage-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
}

/* 输入框样式 */
.userlogin-input-centainer {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin: 15px 0px 0px 0px;
}

.userlogin-inputContainer {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
}



.userlogin-userIcon {
  position: absolute;
  fill: rgb(78, 193, 255);
  width: 16px;
  height: 16px;
  top: -23px;
  left: -15px;
  opacity: 0;
  transition: .2s linear;
}

.userlogin-usernameLabel {
  position: absolute;
  top: -25px;
  left: 5px;
  color: rgb(83, 83, 83);
  font-size: 14px;
  font-weight: 500;
  font-family: Whitney, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  overflow: hidden;
  transition: .2s linear;
  opacity: 0;
}

/* 账号密码输入框样式 */
#userlogin-passwordField,
#userlogin-usernameField {
  width: 100%;
  border: 2px solid rgb(186, 186, 186);
  background-color: transparent;
  border-radius: 15px;
  padding: 10px 15px;
  color: rgb(96, 96, 96);
  font-weight: 500;
  outline: none;
  caret-color: rgb(78, 164, 255);
  transition-duration: .3s;
  font-family: Whitney, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
}

/* 密码 */
#userlogin-passwordField:focus~.userlogin-usernameLabel,
#userlogin-passwordField:valid~.userlogin-usernameLabel {
  transform: translateX(20px);
  opacity: 1;
}

#userlogin-passwordField:focus~.userlogin-userIcon,
#userlogin-passwordField:valid~.userlogin-userIcon {
  transform: translateX(20px);
  opacity: 1;
}

#userlogin-passwordField:focus,
#userlogin-passwordField:valid {
  background-color: #f7f7f7;
  transition-duration: .3s;
}

/* 账号 */
#userlogin-usernameField:focus~.userlogin-usernameLabel,
#userlogin-usernameField:valid~.userlogin-usernameLabel {
  transform: translateX(20px);
  opacity: 1;
}

#userlogin-usernameField:focus~.userlogin-userIcon,
#userlogin-usernameField:valid~.userlogin-userIcon {
  transform: translateX(20px);
  opacity: 1;
}

#userlogin-usernameField:focus,
#userlogin-usernameField:valid {
  background-color: #f7f7f7;
  transition-duration: .3s;
}

/* 登录按钮 */
.loginpage-submit-btn {
  margin-top: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}

.loginpage-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(110, 142, 251, 0.4);
}

.loginpage-submit-btn:active {
  transform: translateY(0);
}

.loginpage-btn-text {
  transition: all 0.3s ease;
}

.loginpage-btn-loader {
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: 0;
  transition: all 0.3s ease;
  animation: rotate 1s linear infinite;
}

.loginpage-btn-loader svg {
  width: 100%;
  height: 100%;
  fill: white;
}

.loginpage-submit-btn.loading .loginpage-btn-text {
  transform: translateX(-15px);
  opacity: 0;
}

.loginpage-submit-btn.loading .loginpage-btn-loader {
  opacity: 1;
}

/* 底部选项 */
.loginpage-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 14px;
}

.loginpage-remember {
  display: flex;
  align-items: center;
}

.loginpage-checkbox {
  position: absolute;
  opacity: 0;
}

.loginpage-checkbox-custom {
  width: 16px;
  height: 16px;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-right: 8px;
  display: inline-block;
  position: relative;
  transition: all 0.3s ease;
}

.loginpage-checkbox:checked+.loginpage-remember-label .loginpage-checkbox-custom {
  background: #6e8efb;
  border-color: #6e8efb;
}

.loginpage-checkbox:checked+.loginpage-remember-label .loginpage-checkbox-custom::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
  width: 4px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.loginpage-remember-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #7f8c8d;
  transition: all 0.3s ease;
}

.loginpage-remember-label:hover {
  color: #6e8efb;
}

.loginpage-forgot-link {
  color: #7f8c8d;
  text-decoration: none;
  transition: all 0.3s ease;
}

.loginpage-forgot-link:hover {
  color: #6e8efb;
  text-decoration: underline;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>