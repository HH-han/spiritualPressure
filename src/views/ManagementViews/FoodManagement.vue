<template>
  <div class="management-page-background">
    <div class="container-management">
      <!-- 操作栏 -->
      <div class="action-bar">
        <div class="search-bar">
          <div class="search-box-management">
            <input type="text" v-model="searchKeyword" placeholder="输入美食名称或描述搜索" class="search-input-management" />

          </div>
          <button class="btn search-btn" @click="handleSearch">搜索</button>
          <button class="btn delete-btn" @click="handleReset">批量删除</button>
        </div>

        <button class="btn add-btn" @click="showAddDialog">新增美食</button>
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
              <tr v-for="food in paginatedFoods" :key="food.id">
                <td>
                  <input type="checkbox" :checked="food.checked" @change="handleCheck(food)" class="ui-checkbox" />
                </td>
                <td>{{ food.id }}</td>
                <td>{{ food.name }}</td>
                <td>
                  <img :src="food.image" alt="美食图片" style="width: 35px; height: 35px;"
                    @click="triggerFileInput(food)" />
                </td>
                <td>{{ food.description }}</td>
                <td>{{ food.category }}</td>
                <td>{{ food.status }}</td>
                <td>{{ food.location }}</td>
                <td>￥{{ food.price }}</td>
                <td>{{ food.sales }}</td>
                <td>{{ food.rating }}</td>
                <td>{{ formatDate(food.createdAt) }}</td>
                <td>{{ formatDate(food.updatedAt) }}</td>
                <td class="table-btn-display">
                  <button class="btn details-btn" @click="showEditDialog(card)">详情</button>
                  <button class="btn edit-btn" @click="showEditDialog(food)">编辑</button>
                  <button class="btn delete-btn" @click="handleDelete(food.id)">删除</button>
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
          <h2>{{ isEditing ? '编辑美食' : '新增美食' }}</h2>
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
                <label>美食名称:</label>
                <input v-model="formData.name" required />
              </div>
              <div class="form-group">
                <label>美食描述:</label>
                <input v-model="formData.description" required />
              </div>
              <div class="form-group">
                <label>美食价格:</label>
                <input v-model="formData.price" required />
              </div>
              <div class="form-group">
                <label>销量:</label>
                <input v-model="formData.sales" required />
              </div>
              <div class="form-group">
                <label>评分:</label>
                <input v-model="formData.rating" required />
              </div>
            </div>
            <!-- 提交按钮 -->
            <div class="dialog-buttons">
              <button type="button" class="btn cancel-btn" @click="closeDialog">取消</button>
              <button type="submit" class="btn confirm-btn">{{ isEditing ? '保存' : '创建' }}</button>
            </div>
          </form>
        </div>
      </div>

      <!-- 删除提示框组件 -->
      <DeleteConfirmation v-if="isDeletePromptVisible" @close="closeDeletePrompt" @confirm="confirmDelete" />
      <!-- 自定义提示框 -->
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
import DeleteConfirmation from '@/components/PromptComponent/DeleteConfirmation.vue';

const columns = [
  { key: 'checked', title: '多选' },
  { key: 'id', title: '美食ID' },
  { key: 'name', title: '美食名称' },
  { key: 'image', title: '美食图片' },
  { key: 'description', title: '美食描述' },
  { key: 'category', title: '美食分类' },
  { key: 'status', title: '美食状态' },
  { key: 'location', title: '美食位置' },
  { key: 'price', title: '美食价格' },
  { key: 'sales', title: '销量' },
  { key: 'rating', title: '评分' },
  { key: 'createdAt', title: '创建时间' },
  { key: 'updatedAt', title: '更新时间' },
];
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');
const foods = ref([]);
const searchKeyword = ref('');
const showDialog = ref(false);
const isEditing = ref(false);
const formData = ref({
  id: null,
  name: '',
  description: '',
  image: '',
  price: '',
  sales: '',
  rating: '',
});

