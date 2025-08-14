<template>
  <div class="delete-MyOrderBackground">
    <div class="delete-MyOrder">
      <div class="delete-MyOrderCard">
        <div class="delete-order-system">
          <!-- 搜索框 -->
          <div class="delete-search-bar">
            <input v-model="searchQuery" type="text" placeholder="🔍搜索订单..." class="delete-search-input"
              @input="handleSearch" />
            <button class="delete-search-button">
              <i class="delete-search-icon"></i>
            </button>
          </div>

          <!-- 订单列表 -->
          <div class="delete-order-list">
            <transition-group name="delete-fade">
              <!-- 订单卡片 -->
              <div v-for="order in orders" :key="order.id" class="delete-order-card">
                <div class="delete-card-header">
                  <h3 class="delete-order-title">{{ order.itemName }}*{{ order.quantity }}</h3>
                  <span :class="['delete-status-tag', order.status.toLowerCase()]">
                    {{ statusLabels[order.status] }}
                  </span>
                </div>

                <div class="delete-card-body">
                  <p class="delete-order-amount">¥{{ order.amount.toFixed(2) }}</p>
                  <p class="delete-order-time">{{ formatTime(order.createdAt) }}</p>
                </div>

                <div class="delete-card-footer">
                  <!-- 删除按钮 -->
                  <button class="delete-action-button delete-delete" @click="deleteshows(order.id)">
                    删除订单
                  </button>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <teleport to="body">
      <transition name="delete-modal">
        <div v-if="showDeleteModal" class="delete-modal-mask">
            <DeletePrompt @confirmDelete="confirmDelete" @closeDeleteModal="closeDeleteModal" />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import request from '@/utils/request';
import { ElMessage } from "element-plus";
import DeletePrompt from '@/components/PromptComponent/DeletePrompt.vue'

// 响应式状态
const searchQuery = ref('');
const orders = ref([]);
const showDeleteModal = ref(false);
const selectedOrderId = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const isLoading = ref(false);
const scrollContainer = ref(null);
// 配置项
const statusLabels = {
  PENDING: '待支付',
  SUCCESS: '支付成功',
};

// 方法
const handleSearch = () => {
  fetchOrders();
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

const handlePayment = (orderId) => {
  // 跳转支付页面逻辑（根据实际需求实现）
  console.log('支付订单:', orderId);
};

// 显示删除确认框
const deleteshows = (orderId) => {
  selectedOrderId.value = orderId;
  showDeleteModal.value = true;
};

// 删除订单
const confirmDelete = async () => {
  try {
    const response = await request({
      url: `/api/public/payment/${selectedOrderId.value}`,
      method: 'DELETE',
    });

    if (response.code === '0') {
      // 删除成功，更新订单列表
      orders.value = orders.value.filter(order => order.id !== selectedOrderId.value);
      showDeleteModal.value = false;
      ElMessage.success("订单删除成功");
    } else {
      console.error('删除订单失败：', response.msg);
      ElMessage.error("订单删除失败");
    }
  } catch (error) {
    console.error('请求失败：', error);
    ElMessage.error("订单删除失败");
  }
};

// 关闭删除确认框
const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

// 获取订单列表
const fetchOrders = async () => {
  if (isLoading.value || currentPage.value > totalPages.value) return;
  
  isLoading.value = true;
  
  // 获取完整的用户信息
  const userInfo = JSON.parse(localStorage.getItem('user'));
  if (!userInfo || !userInfo.username) {
    ElMessage.error('用户信息获取失败');
    isLoading.value = false;
    return;
  }
  
  try {
    const response = await request({
      url: '/api/public/payment',
      method: 'GET',
      params: {
        search: searchQuery.value,
        username: userInfo.username,
        page: currentPage.value,
        pageSize: 10
      },
    });

    if (response.code === '0') {
      const newOrders = Array.isArray(response.data.payments) ? response.data.payments : [];
      if (currentPage.value === 1) {
        orders.value = newOrders;
      } else {
        orders.value = [...orders.value, ...newOrders];
      }
      totalPages.value = response.data.totalPages || 1;
      currentPage.value += 1;
    } else {
      console.error('获取订单列表失败：', response.msg);
    }
  } catch (error) {
    console.error('请求失败：', error);
  } finally {
    isLoading.value = false;
  }
};

const handleScroll = () => {
  if (!scrollContainer.value) return;
  
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;
  const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
  
  if (isNearBottom && !isLoading.value) {
    fetchOrders();
  }
};

// 初始化加载
onMounted(() => {
  scrollContainer.value = document.querySelector('.delete-order-list');
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll);
  }
  fetchOrders();
});

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll);
  }
});
</script>
<style setup>
@import '@/css/Globalstyle/Globalstyle.css';
/* Main Background */
.delete-MyOrderBackground {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Main Container */
.delete-MyOrder {
  margin: 0 auto;
}

/* Card Container */
.delete-MyOrderCard {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(197, 197, 197, 0.2) 100%);
  backdrop-filter: blur(15px);
  min-width: 1000px;
  min-height: 450px;
  max-width: 1200px;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 2rem;
}

/* Search Bar */
.delete-search-bar {
  display: flex;
  margin-bottom: 2rem;
  position: relative;
}

.delete-search-input {
  padding: 10px 20px;
  border: 2px solid #e0e6ed;
  border-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.delete-search-input:focus {
  outline: none;
  border-color: #5a67d8;
  box-shadow: 0 4px 15px rgba(90, 103, 216, 0.2);
}

.delete-search-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

/* Order List */
.delete-order-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-height: 50vh;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-right: 10px;
}
.delete-order-list::-webkit-scrollbar {
  display: none;
}

/* Order Card */
.delete-order-card {
  width: 350px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: all 0.3s ease;
  border-left: 4px solid #5a67d8;
}

.delete-order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.delete-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.delete-order-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.delete-status-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.delete-status-tag.pending {
  background-color: #fffaf0;
  color: #dd6b20;
}

.delete-status-tag.success {
  background-color: #f0fff4;
  color: #38a169;
}

.delete-status-tag.completed {
  background-color: #ebf8ff;
  color: #3182ce;
}

.delete-card-body {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.delete-order-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4a5568;
  margin: 0;
}

.delete-order-time {
  font-size: 0.9rem;
  color: #718096;
  margin: 0;
  align-self: flex-end;
}

.delete-card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.delete-action-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.delete-action-button.pay {
  background-color: #5a67d8;
  color: white;
}

.delete-action-button.pay:hover {
  background-color: #4c51bf;
}

.delete-action-button.completed {
  background-color: #48bb78;
  color: white;
  cursor: default;
}

.delete-action-button.success-completed {
  background-color: #4299e1;
  color: white;
  cursor: default;
}

.delete-action-button.delete-delete {
  background-color: transparent;
  color: #e53e3e;
  border: 1px solid #e53e3e;
}

.delete-action-button.delete-delete:hover {
  background-color: #e53e3e;
  color: white;
}
</style>