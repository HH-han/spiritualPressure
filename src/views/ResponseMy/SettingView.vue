<template>
    <div class="phone-settings-center">
        <div class="phone-settings-container">
            <!-- 账户设置卡片 -->
            <div class="phone-settings-card">
                <div class="phone-card-header">
                    <h2 class="phone-card-title">
                        <i class="fas fa-user-cog phone-title-icon"></i>
                        账户设置
                    </h2>
                </div>

                <div class="phone-settings-group">
                    <div class="phone-setting-item">
                        <div class="phone-setting-info">
                            <i class="fas fa-user phone-setting-icon"></i>
                            <div>
                                <div class="phone-setting-name">用户名</div>
                                <div class="phone-setting-value">{{ userData.username }}</div>
                            </div>
                        </div>
                        <button class="phone-setting-action" @click="showEditModal('username')">
                            修改
                        </button>
                    </div>

                    <div class="phone-setting-item">
                        <div class="phone-setting-info">
                            <i class="fas fa-envelope phone-setting-icon"></i>
                            <div>
                                <div class="phone-setting-name">电子邮箱</div>
                                <div class="phone-setting-value">{{ userData.email }}</div>
                            </div>
                        </div>
                        <button class="phone-setting-action" @click="showEditModal('email')">
                            修改
                        </button>
                    </div>

                    <div class="phone-setting-item">
                        <div class="phone-setting-info">
                            <i class="fas fa-phone phone-setting-icon"></i>
                            <div>
                                <div class="phone-setting-name">手机号码</div>
                                <div class="phone-setting-value">{{ userData.phone }}</div>
                            </div>
                        </div>
                        <button class="phone-setting-action" @click="showEditModal('phone')">
                            修改
                        </button>
                    </div>

                    <div class="phone-setting-item">
                        <div class="phone-setting-info">
                            <i class="fas fa-lock phone-setting-icon"></i>
                            <div>
                                <div class="phone-setting-name">登录密码</div>
                                <div class="phone-setting-value">********</div>
                            </div>
                        </div>
                        <button class="phone-setting-action" @click="showPasswordModal">
                            修改
                        </button>
                    </div>
                </div>
            </div>

            <!-- 隐私设置卡片 -->
            <div class="phone-settings-card">
                <div class="phone-card-header">
                    <h2 class="phone-card-title">
                        <i class="fas fa-shield-alt phone-title-icon"></i>
                        隐私设置
                    </h2>
                </div>

                <div class="phone-settings-group">
                    <div class="phone-setting-item">
                        <div class="phone-setting-info">
                            <i class="fas fa-eye phone-setting-icon"></i>
                            <div>
                                <div class="phone-setting-name">公开个人资料</div>
                                <div class="phone-setting-desc">是否允许其他用户查看你的个人资料</div>
                            </div>
                        </div>
                        <label class="phone-switch">
                            <input type="checkbox" v-model="privacySettings.profilePublic">
                            <span class="phone-slider"></span>
                        </label>
                    </div>

                    <div class="phone-setting-item">
                        <div class="phone-setting-info">
                            <i class="fas fa-search phone-setting-icon"></i>
                            <div>
                                <div class="phone-setting-name">搜索引擎可见</div>
                                <div class="phone-setting-desc">允许搜索引擎索引你的公开内容</div>
                            </div>
                        </div>
                        <label class="phone-switch">
                            <input type="checkbox" v-model="privacySettings.searchEngineVisible">
                            <span class="phone-slider"></span>
                        </label>
                    </div>

                    <div class="phone-setting-item">
                        <div class="phone-setting-info">
                            <i class="fas fa-map-marker-alt phone-setting-icon"></i>
                            <div>
                                <div class="phone-setting-name">位置信息</div>
                                <div class="phone-setting-desc">是否在内容中显示你的位置信息</div>
                            </div>
                        </div>
                        <label class="phone-switch">
                            <input type="checkbox" v-model="privacySettings.locationVisible">
                            <span class="phone-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- 通知设置卡片 -->
            <div class="phone-settings-card">
                <div class="phone-card-header">
                    <h2 class="phone-card-title">
                        <i class="fas fa-bell phone-title-icon"></i>
                        通知设置
                    </h2>
                </div>

                <div class="phone-settings-group">
                    <div class="phone-setting-item">
                        <div class="phone-setting-info">
                            <i class="fas fa-comment-dots phone-setting-icon"></i>
                            <div>
                                <div class="phone-setting-name">评论通知</div>
                                <div class="phone-setting-desc">有人评论你的内容时接收通知</div>
                            </div>
                        </div>
                        <label class="phone-switch">
                            <input type="checkbox" v-model="notificationSettings.comments">
                            <span class="phone-slider"></span>
                        </label>
                    </div>

                    <div class="phone-setting-item">
                        <div class="phone-setting-info">
                            <i class="fas fa-heart phone-setting-icon"></i>
                            <div>
                                <div class="phone-setting-name">点赞通知</div>
                                <div class="phone-setting-desc">有人点赞你的内容时接收通知</div>
                            </div>
                        </div>
                        <label class="phone-switch">
                            <input type="checkbox" v-model="notificationSettings.likes">
                            <span class="phone-slider"></span>
                        </label>
                    </div>

                    <div class="phone-setting-item">
                        <div class="phone-setting-info">
                            <i class="fas fa-user-plus phone-setting-icon"></i>
                            <div>
                                <div class="phone-setting-name">新粉丝通知</div>
                                <div class="phone-setting-desc">有人关注你时接收通知</div>
                            </div>
                        </div>
                        <label class="phone-switch">
                            <input type="checkbox" v-model="notificationSettings.followers">
                            <span class="phone-slider"></span>
                        </label>
                    </div>

                    <div class="phone-setting-item">
                        <div class="phone-setting-info">
                            <i class="fas fa-envelope-open-text phone-setting-icon"></i>
                            <div>
                                <div class="phone-setting-name">站内信通知</div>
                                <div class="phone-setting-desc">接收系统消息和私信通知</div>
                            </div>
                        </div>
                        <label class="phone-switch">
                            <input type="checkbox" v-model="notificationSettings.messages">
                            <span class="phone-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- 系统设置卡片 -->
            <div class="phone-settings-card">
                <div class="phone-card-header">
                    <h2 class="phone-card-title">
                        <i class="fas fa-cog phone-title-icon"></i>
                        系统设置
                    </h2>
                </div>

                <div class="phone-settings-group">
                    <div class="phone-setting-item">
                        <div class="phone-setting-info">
                            <i class="fas fa-moon phone-setting-icon"></i>
                            <div>
                                <div class="phone-setting-name">夜间模式</div>
                                <div class="phone-setting-desc">切换到深色主题保护眼睛</div>
                            </div>
                        </div>
                        <label class="phone-switch">
                            <input type="checkbox" v-model="systemSettings.darkMode">
                            <span class="phone-slider"></span>
                        </label>
                    </div>

                    <div class="phone-setting-item">
                        <div class="phone-setting-info">
                            <i class="fas fa-language phone-setting-icon"></i>
                            <div>
                                <div class="phone-setting-name">语言设置</div>
                                <div class="phone-setting-desc">切换系统显示语言</div>
                            </div>
                        </div>
                        <select class="phone-select" v-model="systemSettings.language">
                            <option value="zh-CN">简体中文</option>
                            <option value="en-US">English</option>
                            <option value="ja-JP">日本語</option>
                        </select>
                    </div>

                    <div class="phone-setting-item">
                        <div class="phone-setting-info">
                            <i class="fas fa-font phone-setting-icon"></i>
                            <div>
                                <div class="phone-setting-name">字体大小</div>
                                <div class="phone-setting-desc">调整系统显示字体大小</div>
                            </div>
                        </div>
                        <div class="phone-range-container">
                            <input type="range" class="phone-range" min="12" max="20" step="1"
                                v-model="systemSettings.fontSize">
                            <span class="phone-range-value">{{ systemSettings.fontSize }}px</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 操作卡片 -->
            <div class="phone-actions-card">
                <button class="phone-action-btn phone-save-btn" @click="saveSettings">
                    <i class="fas fa-save"></i> 保存设置
                </button>
                <button class="phone-action-btn phone-logout-btn" @click="logout" v-if="userInfo.id">
                    <i class="fas fa-sign-out-alt"></i> 退出登录
                </button>
            </div>
        </div>

        <!-- 编辑模态框 -->
        <div class="phone-modal" v-if="showModal">
            <div class="phone-modal-content">
                <div class="phone-modal-header">
                    <h3>修改{{ modalTitle }}</h3>
                    <button class="phone-close-btn" @click="closeModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="phone-modal-body">
                    <input type="text" class="phone-modal-input" v-model="editValue"
                        :placeholder="'请输入新的' + modalTitle">
                </div>
                <div class="phone-modal-footer">
                    <button class="phone-modal-btn phone-cancel-btn" @click="closeModal">
                        取消
                    </button>
                    <button class="phone-modal-btn phone-confirm-btn" @click="confirmEdit">
                        确认
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/utils/request';