// 分页相关变量
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 分页处理函数
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // 切换每页显示数量时重置到第一页
  fetchFoods();
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  fetchFoods();
};
//方法定义
const formatDate = (date) => {
  if (!date) return '未记录';
  return new Date(date).toLocaleString('zh-CN');
};
// 获取美食数据
const fetchFoods = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
    };
    const response = await request.get('/api/public/foods', { params });
    if (response.code === "0") {
      foods.value = response.data.list;
      total.value = response.data.total;
    } else {
      console.error('获取美食数据失败:', response.msg);
    }
  } catch (error) {
    console.error('请求失败:', error);
  }
};

// 搜索按钮点击事件
const handleSearch = () => {
  currentPage.value = 1; // 搜索时重置到第一页
  fetchFoods();
};

// 显示新增对话框
const showAddDialog = () => {
  isEditing.value = false;
  formData.value = {
    id: null,
    name: '',
    description: '',
    image: '',
    price: '',
    sales: '',
    rating: '',
  };
  showDialog.value = true;
};

// 显示编辑对话框
const showEditDialog = (food) => {
  isEditing.value = true;
  formData.value = { ...food };
  showDialog.value = true;
};
// 显示提示消息的方法
const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};
// 提交表单
const submitForm = async () => {
  try {
    if (isEditing.value) {
      await request.put(`/api/public/foods/${formData.value.id}`, formData.value);
      showToastMessage('更新美食成功');
    } else {
      await request.post('/api/public/foods', formData.value);
      showToastMessage('新增美食成功');
    }
    await fetchFoods();
    closeDialog();
  } catch (error) {
    console.error('操作失败:', error);
    const message = isEditing.value ? '更新美食失败' : '新增美食失败';
    showToastMessage(message, 'error');
  }
};

// 删除美食
const isDeletePromptVisible = ref(false);
const deleteFoodId = ref(null);

const handleDelete = (id) => {
  deleteFoodId.value = id;
  isDeletePromptVisible.value = true;
};

const closeDeletePrompt = () => {
  isDeletePromptVisible.value = false;
  deleteFoodId.value = null;
};

const confirmDelete = async () => {
  if (deleteFoodId.value) {
    try {
      await request.delete(`/api/public/foods/${deleteFoodId.value}`);
      await fetchFoods();
      showToastMessage('删除美食成功');

    } catch (error) {
      console.error('删除失败:', error.response?.data || error.message);
      showToastMessage('删除美食失败', 'error');
    } finally {
      closeDeletePrompt();
    }
  }
};

// 关闭对话框
const closeDialog = () => {
  showDialog.value = false;
};

// 处理文件上传
const dragOver = ref(false);
const previewImage = ref(null);
const fileName = ref('');
const fileSize = ref('');
const uploading = ref(false);
const progress = ref(0);

const handleFileUpload = (event) => {
  dragOver.value = false;
  const file = event.target.files[0] || event.dataTransfer?.files[0];

  if (!file) return;

  if (!file.type.match('image.*')) {
    showToastMessage('请选择图片文件', 'error');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToastMessage('文件大小不能超过5MB', 'error');
    return;
  }

  fileName.value = file.name;
  fileSize.value = formatFileSize(file.size);

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
    formData.value.image = e.target.result;
  };
  reader.readAsDataURL(file);

  // 模拟上传进度
  uploading.value = true;
  const interval = setInterval(() => {
    progress.value += Math.random() * 10;
    if (progress.value >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        uploading.value = false;
      }, 500);
    }
  }, 300);
};

// 触发文件输入框
const triggerFileInput = () => {
  document.querySelector('.file-input')?.click();
};

const handleDrop = (e) => {
  e.preventDefault();
  handleFileUpload(e);
};

const removeImage = () => {
  previewImage.value = null;
  fileName.value = '';
  fileSize.value = '';
  progress.value = 0;
  uploading.value = false;
  formData.value.image = '';
  document.querySelector('.file-input').value = '';
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 前端分页逻辑（如果后端不支持分页）
const paginatedFoods = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return foods.value.slice(start, end);
});

onMounted(fetchFoods);


</script>

<style scoped>
@import '@/css/Management/BackgroundManagement.css';
</style>