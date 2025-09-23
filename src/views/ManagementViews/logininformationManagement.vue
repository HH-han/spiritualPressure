<template>
    <div class="management-page-background">
        <div class="container-management">
            <!-- 操作栏 -->
            <div class="action-bar">
                <div class="search-bar">
                    <div class="search-box-management">
                        <input type="text" v-model="searchKeyword" placeholder="输入用户名或IP地址搜索"
                            class="search-input-management" />
                    </div>
                    <button class="btn search-btn" @click="handleSearch">搜索</button>
                    <button class="btn delete-btn" @click="handleReset">批量删除</button>
                </div>
                <div class="operate-bar">
                    <button class="btn import-btn" @click="handleImport">Excel数据导入导出</button>
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
                            <tr v-for="loginInfo in filteredLoginInfos" :key="loginInfo.id">
                                <td>
                                    <input type="checkbox" :checked="loginInfo.checked" @change="handleCheck(loginInfo)"
                                        class="ui-checkbox" />
                                </td>
                                <td>{{ loginInfo.id }}</td>
                                <td>{{ loginInfo.userId }}</td>
                                <td>{{ loginInfo.username }}</td>
                                <td>{{ loginInfo.ipaddr }}</td>
                                <td>{{ loginInfo.login_location || '未知' }}</td>
                                <td>{{ loginInfo.browser || '未知' }}</td>
                                <td>{{ loginInfo.os || '未知' }}</td>
                                <td>
                                    <span :class="['status-badge', getStatusInfo(loginInfo.status).class]">
                                        {{ getStatusInfo(loginInfo.status).text }}
                                    </span>
                                </td>
                                <td>{{ loginInfo.msg || '无' }}</td>
                                <td>{{ formatDateTime(loginInfo.loginTime) }}</td>
                                <td class="table-btn-display">
                                    <button class="btn details-btn" @click="openDetailsDialog(loginInfo)">详情</button>
                                    <button class="btn delete-btn" @click="handleDelete(loginInfo.id)">删除</button>
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
            <!-- 详情查看弹窗 -->
            <div v-if="showDetailsDialog" class="dialog-overlay" @click.self="closeDetailsDialog">
                <div class="dialog" @click.stop>
                    <h2>登录信息详情</h2>
                    <div class="details-container">
                        <div class="detail-item">
                            <label>登录ID:</label>
                            <span>{{ currentLoginInfo?.id }}</span>
                        </div>
                        <div class="detail-item">
                            <label>用户ID:</label>
                            <span>{{ currentLoginInfo?.user_id }}</span>
                        </div>
                        <div class="detail-item">
                            <label>用户名:</label>
                            <span>{{ currentLoginInfo?.username }}</span>
                        </div>
                        <div class="detail-item">
                            <label>IP地址:</label>
                            <span>{{ currentLoginInfo?.ipaddr }}</span>
                        </div>
                        <div class="detail-item">
                            <label>登录地点:</label>
                            <span>{{ currentLoginInfo?.login_location || '未知' }}</span>
                        </div>
                        <div class="detail-item">
                            <label>浏览器:</label>
                            <span>{{ currentLoginInfo?.browser || '未知' }}</span>
                        </div>
                        <div class="detail-item">
                            <label>操作系统:</label>
                            <span>{{ currentLoginInfo?.os || '未知' }}</span>
                        </div>
                        <div class="detail-item">
                            <label>登录状态:</label>
                            <span :class="['status-badge', getStatusInfo(currentLoginInfo?.status).class]">
                                {{ getStatusInfo(currentLoginInfo?.status).text }}
                            </span>
                        </div>
                        <div class="detail-item">
                            <label>提示消息:</label>
                            <span>{{ currentLoginInfo?.msg || '无' }}</span>
                        </div>
                        <div class="detail-item">
                            <label>登录时间:</label>
                            <span>{{ formatDateTime(currentLoginInfo?.login_time) }}</span>
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
</template>

<script setup>

import { ref, computed, onMounted } from 'vue';
import request from '@/utils/request';
import DeleteConfirmation from '@/components/PromptComponent/DeleteConfirmation.vue';
import ToastType from '@/components/PromptComponent/ToastType.vue';

