<template>
  <Login_background />
  <form action="" class="loginform-3" @submit.prevent="handleLogin">
    <div class="login">欢迎登录</div>
    <div class="loginform-3-center">
      <div class="input-container-3">
        <input required="" id="username" type="text" @input="handleUsernameInput" v-model="loginForm.username" />
        <label class="label" for="input">账号</label>
        <div class="underline"></div>
      </div>
      <div class="input-container-3">
        <input type="password" id="password" v-model="loginForm.password" required />
        <label class="label" for="input">密码</label>
        <div class="underline"></div>
      </div>
    </div>
    <div class="btn-conteiner">
      <button class="btn-content" type="submit">
        <span class="btn-title">登录</span>
        <span class="icon-arrow">
          <svg width="66px" height="43px" viewBox="0 0 66 43" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="arrow" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <path id="arrow-icon-one"
                d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                fill="#FFFFFF"></path>
              <path id="arrow-icon-two"
                d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                fill="#FFFFFF"></path>
              <path id="arrow-icon-three"
                d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                fill="#FFFFFF"></path>
            </g>
          </svg>
        </span>
      </button>
    </div>
    <div class="radio_1">
      <div>
        <input type="checkbox" id="rememberMe" />
        <span>记住用户名!</span>
      </div>
      <div>
        <router-link to="/Login_3">
          <button class="phone">手机号登录 !</button>
        </router-link>
      </div>
    </div>
  </form>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Login_background from '@/components/LoginComponent/Login_background.vue';
import request from '@/utils/request';

const router = useRouter();

// 图片引入
const defaultAvatar = require('@/assets/defaultimage/mrtx.png');

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
    const response = await request.post('/api/public/user/login', {
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
        router.push('/home_5');
      }, 2000);
    } else {
      errorMessage.value = response.msg || '登录失败';
      showError.value = true;
    }
  } catch (error) {
    errorMessage.value = error.message || '登录失败，请检查网络连接';
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