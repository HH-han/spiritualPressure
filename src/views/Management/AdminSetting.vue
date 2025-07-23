<template>
    <div class="admin-settings-container">
        <aside class="admin-sidebar">
            <div class="admin-logo">
                <span>项目导航</span>
                <button @click="handleClose">
                    <svg t="1752995368833" class="admin-nav-icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="4451" width="256" height="256">
                        <path
                            d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024zM305.956571 370.395429L447.488 512 305.956571 653.604571a45.568 45.568 0 1 0 64.438858 64.438858L512 576.512l141.604571 141.531429a45.568 45.568 0 0 0 64.438858-64.438858L576.512 512l141.531429-141.604571a45.568 45.568 0 1 0-64.438858-64.438858L512 447.488 370.395429 305.956571a45.568 45.568 0 0 0-64.438858 64.438858z"
                            fill="#FF2525" p-id="4452"></path>
                    </svg>
                    <span class="admin-nav-text">关闭</span>
                </button>
            </div>
            <nav class="admin-nav-menu">
                <ul>
                    <li>
                        <span>系统设置</span>
                    </li>
                </ul>
            </nav>
            <div class="admin-sidebar-footer">
                <div class="admin-user-info">
                    <img :src="userInfo.image" alt="用户头像" class="admin-user-avatar">
                    <span class="admin-user-name">当前用户：{{ userInfo.username }}</span>
                </div>
            </div>
        </aside>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 关闭
const emit = defineEmits(['close']);
const handleClose = () => {
    emit('close');
};
// 用户信息
const userInfo = ref({
    image: '',
    username: '',
});
const loading = ref(false);
// 获取用户信息
const fetchUserInfo = async () => {
    // 先从本地存储获取，优化用户体验
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    userInfo.value = { ...localUser };
};

onMounted(() => {
    fetchUserInfo();
});
</script>

<style scoped>
.admin-settings-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    transition: opacity 0.3s ease;
}

/* 侧边栏样式 */
.admin-sidebar {
    width: 250px;
    background: #fff;
    box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
    height: 100vh;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    border-right: 2px solid rgba(0, 0, 0, 0.1);
}

.admin-logo {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    padding: 1.5rem 1rem;
    font-size: 1.2rem;
    font-weight: 800;
    text-align: center;
    color: #4e73df;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.admin-logo button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    border-radius: 15px;
    color: #4e73df;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.3s ease-in-out;
}
.admin-logo button:hover { 
    background-color: rgba(78, 115, 223, 0.1);
}
.admin-nav-menu {
    flex: 1;
    overflow-y: auto;
}

.admin-nav-menu ul {
    list-style: none;
    padding: 0.5rem 0;
}

.admin-nav-menu li {
    margin: 0.2rem 1rem;
    padding: 5px 0.5rem;
    border-radius: 0.35rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.admin-nav-menu li:hover {
    background-color: rgba(78, 115, 223, 0.1);
}

.admin-nav-menu li.admin-active {
    background-color: #4e73df;
    color: #fff;
}

.admin-nav-menu li.admin-active .admin-nav-icon {
    color: #fff;
}

.admin-nav-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    color: #4e73df;
    transition: all 0.3s ease;
}

.admin-nav-text {
    font-size: 0.85rem;
    font-weight: 600;
}

.admin-sidebar-footer {
    padding: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.admin-user-info {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
}

.admin-user-avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    margin-right: 0.75rem;
    object-fit: cover;
}

.admin-user-name {
    font-size: 0.85rem;
    font-weight: 600;
}
</style>