<template>
  <div class="management-page-background">
    <!-- <div class="page-name-GU">
      <h1 class="action-H1-BM-title">用户管理</h1>
    </div> -->
    <div class="container-008">
      <!-- 操作栏 -->
      <div class="action-bar">
        <div class="search-bar">
          <div class="search-box-008">
            <span>用户名:</span>
            <input type="text" v-model="searchKeyword" placeholder="用户名或昵称" class="search-input-008" />
          </div>
          <div class="search-box-008">
            <span>手机号:</span>
            <input type="text" v-model="searchKeyword" placeholder="手机号" class="search-input-008" />
          </div>
          <button class="btn search-btn" @click="handleSearch">搜索</button>
          <button class="btn delete-btn" @click="handleReset">批量删除</button>
        </div>
        <button class="btn add-btn" @click="showAddDialog">新增用户</button>
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
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>
                  <input type="checkbox" :checked="user.checked" @change="handleCheck(user)" class="ui-checkbox" />
                </td>
                <td>{{ user.id }}</td>
                <td>
                  <img :src="user.image" alt="头像" style="width: 35px; height: 35px;" @click="triggerFileInput(user)">
                </td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone }}</td>
                <td>{{ user.nickname }}</td>
                <td>{{ user.signature ? user.signature.substring(0, 10) : '' }}...</td>
                <td>{{ user.experience ? user.experience.substring(0, 15) : '' }}...</td>
                <td>{{ formatDate(user.createTime) }}</td>
                <td>{{ formatDate(user.updateTime) }}</td>
                <td class="table-btn-display">
                  <button class="btn details-btn" @click="showEditDialog(user)">详情</button>
                  <button class="btn edit-btn" @click="showEditDialog(user)">编辑</button>
                  <button class="btn delete-btn" @click="handleDelete(user.id)">删除</button>
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
          <h2>{{ isEditing ? '编辑用户' : '新增用户' }}</h2>
          <form @submit.prevent="submitForm" class="form-container">
            <div class="form-row">
              <div class="form-group">
                <label>头像:</label>
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
                <label>用户名:</label>
                <input v-model="formData.username" required />
              </div>
              <div class="form-group">
                <label>邮箱:</label>
                <input v-model="formData.email" required placeholder="example@example.com" />
              </div>
              <div class="form-group">
                <label>密码:</label>
                <input type="password" v-model="formData.password" required />
              </div>
              <div class="form-group">
                <label>手机号:</label>
                <input v-model="formData.phone" type="number" required />
              </div>
              <div class="form-group">
                <label>昵称:</label>
                <input v-model="formData.nickname" />
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
import { ref, computed, onMounted } from 'vue';
import request from '@/utils/request';

const columns = [
  { key: 'checked', title: '多选' },
  { key: 'id', title: 'ID' },
  { key: 'image', title: '头像' },
  { key: 'username', title: '用户名' },
  { key: 'email', title: '邮箱' },
  { key: 'phone', title: '手机号' },
  { key: 'nickname', title: '昵称' },
  { key: 'signature', title: '签名' },
  { key: 'experience', title: '经验' },
  { key: 'createTime', title: '创建时间' },
  { key: 'updateTime', title: '更新时间' },
];
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');
const users = ref([]);
const searchKeyword = ref('');
const showDialog = ref(false);
const isEditing = ref(false);
const formData = ref({
  id: null,
  username: '',
  email: '',
  password: '',
  phone: '',
  nickname: '',
  image: '',
  createTime: new Date(),
});

// 格式化手机号显示
const formatPhone = (phone) => {
  return String(phone).replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
};

// 格式化日期显示
const formatDate = (date) => {
  if (!date) return '未知日期';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('zh-CN', options).format(new Date(date));
};

// 搜索功能
const filteredUsers = computed(() => {
  const keyword = searchKeyword.value.toLowerCase();
  return users.value.filter(
    (user) =>
      user.username.toLowerCase().includes(keyword) ||
      user.nickname.toLowerCase().includes(keyword)
  );
});
// 分页功能
// 分页相关变量
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 分页处理函数
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1;
  fetchUsers();
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  fetchUsers();
};
// 获取用户数据
const fetchUsers = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    };
    const response = await request.get('/api/public/user', { params });
    users.value = response.data.list;
    total.value = response.data.total;
  } catch (error) {
    console.error('获取用户数据失败:', error);
  }
};

// 显示新增对话框
const showAddDialog = () => {
  isEditing.value = false;
  formData.value = {
    id: null,
    username: '',
    account: '',
    password: '',
    phone: '',
    nickname: '',
    image: '',
    createTime: new Date(),
  };
  showDialog.value = true;
};

// 显示编辑对话框
const showEditDialog = (user) => {
  isEditing.value = true;
  formData.value = { ...user };
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
      await request.put(`/api/public/user/${formData.value.id}`, formData.value);
      showToastMessage('更新用户成功');
    } else {
      await request.post('/api/public/user', formData.value);
      showToastMessage('新增用户成功');
    }
    await fetchUsers();
    closeDialog();
  } catch (error) {
    const message = isEditing.value ? '更新用户失败' : '新增用户失败';
    showToastMessage(message, 'error');
    console.error('操作失败:', error);
  }
};

// 删除用户
const isDeletePromptVisible = ref(false);
const deleteUserId = ref(null);

const handleDelete = (id) => {
  deleteUserId.value = id;
  isDeletePromptVisible.value = true;
};

const closeDeletePrompt = () => {
  isDeletePromptVisible.value = false;
  deleteUserId.value = null;
};

const confirmDelete = async () => {
  if (deleteUserId.value) {
    try {
      await request.delete(`/api/public/user/${deleteUserId.value}`);
      await fetchUsers();
      showToastMessage('删除用户成功');
    } catch (error) {
      console.error('删除失败:', error);
      showToastMessage('删除用户失败', 'error');
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
// 生命周期钩子
onMounted(
  fetchUsers
);


</script>

<style scoped>
@import '@/css/Management/BackgroundManagement.css';
</style>