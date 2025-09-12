<template>
    <div class="modal">
        <div class="notification">
            <!-- 文字提示内容 -->
            <div>
                <div class="noticontent">
                    <div class="notititle">是否确认退出登录？</div>
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
    max-width: 400px;
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

.notititle {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #ffffff;
    text-align: center;
    letter-spacing: 0.5px;
}

.notibody {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 25px;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
}

.button-container {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
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