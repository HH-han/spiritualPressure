<template>
  <div class="MyOrderBackground">
    <div class="MyOrder">
      <div class="MyOrderCard">
        <div class="order-system">
          <!-- 搜索框 -->
          <div class="search-bar">
            <input v-model="searchQuery" type="text" placeholder="🔍搜索订单..." class="search-input"
              @input="handleSearch" />
            <button class="search-button">
              <i class="search-icon"></i>
            </button>
          </div>

          <!-- 状态筛选 -->
          <div class="filter-tabs">
            <button v-for="tab in tabs" :key="tab.id" :class="['tab', { active: activeTab === tab.id }]"
              @click="changeTab(tab.id)">
              {{ tab.label }}
            </button>
          </div>

          <!-- 加载状态 -->
          <div v-if="isLoading" class="loading-wrapper">
            <div class="spinner"></div>
            <p>加载订单中...</p>
          </div>
          <!-- 空状态 -->
          <div v-if="showEmptyState" key="empty" class="empty-state">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iI0VFRUVFRSIvPjxwYXRoIGQ9Ik00Mi4xMzMgMjcuMDY3TDMyLjA2NiAzNy4xMzNMMjEuOTk5IDI3LjA2NyIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0zMiA0MHYtNi42NjciIHN0cm9rZT0iIzk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4="
              class="empty-icon" />
            <p class="empty-text">没有找到相关订单</p>
          </div>
          <!-- 订单列表 -->
          <div v-else class="order-list">
            <transition-group name="fade">
              <!-- 订单卡片 -->
              <div v-for="order in displayedOrders" :key="order.id" class="order-card" @click="openDetail(order)">
                <div class="card-header">
                  <h3 class="order-title">{{ order.itemName }}*{{ order.quantity }}</h3>
                  <span :class="['status-tag', order.status.toLowerCase()]">
                    {{ statusLabels[order.status] }}
                  </span>
                </div>

                <div class="card-body">
                  <p class="order-amount">¥{{ order.amount.toFixed(2) }}</p>
                  <p class="order-time">{{ formatTime(order.createdAt) }}</p>
                </div>

                <div class="card-footer">
                  <button v-if="order.status === 'PENDING'" class="action-button pay" @click="handlePayment(order.id)">
                    立即支付
                  </button>
                  <button v-else-if="order.status === 'SUCCESS'" class="action-button completed">
                    支付成功
                  </button>
                  <button v-else-if="order.status === 'COMPLETED'" class="action-button to-use">
                    待使用
                  </button>
                </div>
              </div>
            </transition-group>

            <!-- 分页加载 -->
            <div v-if="showPagination" class="pagination">
              <button :class="['load-more', { loading: isPaginationLoading }]" @click="loadMore"
                :disabled="isPaginationLoading">
                {{ isPaginationLoading ? '正在加载...' : '加载更多' }}
              </button>
            </div>
          </div>

          <!-- 订单详情弹窗 -->
          <teleport to="body">
            <transition name="modal">
              <div v-if="showDetailModal" class="modal-mask">
                <div class="modal-container">
                  <div class="modal-header">
                    <h2>订单详情</h2>
                    <button class="close-button" @click="closeDetail">×</button>
                  </div>

                  <div v-if="selectedOrder" class="modal-content">
                    <div class="detail-row">
                      <span class="detail-label">订单编号：</span>
                      <span class="detail-value">{{ selectedOrder.orderId }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">商品名称：</span>
                      <span class="detail-value">{{ selectedOrder.itemName }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">用户名称：</span>
                      <span class="detail-value">{{ selectedOrder.username }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">订单金额：</span>
                      <span class="detail-value">¥{{ selectedOrder.amount.toFixed(2) }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">创建时间：</span>
                      <span class="detail-value">{{ formatTime(selectedOrder.createdAt) }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">支付状态：</span>
                      <span :class="['status-tag', selectedOrder.status.toLowerCase()]">
                        {{ statusLabels[selectedOrder.status] }}
                      </span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">支付方式：</span>
                      <span class="detail-value">
                        {{ { WECHAT: '微信支付', ALIPAY: '支付宝' }[selectedOrder.paymentMethod] || '未支付' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </teleport>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import request from '@/utils/request';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

//跳转支付页面
const router = useRouter();
const handlePayment = (ordersId) => {
  const orders = displayedOrders.value.find((c) => c.id === ordersId);
  if (orders) {
    router.push({
      name: 'payviews',
      query: {
        item: JSON.stringify({
          id: orders.id,
          name: orders.itemName,
          price: orders.amount,
          status: orders.status.toUpperCase()
        }),
        orderId: orders.orderId,
      },
    });
  }
};
// 响应式状态
const activeTab = ref('all');
const searchQuery = ref('');
const isLoading = ref(true);
const isPaginationLoading = ref(false);
const currentPage = ref(1);
const pageSize = 10;
const totalOrders = ref(0);
const showDetailModal = ref(false);
const selectedOrder = ref(null);
const orders = ref([]);

// 配置项
const tabs = [
  { id: 'all', label: '全部订单' },
  { id: 'PENDING', label: '待支付' },
  { id: 'SUCCESS', label: '支付成功' },
];
const statusLabels = {
  PENDING: '待支付',
  SUCCESS: '支付成功',
};

// 计算属性
const filteredOrders = computed(() => {
  if (!Array.isArray(orders.value)) {
    console.error('orders.value 不是数组:', orders.value);
    return [];
  }

  return orders.value.filter((order) => {
    const matchesStatus = activeTab.value === 'all' || order.status === activeTab.value;
    const matchesSearch = order.itemName.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesStatus && matchesSearch;
  });
});

const displayedOrders = computed(() => {
  return filteredOrders.value.slice(0, currentPage.value * pageSize);
});

const showEmptyState = computed(() => {
  return !isLoading.value && filteredOrders.value.length === 0;
});

const showPagination = computed(() => {
  return !showEmptyState.value && filteredOrders.value.length > displayedOrders.value.length;
});

// 方法
const changeTab = (tab) => {
  activeTab.value = tab;
  resetPagination();
  fetchOrders();
};

const handleSearch = () => {
  resetPagination();
  fetchOrders();
};

const resetPagination = () => {
  currentPage.value = 1;
};

const formatTime = (isoString) => {
  if (!isoString) return '未知时间';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    console.error('无效的时间格式:', isoString);
    return '无效时间';
  }
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const openDetail = (order) => {
  selectedOrder.value = order;
  showDetailModal.value = true;
};

const closeDetail = () => {
  showDetailModal.value = false;
  selectedOrder.value = null;
};
const loadMore = async () => {
  isPaginationLoading.value = true;
  currentPage.value++;
  await fetchOrders();
  isPaginationLoading.value = false;
};

// 获取订单列表
const fetchOrders = async () => {
  // 获取完整的用户信息
  const userInfo = JSON.parse(localStorage.getItem('user'));
  if (!userInfo || !userInfo.username) {
    ElMessage.warning('登录获取用户订单');
    return;
  }
  try {
    isLoading.value = true;
    const response = await request({
      url: '/api/public/payment',
      method: 'GET',
      params: {
        status: activeTab.value === 'all' ? null : activeTab.value,
        search: searchQuery.value,
        page: currentPage.value,
        size: pageSize,
        username: userInfo.username,
      },
    });

    if (response.code === '0') {
      orders.value = Array.isArray(response.data.payments) ? response.data.payments : [];
      totalOrders.value = response.data.total || 0;
    } else {
      console.error('获取订单列表失败：', response.msg);
    }
  } catch (error) {
    console.error('请求失败：', error);
  } finally {
    isLoading.value = false;
  }
};

// 初始化加载
onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.MyOrderBackground {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.MyOrder {
  width: 100%;
}

.order-system {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(197, 197, 197, 0.2) 100%);
  backdrop-filter: blur(15px);
  padding: 20px;
  border-radius: 15px;
  min-height: 450px;
  max-width: 1200px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-system:hover {
  transform: translateY(-5px);
}

/* 搜索栏 */
.search-bar {
  position: relative;
}

.search-input {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  transition: all 0.3s ease;
  border: 2px solid #ccc;
}

.search-input:hover {
  border-color: #646cff;
  box-shadow: 0 0 8px rgba(57, 66, 246, 0.649);
}

.search-button {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

/* 筛选标签 */
.filter-tabs {
  display: flex;
  gap: 10px;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
}

.tab {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: #f5f5f5;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab.active {
  background: #646cff;
  color: white;
  box-shadow: 0 4px 12px rgba(100, 108, 255, 0.3);
}

/* 订单卡片 */
.order-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
  border-left: 4px solid #b25ad8;
  cursor: pointer;
}

.order-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.order-title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.status-tag.pending {
  background: #ffecb3;
  color: #ff9f00;
}

.status-tag.completed {
  background: #c8e6c9;
  color: #2e7d32;
}

.status-tag.success {
  background: #bbdefb;
  color: #1565c0;
}

.card-body {
  margin-bottom: 1rem;
}

.order-amount {
  font-size: 24px;
  font-weight: bold;
  color: #2e7d32;
  margin: 0 0 8px;
}

.order-time {
  color: #757575;
  font-size: 14px;
  margin: 0;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.action-button {
  padding: 8px 20px;
  border: none;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button.completed {
  background: linear-gradient(135deg, #2098ee, #434cff);
  color: white;
}

.action-button.pay {
  background: linear-gradient(135deg, #ff6b6b, #ff9f43);
  color: white;
}

.action-button.to-use {
  background: linear-gradient(135deg, #4caf50, #8bc34a);
  color: white;
}

/* 加载状态 */
.loading-wrapper {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #646cff;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 0;
}

.empty-icon {
  width: 100px;
  height: 100px;
  opacity: 0.6;
  margin-bottom: 1rem;
}

.empty-text {
  color: #9e9e9e;
  margin: 0;
}

/* 分页 */
.pagination {
  text-align: center;
  margin: 2rem 0;
}

.load-more {
  padding: 12px 30px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.load-more:hover:not(:disabled) {
  background: #646cff;
  color: white;
  border-color: #646cff;
}

.load-more.loading {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 弹窗 */
.modal-mask {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  padding: 24px;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
}

.close-button {
  font-size: 28px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 8px;
  color: #666;
}

.close-button:hover {
  color: #333;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
}

.detail-label {
  color: #757575;
}

.detail-value {
  color: #333;
  font-weight: 500;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .MyOrder {
    margin-left: 0px;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .order-list {
    grid-template-columns: repeat(1, 1fr);
  }

  .MyOrderCard {
    margin-left: 0px;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 100px;
  }

  .order-container-order {
    width: 90%;
  }

  .order-card-order {
    width: 90%;
  }
}
</style>