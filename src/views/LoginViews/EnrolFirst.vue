<template>

  <div>
    <Login_background />
  </div>
  <div class="registered-css-container">
    <div class="registered-css-card">
      <form id="registerForm" class="form_enrol" @submit.prevent="handleRegister">
        <div class="registered-css-h1">新用户注册</div>

        <div class="registered-avatar-container">
          <div class="registered-avatar-preview" :style="{ backgroundImage: avatarPreview }">
            <label for="avatar-upload" class="registered-avatar-upload-label">
              <span v-if="!avatarPreview">点击上传头像</span>
              <input id="avatar-upload" type="file" accept="image/*" @change="handleAvatarUpload"
                class="registered-avatar-upload" />
            </label>
          </div>
        </div>

        <div class="registered-css-input-container-all">
          <div>
            <div class="registered-css-input-container">
              <input placeholder="" class="registered-css-input-field" type="text" v-model="username">
              <label for="enrolfirst-input-field" class="registered-css-input-label">请输入用户名...</label>
              <span class="registered-css-input-highlight"></span>
            </div>

            <div class="registered-css-input-container">
              <input placeholder="" class="registered-css-input-field" type="text" v-model="phone">
              <label for="enrolfirst-input-field" class="registered-css-input-label">请输入手机号...</label>
              <span class="registered-css-input-highlight"></span>
            </div>

            <div class="registered-css-input-container">
              <input placeholder="" class="registered-css-input-field" type="text" v-model="email">
              <label for="enrolfirst-input-field" class="registered-css-input-label">请输入邮箱...</label>
              <span class="registered-css-input-highlight"></span>
            </div>
          </div>
          <div>
            <div class="registered-css-input-container">
              <input placeholder="" class="registered-css-input-field" type="password" v-model="password">
              <label for="enrolfirst-input-field" class="registered-css-input-label">请输入密码...</label>
              <span class="registered-css-input-highlight"></span>
            </div>

            <div class="registered-css-input-container">
              <input placeholder="" class="registered-css-input-field" type="password" v-model="confirmPassword">
              <label for="enrolfirst-input-field" class="registered-css-input-label">请再次输入密码...</label>
              <span class="registered-css-input-highlight"></span>
            </div>
          </div>
        </div>

        <div class="registered-css-a-container">
          <input type="checkbox" id="agreeTerms" v-model="agreeTerms" required />
          <a href="baidu.com" class="agreement-a4">我同意相关注册协议</a>
        </div>

        <div class="registered-center">
          <input type="submit" value="注册" class="registered-css-input-registered" />
          <router-link to="/login">
            <button class="go-back-login-a2">返回登录 !</button>
          </router-link>
        </div>
      </form>
    </div>
  </div>
  <!-- 错误提示框 -->
  <div>
    <ErrorMessage v-if="showError" :message="errorMessage" @close="showError = false" />
  </div>
  <!-- !登录成功提示框 -->
  <div>
    <LoginSucceeded v-if="showSucceeded" :message="successMessage" @close="showSucceeded = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import request from '@/utils/request';
import { useRouter } from 'vue-router';
import Login_background from '@/components/LoginComponent/Login_background.vue';
import ErrorMessage from '@/components/PromptComponent/ErrorMessage.vue';
import LoginSucceeded from '@/components/PromptComponent/LoginSucceeded.vue';

const router = useRouter();

// 错误提示相关状态
const showError = ref(false);
const errorMessage = ref('');

// 注册成功提示相关状态
const showSucceeded = ref(false);
const successMessage = ref('');

// 表单数据
const username = ref('');
const nickname = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreeTerms = ref(false);
const avatarPreview = ref('');
const avatarFile = ref(null);
// 处理头像上传
const handleAvatarUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarFile.value = e.target.result;
      avatarPreview.value = `url(${e.target.result})`;
    };
    reader.readAsDataURL(file);
  }
};

