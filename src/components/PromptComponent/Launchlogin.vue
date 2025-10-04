<template>
    <div class="modal">
        <div class="notification">
            <!-- 文字提示内容 -->
            <div class="notification-content">
                <div class="noticontent">
                    <div class="notititle">
                        <span>是否确认退出登录？</span>
                        <svg t="1757658764115" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="35948" width="32" height="32">
                            <path
                                d="M511.49551 64.648392c-247.341295 0-447.677019 200.335724-447.677019 447.677019s200.335724 447.677019 447.677019 447.677019 447.677019-200.335724 447.677019-447.677019S758.837828 64.648392 511.49551 64.648392zM509.817288 612.492762c-32.456203 0-58.757219-25.741267-58.757219-58.198493L451.060069 281.771455c0-32.456203 26.301016-58.19747 58.757219-58.19747 31.896454 0 58.19747 25.741267 58.19747 58.19747l0 272.522814C568.014758 586.751494 541.713742 612.492762 509.817288 612.492762zM511.49551 665.654542c37.492916 0 67.711148 30.218232 67.711148 67.711148 0 37.492916-30.218232 67.711148-67.711148 67.711148-37.492916 0-67.711148-30.218232-67.711148-67.711148C443.785386 695.872774 474.003618 665.654542 511.49551 665.654542z"
                                fill="#F77207" p-id="35949"></path>
                        </svg>
                    </div>
                    <div class="notibody">退出登录后，您将无法查看收藏的景点、评论、订单等</div>
                </div>
                <!-- 按钮 -->
                <div class="button-container">
                    <button class="btn btn-secondary" @click="handleCancel">取消</button>
                    <button class="btn btn-primary" @click="handleConfirm">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['confirm', 'cancel']);

const handleConfirm = () => {
    emit('confirm');
};

const handleCancel = () => {
    emit('cancel');
};
</script>
<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease-out;
}

.notification {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 24px;
    padding: 32px;
    max-width: 420px;
    width: 90%;
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.1),
        0 2px 8px rgba(0, 0, 0, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;
}

.notification::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.1) 100%);
    border-radius: 24px;
    z-index: -1;
}

.notification-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.noticontent {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.notititle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 20px;
    color: #ff0000;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.notititle .icon {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.notibody {
    font-size: 14px;
    line-height: 1.5;
    color: #ffffff;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
}

.button-container {
    display: flex;
    gap: 12px;
    justify-content: space-between;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
}

.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.btn:hover::before {
    opacity: 1;
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #666;
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
    background-color: rgb(248, 4, 4);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow:
        0 6px 20px rgba(234, 102, 157, 0.4),
        0 2px 8px rgba(234, 102, 102, 0.2);
}

.btn:active {
    transform: translateY(0);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* 响应式设计 */
@media (max-width: 480px) {
    .notification {
        margin: 20px;
        padding: 24px;
        max-width: none;
    }

    .button-container {
        flex-direction: column;
    }

    .btn {
        width: 100%;
    }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
    .notification {
        background: rgba(30, 30, 30, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .notititle {
        color: #ffffff;
    }

    .notibody {
        color: #cccccc;
    }

    .btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: #cccccc;
    }
}
</style>