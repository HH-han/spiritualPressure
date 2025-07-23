<template>
  <div class="management-page-background">
    <div class="container-008">
      <!-- 操作栏 -->
      <div class="action-bar">
        <div class="search-bar">
          <div class="search-box-008">
            <input type="text" v-model="searchKeyword" placeholder="输入推荐标题或内容搜索" class="search-input-008" />

          </div>
          <button class="btn search-btn" @click="handleSearch">搜索</button>
          <button class="btn delete-btn" @click="handleReset">批量删除</button>
        </div>

        <button class="btn add-btn" @click="showAddDialog">推荐商品</button>
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
              <tr v-for="item in filteredItems" :key="item.id">
                <td>
                  <input type="checkbox" :checked="item.checked" @change="handleCheck(item)" class="ui-checkbox" />
                </td>
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
                <td>
                  <img :src="item.coverImage" alt="封面图片" style="width: 35px; height: 35px;"
                    @click="triggerFileInput(item)">
                </td>
                <td>{{ item.content }}</td>
                <td>{{ item.location }}</td>
                <td>￥{{ item.price }}</td>
                <td>❤️{{ item.likes }}</td>
                <td>{{ item.favorites }}</td>
                <td>{{ item.views }}</td>
                <td>{{ item.status }}</td>
                <td>{{ formatDate(item.created_at) }}</td>
                <td>{{ formatDate(item.updated_at) }}</td>
                <td class="table-btn-display">
                  <button class="btn edit-btn" @click="showEditDialog(item)">编辑</button>
                  <button class="btn delete-btn" @click="handleDelete(item.id)">删除</button>
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
          <h2>{{ isEditing ? '编辑推荐' : '新增推荐' }}</h2>
          <form @submit.prevent="submitForm" class="form-container">
            <div class="form-row">
              <div class="form-group">
                <label>封面图片:</label>
                <input type="file" @change="handleFileUpload" class="file-upload-input" ref="fileInput" />
                <!-- 自定义的按钮 -->
                <button class="file-upload-button" @click="triggerFileInput">
                  选择文件
                </button>
                <div v-if="formData.coverImage" class="image-preview-container">
                  <img :src="formData.coverImage" alt="图片预览" class="image-preview" />
                </div>
              </div>
              <div class="form-group">
                <label>推荐标题:</label>
                <input v-model="formData.title" required />
              </div>
              <div class="form-group">
                <label>推荐内容:</label>
                <input v-model="formData.content" required />
              </div>
              <div class="form-group">
                <label>推荐位置:</label>
                <input v-model="formData.location" required />
              </div>
              <div class="form-group">
                <label>价格:</label>
                <input v-model="formData.price" required />
              </div>
              <div class="form-group">
                <label>点赞数:</label>
                <input v-model="formData.likes" required />
              </div>
              <div class="form-group">
                <label>收藏数:</label>
                <input v-model="formData.favorites" required />
              </div>
              <div class="form-group">
                <label>创建时间:</label>
                <input type="datetime-local" v-model="formData.createdAt" required />
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
  { key: 'title', title: '标题' },
  { key: 'coverImage', title: '封面图片' },
  { key: 'content', title: '内容' },
  { key: 'location', title: '位置' },
  { key: 'price', title: '价格' },
  { key: 'likes', title: '点赞数' },
  { key: 'favorites', title: '收藏数' },
  { key: 'views', title: '浏览数' },
  { key: 'status', title: '状态' },
  { key: 'createdAt', title: '创建时间' },
  { key: 'updatedAt', title: '更新时间' },
];
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');
const items = ref([]);
const searchKeyword = ref('');
const showDialog = ref(false);
const isEditing = ref(false);
const formData = ref({
  id: null,
  title: '',
  content: '',
  location: '',
  coverImage: '',
  likes: 0,
  price: '',
  favorites: 0,
  createdAt: '',
});

// 格式化日期显示
const formatDate = (date) => {
  if (!date) return '未知日期';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('zh-CN', options).format(new Date(date));
};

// 搜索功能
const filteredItems = computed(() => {
  const keyword = searchKeyword.value.toLowerCase();
  return items.value.filter(
    (item) =>
      String(item.id).includes(keyword) ||
      item.title.toLowerCase().includes(keyword) ||
      item.content.toLowerCase().includes(keyword)
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
  fetchItems();
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  fetchItems();
};
// 获取订单数据
const fetchItems = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    };
    const response = await request.get('/api/public/blogs', { params });
    items.value = response.data.list;
    total.value = response.data.total;
  } catch (error) {
    console.error('获取订单数据失败:', error);
  }
};

// 显示新增对话框
const showAddDialog = () => {
  isEditing.value = false;
  formData.value = {
    id: null,
    title: '',
    content: '',
    location: '',
    coverImage: '',
    likes: 0,
    price: '',
    favorites: 0,
    createdAt: '',
  };
  showDialog.value = true;
};

// 显示编辑对话框
const showEditDialog = (item) => {
  isEditing.value = true;
  formData.value = { ...item };
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
      await request.put(`/api/public/blogs/${formData.value.id}`, formData.value);
      showToastMessage('更新推荐成功');
    } else {
      // 新增时自动设置创建时间为当前时间
      formData.value.createdAt = new Date().toISOString();
      await request.post('/api/public/blogs', formData.value);
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

// 删除商品
const isDeletePromptVisible = ref(false);
const deleteItemId = ref(null);

const handleDelete = (id) => {
  deleteItemId.value = id;
  isDeletePromptVisible.value = true;
};

const closeDeletePrompt = () => {
  isDeletePromptVisible.value = false;
  deleteItemId.value = null;
};
//删除
const confirmDelete = async () => {
  if (deleteItemId.value) {
    try {
      await request.delete(`/api/public/blogs/${deleteItemId.value}`);
      await fetchItems();
      showToastMessage('删除推荐成功');
    } catch (error) {
      console.error('删除失败:', error);
      showToastMessage('删除推荐失败', 'error');
      console.error('删除失败:', error.response?.data || error.message);
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
      formData.value.coverImage = e.target.result;
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

onMounted(fetchItems);
</script>

<style scoped>
@import '@/css/Management/BackgroundManagement.css';
</style>