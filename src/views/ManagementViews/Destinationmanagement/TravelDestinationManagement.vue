<template>
  <div class="management-page-background">
    <div class="container-management">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">加载中...</div>
      <div v-else>
        <!-- 操作栏 -->
        <div class="action-bar">
          <div class="search-bar">
            <div class="search-box-management">
              <input type="text" v-model="searchKeyword" placeholder="输入旅游目的地名称搜索" class="search-input-management" />
            </div>
            <button class="btn search-btn" @click="handleSearch">搜索</button>
            <button class="btn delete-btn" @click="handleBatchDelete">批量删除</button>
          </div>
          <button class="btn add-btn" @click="showAddDialog">新增旅游目的地</button>
        </div>

        <!-- 数据表格 -->
        <div class="data-table-container">
          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th><input type="checkbox" v-model="selectAll" @change="handleSelectAll" /></th>
                  <th>ID</th>
                  <th>名称</th>
                  <th>图片</th>
                  <th>地区</th>
                  <th>描述</th>
                  <th>评分</th>
                  <th>价格</th>
                  <th>状态</th>
                  <th>创建时间</th>
                  <th>更新时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody v-if="filteredItems.length > 0">
                <tr v-for="item in filteredItems" :key="item.id">
                  <td>
                    <input type="checkbox" :checked="item.checked" @change="handleCheck(item)" class="ui-checkbox" />
                  </td>
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>
                    <img :src="item.imageUrl || item.image" alt="旅游目的地图片" style="width: 50px; height: 50px; object-fit: cover;" />
                  </td>
                  <td>{{ item.regionName || item.region }}</td>
                  <td>{{ item.description ? item.description.substring(0, 25) + '...' : '' }}</td>
                  <td>{{ item.rating || 0 }}</td>
                  <td>￥{{ item.price || 0 }}</td>
                  <td>
                    <span :class="['status-badge', item.status === 'active' ? 'active' : 'inactive']">
                      {{ item.status === 'active' ? '启用' : '禁用' }}
                    </span>
                  </td>
                  <td>{{ formatDate(item.createdAt || item.created_at) }}</td>
                  <td>{{ formatDate(item.updatedAt || item.updated_at) }}</td>
                  <td class="table-btn-display">
                    <button class="btn details-btn" @click="openDetailsDialog(item)">详情</button>
                    <button class="btn edit-btn" @click="showEditDialog(item)">编辑</button>
                    <button class="btn delete-btn" @click="handleDelete(item.id)">删除</button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="12" class="no-data">未找到相关数据</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 分页器 -->
        <div class="block">
          <el-pagination 
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange"
            :current-page="currentPage" 
            :page-sizes="[10, 20, 50, 100]" 
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" 
            :total="total" />
        </div>

        <!-- 新增/编辑弹窗 -->
        <div v-if="showDialog" class="dialog-overlay" @click.self="closeDialog">
          <div class="dialog" @click.stop>
            <h2>{{ isEditing ? '编辑旅游目的地' : '新增旅游目的地' }}</h2>
            <form @submit.prevent="submitForm" class="form-container">
              <div class="form-row">
                <div class="form-group">
                  <label>名称:</label>
                  <input v-model="formData.name" required />
                </div>
                <div class="form-group">
                  <label>地区:</label>
                  <input v-model="formData.regionName" required />
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>评分:</label>
                  <input v-model="formData.rating" type="number" min="0" max="5" step="0.1" />
                </div>
                <div class="form-group">
                  <label>价格:</label>
                  <input v-model="formData.price" type="number" min="0" />
                </div>
              </div>

              <div class="form-group">
                <label>描述:</label>
                <textarea v-model="formData.description" placeholder="旅游目的地描述" maxlength="500"></textarea>
              </div>

              <div class="form-group">
                <label>图片上传:</label>
                <div class="image-upload-container">
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
                    </div>
                  </div>
                  
                  <div class="preview-container" v-if="previewImage">
                    <div class="preview-card">
                      <img :src="previewImage" alt="预览图片" class="preview-image" />
                      <div class="preview-actions">
                        <button class="action-btn-image delete-btn-image" @click="removeImage">
                          <svg viewBox="0 0 24 24">
                            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>状态:</label>
                <select v-model="formData.status">
                  <option value="active">启用</option>
                  <option value="inactive">禁用</option>
                </select>
              </div>

              <!-- 提交按钮 -->
              <div class="dialog-buttons">
                <button type="button" class="btn cancel-btn" @click="closeDialog">取消</button>
                <button type="submit" class="btn confirm-btn">{{ isEditing ? '保存' : '创建' }}</button>
              </div>
            </form>
          </div>
        </div>

        <!-- 详情弹窗 -->
        <div v-if="showDetailsDialog" class="dialog-overlay" @click.self="closeDetailsDialog">
          <div class="dialog" @click.stop>
            <h2>旅游目的地详情</h2>
            <div class="details-container">
              <div class="detail-item">
                <label>ID:</label>
                <span>{{ selectedItem.id }}</span>
              </div>
              <div class="detail-item">
                <label>名称:</label>
                <span>{{ selectedItem.name }}</span>
              </div>
              <div class="detail-item">
                <label>地区:</label>
                <span>{{ selectedItem.regionName || selectedItem.region }}</span>
              </div>
              <div class="detail-item">
                <label>描述:</label>
                <span>{{ selectedItem.description }}</span>
              </div>
              <div class="detail-item">
                <label>评分:</label>
                <span>{{ selectedItem.rating || 0 }}</span>
              </div>
              <div class="detail-item">
                <label>价格:</label>
                <span>￥{{ selectedItem.price || 0 }}</span>
              </div>
              <div class="detail-item">
                <label>图片:</label>
                <img :src="selectedItem.imageUrl || selectedItem.image" alt="旅游目的地图片" style="width: 100px; height: 100px; object-fit: cover;" />
              </div>
              <div class="detail-item">
                <label>状态:</label>
                <span :class="['status-badge', selectedItem.status === 'active' ? 'active' : 'inactive']">
                  {{ selectedItem.status === 'active' ? '启用' : '禁用' }}
                </span>
              </div>
              <div class="detail-item">
                <label>创建时间:</label>
                <span>{{ formatDate(selectedItem.createdAt || selectedItem.created_at) }}</span>
              </div>
              <div class="detail-item">
                <label>更新时间:</label>
                <span>{{ formatDate(selectedItem.updatedAt || selectedItem.updated_at) }}</span>
              </div>
            </div>
            <div class="dialog-buttons">
              <button type="button" class="btn cancel-btn" @click="closeDetailsDialog">关闭</button>
            </div>
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
import { 
  getTravelDestinations, 
  createTravelDestination, 
  updateTravelDestination, 
  deleteTravelDestination 
} from '@/api/destination';
import DeleteConfirmation from '@/components/PromptComponent/DeleteConfirmation.vue';
import ToastType from '@/components/PromptComponent/ToastType.vue';

