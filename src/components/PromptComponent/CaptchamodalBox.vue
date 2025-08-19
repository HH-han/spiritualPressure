<template>
  <div class="captcha-container">
    <form class="captcha-form">
      <div class="captcha-title">OTP</div>
      <div class="captcha-title">验证码</div>
      <p class="captcha-message">我们已向您的邮箱发送了验证码</p>
      <div class="captcha-inputs"> 
        <input id="input1" type="text" maxlength="1"> 
        <input id="input2" type="text" maxlength="1">
        <input id="input3" type="text" maxlength="1"> 
        <input id="input4" type="text" maxlength="1"> 
        <input id="input5" type="text" maxlength="1"> 
        <input id="input6" type="text" maxlength="1"> 
      </div> 
      <button class="captcha-action">验证</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

</script>

<style scoped>
.captcha-container{
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}
.captcha-form {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  width: 400px;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
}

.captcha-title {
  font-size: 20px;
  font-weight: bold;
  color: black
}

.captcha-message {
  color: #a3a3a3;
  font-size: 14px;
  margin-top: 4px;
  text-align: center
}

.captcha-inputs {
  margin-top: 10px
}

.captcha-inputs input {
  width: 32px;
  height: 32px;
  text-align: center;
  border: none;
  border-bottom: 1.5px solid #d2d2d2;
  margin: 0 10px;
}

.captcha-inputs input:focus {
  border-bottom: 1.5px solid royalblue;
  outline: none;
}

.captcha-action {
  margin-top: 24px;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  background-color: royalblue;
  color: white;
  cursor: pointer;
  align-self: end;
}
</style>