<template>
    <div class="accountsettings-background">
        <img src="@/assets/scenery/风景2.webp" alt="background" />
    </div>
    <div class="glassmorphism-container">
        <!-- 标题装饰 -->
        <div class="glass-header">
            <h1 class="glass-title">我的订单</h1>
            <div class="glass-decoration"></div>
        </div>

        <!-- 订单列表 -->
        <div class="order-list">
            <transition-group name="list" tag="div">
                <div v-for="order in orders" :key="order.id" class="glass-card"
                    :class="{ 'paid': order.status === 'paid', 'pending': order.status === 'pending' }">
                    <div class="card-image-content">
                        <!-- 景点图片 -->
                        <div class="order-image-container">
                            <img v-if="!order.image" :src="defaultOrderImage" alt="默认商品" class="order-image">
                            <img v-else :src="order.image" alt="商品" class="order-image" />
                            <div class="rating-badge">
                                <svg t="1752588028464" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="6498" width="256" height="256">
                                    <path
                                        d="M724.5 877.3c-7.8 0-15.5-2.9-21.5-8.3L575.8 753.4l-167.4 39.2c-11.9 2.7-24.3-1.4-32-10.8-7.8-9.4-9.5-22.4-4.5-33.5l70.7-156.7-89-147c-6.3-10.4-6.2-23.5 0.4-33.8 6.5-10.3 18.3-16 30.5-14.6L555.4 415l112.3-130.1c8-9.2 20.4-13.2 32.3-10 11.8 3 20.8 12.5 23.3 24.5l35 168.3 158.5 66.7c11.2 4.8 18.8 15.4 19.5 27.6 0.7 12.2-5.5 23.7-16.1 29.7l-149.3 85.2L756.4 848c-1 12.2-8.8 22.7-20.2 27.1-3.7 1.5-7.7 2.2-11.7 2.2zM584.9 686.4c7.9 0 15.6 2.9 21.5 8.3l91.7 83.3 10.4-123.5c0.9-10.5 6.9-19.9 16-25.1L832.1 568l-114.2-48c-9.7-4.1-16.8-12.7-18.9-23l-25.2-121.3-81 93.8c-6.9 8-17.3 11.9-27.7 10.9L442 466.8l64.2 106c5.5 9 6.1 20.1 1.8 29.8l-51 112.9 120.6-28.3c2.4-0.5 4.9-0.8 7.3-0.8z"
                                        p-id="6499"></path>
                                    <path
                                        d="M637.4 268.8c-5.5-10.7-16.6-17.9-28.6-17.9l-142.9-0.9-80.6-118.2c-6.8-9.8-18.8-15.4-30.7-13.7-12.4 1.7-22.2 10.2-26 21.8l-44.8 135.7-137.4 39.7c-11.9 3.4-20.5 13.2-22.6 25.2-2.1 11.9 2.6 24.3 12.4 31.6l115.2 84.5-4.4 142.9c-0.4 12.4 6 23.5 16.6 29.4 4.7 2.6 10.2 3.8 15.4 3.8 6.4 0 12.8-2.1 18.3-6.4l98.6-70.4-33.3-55-49.9 35.8 3-94.7c0.4-10.7-4.3-20.9-12.8-26.9l-76.4-56.3 90.9-26.5c10.2-3 18.3-10.7 21.3-20.9l30.3-90 53.3 78.5c6 9 15.8 14.1 26 14.1l95.1 0.4-55.9 71.7 74.9 8.1 71.1-91.7c4.7-5.1 6.8-12.4 6.8-18.8 0.1-5.1-0.7-10.2-2.9-14.9z"
                                        fill="#FFCE00" p-id="6500"></path>
                                </svg> {{ order.rating }}
                            </div>
                        </div>

                        <!-- 订单内容 -->
                        <div class="order-content">
                            <div class="order-info">
                                <h3 class="order-name">{{ order.itemName }}</h3>
                                <div class="order-status" :class="order.status">
                                    {{ statusText[order.status] }}
                                </div>
                            </div>
                            <div class="order-meta">
                                <div class="order-date">
                                    <i class="icon-calendar"></i> {{ order.createdAt }}
                                </div>
                                <div class="order-price">
                                    ¥{{ order.amount }}
                                </div>
                            </div>
                        </div>
                    </div>


                    <!-- 操作按钮 -->
                    <div class="order-actions">
                        <button v-if="order.status !== 'SUCCESS'" @click="handlePay(order.id)"
                            :disabled="order.status === 'SUCCESS'" class="glass-btn pay-btn">
                            <svg t="1752587953346" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="5470" width="256" height="256">
                                <path
                                    d="M235.04 808.906c-28.909 0-49.927-23.754-49.927-52.922V529.368c0-7.371-5.978-13.329-13.335-13.329-7.371 0-13.335 5.958-13.335 13.329v226.617c0 43.884 32.984 79.59 76.596 79.59 7.357 0 13.334-5.964 13.334-13.335 0.001-7.369-5.976-13.334-13.333-13.334zM300.11 809.4h-13.334c-7.358 0-13.335 5.964-13.335 13.335s5.977 13.335 13.335 13.335h13.335c7.37 0 13.334-5.964 13.334-13.335s-5.963-13.335-13.334-13.335z"
                                    p-id="5471"></path>
                                <path
                                    d="M866.09 489.37h-54.25V367.444c0-41.703-31.8-76.979-71.644-87.92 0.828-4.56 0.482-9.393-1.255-14.05l-57.543-154.37a26.676 26.676 0 0 0-13.91-14.943c-6.445-2.937-13.776-3.21-20.404-0.723L185.27 267.83a26.533 26.533 0 0 0-11.385 8.184h-21.365c-50.969 0-87.417 41.02-87.417 91.429v468.548c0 51.515 36.45 93.42 87.417 93.42h561.89c50.968 0 97.43-41.905 97.43-93.42v-106.6h54.251c51.047 0 92.43-41.383 92.43-92.429v-55.162c0-51.054-41.383-92.431-92.43-92.431zM640.743 154.734l45.203 121.281H315.845l324.898-121.28z m117.759 681.258c0 21.722-22.907 40.08-44.094 40.08H152.52c-21.187 0-34.079-18.358-34.079-40.08V367.444c0-21.357 12.163-38.09 34.08-38.09h561.888c21.917 0 44.094 16.733 44.094 38.09V489.37h-80.92c-51.047 0-92.43 41.378-92.43 92.43v55.163c0 51.046 41.383 92.43 92.43 92.43h80.92v106.599z m146.68-199.029c0 21.59-17.502 39.091-39.092 39.091H677.583c-21.592 0-39.093-17.502-39.093-39.09V581.8c0-21.59 17.502-39.1 39.093-39.1H866.09c21.59 0 39.092 17.51 39.092 39.1v55.162z"
                                    p-id="5472"></path>
                                <path
                                    d="M705.724 582.816c-14.117 0-25.563 11.46-25.563 25.576 0 14.115 11.447 25.55 25.563 25.55 14.102 0 25.56-11.435 25.56-25.55 0-14.116-11.458-25.576-25.56-25.576z"
                                    p-id="5473"></path>
                            </svg> 立即支付
                        </button>
                        <button @click="handleDelete(order.id)" class="glass-btn delete-btn">
                            <svg t="1752587928408" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="4462" width="256" height="256">
                                <path
                                    d="M519.620465 0c-103.924093 0-188.511256 82.467721-192.083349 185.820279H85.015814A48.91386 48.91386 0 0 0 36.101953 234.686512a48.91386 48.91386 0 0 0 48.913861 48.866232h54.010046V831.345116c0 102.852465 69.822512 186.844279 155.909954 186.844279h439.200744c86.087442 0 155.909953-83.491721 155.909954-186.844279V284.100465h48.91386a48.91386 48.91386 0 0 0 48.913861-48.890046 48.91386 48.91386 0 0 0-48.913861-48.866233h-227.756651A191.559442 191.559442 0 0 0 519.620465 0z m-107.234232 177.080558c3.548279-49.771163 46.627721-88.540279 99.851907-88.540279 53.224186 0 96.327442 38.745302 99.351813 88.540279h-199.20372z m-111.997024 752.044651c-30.981953 0-65.083535-39.15014-65.083535-95.041488V287.744h575.488v546.839814c0 55.915163-34.077767 95.041488-65.059721 95.041488H300.389209v-0.500093z"
                                    fill="#D81E06" p-id="4463"></path>
                                <path
                                    d="M368.116093 796.814884c24.361674 0 44.27014-21.670698 44.27014-48.818605v-278.623256c0-27.147907-19.908465-48.818605-44.27014-48.818604-24.33786 0-44.27014 21.670698-44.27014 48.818604v278.623256c0 27.147907 19.360744 48.818605 44.293954 48.818605z m154.933581 0c24.361674 0 44.293953-21.670698 44.293954-48.818605v-278.623256c0-27.147907-19.932279-48.818605-44.293954-48.818604-24.33786 0-44.27014 21.670698-44.270139 48.818604v278.623256c0 27.147907 19.932279 48.818605 44.293953 48.818605z m132.810419 0c24.33786 0 44.27014-21.670698 44.27014-48.818605v-278.623256c0-27.147907-19.932279-48.818605-44.27014-48.818604s-44.27014 21.670698-44.27014 48.818604v278.623256c0 27.147907 19.360744 48.818605 44.27014 48.818605z"
                                    fill="#D81E06" p-id="4464"></path>
                            </svg> 删除
                        </button>
                    </div>
                </div>
            </transition-group>
        </div>

        <!-- 空状态 -->
        <div v-if="orders.length === 0" class="empty-state">
            <div class="empty-icon">
                <i class="icon-box"></i>
            </div>
            <p>暂无订单</p>
            <button class="glass-btn primary" @click="fetchOrders">
                <i class="icon-refresh"></i> 刷新
            </button>
        </div>
    </div>
    <!-- 底部导航 -->
    <div>
        <Footer />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Footer from '@/components/ResponseComponent/NavigationFooter.vue'