// 数据相关
const items = ref([]);
const loading = ref(true);
const searchKeyword = ref('');
const showDialog = ref(false);
const showDetailsDialog = ref(false);
const isEditing = ref(false);
const selectedItem = ref({});
const formData = ref({
  id: null,
  name: '',
  regionName: '',
  description: '',
  rating: 0,
  price: 0,
  imageUrl: '',
  status: 'active'
});

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

// 图片上传相关
const dragOver = ref(false);
const previewImage = ref('');

// 全选相关
const selectAll = ref(false);

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('zh-CN');
};

// 搜索功能
const filteredItems = computed(() => {
  if (!items.value) return [];
  const keyword = searchKeyword.value.toLowerCase();
  return items.value.filter(item => 
    item.name.toLowerCase().includes(keyword) ||
    (item.regionName && item.regionName.toLowerCase().includes(keyword)) ||
    (item.description && item.description.toLowerCase().includes(keyword))
  );
});

// 获取数据
const fetchItems = async () => {
  try {
    loading.value = true;
    const response = await getTravelDestinations();
    
    if (response.code === "0") {
      // 转换后端数据为前端格式
      items.value = (response.data || []).map(item => ({
        id: item.id,
        name: item.provinceName || item.name || '',
        regionName: item.region?.name || item.regionName || '',
        description: item.description || '',
        rating: item.rating || 0,
        price: item.price || 0,
        imageUrl: item.imageUrl || item.image || '',
        status: item.status || 'active',
        createdAt: item.createdAt || item.created_at,
        updatedAt: item.updatedAt || item.updated_at
      }));
      total.value = items.value.length;
    } else {
      console.error('获取数据失败:', response.message);
      items.value = [];
    }
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
    regionName: '',
    description: '',
    rating: 0,
    price: 0,
    imageUrl: '',
    status: 'active'
  };
  previewImage.value = '';
  showDialog.value = true;
};

// 显示编辑对话框
const showEditDialog = (item) => {
  isEditing.value = true;
  formData.value = { ...item };
  previewImage.value = item.imageUrl || item.image || '';
  showDialog.value = true;
};

