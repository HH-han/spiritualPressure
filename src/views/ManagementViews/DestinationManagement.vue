<template>
  <div class="management-page-background">
    <div class="container-management">
      <!-- 加载状态 -->
      <div v-if="loading">加载中...</div>
      <div v-else>
        <!-- 操作栏 -->
        <div class="action-bar">
          <div class="search-bar">
            <div class="search-box-management">
              <input type="text" v-model="searchKeyword" placeholder="输入名称或类别搜索" class="search-input-management" />
            </div>
            <button class="btn search-btn" @click="handleSearch">搜索</button>
            <button class="btn delete-btn" @click="handleReset">批量删除</button>
          </div>
          <button class="btn add-btn" @click="showAddDialog">新增项目</button>
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
              <tbody v-if="filteredItems.length > 0">
                <!-- 确保 filteredItems 有数据时才渲染 -->
                <tr v-for="item in filteredItems" :key="item.id">
                  <td>
                    <input type="checkbox" :checked="item.checked" @change="handleCheck(item)" class="ui-checkbox" />
                  </td>
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>
                    <img :src="item.image" alt="图片" style="width: 35px; height: 35px;" />
                  </td>
                  <td>{{ item.description ? item.description.substring(0, 25) + '...' : '' }}</td>
                  <td>{{ item.rating }}</td>
                  <td>{{ item.badgeText }}</td>
                  <td>{{ item.status }}</td>
                  <td>{{ item.isDiscounted }}</td>
                  <td>{{ item.isFeatured }}</td>
                  <td>{{ item.category }}</td>
                  <td>{{ formatCities(item.cities) }}</td>
                  <td>￥{{ item.price }}</td>
                  <td>{{ item.created_at }}</td>
                  <td>{{ item.updated_at }}</td>
                  <td class="table-btn-display">
                    <button class="btn details-btn" @click="showEditDialog(card)">详情</button>
                    <button class="btn edit-btn" @click="showEditDialog(item)">编辑</button>
                    <button class="btn delete-btn" @click="handleDelete(item.id)">删除</button>
                  </td>
                </tr>
                <!-- 当 filteredItems 为空时显示提示信息 -->
                <tr v-if="filteredItems.length === 0">
                  <td colspan="7">未找到相关数据</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- 分页器 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total" />
        </div>

        <!-- 新增/编辑弹窗 -->
        <div v-if="showDialog" class="dialog-overlay" @click.self="closeDialog">
          <div class="dialog" @click.stop>
            <h2>{{ isEditing ? '编辑项目' : '新增项目' }}</h2>
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
                      <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*"
                        class="file-input" />

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
                  <label>名称:</label>
                  <input v-model="formData.name" required />
                </div>
                <div class="form-group">
                  <label>大洲:</label>
                  <input v-model="formData.category" required />
                </div>
                <div class="form-group">
                  <label>城市:</label>
                  <input v-model="formData.cities" placeholder="用逗号分隔多个城市" required />
                </div>

                <div class="form-group">
                  <label>价格:</label>
                  <input v-model="formData.price" type="number" required />
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

        <!-- 自定义提示框组件 -->
        <ToastType v-if="showToast" :toastMessage="toastMessage" :toastType="toastType" />
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import request from '@/utils/request';
import DeleteConfirmation from '@/components/PromptComponent/DeleteConfirmation.vue';
import ToastType from '@/components/PromptComponent/ToastType.vue';

// 表格列定义
const columns = [
  { key: 'checked', title: '多选' },
  { key: 'id', title: 'ID' },
  { key: 'name', title: '名称' },
  { key: 'image', title: '图片' },
  { key: 'description', title: '描述' },
  { key: 'rating', title: '评分' },
  { key: 'badgeText', title: '标签' },
  { key: 'status', title: '状态' },
  { key: 'isDiscounted', title: '折扣' },
  { key: 'isFeatured', title: '特色' },
  { key: 'category', title: '大洲' },
  { key: 'cities', title: '城市' },
  { key: 'price', title: '价格' },
  { key: 'created_at', title: '创建时间' },
  { key: 'updated_at', title: '更新时间' }
];

