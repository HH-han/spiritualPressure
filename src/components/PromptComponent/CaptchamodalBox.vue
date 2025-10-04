<template>
    <div class="captcha-container">
        <form class="captcha-form" @submit.prevent="handleSubmit">
            <div class="captcha-title">OTP</div>
            <div class="captcha-title">验证码</div>
            <p class="captcha-message">我们已向您的邮箱发送了验证码</p>
            <div class="captcha-inputs">
                <input v-for="(input, index) in inputs" :key="index" v-model="input.value" type="text" maxlength="1"
                    :ref="el => { if (el) inputRefs[index] = el }" @input="e => {
                        if (e.target.value.length === 1 && index < 5) {
                            inputRefs[index + 1]?.focus()
                        } else if (e.target.value.length === 0 && index > 0) {
                            inputRefs[index - 1]?.focus()
                        }
                    }">
            </div>
            <button type="submit" class="captcha-action">验证</button>
        </form>
    </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['verify'])

const inputs = Array(6).fill(0).map((_, i) => ref(''))
const inputRefs = []

const handleSubmit = (e) => {
    e?.preventDefault()
    const code = inputs.map(input => input.value).join('')
    if (code.length === 6) {
        emit('verify', code)
    } else {
        alert('请输入完整的6位验证码')
    }
}
</script>

<style scoped>
.captcha-container {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    z-index: 1000;
}

.captcha-form {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
    width: 400px;
    background-color: rgba(255, 255, 255);
    backdrop-filter: blur(10px);
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
    border-radius: 5px;
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