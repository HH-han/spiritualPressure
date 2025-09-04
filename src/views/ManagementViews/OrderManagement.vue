<template>
  <div class="management-page-background">
    <div class="container-management">
      <!-- 操作栏 -->
      <div class="action-bar">
        <div class="search-bar">
          <div class="search-box-management">
            <input type="text" v-model="searchKeyword" placeholder="输入卡片ID或标题搜索" class="search-input-management" />

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
              <tr v-for="card in filteredCards" :key="card.id">
                <td>
                  <input type="checkbox" :checked="card.checked" @change="handleCheck(card)" class="ui-checkbox" />
                </td>
                <td>{{ card.id }}</td>
                <td>{{ card.username }}</td>
                <td>{{ card.itemName }}</td>
                <td>{{ card.orderId }}</td>
                <td>{{ card.amount }}</td>
                <td>{{ card.status }}</td>
                <td>{{ card.paymentMethod && card.paymentMethod.length ? card.paymentMethod : '未支付'}}</td>
                <td>{{ formatDate(card.createdAt) }}</td>
                <td>{{ formatDate(card.updatedAt) }}</td>
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
          <h2>{{ isEditing ? '编辑订单' : '新增订单' }}</h2>
          <form @submit.prevent="submitForm" class="form-container">
            <div class="form-row">
              <div class="form-group">
                <label>用户名:</label>
                <input v-model="formData.username" required />
              </div>
              <div class="form-group">
                <label>订单标题:</label>
                <input v-model="formData.itemName" required />
              </div>
              <div class="form-group">
                <label>订单编号:</label>
                <input v-model="formData.orderId" required />
              </div>
              <div class="form-group">
                <label>价格:</label>
                <input v-model="formData.amount" type="number" required />
              </div>
            </div>
            <!-- 创建修改时间 -->
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

</template>

<script setup>

import { ref, computed, onMounted } from 'vue';
import request from '@/utils/request';
import DeleteConfirmation from '@/components/PromptComponent/DeleteConfirmation.vue';
import ToastType from '@/components/PromptComponent/ToastType.vue';

const columns = [
  { key: 'checked', title: '多选' },
  { key: 'id', title: '订单ID' },
  { key: 'username', title: '用户名' },
  { key: 'itemName', title: '订单标题' },
  { key: 'orderId', title: '订单编号' },
  { key: 'amount', title: '价格' },
  { key: 'status', title: '订单状态' },
  { key: 'paymentMethod', title: '支付方式' },
  { key: 'createdAt', title: '创建时间' },
  { key: 'updatedAt', title: '更新时间' },
];
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');
const cards = ref([]);
const searchKeyword = ref('');
const showDialog = ref(false);
const isEditing = ref(false);
const formData = ref({
  id: null,
  title: '',
  subtitle: '',
  image: '',
  price: '',
  createdAt: '',
  updatedAt: '',
});

// 格式化日期显示
const formatDate = (date) => {
  if (!date) return '未知日期';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('zh-CN', options).format(new Date(date));
};

// 搜索功能
const filteredCards = computed(() => {
  const keyword = searchKeyword.value.toLowerCase();
  return Array.isArray(cards.value)
    ? cards.value.filter(
      (card) =>
        String(card.id).includes(keyword) ||
        card.title.toLowerCase().includes(keyword)
    )
    : [];
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
  fetchScenic();
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  fetchScenic();
};
// 获取订单数据
const fetchScenic = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    };
    const response = await request.get('/api/public/payment/all', { params });
    cards.value = Array.isArray(response.data?.list) ? response.data.list : [];
    total.value = response.data?.total || 0;
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
    subtitle: '',
    image: '',
    price: '',
    createdAt: '',
    updatedAt: '',
  };
  showDialog.value = true;
};

// 显示编辑对话框
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
      await request.put(`/api/public/payment/${formData.value.id}`, formData.value);
      showToastMessage('更新订单成功');
    } else {
      await request.post('/api/public/payment', formData.value);
      showToastMessage('新增订单成功');
    }
    await fetchScenic();
    closeDialog();
  } catch (error) {
    const message = isEditing.value ? '更新订单失败' : '新增订单失败';
    showToastMessage(message, 'error');
    console.error('操作失败:', error);
  }
};

// 删除卡片
const isDeletePromptVisible = ref(false);
const deleteCardId = ref(null);

const handleDelete = (id) => {
  deleteCardId.value = id;
  isDeletePromptVisible.value = true;
};

const closeDeletePrompt = () => {
  isDeletePromptVisible.value = false;
  deleteCardId.value = null;
};
//删除
const confirmDelete = async () => {
  if (deleteCardId.value) {
    try {
      await request.delete(`/api/public/payment/${deleteCardId.value}`);
      await fetchScenic();
      closeDeletePrompt();
      showToastMessage('删除订单成功');
    } catch (error) {
      console.error('删除失败:', error);
      showToastMessage('删除订单失败', 'error');

    } finally {
      closeDeletePrompt();
    }
  }
};

// 关闭对话框
const closeDialog = () => {
  showDialog.value = false;
};
onMounted(fetchScenic);


</script>

<style scoped>
@import '@/css/Management/BackgroundManagement.css';
</style>