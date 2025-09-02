<template>
    <div class="app-container-center">
        <div class="excel-io-container">
            <div class="header">
                <h2>Excel 数据导入导出</h2>
            </div>

            <div class="io-sections">
                <!-- 导入区域 -->
                <div class="import-section">
                    <div class="section-header">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M8,13V19L10.61,16.39L14,19.17L17.39,16.39L20,19V13H8Z" />
                        </svg>
                        <h3>导入 Excel 文件</h3>
                    </div>

                    <div class="dropzone" @dragover.prevent="isDragOver = true" @dragleave="isDragOver = false"
                        @drop.prevent="handleDrop" :class="{ 'drag-active': isDragOver }">
                        <div class="dropzone-content">
                            <svg class="upload-icon" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M8,13V19L10.61,16.39L14,19.17L17.39,16.39L20,19V13H8Z" />
                            </svg>
                            <p class="dropzone-text">拖放文件到这里或点击上传</p>
                            <p class="dropzone-hint">支持 .xlsx, .xls, .csv 格式</p>
                            <input type="file" ref="fileInput" @change="handleFileSelect" accept=".xlsx, .xls, .csv"
                                class="file-input" />
                            <button class="browse-btn" @click="triggerFileInput">选择文件</button>
                        </div>
                    </div>

                    <div v-if="importFile" class="file-info">
                        <div class="file-details">
                            <svg class="file-icon" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                            </svg>
                            <div>
                                <p class="file-name">{{ importFile.name }}</p>
                                <p class="file-size">{{ formatFileSize(importFile.size) }}</p>
                            </div>
                        </div>
                        <button class="clear-btn" @click="clearImportFile">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor"
                                    d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                            </svg>
                        </button>
                    </div>

                    <div class="form-group">
                        <label for="sheet-name">工作表名:</label>
                        <input id="sheet-name" v-model="importOptions.sheetName" type="text" class="form-control"
                            placeholder="Sheet1" />
                    </div>

                    <button class="import-btn" @click="handleImport" :disabled="!importFile || isImporting"
                        :class="{ 'loading': isImporting }">
                        <span v-if="!isImporting">导入数据</span>
                        <span v-else class="loading-text">正在导入...</span>
                        <svg v-if="isImporting" class="spinner" viewBox="0 0 50 50">
                            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                        </svg>
                    </button>

                    <div v-if="importError" class="error-message">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor"
                                d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                        </svg>
                        {{ importError }}
                    </div>

                    <div v-if="importResult" class="success-message">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor"
                                d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                        </svg>
                        导入成功！共处理 {{ importResult.total }} 条记录
                    </div>
                </div>

                <!-- 导出区域 -->
                <div class="export-section">
                    <div class="section-header">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                        </svg>
                        <h3>导出 Excel 文件</h3>
                    </div>

                    <div class="form-group">
                        <label for="export-filename">文件名:</label>
                        <input id="export-filename" v-model="exportOptions.filename" type="text" class="form-control"
                            placeholder="请输入文件名" />
                    </div>

                    <div class="form-group">
                        <label for="export-sheetname">工作表名:</label>
                        <input id="export-sheetname" v-model="exportOptions.sheetName" type="text" class="form-control"
                            placeholder="Sheet1" />
                    </div>

                    <button class="export-btn" @click="handleExport" :disabled="isExporting"
                        :class="{ 'loading': isExporting }">
                        <span v-if="!isExporting">导出数据</span>
                        <span v-else class="loading-text">正在导出...</span>
                        <svg v-if="isExporting" class="spinner" viewBox="0 0 50 50">
                            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                        </svg>
                    </button>

                    <div v-if="exportError" class="error-message">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor"
                                d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                        </svg>
                        {{ exportError }}
                    </div>
                </div>
                <!-- 关闭窗口按钮 -->
                <div class="close-btn-container">
                    <div class="icon-btn-container">
                        <button class="icon-btn icon-btn-red" @click="handleCloseImportExport">
                            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M5.1716 8.00003L1.08582 3.91424L3.91424 1.08582L8.00003 5.1716L12.0858 1.08582L14.9142 3.91424L10.8285 8.00003L14.9142 12.0858L12.0858 14.9142L8.00003 10.8285L3.91424 14.9142L1.08582 12.0858L5.1716 8.00003Z"
                                    fill="#FFFFFF"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import request from '@/utils/request';

// 导入相关状态
const fileInput = ref(null);
const isDragOver = ref(false);
const importFile = ref(null);
const isImporting = ref(false);
const importError = ref(null);
const importResult = ref(null);

// 导出相关状态
const isExporting = ref(false);
const exportError = ref(null);

// 导入选项
const importOptions = ref({
    sheetName: 'Sheet1'
});

// 导出选项
const exportOptions = ref({
    filename: 'export',
    sheetName: 'Sheet1'
});

// 触发文件选择
const triggerFileInput = () => {
    fileInput.value.click();
};

// 处理文件选择
const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        processSelectedFile(files[0]);
    }
};

// 处理拖放
const handleDrop = (e) => {
    isDragOver.value = false;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
        processSelectedFile(files[0]);
    }
};

// 处理选择的文件
const processSelectedFile = (file) => {
    const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
    ];

    if (!validTypes.includes(file.type) &&
        !file.name.match(/\.(xlsx|xls|csv)$/)) {
        importError.value = '请选择有效的 Excel 或 CSV 文件';
        return;
    }

    importFile.value = file;
    importError.value = null;
    importResult.value = null;
};

