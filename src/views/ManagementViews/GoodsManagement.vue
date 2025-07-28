<template>
  <div class="management-page-background">
    <div class="container-008">
      <!-- 操作栏 -->
      <div class="action-bar">
        <div class="search-bar">
          <div class="search-box-008">
            <input type="text" v-model="searchKeyword" placeholder="输入订单ID或商品编号搜索" class="search-input-008" />

          </div>
          <button class="btn search-btn" @click="handleSearch">搜索</button>
          <button class="btn delete-btn" @click="handleReset">批量删除</button>
        </div>

        <button class="btn add-btn" @click="showAddDialog">新增订单</button>
      </div>

      <!-- 数据表格 -->
      <div class="data-table-container">
        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th v-for="col in columns" :key="col.key">{{ col.title }}</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id">
                <td>
                  <input type="checkbox" :checked="order.checked" @change="handleCheck(order)" class="ui-checkbox" />
                </td>
                <td>{{ order.id }}</td>
                <td>
                  <img :src="order.image" alt="商品图片" style="width: 35px; height: 35px;"
                    @click="triggerFileInput(order)">
                </td>
                <td>￥{{ order.price }}</td>
                <td>{{ order.totalAmount }}</td>
                <td>{{ order.status }}</td>
                <td>{{ formatDate(order.orderDate) }}</td>
                <td>{{ formatDate(order.paymentDate) }}</td>
                <td>{{ order.paymentMethod }}</td>
                <td>{{ order.sku }}</td>
                <td>{{ order.description ? order.description.substring(0, 10) : '' }}...</td>
                <td class="table-btn-display">
                  <button class="btn details-btn" @click="showEditDialog(card)">详情</button>
                  <button class="btn edit-btn" @click="showEditDialog(order)">编辑</button>
                  <button class="btn delete-btn" @click="handleDelete(order.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 分页器 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="total" />
      </div>

      <!-- 新增/编辑弹窗 -->
      <div v-if="showDialog" class="dialog-overlay" @click.self="closeDialog">
        <div class="dialog" @click.stop>
          <h2>{{ isEditing ? '编辑订单' : '新增订单' }}</h2>
          <form @submit.prevent="submitForm" class="form-container">
            <div class="form-row">
              <div class="form-group">
                <label>商品图片:</label>
                <input type="file" @change="handleFileUpload" class="file-upload-input" ref="fileInput" />
                <!-- 自定义的按钮 -->
                <button class="file-upload-button" @click="triggerFileInput">
                  选择文件
                </button>
                <div v-if="formData.image" class="image-preview-container">
                  <img :src="formData.image" alt="图片预览" class="image-preview" />
                </div>
              </div>
              <div class="form-group">
                <label>商品价格:</label>
                <input v-model="formData.price" required />
              </div>
              <div class="form-group">
                <label>订单总金额:</label>
                <input v-model="formData.totalAmount" required />
              </div>
              <div class="form-group">
                <label>订单状态:</label>
                <!-- <input v-model="formData.status" required /> -->
                <select v-model="formData.status" required>
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
              <div class="form-group">
                <label>下单时间:</label>
                <span class="auto-time">
                  {{ isEditing ? formatDateTime(formData.orderDate) : '系统自动生成' }}
                </span>
              </div>
              <div class="form-group">
                <label>支付方式:</label>
                <select v-model="formData.paymentMethod" required>
                  <option value="BANK">银行转账</option>
                  <option value="PAYPAL">PayPal</option>
                  <option value="WECHAT">微信支付</option>
                </select>
              </div>
              <div class="form-group">
                <label>商品编号:</label>
                <input v-model="formData.sku" required />
              </div>
            </div>
            <div class="dialog-buttons">
              <button type="button" class="btn cancel-btn" @click="closeDialog">取消</button>
              <button type="submit" class="btn confirm-btn">{{ isEditing ? '保存' : '创建' }}</button>
            </div>
          </form>
        </div>
      </div>

      <!-- 删除提示框 -->
      <div v-if="isDeletePromptVisible" class="delete-prompt-overlay">
        <div class="delete-prompt">
          <div class="delete-prompt-title">提示</div>
          <div class="delete-prompt-content">确定要删除吗？</div>
          <div class="delete-prompt-btn">
            <button class="delete-prompt-btn-cancel" @click="closeDeletePrompt">取消</button>
            <button class="delete-prompt-btn-confirm" @click="confirmDelete">确定</button>
          </div>
        </div>
      </div>

      <!-- 提示消息 -->
      <div v-if="showToast" class="custom-toast" :class="toastType">
        <span class="toast-icon">{{ toastType === 'success' ? '✓' : '✕' }}</span>
        {{ toastMessage }}
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import request from '@/utils/request';

