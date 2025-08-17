<template>
  <div class="app-container">
    <TestProject007 
      @import-complete="handleImportComplete"
      @export-complete="handleExportComplete"
      @import-error="handleImportError"
      @export-error="handleExportError"
      :export-api-url="exportApiUrl"
      :import-api-url="importApiUrl"

    />
  </div>
</template>

<script setup>
import TestProject007 from '@/views/TestProject/TestProject007.vue';

const exportApiUrl = 'http://localhost:2025/api/public/user/export';
const importApiUrl = '/api/public/user/import';

const handleImportComplete = (result) => {
  console.log('导入完成:', result);
};

const handleExportComplete = (result) => {
  console.log('导出完成:', result);
};

const handleImportError = (error) => {
  console.error('导入错误:', error);
};

const handleExportError = (error) => {
  console.error('导出错误:', error);
};
</script>