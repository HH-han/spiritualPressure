<template>
  <div class="management-page-background">
    <div class="container-008">
      <!-- 操作栏 -->
      <div class="action-bar">
        <div class="search-bar">
          <div class="search-box-008">
            <input type="text" v-model="searchKeyword" placeholder="输入美食名称或描述搜索" class="search-input-008" />

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
                <label>美食图片:</label>
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
      foods.value = response.data.list; // 确保解析的是 list 字段
      total.value = response.data.total; // 确保解析的是 total 字段
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
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader(file);
    reader.onload = (e) => {
      formData.value.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 触发文件输入框
const triggerFileInput = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.onchange = (event) => handleFileUpload(event);
  fileInput.click();
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