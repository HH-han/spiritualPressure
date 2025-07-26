<template>
  <div class="management-page-background">
    <div class="container-008">
      <!-- 操作栏 -->
      <div class="action-bar">
        <div class="search-bar">
          <div class="search-box-008">
            <input type="text" v-model="searchKeyword" placeholder="输入卡片ID或标题搜索" class="search-input-008" />

          </div>
          <button class="btn search-btn" @click="fetchScenic">搜索</button>
          <button class="btn delete-btn" @click="handleReset">批量删除</button>
        </div>

        <button class="btn add-btn" @click="showAddDialog">新增安全</button>
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
              <tr v-for="card in cards" :key="card.id">
                <td>
                  <input type="checkbox" :checked="card.checked" @change="handleCheck(card)" class="ui-checkbox" />
                </td>
                <td>{{ card.id }}</td>
                <td>{{ card.title }}</td>
                <td>
                  <img :src="card.imageUrl" alt="安全图片" style="width: 35px; height: 35px;" />
                </td>
                <td>{{ card.description }}</td>
                <td>{{ formatDate(card.createTime) }}</td>
                <!-- <td>{{ formatDate(card.updateTime) }}</td> -->
                <td class="table-btn-display">
                  <button class="btn details-btn" @click="showEditDialog(card)">详情</button>
                  <button class="btn edit-btn" @click="showEditDialog(card)">编辑</button>
                  <button class="btn delete-btn" @click="handleDelete(card.id)">删除</button>
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
          :total="total">
        </el-pagination>
      </div>
      <!-- 新增/编辑弹窗 -->
      <div v-if="showDialog" class="dialog-overlay" @click.self="closeDialog">
        <div class="dialog" @click.stop>
          <h2>{{ isEditing ? '编辑安全' : '新增安全' }}</h2>
          <form @submit.prevent="submitForm" class="form-container">
            <div class="form-row">
              <div class="form-group">
                <label>安全图片:</label>
                <input type="file" @change="handleFileUpload" class="file-upload-input" ref="fileInput" />
                <!-- 自定义的按钮 -->
                <button class="file-upload-button" @click="triggerFileInput">
                  选择文件
                </button>
                <div v-if="formData.imageUrl" class="image-preview-container">
                  <img :src="formData.imageUrl" alt="图片预览" class="image-preview" />
                </div>
              </div>
              <div class="form-group">
                <label>安全标题:</label>
                <input v-model="formData.title" required />
              </div>
              <div class="form-group">
                <label>安全副标题:</label>
                <input v-model="formData.description" required />
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
      <!-- 自定义提示框 -->
      <div v-if="showToast" class="custom-toast" :class="toastType">
        <span class="toast-icon">{{ toastType === 'success' ? '✓' : '✕' }}</span>
        {{ toastMessage }}
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import request from '@/utils/request';

const columns = [
  { key: 'checked', title: '多选' },
  { key: 'id', title: '安全ID' },
  { key: 'title', title: '安全标题' },
  { key: 'imageUrl', title: '安全图片' },
  { key: 'description', title: '安全副标题' },
  { key: 'createTime', title: '创建时间' },
  // { key: 'updateTime', title: '更新时间' },
];

const cards = ref([]);
const searchKeyword = ref('');
const showDialog = ref(false);
const isEditing = ref(false);
const formData = ref({
  id: null,
  title: '',
  description: '',
  imageUrl: '',
  createTime: '',
  updateTime: '',
});

const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

const formatDate = (date) => {
  if (!date) return '未知日期';
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleString('zh-CN', options);
};

const fetchScenic = async () => {
  try {
    const response = await request.get('/api/public/safety-tips/page', {
      params: {
        keyword: searchKeyword.value,
        page: currentPage.value,
        pageSize: pageSize.value,
      },
    });
    cards.value = response.data.list;
    total.value = response.data.total;
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

const showAddDialog = () => {
  isEditing.value = false;
  formData.value = {
    id: null,
    title: '',
    description: '',
    imageUrl: '',
    createTime: '',
    updateTime: '',
  };
  showDialog.value = true;
};

const showEditDialog = (card) => {
  isEditing.value = true;
  formData.value = { ...card };
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
      await request.put(`/api/public/safety-tips/${formData.value.id}`, formData.value);
      showToastMessage('更新成功');
    } else {
      await request.post('/api/public/safety-tips', formData.value);
      showToastMessage('新增成功');
    }
    await fetchScenic();
    closeDialog();
  } catch (error) {
    const message = isEditing.value ? '更新失败' : '新增失败';
    showToastMessage(message, 'error');
    console.error('操作失败:', error);
  }
};

const handleDelete = (id) => {
  deleteCardId.value = id;
  isDeletePromptVisible.value = true;
};

const closeDeletePrompt = () => {
  isDeletePromptVisible.value = false;
  deleteCardId.value = null;
};

const confirmDelete = async () => {
  try {
    await request.delete(`/api/public/safety-tips/${deleteCardId.value}`);
    await fetchScenic();
    showToastMessage('删除成功');
    toastType.value = 'success';
    showToast.value = true;
  } catch (error) {
    showToastMessage('删除失败');
    toastType.value = 'error';
    showToast.value = true;
    console.error('message:', error);
  } finally {
    closeDeletePrompt();
  }
};

const closeDialog = () => {
  showDialog.value = false;
};

const handleFileUpload = (event) => {
  if (event.target) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        formData.value.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
};

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
// 定义一个 ref 来引用文件输入框
const fileInput = ref(null);

// 触发文件输入框的点击事件
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click(); // 触发点击事件
  }
};
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  fetchScenic();
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  fetchScenic();
};

const isDeletePromptVisible = ref(false);
const deleteCardId = ref(null);

onMounted(fetchScenic);
</script>

<style scoped>
@import '@/css/Management/BackgroundManagement.css';
</style>