const columns = [
    { key: 'checked', title: '多选' },
    { key: 'id', title: '登录ID' },
    { key: 'userId', title: '用户ID' },
    { key: 'username', title: '用户名' },
    { key: 'ipaddr', title: 'IP地址' },
    { key: 'login_location', title: '登录地点' },
    { key: 'browser', title: '浏览器' },
    { key: 'os', title: '操作系统' },
    { key: 'status', title: '登录状态' },
    { key: 'msg', title: '提示消息' },
    { key: 'loginTime', title: '登录时间' },
];
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');
const loginInfos = ref([]);
const searchKeyword = ref('');
const showDetailsDialog = ref(false);
const currentLoginInfo = ref(null);

// 格式化日期时间显示
const formatDateTime = (date) => {
    if (!date || isNaN(new Date(date))) return '未知时间';
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return new Intl.DateTimeFormat('zh-CN', options).format(new Date(date));
};

// 获取状态显示文本和类名
const getStatusInfo = (status) => {
    if (status === null || status === undefined) {
        return { text: '未知', class: '' };
    }
    if (status === "0" || status === "1") {
        return { text: '在线', class: 'success' };
    } else if (status === "1" || status === "0") {
        return { text: '离线', class: 'error' };
    }
    return { text: '未知', class: '' };
};