import request from '@/utils/request';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const defaultOrderImage = new URL('@/assets/pagebackground/铁板牛肉.jpeg', import.meta.url).href
//跳转支付页面
const router = useRouter();
// 订单状态文本
const statusText = {
    SUCCESS: '已支付',
    pending: '待支付',
    cancelled: '已取消'
}

// 订单数据
const orders = ref([])
// 获取订单列表
const fetchOrders = async () => {
    // 获取完整的用户信息
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (!userInfo || !userInfo.username) {
        ElMessage.error('用户信息获取失败');
        return;
    }
    try {
        const response = await request({
            url: '/api/public/payment',
            method: 'GET',
            params: {
                username: userInfo.username
            },
        });

        if (response.code === '0') {
            orders.value = Array.isArray(response.data.payments) ? response.data.payments : [];
        } else {
            console.error('获取订单列表失败：', response.msg);
        }
    } catch (error) {
        console.error('请求失败：', error);
    }
    console.log('获取订单数据...')
};
const handlePay = (orderId) => {
    const order = orders.value.find((c) => c.id === orderId);
    if (order && order.status !== 'SUCCESS') {
        router.push({
            name: 'payviews',
            query: {
                item: JSON.stringify({
                    id: order.id,
                    name: order.itemName,
                    price: order.amount,
                    status: order.status.toUpperCase()
                }),
                orderId: order.id,
            },
        });
    }
};
// 删除订单
const handleDelete = (orderId) => {
    orders.value = orders.value.filter(o => o.id !== orderId)
    console.log(`删除订单 ${orderId}`)
}

