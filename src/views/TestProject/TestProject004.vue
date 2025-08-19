<template>
  <div class="external-link-container">
    <div class="link-controls">
      <input
        v-model="url"
        type="text"
        placeholder="输入要打开的网址 (例如: https://example.com)"
        class="url-input"
        @keyup.enter="loadExternalContent"
      />
      <button @click="loadExternalContent" class="load-button">
        <span v-if="!isLoading">加载</span>
        <span v-else class="spinner"></span>
      </button>
    </div>

    <div v-if="error" class="error-message">
      <span class="error-icon">⚠️</span>
      {{ error }}
    </div>

    <div v-if="showIframe" class="iframe-wrapper">
      <div class="iframe-header">
        <span class="display-url">{{ displayUrl }}</span>
        <button @click="closeIframe" class="close-button">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
      </div>
      <iframe
        ref="iframeRef"
        :src="safeUrl"
        class="external-iframe"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        @load="handleIframeLoad"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const url = ref('baidu.com');
const iframeRef = ref(null);
const isLoading = ref(false);
const error = ref(null);
const showIframe = ref(false);

const displayUrl = computed(() => {
  try {
    const urlObj = new URL(url.value);
    return `${urlObj.hostname}${urlObj.pathname !== '/' ? urlObj.pathname : ''}`;
  } catch {
    return url.value;
  }
});

const safeUrl = computed(() => {
  try {
    // 确保URL是有效的，并添加https协议（如果缺少）
    let processedUrl = url.value.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }
    new URL(processedUrl); // 验证URL是否有效
    return processedUrl;
  } catch (err) {
    return '';
  }
});

const loadExternalContent = async () => {
  if (!url.value.trim()) {
    error.value = '请输入有效的网址';
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;
    
    // 验证URL
    new URL(safeUrl.value);
    
    showIframe.value = true;
  } catch (err) {
    error.value = '请输入有效的网址 (例如: https://example.com)';
    showIframe.value = false;
  } finally {
    isLoading.value = false;
  }
};

const closeIframe = () => {
  showIframe.value = false;
  url.value = '';
};

const handleIframeLoad = () => {
  isLoading.value = false;
};
</script>

<style scoped>
.external-link-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.link-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.url-input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.url-input:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 2px 8px rgba(74, 108, 247, 0.2);
}

.load-button {
  padding: 0 24px;
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
}

.load-button:hover {
  background-color: #3a5ce4;
  transform: translateY(-1px);
}

.load-button:active {
  transform: translateY(0);
}

.error-message {
  padding: 12px 15px;
  background-color: #ffebee;
  color: #d32f2f;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-icon {
  font-size: 18px;
}

.iframe-wrapper {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.iframe-header {
  background-color: #f5f5f5;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.display-url {
  font-size: 14px;
  color: #555;
  font-family: monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #777;
  padding: 4px;
  margin-left: 10px;
  border-radius: 4px;
}

.close-button:hover {
  background-color: #e0e0e0;
  color: #333;
}

.external-iframe {
  width: 100%;
  height: 600px;
  background-color: white;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .external-link-container {
    padding: 15px;
  }
  
  .link-controls {
    flex-direction: column;
  }
  
  .load-button {
    padding: 12px;
  }
  
  .external-iframe {
    height: 400px;
  }
}
</style>