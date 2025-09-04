<template>
  <div class="management-page-background">
    <div class="container-management">
      <!-- 列表栏 -->
      <div class="search-bar">
        <div class="search-container">
          <div class="search-title">
            <i class="fas fa-search"></i>
            <h2>搜索条件</h2>
          </div>

          <form class="search-form" @submit.prevent="searchUsers">
            <!-- 搜索框 -->
            <div class="search-box-management-container">
              <!-- ID -->
              <div class="search-box-management">
                <label for="id" class="required-label">ID:</label>
                <input type="number" id="id" v-model="searchParams.id" class="search-input-management"
                  placeholder="输入用户ID">
              </div>
              <!-- 用户名 -->
              <div class="search-box-management">
                <label for="username" class="required-label">用户名:</label>
                <input type="text" id="username" v-model="searchParams.username" class="search-input-management"
                  placeholder="输入用户名">
              </div>
              <!-- 昵称 -->
              <div class="search-box-management">
                <label for="nickname" class="required-label">昵称:</label>
                <input type="text" id="nickname" v-model="searchParams.nickname" class="search-input-management"
                  placeholder="输入昵称">
              </div>
              <!-- 邮箱 -->
              <div class="search-box-management">
                <label for="email" class="required-label">邮箱:</label>
                <input type="email" id="email" v-model="searchParams.email" class="search-input-management"
                  placeholder="输入邮箱地址">
              </div>
              <!-- 手机号 -->
              <div class="search-box-management">
                <label for="phone" class="required-label">手机号:</label>
                <input type="tel" id="phone" v-model="searchParams.phone" class="search-input-management"
                  placeholder="输入手机号码">
              </div>
              <!-- 用户ID -->
              <div class="search-box-management">
                <label for="userID" class="required-label">用户ID:</label>
                <input type="number" id="userID" v-model="searchParams.userID" class="search-input-management"
                  placeholder="输入用户ID">
              </div>

            </div>
            <!-- 搜索按钮 -->
            <div class="search-box-management-btn">
              <button type="button" class="btn reset-btn" @click="resetForm">
                <i class="fas fa-redo"></i> 重置
              </button>
              <button type="submit" class="btn search-btn">
                <i class="fas fa-search"></i> 搜索
              </button>
            </div>
          </form>
        </div>
      </div>
      <!-- 操作栏 -->
      <div class="action-bar">
        <div class="operate-bar">
          <button class="btn batchlogin-btn" @click="Batchlogin">批量登录</button>
          <button class="btn batchpermissions-btn" @click="batchpermissions">批量权限</button>
          <button class="btn delete-btn" @click="handleReset">批量删除</button>
          <button class="btn import-btn" @click="handleImport">Excel数据导入导出</button>
          <button class="btn add-btn" @click="showAddDialog">新增用户</button>
        </div>
      </div>
      <!-- 数据表格 -->
      <div class="results-container">
        <div class="results-header">
          <h2>搜索结果</h2>
          <div class="results-count" v-if="!loading && !error">
            共找到 {{ users.length }} 个用户
          </div>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>正在搜索用户，请稍候...</p>
        </div>

        <div v-else-if="error" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <span>{{ error }}</span>
        </div>

        <div v-else-if="users.length === 0" class="no-results">
          <i class="fas fa-users"></i>
          <h3>未找到用户</h3>
          <p>请尝试调整搜索条件后重新搜索</p>
        </div>

        <div v-else class="data-table-container">
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
                  <td>{{ user.userId }}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.phone }}</td>
                  <td>{{ user.nickname ? user.nickname : '未设置' }}</td>
                  <td>{{ user.signature ? user.signature.substring(0, 10) : '未设置' }}...</td>
                  <td>{{ user.experience ? user.experience.substring(0, 15) : '未设置' }}...</td>
                  <td>{{ formatDate(user.createTime) }}</td>
                  <td>{{ formatDate(user.updateTime) }}</td>
                  <td>
                    <label class="switch">
                      <input type="checkbox" :checked="user.permissions === 1" @change="togglePermission(user)">
                      <span class="slider"
                        :class="{ 'green': user.permissions === 1, 'red': user.permissions !== 1 }"></span>
                      <span class="knob"></span>
                    </label>
                  </td>
                  <td>
                    <label class="switch">
                      <input type="checkbox" :checked="user.status === 0" @change="toggleStatus(user)">
                      <span class="slider" :class="{ 'green': user.status === 0, 'red': user.status !== 0 }"></span>
                      <span class="knob"></span>
                    </label>
                  </td>
                  <td class="table-btn-display">
                    <button class="btn details-btn" @click="showUserDetails(user)">详情</button>
                    <button class="btn edit-btn" @click="showEditDialog(user)">编辑</button>
                    <button class="btn delete-btn" @click="handleDelete(user.id)">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
                        <!-- 操作按钮 -->
                        <button class="action-btn-image edit-btn-image" @click="triggerFileInput">
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                          </svg>
                        </button>
                        <!-- 删除按钮 -->
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
      <!-- 详情弹窗 -->
      <div class="user-detail-container" v-if="showDetailsUser" @click.self="closeDialog">
        <!-- 主卡片 -->
        <div class="user-detail-card" @click.stop>
          <!-- 关闭按钮 -->
          <button class="close-btn" @click="closeDialog">
            <i class="fas fa-times"></i>
          </button>

          <!-- 用户头像区 -->
          <div class="user-avatar-section">
            <div class="avatar-wrapper">
              <img :src="userDetail.image" alt="用户头像" class="user-avatar">
              <div class="avatar-border"></div>
            </div>
            <h2 class="user-name">{{ userDetail.username }}</h2>
            <p class="user-nickname">{{ userDetail.nickname }}</p>
            <div class="user-tags">
              <span class="tag">VIP</span>
              <span class="tag">活跃用户</span>
              <span class="tag">注册于 {{ formatDate(userDetail.createTime) }}</span>
            </div>
          </div>

          <!-- 用户详细信息 -->
          <div class="user-info-section">
            <div class="info-grid">
              <!-- 基本信息 -->
              <div class="info-card">
                <div class="info-header">
                  <i class="fas fa-id-card"></i>
                  <h3>基本信息</h3>
                </div>
                <div class="info-content">
                  <div class="info-item">
                    <span class="info-label">用户ID:</span>
                    <span class="info-value">{{ userDetail.id }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">用户名:</span>
                    <span class="info-value">{{ userDetail.username }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">昵称:</span>
                    <span class="info-value">{{ userDetail.nickname }}</span>
                  </div>
                </div>
              </div>

              <!-- 联系信息 -->
              <div class="info-card">
                <div class="info-header">
                  <i class="fas fa-envelope"></i>
                  <h3>联系信息</h3>
                </div>
                <div class="info-content">
                  <div class="info-item">
                    <span class="info-label">电子邮箱:</span>
                    <span class="info-value">{{ userDetail.email }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">联系电话:</span>
                    <span class="info-value">{{ userDetail.phone }}</span>
                  </div>
                </div>
              </div>

              <!-- 签名 -->
              <div class="info-card signature-card">
                <div class="info-header">
                  <i class="fas fa-quote-left"></i>
                  <h3>个性签名</h3>
                </div>
                <div class="info-content">
                  <p class="signature-text">{{ userDetail.signature || '暂无签名' }}</p>
                </div>
              </div>

              <!-- 经历 -->
              <div class="info-card experience-card">
                <div class="info-header">
                  <i class="fas fa-briefcase"></i>
                  <h3>个人经历</h3>
                </div>
                <div class="info-content">
                  <p class="experience-text">{{ userDetail.experience || '暂无经历信息' }}</p>
                </div>
              </div>

              <!-- 时间信息 -->
              <div class="info-card timeline-card">
                <div class="info-header">
                  <i class="fas fa-clock"></i>
                  <h3>时间信息</h3>
                </div>
                <div class="info-content">
                  <div class="timeline">
                    <div class="timeline-item">
                      <span class="timeline-label">注册时间:</span>
                      <span class="timeline-value">{{ formatDate(userDetail.createTime) }}</span>
                    </div>
                    <div class="timeline-item">
                      <span class="timeline-label">最后更新:</span>
                      <span class="timeline-value">{{ formatDate(userDetail.updateTime) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 操作按钮 -->
          <div class="action-buttons">
            <button class="action-btn message-btn" @click="sendMessage">
              <i class="fas fa-paper-plane"></i> 发送消息
            </button>
          </div>
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
    <!-- 导入导出Excel API -->
    <div class="app-container" v-if="showExcel">
      <ExcelImportExportAPI @import-complete="handleImportComplete" @export-complete="handleExportComplete"
        @import-error="handleImportError" @export-error="handleExportError" @close="handleCloseImportExport"
        :export-api-url="exportApiUrl" :import-api-url="importApiUrl" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import request from '@/utils/request';
import ExcelImportExportAPI from '@/components/DisplayBox/ExcelImportExportAPI.vue';
import DeleteConfirmation from '@/components/PromptComponent/DeleteConfirmation.vue';

const columns = [
  { key: 'checked', title: '多选' },
  { key: 'id', title: 'ID' },
  { key: 'image', title: '头像' },
  { key: 'nameId', title: '用户ID' },
  { key: 'username', title: '用户名' },
  { key: 'email', title: '邮箱' },
  { key: 'phone', title: '手机号' },
  { key: 'nickname', title: '昵称' },
  { key: 'signature', title: '签名' },
  { key: 'experience', title: '经验' },
  { key: 'createTime', title: '创建时间' },
  { key: 'updateTime', title: '更新时间' },
  { key: 'permissions', title: '管理员权限(关闭-开启)' },
  { key: 'status', title: '登录状态(禁止-启用)' },
];
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');
const users = ref([]);
const showDialog = ref(false);
const showExcel = ref(false);
const isEditing = ref(false);
const showDetailsUser = ref(false);

// 表单数据
const formData = ref({
  id: null,
  username: '',
  email: '',
  password: '',
  phone: '',
  nickname: '',
  image: '',
  createTime: new Date(),
  updateTime: new Date(),
});

// 详情弹窗
const userDetail = ref({
  image: '',
  username: '',
  nickname: '',
  createTime: null,
  id: '',
  email: '',
  phone: '',
  signature: '',
  experience: '',
  updateTime: null
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
const searchParams = reactive({
  id: null,
  username: '',
  nickname: '',
  email: '',
  phone: '',
  userID: null
});

const loading = ref(false);
const error = ref(null);

const searchUsers = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { data } = await request.get('/api/public/user/search', { params: searchParams });
    users.value = data;
  } catch (err) {
    error.value = '搜索用户时发生错误: ' + err.message;
    console.error('搜索错误:', err);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  searchParams.id = null;
  searchParams.username = '';
  searchParams.nickname = '';
  searchParams.email = '';
  searchParams.phone = '';
  searchParams.userID = null;
  users.value = [];
  error.value = null;
};

const filteredUsers = computed(() => {
  return users.value;
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
      pageSize: pageSize.value
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
    updateTime: new Date(),
  };
  showDialog.value = true;
};

// 显示编辑对话框
const showEditDialog = (user) => {
  isEditing.value = true;
  formData.value = { ...user };
  showDialog.value = true;
};

// 显示用户详情
const showUserDetails = (user) => {
  userDetail.value = { ...user };
  showDetailsUser.value = true;
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
      formData.value.updateTime = new Date();
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
// 更改权限
const togglePermission = async (user) => {
  try {
    const newPermission = user.permissions === 1 ? 0 : 1;
    const requestData = {
      id: user.id,
      permissions: newPermission,
      username: user.username
    };
    await request.put(`/api/public/user/updateRole`, requestData);
    user.permissions = newPermission;
    showToastMessage('修改权限成功');
  } catch (error) {
    console.error('修改权限失败:', error);
    showToastMessage('修改权限失败', 'error');
  }
};
// 更改状态
const toggleStatus = async (user) => {
  try {
    const newStatus = user.status === 0 ? 1 : 0;
    const requestData = {
      id: user.id,
      status: newStatus,
      username: user.username
    };
    await request.put(`/api/public/user/updateStatus`, requestData);
    user.status = newStatus;
    showToastMessage('修改状态成功');
  } catch (error) {
    console.error('修改状态失败:', error);
    showToastMessage('修改状态失败', 'error');
  }
};
// 关闭对话框
const closeDialog = () => {
  showDialog.value = false;
  showDetailsUser.value = false;
};
// 图片上传相关状态
const dragOver = ref(false);
const previewImage = ref('');
const fileName = ref('');
const fileSize = ref('');
const uploading = ref(false);
const progress = ref(0);

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 处理文件上传
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 验证文件类型
  const validTypes = ['image/jpeg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    showToastMessage('只支持JPG/PNG格式图片', 'error');
    return;
  }

  // 验证文件大小
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    showToastMessage('图片大小不能超过5MB', 'error');
    return;
  }

  // 显示文件信息
  fileName.value = file.name;
  fileSize.value = formatFileSize(file.size);

  // 读取并预览图片
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
    formData.value.image = e.target.result;
  };
  reader.readAsDataURL(file);

  // 模拟上传进度
  uploading.value = true;
  const interval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 10;
    } else {
      clearInterval(interval);
      uploading.value = false;
    }
  }, 100);

  return file;
};

// 处理拖放上传
const handleDrop = (event) => {
  dragOver.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    const fakeEvent = { target: { files: [file] } };
    handleFileUpload(fakeEvent);
  }
};

// 移除图片
const removeImage = () => {
  previewImage.value = '';
  fileName.value = '';
  fileSize.value = '';
  formData.value.image = '';
};

// 触发文件输入框
const triggerFileInput = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.onchange = (event) => {
    const file = handleFileUpload(event);
    if (file) {
      formData.value.file = file;
    }
  };
  fileInput.click();
};

// Excel 导入导出结果处理
const handleImport = (result) => {
  showExcel.value = true;
  console.log('打开Excel导入组件:', showExcel.value);
};

const exportApiUrl = 'http://localhost:2025/api/public/user/export';
const importApiUrl = '/api/public/user/import';

const handleImportComplete = (result) => {
  console.log('导入完成:', result);
};

const handleExportComplete = (result) => {
  console.log('导出完成:', result);
};

const handleImportError = (error) => {
  console.error('导入错误:', error);
};

const handleExportError = (error) => {
  console.error('导出错误:', error);
};

const handleCloseImportExport = () => {
  showExcel.value = false;
  console.log('关闭Excel导入组件:', showExcel.value);
};
// 生命周期钩子
onMounted(
  fetchUsers
);


</script>

<style scoped>
@import '@/css/Management/BackgroundManagement.css';
</style>