const router = useRouter();

const userData = ref({
    username: "admin",
    email: "2560177364@qq.com",
    phone: "18213200129",
    password: "123456"
});

const privacySettings = ref({
    profilePublic: true,
    searchEngineVisible: true,
    locationVisible: false
});

const notificationSettings = ref({
    comments: true,
    likes: true,
    followers: true,
    messages: true
});

const systemSettings = ref({
    darkMode: false,
    language: "zh-CN",
    fontSize: 16
});

const showModal = ref(false);
const editField = ref("");
const editValue = ref("");

const modalTitle = computed(() => {
    switch (editField.value) {
        case "username": return "用户名";
        case "email": return "电子邮箱";
        case "phone": return "手机号码";
        default: return "";
    }
});

const showEditModal = (field) => {
    editField.value = field;
    editValue.value = userData.value[field];
    showModal.value = true;
};

const showPasswordModal = () => {
    // 密码修改需要单独处理，这里可以跳转到密码修改页面
    router.push('/change-password');
};

const closeModal = () => {
    showModal.value = false;
};

const confirmEdit = () => {
    if (editValue.value.trim()) {
        userData.value[editField.value] = editValue.value;
        closeModal();
    }
};

const saveSettings = () => {
    // 这里可以添加保存设置到服务器的逻辑
    alert("设置已保存");
};
// 退出登录
const logout = () => {
  // 清除所有登录相关存储
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('rememberedUsername');
  
  console.log('用户退出登录')
  // 刷新页面状态
  router.push('/viewprofile');
}
const fetchUserInfo = async () => {
    const localUser = JSON.parse(localStorage.getItem('user') || {});
    userInfo.value = { ...localUser };
};
const loading = ref(false);
// 用户信息
const userInfo = ref({});
// 生命周期钩子
onMounted(
  fetchUserInfo
);
</script>

