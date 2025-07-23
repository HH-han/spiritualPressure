<template>
    <div class="notification">
        <div class="notification-container">
            <div class="notification-header-span">
                <span>当前时间：{{ currentTime }}</span>
            </div>
            <div v-for="(notification, index) in notifications" :key="index" class="notification-item"
                @click="showDetails(index)" @mouseenter="showDetails(index)" @mouseleave="hideDetails"
                :class="{ 'hovered': hoveredIndex === index }">
                <!-- 图标 -->
                <div>{{ notification.icon }}</div>
                <div class="notification-content">
                    <p>{{ notification.message }}</p>
                    <span class="notification-time">{{ notification.time }}</span>
                </div>
                <button class="Btn" @click.stop="openDeletePrompt(index)">
                    <div class="sign">
                        <svg viewBox="0 0 16 16" class="bi bi-trash3-fill" fill="currentColor" height="18" width="18"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5">
                            </path>
                        </svg>
                    </div>
                </button>

                <!-- 详细信息 -->
                <div class="notification-details" v-if="hoveredIndex === index">
                    {{ notification.details }}
                </div>
            </div>
        </div>
        <DeletePrompt :isDeletePromptVisible="isDeletePromptVisible" @close="closeDeletePrompt"
            @delete="handleDelete" />
    </div>
</template>

<script>
import DeletePrompt from '@/components/PromptComponent/DeletePrompt.vue';

export default {
    name: 'MessageNotification',
    mounted() {
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
    },
    components: {
        DeletePrompt,
    },
    data() {
        return {
            isDeletePromptVisible: false,
            currentDeleteIndex: null,
            hoveredIndex: null,
            currentTime: '',
            newMessage: '',
            messages: [],
            notifications: [
                {
                    message: '您有一条新的消息',
                    time: '5分钟前',
                    icon: '✍️',
                    details: '这是一条新的消息的详细信息。',
                },
                {
                    message: '您有一条新的消息',
                    time: '10分钟前',
                    icon: '✍️',
                    details: '这是第二条新消息的详细信息',
                },
                {
                    message: '您有一条新的消息',
                    time: '15分钟前',
                    icon: '✍️',
                    details: '这是第三条新消息的详细信息。',
                },
                {
                    message: '您的邮件已发送',
                    time: '10分钟前',
                    icon: '📧',
                    details: '您的邮件已成功发送。',
                },
                {
                    message: '系统更新可用',
                    time: '1小时前',
                    icon: '🌍',
                    details: '可以根据实际需要调整颜色、渐变效果和动画参数来达到最佳视觉效果。建议配合图标动画库（如lottie）进一步增强交互体验。',
                },
            ],
        };
    },
    methods: {
        updateCurrentTime() {
            const now = new Date();
            this.currentTime = now.toLocaleString('zh-CN');
        },
        showDetails(index) {
            // 显示通知详情
            this.hoveredIndex = index;
        },
        hideDetails() {
            // 隐藏通知详情
            this.hoveredIndex = null;
        },
        openDeletePrompt(index) {
            this.currentDeleteIndex = index;
            this.isDeletePromptVisible = true;
        },
        closeDeletePrompt() {
            this.isDeletePromptVisible = false;
            this.currentDeleteIndex = null;
        },
        handleDelete() {
            if (this.currentDeleteIndex !== null) {
                // 执行删除逻辑
                this.notifications.splice(this.currentDeleteIndex, 1);
                this.closeDeletePrompt();
                console.log('删除操作执行');
            }
        }
    }
};  
</script>
<style scoped>
.notification {
    display: flex;
    justify-content: center;
    align-items: center;
}

.notification-container {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(197, 197, 197, 0.2) 100%);
    backdrop-filter: blur(15px);
    border-radius: 10px;
    padding: 20px;
    color: white;
    width: 100%;
    margin: 20px;
    box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.4);
}

.notification-header-span {
    font-size: 20px;
    color: #000;
}

.notification-item {
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(150, 215, 243, 0.2) 100%);
    backdrop-filter: blur(15px);
    border-radius: 10px;
    padding: 10px;
    margin: 15px;
    position: relative;
    transition: transform 0.4s;
}

.notification-item:hover {
    transform: scale(1.05);
}

.notification-icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
}

.notification-content {
    flex: 1;
}

.notification-content p {
    color: #ffffff;
}

.notification-time {
    font-size: 12px;
    color: #e1e1e1;
}

.notification-details {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: black;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    width: 250px;
    z-index: 10;
}

/* 删除按钮 */
.Btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background: rgb(255, 135, 65);
    background: linear-gradient(250deg,
            rgba(255, 135, 65, 1) 15%,
            rgba(255, 65, 65, 1) 65%);
}

/* plus sign */
.sign {
    width: 100%;
    transition-duration: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.sign svg {
    width: 17px;
}

.sign svg path {
    fill: white;
}

/* hover effect on button width */
.Btn:hover {
    border-radius: 40px;
    transition-duration: 0.3s;
}

.Btn:active {
    transform: translate(2px, 2px);
}
</style>