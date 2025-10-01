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
              <input type="text" v-model="searchKeyword" placeholder="输入推荐名称搜索" class="search-input-management" />
            </div>
            <button class="btn search-btn" @click="handleSearch">搜索</button>
            <button class="btn delete-btn" @click="handleBatchDelete">批量删除</button>
          </div>
          <button class="btn add-btn" @click="showAddDialog">新增推荐</button>
          <button class="btn batch-add-btn" @click="showBatchAddDialog">批量新增</button>
        </div>

        <!-- 数据表格 -->
        <div class="data-table-container">
          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th><input type="checkbox" v-model="selectAll" @change="handleSelectAll" /></th>
                  <th>ID</th>
                  <th>推荐名称</th>
                  <th>月份</th>
                  <th>标签</th>
                  <th>排序</th>
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
                  <td>{{ item.monthName || item.month?.monthName || '' }}</td>
                  <td>{{ formatTags(item.tags) }}</td>
                  <td>{{ item.sortOrder || 0 }}</td>
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
                  <td colspan="10" class="no-data">未找到相关数据</td>
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
          <div class="dialog" @click.stop style="max-width: 800px;">
            <h2>{{ isEditing ? '编辑推荐' : '新增推荐' }}</h2>
            <form @submit.prevent="submitForm" class="form-container">
              <div class="form-row">
                <div class="form-group">
                  <label>推荐名称:</label>
                  <input v-model="formData.name" required />
                </div>
                <div class="form-group">
                  <label>月份:</label>
                  <select v-model="formData.monthId" required>
                    <option value="">请选择月份</option>
                    <option v-for="month in months" :key="month.id" :value="month.id">{{ month.monthName }}</option>
                  </select>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>标签:</label>
                  <input v-model="formData.tags" placeholder="多个标签用逗号分隔" />
                </div>
                <div class="form-group">
                  <label>排序:</label>
                  <input v-model="formData.sortOrder" type="number" min="0" />
                </div>
              </div>

              <div class="form-group">
                <label>描述:</label>
                <textarea v-model="formData.description" placeholder="推荐描述" maxlength="500"></textarea>
              </div>

              <div class="form-group">
                <label>图片URL:</label>
                <input v-model="formData.imageUrl" placeholder="图片链接地址" />
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

        <!-- 批量新增弹窗 -->
        <div v-if="showBatchDialog" class="dialog-overlay" @click.self="closeBatchDialog">
          <div class="dialog" @click.stop style="max-width: 600px;">
            <h2>批量新增推荐</h2>
            <form @submit.prevent="submitBatchForm" class="form-container">
              <div class="form-group">
                <label>推荐数据 (JSON格式):</label>
                <textarea v-model="batchData" placeholder="请输入JSON格式的推荐数据数组" rows="10" style="font-family: monospace;"></textarea>
                <div class="form-hint">
                  示例格式: [{"name": "冰雪大世界", "monthId": 1, "description": "冬季旅游推荐"}]
                </div>
              </div>

              <!-- 提交按钮 -->
              <div class="dialog-buttons">
                <button type="button" class="btn cancel-btn" @click="closeBatchDialog">取消</button>
                <button type="submit" class="btn confirm-btn">批量创建</button>
              </div>
            </form>
          </div>
        </div>

        <!-- 详情弹窗 -->
        <div v-if="showDetailsDialog" class="dialog-overlay" @click.self="closeDetailsDialog">
          <div class="dialog" @click.stop style="max-width: 700px;">
            <h2>推荐详情</h2>
            <div class="details-container">
              <div class="detail-section">
                <h3>基本信息</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <label>ID:</label>
                    <span>{{ selectedItem.id }}</span>
                  </div>
                  <div class="detail-item">
                    <label>推荐名称:</label>
                    <span>{{ selectedItem.name }}</span>
                  </div>
                  <div class="detail-item">
                    <label>月份:</label>
                    <span>{{ selectedItem.monthName || selectedItem.month?.monthName || '' }}</span>
                  </div>
                  <div class="detail-item">
                    <label>排序:</label>
                    <span>{{ selectedItem.sortOrder || 0 }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h3>详细信息</h3>
                <div class="detail-item full-width">
                  <label>描述:</label>
                  <span>{{ selectedItem.description }}</span>
                </div>
                <div class="detail-item full-width">
                  <label>标签:</label>
                  <span>{{ formatTags(selectedItem.tags) }}</span>
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

              <div v-if="selectedItem.imageUrl" class="detail-section">
                <h3>推荐图片</h3>
                <div class="image-preview">
                  <img :src="selectedItem.imageUrl" :alt="selectedItem.name" />
                </div>
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
  getTravelRecommendations,
  createTravelRecommendation,
  updateTravelRecommendation,
  deleteTravelRecommendation,
  batchCreateTravelRecommendations
} from '@/api/destination';
import DeleteConfirmation from '@/components/PromptComponent/DeleteConfirmation.vue';
import ToastType from '@/components/PromptComponent/ToastType.vue';