<style scoped>
/* 基础样式 */
.phone-settings-center {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    color: #333;
    background-color: #f5f7fa;
    min-height: 100vh;
}

/* 卡片容器 */
.phone-settings-container {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

/* 卡片样式 */
.phone-settings-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.phone-settings-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.phone-card-header {
    padding: 18px 20px;
    background: linear-gradient(135deg, #118dcb 0%, #2575fc 100%);
    color: white;
}

.phone-card-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
}

.phone-title-icon {
    margin-right: 10px;
    font-size: 16px;
}

/* 设置项样式 */
.phone-settings-group {
    padding: 15px 20px;
}

.phone-setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #f0f2f5;
}

.phone-setting-item:last-child {
    border-bottom: none;
}

.phone-setting-info {
    display: flex;
    align-items: center;
    flex: 1;
}

.phone-setting-icon {
    font-size: 18px;
    color: #118dcb;
    margin-right: 15px;
    width: 24px;
    text-align: center;
}

.phone-setting-name {
    font-weight: 500;
    font-size: 15px;
    margin-bottom: 3px;
    color: #2c3e50;
}

.phone-setting-value {
    font-size: 14px;
    color: #7f8c8d;
}

.phone-setting-desc {
    font-size: 13px;
    color: #95a5a6;
}