// 初始化
onMounted(() => {
    fetchOrders()
})
</script>

<style scoped>
/* 固定背景层 */
.accountsettings-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
}

.accountsettings-background img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(10px);
}

/* Glassmorphism 基础样式 */
:root {
    --primary-glass: rgba(106, 90, 205, 0.7);
    /* 艺术紫 */
    --secondary-glass: rgba(32, 178, 170, 0.7);
    /* 浅海洋绿 */
    --danger-glass: rgba(255, 99, 71, 0.7);
    /* 番茄红 */
    --white-glass: rgba(255, 255, 255, 0.8);
    --glass-blur: 10px;
    --glass-border: 1px solid rgba(255, 255, 255, 0.2);
    --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

.glassmorphism-container {
    max-width: 100%;
    min-height: 100vh;
    padding: 20px;
    font-family: 'Segoe UI', system-ui, sans-serif;
}

/* 玻璃标题样式 */
.glass-header {
    position: relative;
    margin-bottom: 30px;
    text-align: center;
}

.glass-title {
    font-size: 2.2rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
}

.glass-decoration {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 150px;
    height: 50px;
    background: var(--primary-glass);
    backdrop-filter: blur(var(--glass-blur));
    border-radius: 50%;
    filter: blur(20px);
    opacity: 0.6;
    z-index: 0;
}

/* 订单列表样式 */
.order-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 800px;
    margin: 0 auto;
}