// 数据相关
const items = ref([]);
const loading = ref(true);
const searchKeyword = ref('');
const showDialog = ref(false);
const showBatchDialog = ref(false);
const showDetailsDialog = ref(false);
const isEditing = ref(false);
const selectedItem = ref({});
const formData = ref({
  id: null,
  name: '',
  monthId: '',
  description: '',
  imageUrl: '',
  tags: '',
  sortOrder: 0,
  status: 'active'
});
const batchData = ref('');

// 月份数据
const months = ref([
  { id: 1, monthName: '一月' },
  { id: 2, monthName: '二月' },
  { id: 3, monthName: '三月' },
  { id: 4, monthName: '四月' },
  { id: 5, monthName: '五月' },
  { id: 6, monthName: '六月' },
  { id: 7, monthName: '七月' },
  { id: 8, monthName: '八月' },
  { id: 9, monthName: '九月' },
  { id: 10, monthName: '十月' },
  { id: 11, monthName: '十一月' },
  { id: 12, monthName: '十二月' }
]);

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

// 全选相关
const selectAll = ref(false);

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('zh-CN');
};

// 格式化标签
const formatTags = (tags) => {
  if (!tags) return '';
  try {
    if (typeof tags === 'string') {
      const parsedTags = JSON.parse(tags);
      if (Array.isArray(parsedTags)) {
        return parsedTags.join(', ');
      }
    }
    return tags;
  } catch (error) {
    return tags;
  }
};

// 搜索功能
const filteredItems = computed(() => {
  if (!items.value) return [];
  const keyword = searchKeyword.value.toLowerCase();
  return items.value.filter(item => 
    item.name.toLowerCase().includes(keyword) ||
    (item.description && item.description.toLowerCase().includes(keyword)) ||
    (item.tags && formatTags(item.tags).toLowerCase().includes(keyword))
  );
});

