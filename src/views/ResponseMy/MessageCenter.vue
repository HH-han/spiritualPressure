<template>
    <div class="phone-message-center">
        <div class="phone-header">
            <h1 class="phone-title">消息中心</h1>
            <div class="phone-unread-count">3条未读消息</div>
        </div>

        <div class="phone-message-container">
            <!-- 消息筛选卡片 -->
            <div class="phone-filter-card">
                <div class="phone-filter-options">
                    <button class="phone-filter-btn" :class="{ 'phone-active': activeFilter === 'all' }"
                        @click="activeFilter = 'all'">
                        全部消息
                    </button>
                    <button class="phone-filter-btn" :class="{ 'phone-active': activeFilter === 'unread' }"
                        @click="activeFilter = 'unread'">
                        未读消息
                    </button>
                    <button class="phone-filter-btn" :class="{ 'phone-active': activeFilter === 'system' }"
                        @click="activeFilter = 'system'">
                        系统通知
                    </button>
                </div>
            </div>

            <!-- 消息列表卡片 -->
            <div class="phone-message-list-card">
                <div class="phone-message-item" v-for="message in filteredMessages" :key="message.id"
                    :class="{ 'phone-unread': !message.read }">
                    <div class="phone-message-avatar">
                        <img :src="message.avatar" alt="发送者头像" class="phone-avatar">
                        <div class="phone-message-type" :class="'phone-' + message.type">
                            <i :class="messageTypeIcons[message.type]"></i>
                        </div>
                    </div>
                    <div class="phone-message-content">
                        <div class="phone-message-header">
                            <span class="phone-sender">{{ message.sender }}</span>
                            <span class="phone-time">{{ formatTime(message.time) }}</span>
                        </div>
                        <div class="phone-message-title">{{ message.title }}</div>
                        <div class="phone-message-text">{{ message.content }}</div>
                    </div>
                    <div class="phone-message-actions">
                        <button class="phone-action-btn" @click="markAsRead(message.id)" v-if="!message.read">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="phone-action-btn" @click="deleteMessage(message.id)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 空状态卡片 -->
            <div class="phone-empty-card" v-if="filteredMessages.length === 0">
                <div class="phone-empty-icon">
                    <i class="far fa-envelope-open"></i>
                </div>
                <div class="phone-empty-text">暂无消息</div>
            </div>

            <!-- 统计卡片 -->
            <div class="phone-stats-card">
                <div class="phone-stat-item">
                    <div class="phone-stat-value">{{ totalMessages }}</div>
                    <div class="phone-stat-label">全部消息</div>
                </div>
                <div class="phone-stat-item">
                    <div class="phone-stat-value">{{ unreadCount }}</div>
                    <div class="phone-stat-label">未读消息</div>
                </div>
                <div class="phone-stat-item">
                    <div class="phone-stat-value">{{ systemMessages }}</div>
                    <div class="phone-stat-label">系统通知</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeFilter = ref('all');

const messages = ref([
    {
        id: 1,
        type: 'system',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        sender: '系统通知',
        title: '系统升级公告',
        content: '系统将于2025-07-20 02:00至05:00进行升级维护，期间将无法访问。',
        time: '2025-07-15T14:30:00',
        read: false
    },
    {
        id: 2,
        type: 'comment',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        sender: '用户小红',
        title: '评论了你的文章',
        content: '你的小说写得真好，期待下一章更新！',
        time: '2025-07-15T10:15:00',
        read: true
    },
    {
        id: 3,
        type: 'like',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        sender: '用户小明',
        title: '点赞了你的作品',
        content: '《未来世界》获得了100个赞',
        time: '2025-07-14T18:45:00',
        read: false
    },
    {
        id: 4,
        type: 'follow',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        sender: '用户小花',
        title: '关注了你',
        content: '小花已经成为你的粉丝',
        time: '2025-07-13T09:20:00',
        read: true
    },
    {
        id: 5,
        type: 'system',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        sender: '系统通知',
        title: '新功能上线',
        content: '私信功能已上线，现在可以和其他用户直接交流了！',
        time: '2025-07-12T16:10:00',
        read: false
    }
]);

const messageTypeIcons = {
    system: 'fas fa-bell',
    comment: 'fas fa-comment',
    like: 'fas fa-heart',
    follow: 'fas fa-user-plus'
};

