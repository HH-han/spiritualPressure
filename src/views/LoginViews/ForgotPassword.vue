<template>
  <div>
    <div>
      <Login_1 />
    </div>
    <div>
      <div class="ForgotPassword">
        <div class="card_forgotPassword">
          <!-- 保持原有SVG和样式结构 -->
          <div class="BG">
            <svg viewBox="0 0 512 512" class="ionicon_forgotPassword" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M256 176a80 80 0 1080 80 80.24 80.24 0 00-80-80zm172.72 80a165.53 165.53 0 01-1.64 22.34l48.69 38.12a11.59 11.59 0 012.63 14.78l-46.06 79.52a11.64 11.64 0 01-14.14 4.93l-57.25-23a176.56 176.56 0 01-38.82 22.67l-8.56 60.78a11.93 11.93 0 01-11.51 9.86h-92.12a12 12 0 01-11.51-9.53l-8.56-60.78A169.3 169.3 0 01151.05 393L93.8 416a11.64 11.64 0 01-14.14-4.92L33.6 331.57a11.59 11.59 0 012.63-14.78l48.69-38.12A174.58 174.58 0 0183.28 256a165.53 165.53 0 011.64-22.34l-48.69-38.12a11.59 11.59 0 01-2.63-14.78l46.06-79.52a11.64 11.64 0 0114.14-4.93l57.25 23a176.56 176.56 0 0138.82-22.67l8.56-60.78A11.93 11.93 0 01209.94 26h92.12a12 12 0 0111.51 9.53l8.56 60.78A169.3 169.3 0 01361 119l57.2-23a11.64 11.64 0 0114.14 4.92l46.06 79.52a11.59 11.59 0 01-2.63 14.78l-48.69 38.12a174.58 174.58 0 011.64 22.66z">
              </path>
            </svg>
          </div>

          <div class="content_forgotPassword">
            <p class="heading_forgotPassword">可爱的朋友啊!</p>
            <p class="sub-heading_forgotPassword">忘记密码啦?</p>
            <p class="sub-sub-heading_forgotPassword">输入要恢复的手机号</p>

            <form @submit.prevent="handleSubmit">
              <input v-model="phone" class="Phone_forgotPassword" placeholder="Phone" type="tel"
                @input="validatePhone" />
              <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
              <button class="card-btn_forgotPassword" type="submit">重置密码</button>
            </form>
          </div>
        </div>

        <div class="ForgotPassword_button">
          <router-link to="/login">
            <button>返回登录</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Login_1 from '../../components/LoginComponent/Login_1.vue'
import axios from 'axios'

export default {
  name: 'ForgotPassword',
  components: {
    Login_1
  },
  data() {
    return {
      phone: '',
      errorMsg: '',
      isLoading: false
    }
  },
  methods: {
    validatePhone() {
      // 实时验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!this.phone) {
        this.errorMsg = '手机号不能为空'
      } else if (!phoneRegex.test(this.phone)) {
        this.errorMsg = '请输入有效的手机号码'
      } else {
        this.errorMsg = ''
      }
    },
    async handleSubmit() {
      // 提交前再次验证
      if (this.errorMsg) return

      this.isLoading = true
      try {
        const response = await axios.post('/api/auth/reset-password', {
          phone: this.phone
        })

        if (response.data.success) {
          // 跳转到验证码验证页面
          this.$router.push({
            path: '/reset-password',
            query: { phone: this.phone }
          })
        }
      } catch (error) {
        this.errorMsg = error.response?.data?.message || '请求失败，请稍后重试'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
/* 添加错误信息样式 */
.error-message {
  color: #ff4444;
  font-size: 14px;
  margin-top: 8px;
  text-align: left;
}

/* 禁用按钮时的样式 */
.card-btn_forgotPassword:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.ForgotPassword {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 500px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.ForgotPassword_button button {
  width: 300px;
  height: 40px;
  background-color: #007bff;
  border: none;
  border-radius: 15px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.ForgotPassword-content_forgotPassword button {
  width: 100%;
  height: 40px;
  background-color: #007bff;
  border: none;
  text-align: center;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
}

.card_forgotPassword {
  width: 300px;
  height: 400px;
  position: relative;
  background-color: rgb(255, 255, 255);
  border-bottom: 3px solid #4c6bff;
  overflow: hidden;
  -webkit-box-shadow: 0px 12px 65px -39px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 12px 65px -39px rgba(0, 0, 0, 1);
  box-shadow: 0px 12px 65px -39px rgba(0, 0, 0, 1);
  border-radius: 15px;
}

.BG {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.BG svg {
  position: absolute;
  width: 50%;
  left: -20%;
  top: -20%;
  fill: rgb(244, 244, 244);
  transition: all 0.5s;
}

.content_forgotPassword {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px;
  box-sizing: border-box;
  color: rgb(30, 30, 30);
  gap: 3px;
}

.heading_forgotPassword {
  font-size: 1.4em;
  font-weight: 700;
  color: rgb(30, 30, 30);
  margin: 5px 0;
}

.sub-heading_forgotPassword {
  margin-top: -7px;
  font-size: 0.9em;
  font-weight: 600;
  margin: 5px 0;
  color: rgb(30, 30, 30);
}

.sub-sub-heading_forgotPassword {
  margin: 5px 0;
  font-size: 0.7em;
  color: rgb(128, 128, 128);
}

.Phone_forgotPassword {
  width: 100%;
  height: 25px;
  margin-top: 20px;
  border: none;
  border-bottom: 1px solid #c0c7ec;
  outline: none;
  font-size: 0.7em;
  background-color: transparent;
}

.card-btn_forgotPassword {
  margin-top: 10px;
  height: 30px;
  width: 80%;
  border: none;
  background: linear-gradient(60deg, #4c6bff, #8196ff);
  color: white;
  border-radius: 30px;
  cursor: pointer;
}

.card_forgotPassword:hover .BG svg {
  left: 0%;
  top: 0%;
  transform: rotate(180deg) scale(9);
  fill: #c0c7ec;
}
</style>
