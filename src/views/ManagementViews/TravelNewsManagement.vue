<template>
    <div class="management-page-background">
        <div class="container-management">
            <!-- 操作栏 -->
            <div class="action-bar">
                <div class="search-bar">
                    <div class="search-box-management">
                        <input type="text" v-model="searchKeyword" placeholder="输入卡片ID或标题搜索"
                            class="search-input-management" />
                    </div>
                    <button class="btn search-btn" @click="handleSearch">搜索</button>
                    <button class="btn delete-btn" @click="handleReset">批量删除</button>
                </div>
                <div class="operate-bar">
                    <button class="btn import-btn" @click="handleImport">Excel数据导入导出</button>
                    <button class="btn add-btn" @click="showAddDialog">新增新闻</button>
                </div>
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
                                    <img :src="card.coverImage" alt="封面图片" class="cover-image" />
                                </td>
                                <td>{{ card.content.substring(0, 15) }}...</td>
                                <td>{{ card.location }}</td>
                                <td>{{ formatDate(card.created_at) }}</td>
                                <td>{{ formatDate(card.updated_at) }}</td>
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
                    <h2>{{ isEditing ? '编辑新闻' : '新增新闻' }}</h2>
                    <form @submit.prevent="submitForm" class="form-container">
                        <div class="form-group">
                            <div class="image-upload-container">
                                <div class="upload-header">
                                    <h3>上传图片</h3>
                                    <p>支持 JPG, PNG 格式，最大 5MB</p>
                                </div>

                                <div class="upload-area" @click="triggerFileInput" @dragover.prevent="dragOver = true"
                                    @dragleave="dragOver = false" @drop.prevent="handleDrop"
                                    :class="{ 'drag-active': dragOver }">
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
                        <div class="form-row">
                            <div class="form-group">
                                <label>新闻标题:</label>
                                <input v-model="formData.title" required />
                            </div>
                            <div class="form-group">
                                <label>新闻内容:</label>
                                <input v-model="formData.content" required />
                            </div>
                            <div class="form-group">
                                <label>地点:</label>
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
    { key: 'id', title: 'ID' },
    { key: 'title', title: '标题' },
    { key: 'coverImage', title: '图片' },
    { key: 'content', title: '内容' },
    { key: 'location', title: '地点' },
    { key: 'created_at', title: '创建时间' },
    { key: 'updated_at', title: '更新时间' },
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
    content: '',
    coverImage: '',
    location: '',
    created_at: '',
    updated_at: '',
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
        const response = await request.get('/api/public/news', { params });
        cards.value = response.data.list.map(card => ({
            ...card,
            images: typeof card.images === 'string' ? JSON.parse(card.images) : card.images
        }));
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
        content: '',
        coverImage: '',
        location: '',
        created_at: '',
        updated_at: '',
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
            formData.value.updated_at = new Date().toISOString();
            await request.put(`/api/public/news/${formData.value.id}`, formData.value);
            showToastMessage('更新成功');
        } else {
            formData.value.created_at = new Date().toISOString();
            await request.post('/api/public/news', formData.value);
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
            await request.delete(`/api/public/news/${deleteCardId.value}`);
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
        formData.value.coverImage = e.target.result;
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
    formData.value.coverImage = '';
};

// 触发文件输入框
const triggerFileInput = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event) => {
        const file = handleFileUpload(event);
        if (file) {
            formData.value.coverImage = file;
        }
    };
    fileInput.click();
};

onMounted(fetchScenic);


</script>

<style scoped>
@import '@/css/Management/BackgroundManagement.css';
</style>