const filteredMessages = computed(() => {
    switch (activeFilter.value) {
        case 'unread':
            return messages.value.filter(msg => !msg.read);
        case 'system':
            return messages.value.filter(msg => msg.type === 'system');
        default:
            return messages.value;
    }
});

const unreadCount = computed(() => messages.value.filter(msg => !msg.read).length);
const totalMessages = computed(() => messages.value.length);
const systemMessages = computed(() => messages.value.filter(msg => msg.type === 'system').length);

const formatTime = (timeString) => {
    const now = new Date();
    const msgTime = new Date(timeString);
    const diffHours = Math.floor((now - msgTime) / (1000 * 60 * 60));

    if (diffHours < 24) {
        return msgTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else {
        return msgTime.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
};

const markAsRead = (id) => {
    const message = messages.value.find(msg => msg.id === id);
    if (message) {
        message.read = true;
    }
};

const deleteMessage = (id) => {
    messages.value = messages.value.filter(msg => msg.id !== id);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.phone-message-center {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
}

.phone-header {
    text-align: center;
    margin-bottom: 30px;
    position: relative;
}

.phone-title {
    font-size: 2.5rem;
    color: #333;
    position: relative;
    display: inline-block;
    padding-bottom: 10px;
}

.phone-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #ff9a9e 0%, #fad0c4 100%);
    border-radius: 2px;
}

.phone-unread-count {
    position: absolute;
    top: 0;
    right: 20px;
    background: #ff4757;
    color: white;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
}

.phone-message-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 25px;
    max-width: 1200px;
    margin: 0 auto;
}

.phone-filter-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 15px;
}

.phone-filter-options {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 5px;
    align-items: center;
    justify-content: space-between;
}

.phone-filter-btn {
    padding: 8px 20px;
    border: none;
    background: #f1f2f6;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.9rem;
    white-space: nowrap;
    transition: all 0.3s ease;
}

.phone-filter-btn.phone-active {
    background: linear-gradient(135deg, #118dcb 0%, #2575fc 100%);
    color: white;
}

.phone-message-list-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.phone-message-item {
    display: flex;
    padding: 20px;
    border-bottom: 1px solid #eee;
    transition: background 0.3s ease;
}

.phone-message-item.phone-unread {
    background: #f8f9fa;
}

.phone-message-item:last-child {
    border-bottom: none;
}

.phone-message-avatar {
    position: relative;
    margin-right: 15px;
}

.phone-message-type {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.8rem;
}

.phone-message-type.phone-system {
    background: #ff4757;
}

.phone-message-type.phone-comment {
    background: #2ed573;
}

.phone-message-type.phone-like {
    background: #ff6b81;
}

.phone-message-type.phone-follow {
    background: #1e90ff;
}

.phone-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

.phone-message-content {
    flex: 1;
}

.phone-message-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
}

.phone-sender {
    font-weight: 500;
    color: #333;
}

.phone-time {
    font-size: 0.8rem;
    color: #999;
}

.phone-message-title {
    font-weight: 500;
    margin-bottom: 5px;
    color: #555;
}

.phone-message-text {
    font-size: 0.9rem;
    color: #777;
    line-height: 1.4;
}

.phone-message-actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    margin-left: 15px;
}

.phone-action-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: #f1f2f6;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
}

.phone-action-btn:hover {
    background: #dfe4ea;
    color: #333;
}

.phone-empty-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 50px 20px;
    text-align: center;
}

.phone-empty-icon {
    font-size: 3rem;
    color: #a4b0be;
    margin-bottom: 20px;
}

.phone-empty-text {
    font-size: 1.2rem;
    color: #747d8c;
}

.phone-stats-card {
    display: flex;
    justify-content: space-around;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 30px 20px;
    text-align: center;
}

.phone-stat-item {
    padding: 0 15px;
}

.phone-stat-value {
    font-size: 2rem;
    font-weight: 600;
    color: #667eea;
    margin-bottom: 5px;
}

.phone-stat-label {
    font-size: 0.9rem;
    color: #666;
}

@media (max-width: 768px) {
    .phone-title {
        font-size: 2rem;
    }

    .phone-stat-value {
        font-size: 1.5rem;
    }

    .phone-message-item {
        flex-direction: column;
    }

    .phone-message-actions {
        flex-direction: row;
        margin-left: 0;
        margin-top: 15px;
        justify-content: flex-end;
    }
}
</style>