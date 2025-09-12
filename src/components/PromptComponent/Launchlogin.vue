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
    width: 100%;
    height: 100%;
    backdrop-filter: blur(10px);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}

.notification {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 450px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    color: #fff;
    overflow: hidden;
    z-index: 9999;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);

}

/* 添加模态背景层 */
.notification::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: -1;
}

.notification-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.noticontent {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}

.notititle {
    width: 100%;
    font-size: 22px;
    font-weight: 600;
    color: #ffffff;
    text-align: center;
    letter-spacing: 0.5px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
}

.notibody {
    font-size: 16px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
}

.button-container {
    display: flex;
    justify-content: center;
    gap: 15px;
}

.btn {
    padding: 8px 38px;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
    position: relative;
    overflow: hidden;
}

.btn-primary {
    background: linear-gradient(45deg, #4285f4, #669df6);
    color: white;
    box-shadow: 0 4px 15px rgba(66, 133, 244, 0.4);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(66, 133, 244, 0.6);
}

.btn-primary:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(66, 133, 244, 0.4);
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-secondary:active {
    transform: translateY(0);
}

/* 动画效果 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

@keyframes pulse {
    0% {
        opacity: 0.5;
    }

    100% {
        opacity: 0.8;
    }
}

/* 响应式设计 */
@media (max-width: 480px) {
    .notification {
        padding: 20px;
        max-width: 90%;
    }

    .notititle {
        font-size: 20px;
    }

    .notibody {
        font-size: 14px;
    }

    .button-container {
        flex-direction: column;
        gap: 10px;
    }

    .btn {
        width: 100%;
    }
}
</style>