/* 玻璃卡片样式 */
.glass-card {
    display: flex;
    background-color: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(var(--glass-blur));
    border-radius: 15px;
    overflow: hidden;
    box-shadow: var(--glass-shadow);
    border: var(--glass-border);
    transition: all 0.3s ease;
    position: relative;
    margin-bottom: 10px;
    gap: 15px;
}

.glass-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.2);
}

.glass-card.paid {
    border-left: 4px solid var(--secondary-glass);
}

.glass-card.pending {
    border-left: 4px solid var(--primary-glass);
}

.card-image-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    gap: 15px;
}

/* 订单图片区域 */
.order-image-container {
    width: 120px;
    height: 120px;
    position: relative;
    flex-shrink: 0;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    overflow: hidden
}

.order-image {
    width: 100%;
    height: 100%;
    border-radius: 15px;
    object-fit: cover;
}

.rating-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 3px;
}

.rating-badge svg {
    color: #fff700;
    width: 16px;
    height: 16px;
}

/* 订单内容区域 */
.order-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
    padding: 15px;
    border-radius: 15px;
    overflow: hidden;
}

.order-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.order-name {
    margin: 0 0 8px;
    font-size: 1.1rem;
    color: #333;
}

.order-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 0.9rem;
    color: #666;
}

.order-meta i {
    margin-right: 5px;
    color: var(--primary-glass);
}

.order-price {
    font-weight: bold;
    color: #333;
}

.order-status {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    align-self: flex-start;
}

.order-status.paid {
    background: rgba(32, 178, 170, 0.1);
    color: var(--secondary-glass);
}

.order-status.pending {
    background: rgba(106, 90, 205, 0.1);
    color: var(--primary-glass);
}

/* 操作按钮区域 */
.order-actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 15px;
    gap: 10px;
    min-width: 100px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
    border-radius: 15px;

}

.glass-btn {
    border: none;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    backdrop-filter: blur(var(--glass-blur));
}

.glass-btn svg {
    width: 20px;
    height: 20px;

}

.pay-btn {
    background: var(--primary-glass);
    border: 1px solid rgb(195, 195, 195);
    color: rgb(48, 231, 255);
}

.pay-btn:hover {
    background: rgba(106, 90, 205, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(106, 90, 205, 0.3);
}

.delete-btn {
    background: rgba(255, 255, 255, 0.6);
    color: #666;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.delete-btn:hover {
    background: var(--danger-glass);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 99, 71, 0.3);
}

/* 空状态样式 */
.empty-state {
    text-align: center;
    padding: 50px 20px;
    background: var(--white-glass);
    backdrop-filter: blur(var(--glass-blur));
    border-radius: 15px;
    margin-top: 30px;
    border: var(--glass-border);
    box-shadow: var(--glass-shadow);
}

.empty-icon {
    font-size: 3rem;
    color: var(--primary-glass);
    margin-bottom: 20px;
}

.empty-state p {
    color: #666;
    margin-bottom: 20px;
}

.glass-btn.primary {
    background: var(--primary-glass);
    color: white;
    padding: 10px 20px;
}

.glass-btn.primary:hover {
    background: rgba(106, 90, 205, 0.9);
}

/* 列表过渡动画 */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

/* 响应式调整 */
@media (max-width: 768px) {
    .glass-card {
        flex-direction: column;
    }

    .order-actions {
        flex-direction: row;
        padding: 10px 15px;
        justify-content: flex-end;
    }

    .glass-btn {
        padding: 6px 10px;
    }
}

@media (max-width: 480px) {
    .order-meta {
        flex-direction: column;
        gap: 5px;
    }

    .order-actions {
        justify-content: space-between;
    }
}
</style>