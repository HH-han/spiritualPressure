<template>
  <div>
    <Login_background />
  </div>
  <div class="phonelogin-container">
    <div class="phonelogin-card">
      <form id="loginForm" class="phonelogin-form" @submit.prevent="handleLogin">
        <div class="phonelogin-title">手机号登录</div>
        <div class="phonelogin-input-container">
          <div class="phonelogin-input-group">
            <div class="phonelogin-svg-icon">
              <svg t="1744436216245" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="7805">
                <path
                  d="M768.9 784.8H252.8c-6.6 0-12-5.4-12-12V194.2c0-6.6 5.4-12 12-12h516.1c6.6 0 12 5.4 12 12v578.6c0 6.6-5.4 12-12 12z"
                  fill="#83FCE5" p-id="7806"></path>
                <path d="M240.8 177.2h553.9v10H240.8z" fill="#3983FD" p-id="7807"></path>
                <path
                  d="M729.7 81c11.9 0 23.2 4.7 31.8 13.2 8.5 8.5 13.2 19.8 13.2 31.8v765.3c0 11.9-4.7 23.2-13.2 31.8-8.5 8.5-19.8 13.2-31.8 13.2H295.1c-11.9 0-23.2-4.7-31.8-13.2-8.5-8.5-13.2-19.8-13.2-31.8V126c0-11.9 4.7-23.2 13.2-31.8 8.5-8.5 19.8-13.2 31.8-13.2h434.6m0-20H295.1c-35.8 0-65 29.2-65 65v765.3c0 35.8 29.3 65 65 65h434.6c35.8 0 65-29.3 65-65V126c0-35.7-29.2-65-65-65z"
                  fill="#3983FD" p-id="7808"></path>
                <path d="M510.3 854.4m-30 0a30 30 0 1 0 60 0 30 30 0 1 0-60 0Z" fill="#3983FD" p-id="7809"></path>
                <path d="M240.8 779.8h553.9v10H240.8z" fill="#3983FD" p-id="7810"></path>
              </svg>
            </div>
            <input type="text" class="phonelogin-input" id="phoneInput" v-model="phoneNumber" maxlength="11"
              placeholder="请输入手机号" />
          </div>
          <div class="phonelogin-input-group">
            <div class="phonelogin-svg-icon">
              <svg t="1744436697129" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="9792">
                <path
                  d="M857.8 239.5c-199-63.7-333.4-176.1-342.5-183.8v-0.4s-0.1 0.1-0.3 0.2c-0.2-0.1-0.3-0.2-0.3-0.2v0.4c-9 7.7-143.3 120-342.1 183.7-14.8 4.7-24.9 18.5-24.9 34v294.9c0 41.7 14.8 82 41.8 113.8 70.8 83.3 217.1 242.1 325.2 269.1v0.1c0.1 0 0.2 0 0.3-0.1 0.1 0 0.2 0 0.3 0.1v-0.1C624.1 924 771.6 763.3 841.9 680.4c26.1-30.8 40.4-69.8 40.4-110.2V273.1c0-15.3-9.9-28.9-24.5-33.6z m-51.9 316.8c0 32-11.3 62.9-32 87.3-55.7 65.6-172.5 192.9-258.7 214.4v0.1c-0.1 0-0.1 0-0.2-0.1-0.1 0-0.1 0-0.2 0.1v-0.1c-85.6-21.4-201.4-147.1-257.5-213.1-21.4-25.2-33.1-57.1-33.1-90.1V321.3c0-12.3 8-23.2 19.7-27C401.4 243.9 507.7 155 514.8 148.9v-0.3l0.2 0.2 0.2-0.2v0.3c7.2 6.1 113.6 95.1 271.2 145.6 11.6 3.7 19.4 14.4 19.4 26.6v235.2z"
                  fill="#0C9EEF" p-id="9793"></path>
                <path
                  d="M474.3 634.1l-109.1-98.8c-11.6-10.5-12.5-28.6-2-40.1 10.5-11.6 28.6-12.5 40.1-2L512.4 592c11.6 10.5 12.5 28.6 2 40.1-10.4 11.5-28.5 12.4-40.1 2z"
                  fill="#57C0ED" p-id="9794"></path>
                <path
                  d="M691.9 465.6L513.5 634.1c-11.4 10.7-29.4 10.2-40.2-1.1-10.7-11.4-10.2-29.4 1.1-40.2l178.5-168.5c11.4-10.7 29.4-10.2 40.2 1.1 10.7 11.4 10.2 29.5-1.2 40.2z"
                  fill="#57C0ED" p-id="9795"></path>
              </svg>
            </div>
            <input type="text" class="phonelogin-input" id="codeInput" v-model="verificationCode"
              placeholder="请输入验证码" />

          </div>
        </div>

        <div>
          <button type="button" class="phonelogin-code-btn" id="getCodeBtn" :disabled="isCodeButtonDisabled"
            @click="sendVerificationCode">
            {{ countdown > 0 ? `${countdown}s后重新获取` : "获取验证码" }}
          </button>
        </div>
        <div>
          <input type="submit" value="登录" class="phonelogin-submit-btn" id="loginBtn"
            :disabled="isLoginButtonDisabled" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import Login_background from '@/components/LoginComponent/Login_background.vue';
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import request from '@/utils/request';
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter();
const phoneNumber = ref("");
const verificationCode = ref("");
const isCodeButtonDisabled = ref(false);
const isLoginButtonDisabled = ref(true);
const countdown = ref(0);

