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
                    <button class="btn add-btn" @click="showAddDialog">新增用户</button>
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
                                <td>{{ card.username }}</td>
                                <td>{{ card.collectionname }}</td>
                                <td>
                                    <img :src="card.image" alt="美食图片" style="width: 35px; height: 35px;"
                                        @click="triggerFileInput(card)" />
                                </td>
                                <td>{{ card.price }}</td>
                                <td>{{ card.location }}</td>
                                <td>{{ card.profile }}</td>
                                <td>{{ card.characteristics }}</td>
                                <td>{{ card.score }}</td>
                                <td>{{ card.collection }}</td>
                                <td>{{ card.sales }}</td>
                                <td>{{ card.classification }}</td>
                                <td>{{ formatDate(card.createTime) }}</td>
                                <td>{{ formatDate(card.updateTime) }}</td>
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
                                <label>用户名:</label>
                                <input v-model="formData.username" required />
                            </div>
                            <div class="form-group">
                                <label>笔记内容:</label>
                                <input v-model="formData.collectionname" required />
                            </div>

                            <div class="form-group">
                                <label>价格:</label>
                                <input v-model="formData.price" required />
                            </div>
                            <div class="form-group">
                                <label>收藏地点:</label>
                                <input v-model="formData.location" required />
                            </div>
                            <div class="form-group">
                                <label>收藏简介:</label>
                                <input v-model="formData.profile" required />
                            </div>
                            <div class="form-group">
                                <label>收藏特点:</label>
                                <input v-model="formData.characteristics" required />
                            </div>
                            <div class="form-group">
                                <label>评分:</label>
                                <input v-model="formData.score" required />
                            </div>
                            <div class="form-group">
                                <label>收藏数量:</label>
                                <input v-model="formData.collection" required />
                            </div>
                            <div class="form-group">
                                <label>销量:</label>
                                <input v-model="formData.sales" required />
                            </div>
                            <div class="form-group">
                                <label>分类:</label>
                                <input v-model="formData.classification" required />
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
    { key: 'id', title: '收藏ID' },
    { key: 'username', title: '用户名' },
    { key: 'collectionname', title: '收藏名称' },
    { key: 'image', title: '封面图' },
    { key: 'price', title: '价格' },
    { key: 'location', title: '收藏地点' },
    { key: 'profile', title: '收藏简介' },
    { key: 'characteristics', title: '收藏特点' },
    { key: 'score', title: '评分' },
    { key: 'collection', title: '收藏数量' },
    { key: 'sales', title: '销量' },
    { key: 'classification', title: '分类' },
    { key: 'createdTime', title: '创建时间' },
    { key: 'updatedTime', title: '更新时间' },
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
    username: '',
    collectionname: '',
    image: '',
    price: '',
    location: '',
    profile: '',
    characteristics: '',
    score: '',
    collection: '',
    sales: '',
    classification: '',
    createdTime: '',
    updatedTime: '',
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
        const response = await request.get('/api/public/travel-collections/search', { params });
        cards.value = response.data.list.map(card => ({
            ...card,
            images: typeof card.images === 'string' ? JSON.parse(card.images) : card.images
        }));
        console.log(cards.value, "数据");
        total.value = response.data.total;
    } catch (error) {
        console.error('获取笔记数据失败:', error);
    }
};

// 显示新增对话框
const showAddDialog = () => {
    isEditing.value = false;
    formData.value = {
        id: '',
        username: '',
        collectionname: '',
        image: '',
        price: '',
        location: '',
        profile: '',
        characteristics: '',
        score: '',
        collection: '',
        sales: '',
        classification: '',
        createdTime: '',
        updatedTime: '',
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
            formData.value.updatedTime = new Date().toISOString();
            await request.put(`/api/public/travel-collections/${formData.value.id}`, formData.value);
            showToastMessage('更新笔记成功');
        } else {
            formData.value.createdTime = new Date().toISOString();
            await request.post('/api/public/travel-collections', formData.value);
            showToastMessage('新增笔记成功');
        }
        await fetchScenic();
        closeDialog();
    } catch (error) {
        const message = isEditing.value ? '更新笔记失败' : '新增笔记失败';
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
            await request.delete(`/api/public/travel-collections/${deleteCardId.value}`);
            await fetchScenic();
            closeDeletePrompt();
            showToastMessage('删除笔记成功');
            console.log(deleteCardId.value, "删除成功");
        } catch (error) {
            console.error('删除失败:', error);
            showToastMessage('删除笔记失败', 'error');
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
            formData.value.image = file;
        }
    };
    fileInput.click();
};

onMounted(fetchScenic);


</script>

<style scoped>
@import '@/css/Management/BackgroundManagement.css';
</style>