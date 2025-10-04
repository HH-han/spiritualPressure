<template>
    <div class="accountsettings-container">
        <!-- 模糊背景 -->
        <div class="accountsettings-background">
            <img src="@/assets/scenery/scenery-2.webp" alt="background" />
        </div>

        <!-- 主内容区域 -->
        <div class="accountsettings-content">
            <h1 class="accountsettings-title">账户设置</h1>

            <!-- 头像上传区域 -->
            <div class="accountsettings-avatar-container">
                <div class="accountsettings-avatar-wrapper" @click="triggerFileInput">
                    <img v-if="avatarPreview" :src="avatarPreview" class="accountsettings-avatar" alt="用户头像" />
                    <div v-else class="accountsettings-avatar-placeholder">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="accountsettings-avatar-hover">
                        <i class="fas fa-camera"></i>
                        <span>上传照片</span>
                    </div>
                </div>
                <input type="file" ref="fileInput" @change="handleAvatarUpload" accept="image/*"
                    style="display: none;" />
            </div>

            <!-- 表单区域 -->
            <form class="accountsettings-form" @submit.prevent="saveChanges">
                <!-- 用户名 -->
                <div class="accountsettings-form-group">
                    <label class="accountsettings-label">用户名</label>
                    <div class="accountsettings-input-container">
                        <i class="fas fa-user accountsettings-input-icon"></i>
                        <input type="text" v-model="username" class="accountsettings-input" placeholder="输入用户名" />
                    </div>
                </div>

                <!-- 邮箱 -->
                <div class="accountsettings-form-group">
                    <label class="accountsettings-label">电子邮件地址</label>
                    <div class="accountsettings-input-container">
                        <i class="fas fa-envelope accountsettings-input-icon"></i>
                        <input type="email" v-model="email" class="accountsettings-input" placeholder="输入电子邮件" />
                    </div>
                </div>

                <!-- 密码 -->
                <div class="accountsettings-form-group">
                    <label class="accountsettings-label">密码</label>
                    <div class="accountsettings-input-container">
                        <i class="fas fa-lock accountsettings-input-icon"></i>
                        <input type="password" v-model="password" class="accountsettings-input" placeholder="输入新密码" />
                    </div>
                </div>

                <!-- 通知偏好 -->
                <div class="accountsettings-form-group">
                    <label class="accountsettings-label">通知偏好</label>
                    <div class="accountsettings-toggle-group">
                        <div v-for="(pref, index) in notificationPrefs" :key="index"
                            class="accountsettings-toggle-item">
                            <span>{{ pref.label }}</span>
                            <label class="accountsettings-switch">
                                <input type="checkbox" v-model="pref.value" @change="toggleNotification(pref)" />
                                <span class="accountsettings-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- 按钮区域 -->
                <div class="accountsettings-button-group">
                    <button type="button" class="accountsettings-button accountsettings-button-cancel"
                        @click="cancelChanges">
                        取消
                    </button>
                    <button type="submit" class="accountsettings-button accountsettings-button-save">
                        保存更改
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// 用户数据
const username = ref('John Doe');
const email = ref('john.doe@example.com');
const password = ref('');
const avatarPreview = ref(null);

// 通知偏好设置
const notificationPrefs = ref([
    { label: '电子邮件通知', value: true },
    { label: '推送通知', value: true },
    { label: '短信通知', value: false }
]);

// 文件输入引用
const fileInput = ref(null);

// 触发文件选择
const triggerFileInput = () => {
    fileInput.value.click();
};

// 处理头像上传
const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarPreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

// 切换通知偏好
const toggleNotification = (pref) => {
    console.log(`${pref.label} 状态已更改为: ${pref.value}`);
};

// 保存更改
const saveChanges = () => {
    console.log('保存更改:', {
        username: username.value,
        email: email.value,
        password: password.value,
        notifications: notificationPrefs.value
    });
    // 这里可以添加API调用
};

// 取消更改
const cancelChanges = () => {
    console.log('取消更改');
    // 这里可以重置表单
};
</script>

<style scoped>
/* 基础样式 */
.accountsettings-container {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow: hidden;
    color: white;
}

/* 模糊背景 */
.accountsettings-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.accountsettings-background img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(10px) brightness(0.8);
}

/* 主内容区域 */
.accountsettings-content {
    width: 90%;
    max-width: 400px;
    padding: 30px;
    background: rgba(230, 247, 255, 0.15);
    backdrop-filter: blur(15px);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.accountsettings-title {
    text-align: center;
    margin-bottom: 30px;
    font-weight: 600;
    font-size: 24px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 头像区域 */
.accountsettings-avatar-container {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
}

.accountsettings-avatar-wrapper {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    border: 2px dashed rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
    overflow: hidden;
}

.accountsettings-avatar-wrapper:hover {
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.8);
}

.accountsettings-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.accountsettings-avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
}

.accountsettings-avatar-placeholder i {
    font-size: 40px;
    color: rgba(255, 255, 255, 0.7);
}

.accountsettings-avatar-hover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 50%;
}

.accountsettings-avatar-wrapper:hover .accountsettings-avatar-hover {
    opacity: 1;
}

.accountsettings-avatar-hover i {
    font-size: 20px;
    margin-bottom: 5px;
}

.accountsettings-avatar-hover span {
    font-size: 12px;
}

/* 表单样式 */
.accountsettings-form-group {
    margin-bottom: 20px;
}

.accountsettings-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    opacity: 0.9;
}

.accountsettings-input-container {
    position: relative;
    display: flex;
    align-items: center;
}

.accountsettings-input-icon {
    position: absolute;
    left: 15px;
    font-size: 16px;
    opacity: 0.8;
}

.accountsettings-input {
    width: 100%;
    padding: 12px 15px 12px 40px;
    background: rgba(240, 240, 240, 0.2);
    /* 浅灰色半透明 */
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    color: white;
    font-size: 14px;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
}

.accountsettings-input:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
}

.accountsettings-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

/* 通知偏好切换 */
.accountsettings-toggle-group {
    background: rgba(240, 240, 240, 0.15);
    border-radius: 10px;
    padding: 10px;
    backdrop-filter: blur(5px);
}

.accountsettings-toggle-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.accountsettings-toggle-item:last-child {
    border-bottom: none;
}

.accountsettings-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.accountsettings-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.accountsettings-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.2);
    transition: .4s;
    border-radius: 24px;
}

.accountsettings-slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked+.accountsettings-slider {
    background-color: rgba(0, 136, 204, 0.5);
}

input:checked+.accountsettings-slider:before {
    transform: translateX(26px);
}

/* 按钮样式 */
.accountsettings-button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
}

.accountsettings-button {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.accountsettings-button-cancel {
    margin-right: 10px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.accountsettings-button-cancel:hover {
    background: rgba(255, 255, 255, 0.2);
}

.accountsettings-button-save {
    margin-left: 10px;
    background: rgba(0, 119, 182, 0.7);
    color: white;
}

.accountsettings-button-save:hover {
    background: rgba(0, 119, 182, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.accountsettings-button:active {
    transform: translateY(1px);
}
</style>