// 显示详情对话框
const openDetailsDialog = (item) => {
  selectedItem.value = item;
  showDetailsDialog.value = true;
};

// 关闭详情对话框
const closeDetailsDialog = () => {
  showDetailsDialog.value = false;
  selectedItem.value = {};
};

// 提交表单
const submitForm = async () => {
  try {
    // 转换前端数据为后端格式
    const data = {
      id: formData.value.id,
      provinceName: formData.value.name,
      region: formData.value.regionName ? { name: formData.value.regionName } : null,
      description: formData.value.description,
      rating: formData.value.rating,
      price: formData.value.price,
      imageUrl: formData.value.imageUrl,
      status: formData.value.status
    };
    
    if (isEditing.value) {
      await updateTravelDestination(data);
      showToastMessage('更新旅游目的地成功');
    } else {
      await createTravelDestination(data);
      showToastMessage('新增旅游目的地成功');
    }
    
    await fetchItems();
    closeDialog();
  } catch (error) {
    const message = isEditing.value ? '更新旅游目的地失败' : '新增旅游目的地失败';
    showToastMessage(message, 'error');
    console.error('操作失败:', error);
  }
};

// 关闭对话框
const closeDialog = () => {
  showDialog.value = false;
  formData.value = {
    id: null,
    name: '',
    regionName: '',
    description: '',
    rating: 0,
    price: 0,
    imageUrl: '',
    status: 'active'
  };
  previewImage.value = '';
};

// 删除项目
const handleDelete = (id) => {
  deleteItemId.value = id;
  isDeletePromptVisible.value = true;
};

const confirmDelete = async () => {
  if (deleteItemId.value) {
    try {
      await deleteTravelDestination(deleteItemId.value);
      await fetchItems();
      showToastMessage('删除旅游目的地成功');
    } catch (error) {
      console.error('删除失败:', error);
      showToastMessage('删除旅游目的地失败', 'error');
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
    formData.value.imageUrl = e.target.result;
  };
  reader.readAsDataURL(file);
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
  formData.value.imageUrl = '';
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
  currentPage.value = 1;
  fetchItems();
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  fetchItems();
};

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1;
  fetchItems();
};

// 全选处理
const handleSelectAll = () => {
  items.value.forEach(item => {
    item.checked = selectAll.value;
  });
};

// 单个选择处理
const handleCheck = (item) => {
  item.checked = !item.checked;
  selectAll.value = items.value.every(item => item.checked);
};

// 批量删除
const handleBatchDelete = () => {
  const selectedItems = items.value.filter(item => item.checked);
  if (selectedItems.length === 0) {
    showToastMessage('请先选择要删除的项目', 'warning');
    return;
  }
  
  if (confirm(`确定要删除选中的 ${selectedItems.length} 个旅游目的地吗？`)) {
    // 实现批量删除逻辑
    selectedItems.forEach(async (item) => {
      try {
        await deleteTravelDestination(item.id);
      } catch (error) {
        console.error(`删除旅游目的地 ${item.id} 失败:`, error);
      }
    });
    
    setTimeout(() => {
      fetchItems();
      showToastMessage(`成功删除 ${selectedItems.length} 个旅游目的地`);
    }, 1000);
  }
};

// 初始化加载数据
onMounted(fetchItems);
</script>

<style scoped>
@import '@/css/Management/BackgroundManagement.css';

.loading-state {
  text-align: center;
  padding: 20px;
  color: #666;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #999;
}

.details-container {
  max-height: 400px;
  overflow-y: auto;
}

.detail-item {
  display: flex;
  margin-bottom: 15px;
  align-items: flex-start;
}

.detail-item label {
  font-weight: bold;
  min-width: 80px;
  margin-right: 10px;
}

.detail-item span {
  flex: 1;
  word-break: break-word;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-badge.active {
  background-color: #f0f9ff;
  color: #1890ff;
}

.status-badge.inactive {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.image-upload-container {
  margin-top: 10px;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area.drag-active {
  border-color: #409eff;
}

.upload-content {
  color: #666;
}

.upload-icon svg {
  width: 48px;
  height: 48px;
  fill: #ccc;
  margin-bottom: 10px;
}

.preview-card {
  position: relative;
  display: inline-block;
  margin-top: 10px;
}

.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.preview-actions {
  position: absolute;
  top: 5px;
  right: 5px;
}

.action-btn-image {
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.action-btn-image svg {
  width: 16px;
  height: 16px;
  fill: white;
}
</style>