// 数据定义
const columns = [
  { key: 'checked', title: '多选' },
  { key: 'id', title: '订单ID' },
  { key: 'image', title: '商品图片' },
  { key: 'price', title: '商品价格' },
  { key: 'totalAmount', title: '订单总金额' },
  { key: 'status', title: '订单状态' },
  { key: 'orderDate', title: '下单时间' },
  { key: 'paymentDate', title: '支付时间' },
  { key: 'paymentMethod', title: '支付方式' },
  { key: 'sku', title: '商品编号' },
  { key: 'description', title: '描述' },
];

const orders = ref([]);
const searchKeyword = ref('');
const showDialog = ref(false);
const isEditing = ref(false);
const formData = ref({
  id: null,
  image: '',
  price: '',
  totalAmount: '',
  status: '',
  orderDate: '',
  paymentDate: '',
  paymentMethod: '',
  sku: '',
});

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 提示消息
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

// 删除确认
const isDeletePromptVisible = ref(false);
const deleteOrderId = ref(null);

//方法定义
const formatDate = (date) => {
  if (!date) return '未记录';
  return new Date(date).toLocaleString('zh-CN');
};

const closeDialog = () => {
  showDialog.value = false;
};

const closeDeletePrompt = () => {
  isDeletePromptVisible.value = false;
};

const formatDateTime = (dateString) => {
  if (!dateString) return '未记录';
  return new Date(dateString).toLocaleString('zh-CN');
};

const fetchOrders = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
    };
    const response = await request.get('/api/public/order', { params });
    orders.value = response.data.list;
    total.value = response.data.total;
  } catch (error) {
    showToastMessage('获取订单失败', 'error');
  }
};

const showAddDialog = () => {
  isEditing.value = false;
  formData.value = {
    id: null,
    image: '',
    price: '',
    totalAmount: '',
    status: '',
    orderDate: '',
    paymentDate: '',
    paymentMethod: '',
    sku: '',
  };
  showDialog.value = true;
};

const showEditDialog = (order) => {
  isEditing.value = true;
  formData.value = { ...order };
  showDialog.value = true;
};

const submitForm = async () => {
  try {
    const payload = {
      ...formData.value,
      orderDate: isEditing.value ? formData.value.orderDate : new Date().toISOString(),
    };

    if (isEditing.value) {
      await request.put(`/api/public/order/${formData.value.id}`, payload);
      showToastMessage('更新成功');
    } else {
      await request.post('/api/public/order', payload);
      showToastMessage('创建成功');
    }
    fetchOrders();
    closeDialog();
  } catch (error) {
    showToastMessage(isEditing.value ? '更新失败' : '创建失败', 'error');
  }
};

const handleDelete = (id) => {
  deleteOrderId.value = id;
  isDeletePromptVisible.value = true;
};

const confirmDelete = async () => {
  try {
    await request.delete(`/api/public/order/${deleteOrderId.value}`);
    showToastMessage('删除成功');
    fetchOrders();
  } catch (error) {
    showToastMessage('删除失败', 'error');
  } finally {
    closeDeletePrompt();
  }
};

const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
};

// 初始化
onMounted(fetchOrders);

const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchOrders();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchOrders();
};

const handleSearch = fetchOrders;

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      formData.value.image = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};
// 定义一个 ref 来引用文件输入框
const fileInput = ref(null);

// 触发文件输入框的点击事件
const triggerFileInput = () => {
  fileInput.value.click(); // 触发点击事件
};
const filteredOrders = computed(() => {
  const keyword = searchKeyword.value.toLowerCase();
  return keyword
    ? orders.value.filter(
      (order) =>
        String(order.id).includes(keyword) || order.sku.toLowerCase().includes(keyword)
    )
    : orders.value;
});
</script>

<style scoped>
@import '@/css/Management/BackgroundManagement.css';
</style>