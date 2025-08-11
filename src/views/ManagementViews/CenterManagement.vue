<template>
    <div class="container-fluid">
        <header>
            <h1>个人中心</h1>
            <p>欢迎<span class="color-primary">"{{ userInfo.nickname }}"</span>管理您的账户信息，保护账户安全</p>
        </header>

        <div class="profile-container">
            <!-- 侧边栏 -->
            <aside class="sidebar">
                <div class="profile-header">
                    <div class="avatar">
                        <img v-if="!userInfo.image" :src="defaultAvatar" alt="默认头像" />
                        <img v-else :src="userInfo.image" alt="用户头像" />
                    </div>
                    <h2>{{ userInfo.username }}</h2>
                    <p>{{ userInfo.signature }}</p>
                </div>

                <div class="stats">
                    <div class="stat-item" v-for="stat in stats" :key="stat.label">
                        <div class="number">{{ stat.number }}</div>
                        <div class="label">{{ stat.label }}</div>
                    </div>
                </div>

                <nav class="navigation">
                    <div v-for="item in navItems" :key="item.tab" class="nav-item"
                        :class="{ active: activeTab === item.tab }" @click="changeTab(item.tab)">
                        <i :class="item.icon"></i> {{ item.label }}
                    </div>
                </nav>
            </aside>

            <!-- 内容区 -->
            <main class="content-area">
                <!-- 个人信息 -->
                <section v-if="activeTab === 'personal'" class="tab-content active">
                    <h2 class="section-title">个人信息</h2>
                    <div class="personal-info-grid">
                        <PersonalCenter />
                    </div>
                </section>

                <!-- 修改密码 -->
                <section v-if="activeTab === 'password'" class="tab-content active">
                    <h2 class="section-title">修改密码</h2>
                    <div class="personal-info-grid">
                        <ChangePassword />
                    </div>
                </section>
                <section v-if="activeTab === 'notification'" class="tab-content active">
                    <h2 class="section-title">通知设置</h2>
                    <div class="personal-info-grid">
                        <MessageNotification />
                    </div>
                </section>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import PersonalCenter from '@/views/MyCenter/PersonalCenter.vue';
import ChangePassword from '@/views/MyCenter/ChangePassword.vue';
import MessageNotification from '@/views/MyCenter/MessageNotification.vue'
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

// 获取用户信息
const loading = ref(false);
const originalUserInfo = ref({});
const fetchUserInfo = async () => {
    try {
        loading.value = true;
        // 检查是否有token
        const token = localStorage.getItem('token');
        if (!token) {
            ElMessage.error('请先登录');
            router.push('/login');
            return;
        }

        // 先从本地存储获取，优化用户体验
        const localUser = JSON.parse(localStorage.getItem('user') || {});
        userInfo.value = { ...localUser };

        //从服务器获取最新数据
        const response = await request.get('/api/public/user/info');

        if (response.code === '0') {
            userInfo.value = response.data;
            originalUserInfo.value = { ...response.data };
            localStorage.setItem('user', JSON.stringify(response.data));
        } else {
            ElMessage.error(response.msg || '获取用户信息失败');
        }
    } catch (error) {
        ElMessage.error('获取用户信息失败，请检查网络');
        console.error('获取用户信息失败:', error);
    } finally {
        loading.value = false;
    }
};

// 用户信息
const userInfo = ref({
    username: '',
    nickname: '',
    experience: '',
    signature: '',
    phone: '',
    createTime: '',
    email: '',
    image: ''
});

const stats = [
    { number: 128, label: '项目' },
    { number: 24, label: '关注' },
    { number: 56, label: '粉丝' }
]

const navItems = [
    { tab: 'personal', label: '个人信息', icon: 'fas fa-user-circle' },
    { tab: 'password', label: '修改密码', icon: 'fas fa-lock' },
    { tab: 'notification', label: '通知设置', icon: 'fas fa-bell' },
    { tab: 'payment', label: '支付信息', icon: 'fas fa-credit-card' },
    { tab: 'settings', label: '账户设置', icon: 'fas fa-cog' }
]
const activeTab = ref('personal')