// 处理注册
const handleRegister = async () => {
  // 手机号验证 (11位数字，1开头)
  const phoneRegex = /^1\d{10}$/;
  if (!phoneRegex.test(phone.value)) {
    errorMessage.value = '请输入有效的手机号';
    showError.value = true;
    return;
  }

  // 邮箱验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errorMessage.value = '请输入有效的邮箱地址';
    showError.value = true;
    return;
  }

  // 密码校验
  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致';
    showError.value = true;
    return;
  }
  // 协议同意校验
  if (!agreeTerms.value) {
    errorMessage.value = '请同意注册协议';
    showError.value = true;
    return;
  }

  // 创建请求数据对象
  const requestData = {
    username: username.value,
    nickname: nickname.value,
    email: email.value,
    phone: phone.value,
    image: avatarFile.value,
    password: password.value,
    confirmPassword: confirmPassword.value
  };

  try {
    // 发送注册请求
    const response = await request.post('/api/public/user/register', requestData);

    // 根据后端返回的 code 判断注册结果
    if (response.code === "0") {
      successMessage.value = response.data || '注册成功';
      showSucceeded.value = true;
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } else {
      errorMessage.value = response.msg || '注册失败';
      showError.value = true;
    }
  } catch (error) {
    console.error('注册失败:', error);
    errorMessage.value = '注册失败，请稍后重试';
    showError.value = true;
  }
};
</script>
<style scoped>
.registered-css-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.registered-css-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  width: 450px;
  max-width: 450px;
  padding: 40px;
  transition: all 0.3s ease;
}

.registered-css-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.registered-css-h1 {
  font-size: 28px;
  color: #3a4a6d;
  text-align: center;
  margin-bottom: 30px;
  font-weight: 600;
  letter-spacing: 1px;
}

/* 头像 */
.registered-center {
  display: flex;
  flex-direction: column;
}

/* 头像上传区域 */
.registered-avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.registered-avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f0f2f5;
  background-size: cover;
  background-position: center;
  position: relative;
  cursor: pointer;
  border: 4px solid #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.registered-avatar-preview:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.registered-avatar-upload-label {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  font-size: 14px;
  text-align: center;
  padding: 10px;
}

.registered-avatar-preview:hover .registered-avatar-upload-label {
  opacity: 1;
}

.registered-avatar-upload {
  display: none;
}

/*  */
.registered-css-input-container-all {
  margin: 25px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-wrap: wrap;
}

.registered-css-input-container {
  position: relative;
  margin-bottom: 25px;
}

.registered-css-input-field {
  font-size: 16px;
  width: 100%;
  border: none;
  border-bottom: 2px solid #e0e5ec;
  padding: 10px 0;
  background-color: transparent;
  color: #3a4a6d;
  transition: all 0.3s ease;
}

.registered-css-input-field:focus {
  outline: none;
  border-bottom-color: #667eea;
}

.registered-css-input-field:focus+.registered-css-input-label,
.registered-css-input-field:not(:placeholder-shown)+.registered-css-input-label {
  transform: translateY(-25px);
  font-size: 14px;
  color: #667eea;
}

.registered-css-input-label {
  position: absolute;
  top: 10px;
  left: 0;
  color: #a3a9c3;
  transition: all 0.3s ease;
  pointer-events: none;
}

.registered-css-input-highlight {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background-color: #667eea;
  transition: all 0.4s ease;
}

.registered-css-input-field:focus~.registered-css-input-highlight {
  width: 100%;
}

.registered-css-a-container {
  display: flex;
  align-items: center;
  margin: 25px 0;
}

.registered-css-a-container input[type="checkbox"] {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #e0e5ec;
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.registered-css-a-container input[type="checkbox"]:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.registered-css-a-container input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 12px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.agreement-a4 {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
}

.agreement-a4:hover {
  color: #764ba2;
  text-decoration: underline;
}

.registered-css-input-registered {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 30px;
  cursor: pointer;
  width: 100%;
  font-weight: 600;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.registered-css-input-registered:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(102, 126, 234, 0.6);
}

.registered-css-input-registered:active {
  transform: translateY(1px);
}

.go-back-login-a2 {
  background: transparent;
  color: #667eea;
  border: 2px solid #e0e5ec;
  padding: 10px 30px;
  font-size: 14px;
  border-radius: 30px;
  cursor: pointer;
  width: 100%;
  font-weight: 600;
  transition: all 0.3s ease;
}

.go-back-login-a2:hover {
  border-color: #667eea;
  background-color: rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .registered-css-card {
    max-width: 350px;
  }
}
</style>