// 清除导入文件
const clearImportFile = () => {
    importFile.value = null;
    importError.value = null;
    importResult.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

// 定义props接收父组件传递的接口地址
const props = defineProps({
    exportApiUrl: {
        type: String,
        required: true,
        default: ''
    },
    importApiUrl: {
        type: String,
        required: true,
        default: ''
    },

});
// 处理导入
const handleImport = async () => {
    if (!importFile.value) return;

    isImporting.value = true;
    importError.value = null;
    importResult.value = null;

    try {
        const formData = new FormData();
        formData.append('file', importFile.value);

        const response = await request.post(props.importApiUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        importResult.value = response.data;
    } catch (error) {
        console.error('导入失败:', error);
        importError.value = error.response?.data?.message || '导入文件时出错';
    } finally {
        isImporting.value = false;
    }
};

// 修改后的导出处理
const handleExport = async () => {
    isExporting.value = true;
    exportError.value = null;

    try {
        const link = document.createElement('a');
        link.href = props.exportApiUrl;
        link.setAttribute('download', exportOptions.value.filename || '用户列表.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('导出失败:', error);
        exportError.value = error.response?.data?.message || '导出文件时出错';
    } finally {
        isExporting.value = false;
    }
};

// 格式化文件大小
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
};

// 定义emit事件
const emit = defineEmits(['import-complete', 'export-complete', 'import-error', 'export-error']);

// 关闭模态框
const handleCloseImportExport = () => { emit('close'); };

</script>

<style scoped>
.app-container-center {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(3px);
    z-index: 1000;
}

.excel-io-container {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.header {
    text-align: center;
    margin-bottom: 2.5rem;
}

.header h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.header p {
    font-size: 1rem;
}

.io-sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

@media (max-width: 768px) {
    .io-sections {
        grid-template-columns: 1fr;
    }
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
}

.section-header h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-left: 0.75rem;
    color: #2c3e50;
}

.icon {
    width: 24px;
    height: 24px;
    color: #3498db;
}

.import-section,
.export-section {
    background-color: rgba(255, 255, 255);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.dropzone {
    border: 2px dashed #bdc3c7;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 1.5rem;
    background-color: #f8f9fa;
}

.dropzone:hover,
.drag-active {
    border-color: #3498db;
    background-color: #f0f7ff;
}

.dropzone-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.upload-icon {
    width: 48px;
    height: 48px;
    color: #7f8c8d;
    margin-bottom: 1rem;
}

.dropzone-text {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
    color: #2c3e50;
}

.dropzone-hint {
    font-size: 0.875rem;
    color: #7f8c8d;
    margin-bottom: 1rem;
}

.file-input {
    display: none;
}

.browse-btn {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
}

.browse-btn:hover {
    background-color: #2980b9;
}

.file-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    margin-bottom: 1.5rem;
}

.file-details {
    display: flex;
    align-items: center;
}

.file-icon {
    width: 24px;
    height: 24px;
    color: #7f8c8d;
    margin-right: 0.75rem;
}

.file-name {
    font-weight: 500;
    margin-bottom: 0.25rem;
}

.file-size {
    font-size: 0.75rem;
    color: #7f8c8d;
}

.clear-btn {
    background: none;
    border: none;
    color: #7f8c8d;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.2s;
}

.clear-btn:hover {
    color: #e74c3c;
    background-color: #fef0f0;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #2c3e50;
}

.form-control {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.875rem;
    transition: border-color 0.2s;
}

.form-control:focus {
    outline: none;
    border-color: #3498db;
}

.import-btn,
.export-btn {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    position: relative;
}

.import-btn {
    background-color: #2ecc71;
    color: white;
}

.import-btn:hover:not(:disabled) {
    background-color: #27ae60;
}

.import-btn:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}

.export-btn {
    background-color: #3498db;
    color: white;
}

.export-btn:hover:not(:disabled) {
    background-color: #2980b9;
}

.export-btn:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}

.loading-text {
    margin-right: 0.5rem;
}

.spinner {
    animation: rotate 1.5s linear infinite;
    width: 20px;
    height: 20px;
}

.spinner .path {
    stroke: white;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes dash {
    0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
    }

    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
    }
}

.error-message {
    display: flex;
    align-items: center;
    background-color: #fef0f0;
    color: #e74c3c;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    margin-top: 1rem;
    font-size: 0.875rem;
}

.success-message {
    display: flex;
    align-items: center;
    background-color: #f0fff4;
    color: #2ecc71;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    margin-top: 1rem;
    font-size: 0.875rem;
}

.error-message svg,
.success-message svg {
    margin-right: 0.5rem;
}

/* 关闭按钮 */
.close-btn-container {
    position: absolute;
    top: 40px;
    right: 40px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
}

.icon-btn-container {
    position: relative;
    display: flex;
    gap: 10px;
}

.icon-btn {
    font-size: 2.4rem;
    text-align: center;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    color: #ffffff;
    border: 5px solid #fff;
    transition: all 0.3s ease;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2);
}

.icon-btn:active {
    transform: scale(0.95);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
}
.icon-btn:hover {
    transform: scale(0.95);
    box-shadow: 0 0 15px rgb(255, 0, 0);
}
.icon-btn-red {
    background-color: #f73a45;
    box-shadow: 0px 0px 5px #f73a45;
}

.icon-btn-red svg {
    width: 15px;
    height: 15px;
}
</style>