// 方法
const changeTab = (tab) => {
    activeTab.value = tab
}
// 组件挂载时获取用户信息
onMounted(() => {
    fetchUserInfo();
});
</script>
<style scoped>
.container-fluid {
    margin: 0 auto;
    padding: 20px;
    background-color: #f4f6f8;
    border-radius: 15px;
}
.color-primary{
    color: #0080ff;
    font-weight: bold;
}
header {
    text-align: center;
    margin-bottom: 10px;
}

header h1 {
    font-size: 2.8rem;
    color: #2c3e50;
    margin-bottom: 10px;
    background: linear-gradient(90deg, #3498db, #9b59b6);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 700;
}

header p {
    color: #7f8c8d;
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
}

.profile-container {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
}

.sidebar {
    flex: 1;
    min-width: 280px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    padding: 30px;
}

.profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 30px;
}

.avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3498db, #9b59b6);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    overflow: hidden;
    border: 4px solid white;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-header h2 {
    font-size: 1.8rem;
    color: #2c3e50;
    margin-bottom: 5px;
}

.profile-header p {
    color: #7f8c8d;
    font-size: 1.1rem;
}

.stats {
    display: flex;
    justify-content: space-around;
    margin: 25px 0;
    border-top: 1px solid #ecf0f1;
    border-bottom: 1px solid #ecf0f1;
    padding: 15px 0;
}

.stat-item {
    text-align: center;
}

.stat-item .number {
    font-size: 1.8rem;
    font-weight: 700;
    color: #3498db;
}

.stat-item .label {
    font-size: 0.9rem;
    color: #7f8c8d;
}

.navigation {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.nav-item {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1.1rem;
    color: #34495e;
}

.nav-item:hover {
    background: #f8f9fa;
}

.nav-item.active {
    background: linear-gradient(135deg, #3498db, #9b59b6);
    color: white;
    box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
}

.nav-item i {
    margin-right: 12px;
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
}

.content-area {
    flex: 3;
    min-width: 300px;
    background-image: url("@/assets/scenery/风景6.webp");
    background-size: cover;
    background-position: center;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    padding: 30px;
    overflow: hidden;
}

.tab-content {
    display: none;
    animation: fadeIn 0.5s ease;
}

.tab-content.active {
    display: block;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.section-title {
    font-size: 1.8rem;
    color: #2c3e50;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f1f2f6;
    position: relative;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 120px;
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(90deg, #3498db, #9b59b6);
}

.personal-info-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 25px;
}

.info-card {
    background: #f8f9fa;
    border-radius: 15px;
    padding: 20px;
    transition: transform 0.3s ease;
}

.info-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.info-card h3 {
    display: flex;
    align-items: center;
    color: #7f8c8d;
    font-size: 1.1rem;
    margin-bottom: 15px;
}

.info-card h3 i {
    margin-right: 10px;
    color: #3498db;
}

.info-card p {
    font-size: 1.3rem;
    color: #2c3e50;
    font-weight: 600;
}

.form-group {
    margin-bottom: 25px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #2c3e50;
    font-size: 1.1rem;
}

.form-control {
    width: 100%;
    padding: 15px;
    border: 2px solid #e0e6ed;
    border-radius: 12px;
    font-size: 1.1rem;
    transition: all 0.3s ease;
}

.form-control:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    outline: none;
}

.password-strength {
    height: 5px;
    background: #ecf0f1;
    border-radius: 5px;
    margin-top: 10px;
    overflow: hidden;
}

.strength-meter {
    height: 100%;
    width: 0;
    border-radius: 5px;
    transition: width 0.3s ease;
}

.btn {
    display: inline-block;
    background: linear-gradient(135deg, #3498db, #9b59b6);
    color: white;
    border: none;
    padding: 15px 35px;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.btn:active {
    transform: translateY(1px);
}

.password-rules {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
    margin-top: 30px;
}

.password-rules h4 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 1.2rem;
}

.rules-list {
    list-style-type: none;
}

.rules-list li {
    padding: 8px 0;
    display: flex;
    align-items: center;
}

.rules-list li i {
    margin-right: 10px;
    color: #3498db;
}

.password-toggle {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #7f8c8d;
}

.password-input {
    position: relative;
}

footer {
    text-align: center;
    color: #7f8c8d;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #ecf0f1;
    font-size: 1rem;
}

@media (max-width: 768px) {
    .profile-container {
        flex-direction: column;
    }

    .sidebar {
        width: 100%;
    }

    header h1 {
        font-size: 2.2rem;
    }
}
</style>