// 数据相关
const items = ref([]);
const loading = ref(true);
const searchKeyword = ref('');
const showDialog = ref(false);
const isEditing = ref(false);
const formData = ref({
  id: null,
  name: '',
  category: '',
  cities: '',
  image: '',
  created_at: '',
  price: 0,

});
const closeDialog = () => {
  showDialog.value = false;
};
// 提示框相关
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 删除提示框相关
const isDeletePromptVisible = ref(false);
const deleteItemId = ref(null);

// 格式化城市显示
const formatCities = (cities) => {
  return cities.join(', ');
};

// 搜索功能
const filteredItems = computed(() => {
  console.log('items.value:', items.value);
  if (!items.value) return [];
  const keyword = searchKeyword.value.toLowerCase();
  return items.value.filter(
    (item) =>
      item.name.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword)
  );
});

// 获取数据
const fetchItems = async () => {
  try {
    const params = {
      currentPage: currentPage.value, // 参数名从 page 改为 currentPage
      pageSize: pageSize.value,
      searchQuery: searchKeyword.value, // 参数名从 keyword 改为 searchQuery
      activeCategory: '全部' // 添加分类参数（根据实际需求）
    };
    const response = await request.get('/api/public/destination/list', { params });
    console.log('后端返回的数据:', response.data);
    items.value = response.data.destinations || [];

    // 更新分页参数
    total.value = response.data.total; // 直接使用后端返回的总数
    currentPage.value = response.data.currentPage || 1;

    // 移除原来的总页数计算逻辑
  } catch (error) {
    console.error('获取数据失败:', error);
    items.value = [];
  } finally {
    loading.value = false;
  }
};

// 显示新增对话框
const showAddDialog = () => {
  isEditing.value = false;
  formData.value = {
    id: null,
    name: '',
    category: '',
    cities: '',
    image: '',
    price: 0,
  };
  showDialog.value = true;
};

// 显示编辑对话框
const showEditDialog = (item) => {
  isEditing.value = true;
  formData.value = {
    ...item,
    cities: item.cities.join(','),
  };
  showDialog.value = true;
};

// 提交表单
const submitForm = async () => {
  try {
    const data = {
      ...formData.value,
      cities: formData.value.cities.split(',').map((city) => city.trim()),
    };

    if (isEditing.value) {
      await request.put(`/api/public/destination/${data.id}`, data);
      showToastMessage('更新项目成功');
    } else {
      await request.post('/api/public/destination', data);
      showToastMessage('新增项目成功');
    }
    await fetchItems();
    closeDialog();
  } catch (error) {
    const message = isEditing.value ? '更新项目失败' : '新增项目失败';
    showToastMessage(message, 'error');
    console.error('操作失败:', error);
  }
};

// 删除项目
const handleDelete = (id) => {
  deleteItemId.value = id;
  isDeletePromptVisible.value = true;
};

const confirmDelete = async () => {
  if (deleteItemId.value) {
    try {
      await request.delete(`/api/public/destination/${deleteItemId.value}`);
      await fetchItems();
      showToastMessage('删除项目成功');
    } catch (error) {
      console.error('删除失败:', error);
      showToastMessage('删除项目失败', 'error');
    } finally {
      closeDeletePrompt();
    }
  }
};

// 关闭删除提示框
const closeDeletePrompt = () => {
  isDeletePromptVisible.value = false;
  deleteItemId.value = null;
};

// 显示提示消息
const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};
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

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  fetchItems(); // 移除 currentPage.value = 1 保持当前页码
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  fetchItems();
};

// 初始化加载数据
onMounted(fetchItems);


</script>

<style scoped>
@import '@/css/Management/BackgroundManagement.css';
</style>