// 获取数据
const fetchItems = async () => {
  try {
    loading.value = true;
    const response = await getTravelRecommendations();
    
    if (response.code === "0") {
      // 转换后端数据为前端格式
      items.value = (response.data || []).map(item => ({
        id: item.id,
        name: item.name,
        monthName: item.month?.monthName || '',
        month: item.month,
        description: item.description,
        imageUrl: item.imageUrl,
        tags: item.tags,
        sortOrder: item.sortOrder || 0,
        status: item.status || 'active',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
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
    monthId: '',
    description: '',
    imageUrl: '',
    tags: '',
    sortOrder: 0,
    status: 'active'
  };
  showDialog.value = true;
};

// 显示批量新增对话框
const showBatchAddDialog = () => {
  batchData.value = '';
  showBatchDialog.value = true;
};

// 关闭批量新增对话框
const closeBatchDialog = () => {
  showBatchDialog.value = false;
  batchData.value = '';
};

// 显示编辑对话框
const showEditDialog = (item) => {
  isEditing.value = true;
  formData.value = { 
    id: item.id,
    name: item.name,
    monthId: item.month?.id || '',
    description: item.description,
    imageUrl: item.imageUrl,
    tags: formatTags(item.tags),
    sortOrder: item.sortOrder || 0,
    status: item.status || 'active'
  };
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
      name: formData.value.name,
      monthId: formData.value.monthId,
      description: formData.value.description,
      imageUrl: formData.value.imageUrl,
      tags: formData.value.tags ? JSON.stringify(formData.value.tags.split(',').map(tag => tag.trim())) : '[]',
      sortOrder: formData.value.sortOrder || 0,
      status: formData.value.status || 'active'
    };
    
    if (isEditing.value) {
      data.id = formData.value.id;
      await updateTravelRecommendation(data);
      showToastMessage('更新推荐成功');
    } else {
      await createTravelRecommendation(data);
      showToastMessage('新增推荐成功');
    }
    
    await fetchItems();
    closeDialog();
  } catch (error) {
    const message = isEditing.value ? '更新推荐失败' : '新增推荐失败';
    showToastMessage(message, 'error');
    console.error('操作失败:', error);
  }
};

// 提交批量表单
const submitBatchForm = async () => {
  try {
    if (!batchData.value.trim()) {
      showToastMessage('请输入要批量新增的推荐数据', 'warning');
      return;
    }

    let recommendationsData;
    try {
      recommendationsData = JSON.parse(batchData.value);
    } catch (error) {
      showToastMessage('JSON格式错误，请检查输入数据', 'error');
      return;
    }

    if (!Array.isArray(recommendationsData)) {
      showToastMessage('请输入数组格式的数据', 'error');
      return;
    }

    // 转换批量数据格式
    const batchDataToSubmit = recommendationsData.map(item => ({
      name: item.name,
      monthId: item.monthId,
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      tags: item.tags ? JSON.stringify(item.tags.split(',').map(tag => tag.trim())) : '[]',
      sortOrder: item.sortOrder || 0,
      status: item.status || 'active'
    }));

    await batchCreateTravelRecommendations(batchDataToSubmit);
    showToastMessage(`批量新增 ${recommendationsData.length} 个推荐成功`);
    
    await fetchItems();
    closeBatchDialog();
  } catch (error) {
    showToastMessage('批量新增推荐失败', 'error');
    console.error('批量操作失败:', error);
  }
};

// 关闭对话框
const closeDialog = () => {
  showDialog.value = false;
  formData.value = {
    id: null,
    name: '',
    monthId: '',
    description: '',
    imageUrl: '',
    tags: '',
    sortOrder: 0,
    status: 'active'
  };
};

// 删除项目
const handleDelete = (id) => {
  deleteItemId.value = id;
  isDeletePromptVisible.value = true;
};

const confirmDelete = async () => {
  if (deleteItemId.value) {
    try {
      await deleteTravelRecommendation(deleteItemId.value);
      await fetchItems();
      showToastMessage('删除推荐成功');
    } catch (error) {
      console.error('删除失败:', error);
      showToastMessage('删除推荐失败', 'error');
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
  
  if (confirm(`确定要删除选中的 ${selectedItems.length} 个推荐吗？`)) {
    // 实现批量删除逻辑
    selectedItems.forEach(async (item) => {
      try {
        await deleteTravelRecommendation(item.id);
      } catch (error) {
        console.error(`删除推荐 ${item.id} 失败:`, error);
      }
    });
    
    setTimeout(() => {
      fetchItems();
      showToastMessage(`成功删除 ${selectedItems.length} 个推荐`);
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
  max-height: 500px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section h3 {
  margin-bottom: 15px;
  color: #1890ff;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  font-weight: bold;
  min-width: 100px;
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

.form-hint {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.image-preview {
  max-width: 300px;
  max-height: 200px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.batch-add-btn {
  background-color: #52c41a;
  color: white;
}

.batch-add-btn:hover {
  background-color: #389e0d;
}
</style>