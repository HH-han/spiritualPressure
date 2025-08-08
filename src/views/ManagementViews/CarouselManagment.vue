<template>
    <div class="management-page-background">
        <div class="container-008">
            <!-- 操作栏 -->
            <div class="action-bar">
                <div class="search-bar">
                    <div class="search-box-008">
                        <input type="text" v-model="searchKeyword" placeholder="输入卡片ID或标题搜索" class="search-input-008" />
                    </div>
                    <button class="btn search-btn" @click="handleSearch">搜索</button>
                    <button class="btn delete-btn" @click="handleReset">批量删除</button>
                </div>
                <button class="btn add-btn" @click="showAddDialog">新增轮播</button>
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
                                    <input type="checkbox" :checked="card.checked" @change="handleCheck(card)"
                                        class="ui-checkbox" />
                                </td>
                                <td>{{ card.id }}</td>
                                <td>{{ card.title }}</td>
                                <td>
                                    <img :src="card.image" alt="图片" style="width: 35px; height: 35px;"
                                        @click="triggerFileInput(card)" />
                                </td>
                                <td>{{ card.description.substring(0, 25) }}...</td>
                                <td>{{ card.location.substring(0, 35) }}...</td>
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
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <!-- 新增/编辑弹窗 -->
            <div v-if="showDialog" class="dialog-overlay" @click.self="closeDialog">
                <div class="dialog" @click.stop>
                    <h2>{{ isEditing ? '编辑笔记' : '新增笔记' }}</h2>
                    <form @submit.prevent="submitForm" class="form-container">
                        <div class="form-row">
                            <div class="form-group">
                                <label>轮播图片:</label>
                                <input type="file" @change="handleFileUpload" class="file-upload-input"
                                    ref="fileInput" />
                                <!-- 自定义的按钮 -->
                                <button class="file-upload-button" @click="triggerFileInput">
                                    选择文件
                                </button>
                                <div v-if="formData.image" class="image-preview-container">
                                    <img :src="formData.image" alt="图片预览" class="image-preview" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label>轮播标题:</label>
                                <input v-model="formData.title" required />
                            </div>
                            <div class="form-group">
                                <label>轮播内容:</label>
                                <input v-model="formData.description" required />
                            </div>
                            <div class="form-group">
                                <label>轮播地点:</label>
                                <input v-model="formData.location" required />
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
    { key: 'id', title: '轮播ID' },
    { key: 'title', title: '轮播标题' },
    { key: 'image', title: '轮播图片' },
    { key: 'description', title: '轮播简介' },
    { key: 'location', title: '轮播地点' },
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
    id: '',
    title: '',
    description: '',
    image: '',
    location: '',
    createdAt: '',
    updatedAt: '',
});

// 格式化日期显示
const formatDate = (date) => {
    if (!date || isNaN(new Date(date))) return '未知日期';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('zh-CN', options).format(new Date(date));
};

// 搜索功能
const filteredCards = computed(() => {
    const keyword = searchKeyword.value.toLowerCase();
    return cards.value.filter(
        (card) =>
            String(card.id).includes(keyword) ||
            card.title.toLowerCase().includes(keyword)
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
    fetchScenic();
};

const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    fetchScenic();
};
// 获取数据
const fetchScenic = async () => {
    try {
        const params = {
            page: currentPage.value,
            pageSize: pageSize.value,
            keyword: searchKeyword.value
        };
        const response = await request.get('/api/public/travelcarousel', { params });
        cards.value = response.data.list;
        total.value = response.data.total;
    } catch (error) {
        console.error('获取数据失败:', error);
    }
};

// 显示新增对话框
const showAddDialog = () => {
    isEditing.value = false;
    formData.value = {
        id: '',
        title: '',
        description: '',
        image: '',
        location: '',
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
        // 自动设置时间
        if (isEditing.value) {
            formData.value.updatedAt = new Date().toISOString();
            await request.put(`/api/public/travelcarousel/${formData.value.id}`, formData.value);
            showToastMessage('更新成功');
        } else {
            formData.value.createdAt = new Date().toISOString();
            await request.post('/api/public/travelcarousel', formData.value);
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
            await request.delete(`/api/public/travelcarousel/${deleteCardId.value}`);
            await fetchScenic();
            closeDeletePrompt();
            showToastMessage('删除成功');
        } catch (error) {
            console.error('删除失败:', error);
            showToastMessage('删除失败', 'error');

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
// 定义一个 ref 来引用文件输入框
const fileInput = ref(null);
// 触发文件输入框
const triggerFileInput = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = (event) => handleFileUpload(event);
    fileInput.click();
};

onMounted(fetchScenic);


</script>

<style scoped>
@import '@/css/Management/BackgroundManagement.css';
</style>