<template>
  <div class="container-shop-cart">
    <!-- Custom Alert Dialog -->
    <div v-if="showCustomAlert" class="custom-alert-mask">
      <div class="custom-alert-shop">
        <div class="alert-content">{{ alertMessage }}</div>
        <div class="alert-buttons">
          <button @click="handleAlertConfirm">确定</button>
        </div>
      </div>
    </div>

    <div class="heading-shop-cart">
      <h1>我的购物车</h1>
      
      <!-- Selection Actions Bar -->
      <div v-if="cartItems.length" class="selection-actions">
        <button @click="toggleSelectAll" class="select-all-btn">
          {{ isAllSelected ? '取消全选' : '全选' }}
        </button>
        <span class="selected-count" v-if="selectedItems.length > 0">
          已选 {{ selectedItems.length }} 件商品
        </span>
      </div>
      
      <!-- Cart Items List -->
      <div v-if="cartItems.length" class="cart-items-container">
        <div 
          v-for="(item, index) in cartItems" 
          :key="index" 
          class="cart-item-card"
          :class="{ 'selected': selectedItems.includes(index) }"
          @click="toggleSelect(index)"
        >
          <!-- Item Info -->
          <div class="item-info">
            <h2>{{ item.name }}</h2>
            <!-- Selection Checkbox -->
            <div class="item-details">
              <div class="selection-checkbox" @click.stop="toggleSelect(index)">
                <div class="checkbox-icon" :class="{ 'checked': selectedItems.includes(index) }">
                  <svg v-if="selectedItems.includes(index)" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              </div>
              <div class="item-price">
                <p>价格: ¥{{ Number(item.price).toFixed(2) }}</p>
              </div>
              <div class="item-controls">
                <!-- <input 
                  type="number" 
                  v-model.number="item.quantity" 
                  min="1" 
                  @change="updateQuantity(index)"
                  class="quantity-input"
                  @click.stop
                > -->
                <button @click.stop="showDeleteConfirm(index)" class="delete-btn">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty Cart State -->
      <div v-else class="empty-cart">
        <p>🎒 购物车空空如也，快去逛逛吧~</p>
      </div>
      
      <!-- Cart Actions -->
      <div class="cart-actions">
        <button 
          v-if="selectedItems.length > 0"
          @click="confirmSelectedItems"
          :class="{ 'loading': isSubmitting }"
          class="confirm-btn"
        >
          {{ isSubmitting ? '提交中...' : `选中商品加入购物车 (${selectedTotalPrice})` }}
        </button>
        <button 
          v-if="cartItems.length > 0"
          @click="confirmAllItems"
          :class="{ 'loading': isSubmitting }"
          class="confirm-btn"
        >
          {{ isSubmitting ? '提交中...' : `全部加入购物车 (${totalPrice})` }}
        </button>
        <button class="confirm-btn back-btn" @click="goBack">返回</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import request from '@/utils/request';
import { ElMessage} from 'element-plus';

const route = useRoute();
const router = useRouter();

// Reactive state
const cartItems = ref([]);
const selectedItems = ref([]);
const isSubmitting = ref(false);
const showCustomAlert = ref(false);
const alertMessage = ref('');
let pendingDeleteIndex = null;

// Computed properties
const isAllSelected = computed(() => {
  return selectedItems.value.length === cartItems.value.length && cartItems.value.length > 0;
});

const selectedTotalPrice = computed(() => {
  return selectedItems.value.reduce((total, index) => {
    const item = cartItems.value[index];
    return total + (Number(item.price));
  }, 0).toFixed(2);
});

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (Number(item.price));
  }, 0).toFixed(2);
});

// Methods
const goBack = () => {
  router.back(); 
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedItems.value = [];
  } else {
    selectedItems.value = cartItems.value.map((_, index) => index);
  }
};

const addToCart = (item) => {
  const existingItem = cartItems.value.find(i => i.id === item.id);
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 0) + 1;
  } else {
    cartItems.value.push({
      ...item,
      price: Number(Number(item.price).toFixed(2)),
      quantity: item.quantity || 1
    });
  }
  saveCartItems();
};

// const updateQuantity = (index) => {
//   if (cartItems.value[index].quantity < 1) {
//     cartItems.value[index].quantity = 1;
//   }
//   saveCartItems();
// };

const showDeleteConfirm = (index) => {
  pendingDeleteIndex = index;
  showAlert('确定要删除这个商品吗？');
};

const handleAlertConfirm = () => {
  if (pendingDeleteIndex !== null) {
    // Remove from selected items
    selectedItems.value = selectedItems.value.filter(i => i !== pendingDeleteIndex);
    // Adjust other selected indices
    selectedItems.value = selectedItems.value.map(i => i > pendingDeleteIndex ? i - 1 : i);
    
    cartItems.value.splice(pendingDeleteIndex, 1);
    saveCartItems();
    pendingDeleteIndex = null;
  }
  showCustomAlert.value = false;
};

const saveCartItems = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
};

const loadCartItems = () => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      cartItems.value = JSON.parse(savedCart).map(item => ({
        ...item,
        price: Number(Number(item.price).toFixed(2)),
        quantity: item.quantity || 1
      }));
    } catch (error) {
      showAlert('购物车数据加载失败');
    }
  }
};

const toggleSelect = (index) => {
  const selectedIndex = selectedItems.value.indexOf(index);
  if (selectedIndex > -1) {
    selectedItems.value.splice(selectedIndex, 1);
  } else {
    selectedItems.value.push(index);
  }
};