// 搜索功能
const filteredLoginInfos = computed(() => {
    const keyword = searchKeyword.value.toLowerCase();
    return loginInfos.value.filter(
        (loginInfo) =>
            String(loginInfo.id).includes(keyword) ||
            String(loginInfo.user_id).includes(keyword) ||
            loginInfo.username.toLowerCase().includes(keyword) ||
            loginInfo.ipaddr.toLowerCase().includes(keyword)
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
    fetchLoginInfos();
};

const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    fetchLoginInfos();
};
// 获取数据
const fetchLoginInfos = async () => {
    try {
        const params = {
            page: currentPage.value,
            pageSize: pageSize.value,
            keyword: searchKeyword.value
        };
        const response = await request.get('/api/public/user/logininfo', { params });
        loginInfos.value = response.data.list;
        total.value = response.data.total;
    } catch (error) {
        console.error('获取登录信息失败:', error);
        showToastMessage('获取登录信息失败', 'error');
    }
};

// 显示详情对话框
const openDetailsDialog = (loginInfo) => {
    currentLoginInfo.value = { ...loginInfo };
    showDetailsDialog.value = true;
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
// 关闭详情对话框
const closeDetailsDialog = () => {
    showDetailsDialog.value = false;
    currentLoginInfo.value = null;
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
            await request.delete(`/api/public/user/logininfo/${deleteCardId.value}`);
            await fetchLoginInfos();
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

// 搜索处理
const handleSearch = () => {
    currentPage.value = 1;
    fetchLoginInfos();
};

// 重置搜索
const handleReset = () => {
    searchKeyword.value = '';
    currentPage.value = 1;
    fetchLoginInfos();
};

// 处理复选框选择
const handleCheck = (loginInfo) => {
    loginInfo.checked = !loginInfo.checked;
};

// Excel导入导出（待实现）
const handleImport = () => {
    showToastMessage('Excel导入导出功能待实现', 'info');
};

onMounted(fetchLoginInfos);


</script>

<style scoped>
.management-page-background {
    background-color: #f5f7fa;
    min-height: 100vh;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container-management {
    max-width: 1400px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 24px;
}

/* 操作栏样式 */
.action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;
}

.search-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.search-box-management {
    position: relative;
}

.search-input-management {
    padding: 10px 16px;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    font-size: 14px;
    width: 280px;
    transition: all 0.3s ease;
    outline: none;
}

.search-input-management:focus {
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.operate-bar {
    display: flex;
    gap: 12px;
}

/* 按钮样式 */
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.search-btn {
    background: #409eff;
    color: white;
}

.search-btn:hover {
    background: #66b1ff;
    transform: translateY(-1px);
}

.delete-btn {
    background: #f56c6c;
    color: white;
}

.delete-btn:hover {
    background: #f78989;
    transform: translateY(-1px);
}

.import-btn {
    background: #67c23a;
    color: white;
}

.import-btn:hover {
    background: #85ce61;
    transform: translateY(-1px);
}

.details-btn {
    background: #909399;
    color: white;
    padding: 6px 12px;
    font-size: 12px;
}

.details-btn:hover {
    background: #a6a9ad;
}

.cancel-btn {
    background: #909399;
    color: white;
}

.cancel-btn:hover {
    background: #a6a9ad;
}

/* 数据表格样式 */
.data-table-container {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #ebeef5;
    margin-bottom: 24px;
}

.data-table-wrapper {
    overflow-x: auto;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    background: #ffffff;
}

.data-table th {
    background: #f5f7fa;
    padding: 16px 12px;
    text-align: left;
    font-weight: 600;
    color: #606266;
    border-bottom: 1px solid #ebeef5;
    white-space: nowrap;
}

.data-table td {
    padding: 14px 12px;
    border-bottom: 1px solid #ebeef5;
    color: #606266;
    transition: background 0.3s ease;
}

.data-table tbody tr:hover td {
    background: #f5f7fa;
}

.data-table tbody tr:last-child td {
    border-bottom: none;
}

/* 复选框样式 */
.ui-checkbox {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #409eff;
}

/* 状态徽章样式 */
.status-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.status-success {
    background: #f0f9eb;
    color: #67c23a;
}

.status-error {
    background: #fef0f0;
    color: #f56c6c;
}

.status-warning {
    background: #fdf6ec;
    color: #e6a23c;
}

/* 表格按钮容器 */
.table-btn-display {
    display: flex;
    gap: 8px;
}

.table-btn-display .btn {
    padding: 6px 12px;
    font-size: 12px;
}

/* 分页器样式 */
.block {
    display: flex;
    justify-content: flex-end;
    padding: 16px 0;
}

/* 弹窗样式 */
.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

.dialog {
    background: white;
    border-radius: 12px;
    padding: 24px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s ease;
}

.dialog h2 {
    margin: 0 0 20px 0;
    color: #303133;
    font-size: 20px;
    font-weight: 600;
}

.details-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
}

.detail-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #ebeef5;
}

.detail-item:last-child {
    border-bottom: none;
}

.detail-item label {
    font-weight: 600;
    color: #606266;
    min-width: 100px;
    margin-right: 16px;
}

.detail-item span {
    color: #303133;
    word-break: break-word;
}

.dialog-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

/* 动画效果 */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .container-management {
        padding: 16px;
    }

    .action-bar {
        flex-direction: column;
        align-items: stretch;
    }

    .search-bar {
        justify-content: center;
    }

    .search-input-management {
        width: 100%;
    }

    .operate-bar {
        justify-content: center;
    }

    .data-table {
        font-size: 14px;
    }

    .data-table th,
    .data-table td {
        padding: 10px 8px;
    }

    .table-btn-display {
        flex-direction: column;
        gap: 4px;
    }

    .detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }

    .detail-item label {
        min-width: auto;
    }
}

/* 滚动条样式 */
.data-table-wrapper::-webkit-scrollbar {
    height: 6px;
}

.data-table-wrapper::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.data-table-wrapper::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.data-table-wrapper::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

.dialog::-webkit-scrollbar {
    width: 6px;
}

.dialog::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.dialog::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.dialog::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

.status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

.status-badge.success {
    background-color: #f0f9eb;
    color: #67c23a;
    border: 1px solid #e1f3d8;
}

.status-badge.error {
    background-color: #fef0f0;
    color: #f56c6c;
    border: 1px solid #fde2e2;
}

.details-container {
    display: grid;
    grid-template-columns: minmax(0, 80px) 1fr;
    gap: 12px;
    margin-bottom: 20px;
}

.detail-item {
    display: contents;
}

.detail-item label {
    font-weight: 600;
    color: #606266;
    text-align: left;
    padding-right: 12px;
}

.detail-item span {
    color: #303133;
    word-break: break-all;
}
</style>