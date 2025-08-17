<template>
  <div class="management-page-background">
    <div class="container-management">
      <!-- 操作栏 -->
      <div class="action-bar">
        <div class="search-bar">
          <div class="search-box-management">
            <input type="text" v-model="searchKeyword" placeholder="输入订单ID或商品编号搜索" class="search-input-management" />

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
                <div class="image-upload-container">
                  <div class="upload-header">
                    <h3>上传图片</h3>
                    <p>支持 JPG, PNG 格式，最大 5MB</p>
                  </div>

                  <div class="upload-area" @click="triggerFileInput" @dragover.prevent="dragOver = true"
                    @dragleave="dragOver = false" @drop.prevent="handleDrop" :class="{ 'drag-active': dragOver }">
                    <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" class="file-input" />

                    <div class="upload-content">
                      <div class="upload-icon">
                        <svg viewBox="0 0 24 24">
                          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                        </svg>
                      </div>
                      <p class="upload-text">点击或拖拽文件到此处</p>
                      <p class="upload-hint">推荐尺寸：1200×800px</p>
                    </div>
                  </div>

                  <!-- 图片预览区域 -->
                  <div class="preview-container" v-if="previewImage">
                    <div class="preview-card">
                      <img :src="previewImage" alt="预览图片" class="preview-image" />
                      <div class="preview-actions">
                        <button class="action-btn-image edit-btn-image" @click="triggerFileInput">
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                          </svg>
                        </button>
                        <button class="action-btn-image delete-btn-image" @click="removeImage">
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                          </svg>
                        </button>
                      </div>
                      <div class="preview-footer">
                        <div class="file-info">
                          <span class="file-name">{{ fileName }}</span>
                          <span class="file-size">{{ fileSize }}</span>
                        </div>
                        <div class="upload-progress" v-if="uploading">
                          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
                        </div>
                      </div>
                    </div>
                  </div>
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

// 图片上传相关状态
const dragOver = ref(false);
const previewImage = ref('');
const fileName = ref('');
const fileSize = ref('');
const uploading = ref(false);
const progress = ref(0);

// 处理文件上传
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 验证文件类型
  const validTypes = ['image/jpeg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    showToastMessage('仅支持JPG/PNG格式图片', 'error');
    return;
  }

  // 验证文件大小 (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    showToastMessage('图片大小不能超过5MB', 'error');
    return;
  }

  // 显示预览
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
    fileName.value = file.name;
    fileSize.value = formatFileSize(file.size);
    formData.value.image = e.target.result;
  };
  reader.readAsDataURL(file);

  // 模拟上传进度
  uploading.value = true;
  progress.value = 0;
  const interval = setInterval(() => {
    progress.value += 10;
    if (progress.value >= 100) {
      clearInterval(interval);
      uploading.value = false;
      showToastMessage('图片上传成功');
    }
  }, 200);
};

// 处理拖放上传
const handleDrop = (event) => {
  dragOver.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    const inputEvent = { target: { files: [file] } };
    handleFileUpload(inputEvent);
  }
};

// 移除图片
const removeImage = () => {
  previewImage.value = '';
  fileName.value = '';
  fileSize.value = '';
  formData.value.image = '';
};

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 触发文件输入框
const triggerFileInput = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.onchange = (event) => handleFileUpload(event);
  fileInput.click();
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