// auth store
const authStore = useAuthStore();

// 发送验证码
const sendVerificationCode = async () => {
  if (!/^1[3-9]\d{9}$/.test(phoneNumber.value)) {
    ElMessage.error("请输入有效的手机号");
    return;
  }

  try {
    const response = await request.post('/api/public/user/send-code', {
      phone: phoneNumber.value
    });

    if (response.success) {
      ElMessage.success("验证码已发送");
      isCodeButtonDisabled.value = true;
      countdown.value = 60;

      const timer = setInterval(() => {
        if (countdown.value <= 0) {
          clearInterval(timer);
          isCodeButtonDisabled.value = false;
          return;
        }
        countdown.value--;
      }, 1000);
    } else {
      ElMessage.error(response.message || "验证码发送失败");
    }
  } catch (error) {
    ElMessage.error("验证码发送失败");
    console.error("验证码发送失败:", error);
  }
};

// 手机号+验证码登录
const handleLogin = async () => {
  try {
    // 清除旧的token和用户数据
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 使用auth store的phoneLogin方法进行手机登录
    const response = await authStore.phoneLogin({
      phone: phoneNumber.value,
      code: verificationCode.value
    });

    if (response.success) {
      ElMessage.success("登录成功");
      router.push({ name: "Home_5" });
    } else {
      ElMessage.error(response.message || "登录失败");
    }
  } catch (error) {
    ElMessage.error("登录请求失败");
    console.error("登录失败:", error);
  }
};

// 自动启用/禁用登录按钮
watchEffect(() => {
  const isPhoneValid = /^1[3-9]\d{9}$/.test(phoneNumber.value);
  const isCodeValid = /^\d{6}$/.test(verificationCode.value);
  isLoginButtonDisabled.value = !(isPhoneValid && isCodeValid);
});
</script>
<style scoped>
/* 通用样式 */
.phonelogin-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

/* 卡片样式 */
.phonelogin-card {
  width: 100%;
  min-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  padding: 40px;
  animation: phonelogin-fadeIn 0.6s ease-out;
}

@keyframes phonelogin-fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 标题样式 */
.phonelogin-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  position: relative;
}

.phonelogin-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  margin: 10px auto 0;
  border-radius: 2px;
}

/* 输入框 */
.phonelogin-input-container {
  margin-bottom: 25px;
}

/* 输入框组 */
.phonelogin-input-group {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 10px;
  padding: 0 15px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border: 1px solid #e1e5eb;
}

.phonelogin-input-group:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

/* svg样式 */
.phonelogin-svg-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  flex-shrink: 0;
}

/* 输入样式 */
.phonelogin-input {
  flex: 1;
  height: 50px;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #333;
  outline: none;
  padding: 5px 0;
}

.phonelogin-input::placeholder {
  color: #a8a8a8;
  font-weight: 300;
}

/* 按钮样式 */
.phonelogin-code-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.phonelogin-code-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.phonelogin-code-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 登录按钮样式 */
.phonelogin-submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.phonelogin-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
}

.phonelogin-submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 响应式 */
@media (max-width: 480px) {
  .phonelogin-card {
    padding: 30px 20px;
  }

  .phonelogin-title {
    font-size: 24px;
  }

  .phonelogin-input {
    font-size: 15px;
  }
}
</style>