.phone-setting-action {
    background: #f0f2f5;
    border: none;
    padding: 8px 15px;
    border-radius: 6px;
    color: #3498db;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.phone-setting-action:hover {
    background: #3498db;
    color: white;
}

/* 开关样式 */
.phone-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;
}

.phone-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.phone-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
}

.phone-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked+.phone-slider {
    background: linear-gradient(135deg, #118dcb 0%, #2575fc 100%);
}

input:checked+.phone-slider:before {
    transform: translateX(24px);
}

/* 选择框和滑块样式 */
.phone-select {
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #ddd;
    background-color: white;
    color: #333;
    font-size: 14px;
    min-width: 120px;
}

.phone-range-container {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 180px;
}

.phone-range {
    flex: 1;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: #ddd;
    border-radius: 3px;
    outline: none;
}

.phone-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: linear-gradient(135deg, #118dcb 0%, #2575fc 100%);
    cursor: pointer;
}

.phone-range-value {
    font-size: 13px;
    color: #7f8c8d;
    min-width: 40px;
}

/* 操作卡片样式 */
.phone-actions-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.phone-action-btn {
    padding: 12px 25px;
    border-radius: 8px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.phone-save-btn {
    background: linear-gradient(135deg, #118dcb 0%, #2575fc 100%);
    color: white;
}

.phone-save-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(106, 17, 203, 0.3);
}

.phone-logout-btn {
    background: #f0f2f5;
    color: #e74c3c;
}

.phone-logout-btn:hover {
    background: #e74c3c;
    color: white;
}

/* 模态框样式 */
.phone-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.phone-modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.phone-modal-header {
    padding: 18px 20px;
    background: linear-gradient(135deg, #118dcb 0%, #2575fc 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.phone-modal-header h3 {
    margin: 0;
    font-size: 18px;
}

.phone-close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
}

.phone-modal-body {
    padding: 25px 20px;
}

.phone-modal-input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 15px;
    transition: border-color 0.3s;
}

.phone-modal-input:focus {
    border-color: #118dcb;
    outline: none;
}

.phone-modal-footer {
    padding: 15px 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    background: #f9f9f9;
}

.phone-modal-btn {
    padding: 8px 20px;
    border-radius: 6px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.phone-cancel-btn {
    background: #f0f2f5;
    color: #7f8c8d;
}

.phone-cancel-btn:hover {
    background: #e0e6ed;
}

.phone-confirm-btn {
    background: linear-gradient(135deg, #118dcb 0%, #2575fc 100%);
    color: white;
}

.phone-confirm-btn:hover {
    opacity: 0.9;
}

/* 响应式调整 */
@media (max-width: 600px) {
    .phone-settings-center {
        padding: 15px;
    }

    .phone-card-header {
        padding: 15px;
    }

    .phone-settings-group {
        padding: 10px 15px;
    }

    .phone-setting-item {
        align-items: flex-start;
        gap: 10px;
    }

    .phone-setting-action,
    .phone-switch,
    .phone-select {
        align-self: flex-end;
    }

    .phone-actions-card {
        flex-direction: column;
        gap: 10px;
    }

    .phone-action-btn {
        justify-content: center;
    }
}
</style>