const confirmSelectedItems = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    showAlert('请先登录');
    ElMessage.error('请先登录');
    return router.push('/login');
  }
  if (selectedItems.value.length === 0) {
    return showAlert('请先选择要购买的商品');
  }
  await submitOrder(selectedItems.value.map(index => cartItems.value[index]));
};

const confirmAllItems = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    showAlert('请先登录');
    ElMessage.error('请先登录');
    return router.push('/login');
  }
  if (cartItems.value.length === 0) {
    return showAlert('购物车中没有商品');
  }
  await submitOrder([...cartItems.value]);
};

const submitOrder = async (items) => {
  isSubmitting.value = true;
  try {
    // 生成唯一的orderId（可以使用时间戳+随机数）
    const orderId = Date.now() + Math.floor(Math.random() * 1000);
    // 获取完整的用户信息
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (!userInfo || !userInfo.username) {
      ElMessage.error('用户信息获取失败');
      return;
    }
    // 构造符合要求的请求数据（单个DTO对象）
    const payload = {
      orderId: orderId,
      itemId: items[0].id,
      itemName: items[0].name,
      amount: items[0].price,
      quantity: items[0].quantity,
      username: userInfo.username,
    };

    // 发送POST请求
    const response = await request.post('/api/public/payment/cart', payload);

    // 根据后端响应处理
    if (response.code === "0") {  // 注意这里是字符串"0"
      // 使用后端返回的消息或默认消息
      const successMessage = response.data || '商品已成功加入购物车';
      
      // 提交成功后清空购物车逻辑
      if (selectedItems.value.length > 0) {
        selectedItems.value.sort((a, b) => b - a);
        selectedItems.value.forEach(index => {
          cartItems.value.splice(index, 1);
        });
        selectedItems.value = [];
      } else {
        cartItems.value = [];
      }
      saveCartItems();
      
      showAlert(successMessage);  // 显示后端返回的成功消息
      setTimeout(() => router.back(), 1500);  // 返回上一页
    } else {
      // 使用后端返回的错误消息或默认消息
      const errorMessage = response.msg || '订单提交失败';
      showAlert(errorMessage);
    }
  } catch (error) {
    console.error('请求失败:', error);
    showAlert('网络异常，请稍后重试');
  } finally {
    isSubmitting.value = false;
  }
};

const showAlert = (message) => {
  alertMessage.value = message;
  showCustomAlert.value = true;
};

// Lifecycle hooks
onMounted(() => {
  loadCartItems();
  if (route.query.item) {
    try {
      const newItem = JSON.parse(route.query.item);
      addToCart(newItem);
    } catch (error) {
      showAlert('商品数据格式错误');
    }
  }
});
</script>

<style scoped>
.container-shop-cart {
  min-width: 450px;
  background: linear-gradient(0deg, #ffffff 0%, #f4f7fb 100%);
  border-radius: 40px;
  padding: 25px 35px;
  border: 5px solid #ffffff;
  box-shadow: 0 30px 30px -20px rgba(133, 189, 215, 0.88);
  margin: 20px;
}

.heading-shop-cart {
  text-align: center;
}
.heading-shop-cart h1 {
  font-size: 30px;
  color: #1089d3;
  margin-bottom: 25px;
}

/* Selection Actions */
.selection-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 0 10px;
}

.select-all-btn {
  background: transparent;
  border: none;
  color: #1089d3;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 4px;
}

.select-all-btn:hover {
  background: #f0f7ff;
}

.selected-count {
  color: #666;
  font-size: 14px;
}

/* Cart Items */
.cart-items-container {
  margin-bottom: 30px;
}

.cart-item-card {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin: 15px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
}

.cart-item-card.selected {
  border: 2px solid #1089d3;
  background-color: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 137, 211, 0.2);
}

.selection-checkbox {
  width: 24px;
  height: 24px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.checkbox-icon {
  width: 20px;
  height: 20px;
  border: 2px solid #1089d3;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.checkbox-icon.checked {
  background-color: #1089d3;
}

.checkbox-icon svg {
  width: 16px;
  height: 16px;
  fill: white;
}

.item-info {
  flex: 1;
}

.item-info h2 {
  margin-top: 0;
  color: #333;
}

.item-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.item-price p{
  font-weight: bold;
  color: #ff4d4f;
  margin-bottom: 0;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-input {
  width: 60px;
  padding: 8px;
  border: 2px solid #1089d3;
  border-radius: 8px;
  text-align: center;
}

.delete-btn {
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.delete-btn:hover {
  background: #ff7875;
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 40px 0;
  color: #666;
  font-size: 16px;
}

.empty-cart p {
  margin: 15px 0;
}

/* Cart Actions */
.cart-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
  flex-wrap: wrap;
}

.confirm-btn {
  background: #1089d3;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 15px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
}

.confirm-btn.loading {
  background: #bae7ff;
  cursor: not-allowed;
}

.confirm-btn:hover:not(.loading) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(16, 137, 211, 0.4);
}

.back-btn {
  background: #909399;
}

.back-btn:hover {
  background: #a6a9ad;
}

/* Custom Alert */
.custom-alert-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-alert-shop {
  background: white;
  border-radius: 20px;
  padding: 25px;
  width: 300px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.alert-content {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

.alert-buttons button {
  background: #1089d3;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.alert-buttons button:hover {
  background: #0d6ca8;
}
</style>