<template>
    <div>
        <TestPage />
    </div>
    <div class="translate-app">
        <header class="app-header">
        <h1>多语言翻译器</h1>
        <p>支持多种语言互译，自动检测源语言</p>
        </header>

        <div class="translate-container">
        <div class="input-section">
            <div class="language-selector">
            <label for="source-lang">源语言:</label>
            <select id="source-lang" v-model="sourceLang" @change="handleSourceLangChange">
                <option value="AUTO">自动检测</option>
                <option value="ZH_CN">中文</option>
                <option value="EN">英语</option>
                <option value="JA">日语</option>
                <option value="KR">韩语</option>
                <option value="FR">法语</option>
                <option value="RU">俄语</option>
                <option value="SP">西班牙语</option>
            </select>
            </div>
            
            <textarea 
            v-model="inputText" 
            placeholder="请输入要翻译的内容..."
            @input="handleInput"
            class="input-textarea"
            ></textarea>
            
            <div class="action-buttons">
            <button @click="clearText" class="clear-btn">清空</button>
            <button @click="translateText" class="translate-btn" :disabled="!inputText">
                {{ isTranslating ? '翻译中...' : '翻译' }}
            </button>
            </div>
        </div>

        <div class="output-section">
            <div class="language-selector">
            <label for="target-lang">目标语言:</label>
            <select id="target-lang" v-model="targetLang">
                <option value="ZH_CN">中文</option>
                <option value="EN">英语</option>
                <option value="JA">日语</option>
                <option value="KR">韩语</option>
                <option value="FR">法语</option>
                <option value="RU">俄语</option>
                <option value="SP">西班牙语</option>
            </select>
            </div>
            
            <div class="output-textarea" v-if="!isTranslating && translatedText">
            {{ translatedText }}
            </div>
            <div class="output-textarea loading" v-else-if="isTranslating">
            <div class="loading-spinner"></div>
            <span>正在翻译...</span>
            </div>
            <div class="output-textarea placeholder" v-else>
            翻译结果将显示在这里
            </div>
            
            <div class="copy-section" v-if="translatedText">
            <button @click="copyToClipboard" class="copy-btn">复制结果</button>
            </div>
        </div>
        </div>

        <footer class="app-footer">
        <p>
            本翻译器由 <a href="https://www.pearktrue.cn/" target="_blank">PeerkTrue</a> 提供技术支持。
        </p>
        </footer>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessage } from "element-plus";

const inputText = ref('');
const translatedText = ref('');
const sourceLang = ref('AUTO');
const targetLang = ref('EN');
const isTranslating = ref(false);
const lastTranslateTime = ref(0);

const translationType = computed(() => {
  if (sourceLang.value === 'AUTO') return 'AUTO';
  return `${sourceLang.value}2${targetLang.value}`;
});

const handleSourceLangChange = () => {
  // 如果源语言不是自动检测且与目标语言相同，则自动切换目标语言
  if (sourceLang.value !== 'AUTO' && sourceLang.value === targetLang.value) {
    targetLang.value = sourceLang.value === 'ZH_CN' ? 'EN' : 'ZH_CN';
  }
};

const handleInput = () => {
  // 简单的防抖处理，500ms后自动翻译
  clearTimeout(lastTranslateTime.value);
  if (inputText.value.trim()) {
    lastTranslateTime.value = setTimeout(() => {
      translateText();
    }, 1000);
  } else {
    translatedText.value = '';
  }
};

const translateText = async () => {
  if (!inputText.value.trim() || isTranslating.value) return;
  
  isTranslating.value = true;
  
  try {
    const response = await fetch(`https://api.pearktrue.cn/api/translate/?text=${encodeURIComponent(inputText.value)}&type=${translationType.value}`);
    const data = await response.json();
    
    if (data.code === 200) {
      translatedText.value = data.data.translate;
    } else {
      throw new Error('翻译失败');
    }
  } catch (error) {
    console.error('翻译出错:', error);
    translatedText.value = '翻译失败，请重试';
  } finally {
    isTranslating.value = false;
  }
};

const clearText = () => {
  inputText.value = '';
  translatedText.value = '';
};

const copyToClipboard = () => {
  if (!translatedText.value) return;
  
  navigator.clipboard.writeText(translatedText.value)
    .then(() => {
      ElMessage.success('已复制到剪贴板');
    })
    .catch(err => {
      ElMessage.error('复制失败，请重试', err);
    });
};
</script>

<style scoped>
.translate-app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
}

.app-header h1 {
  color: #2c3e50;
  font-size: 2.2rem;
  margin-bottom: 10px;
}

.app-header p {
  color: #7f8c8d;
  font-size: 1rem;
}

.translate-container {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.input-section, .output-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.language-selector label {
  font-weight: bold;
  color: #2c3e50;
}

.language-selector select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  font-size: 0.9rem;
  cursor: pointer;
}

.input-textarea, .output-textarea {
  min-height: 200px;
  padding: 15px;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.5;
}

.input-textarea {
  border: 2px solid #3498db;
  resize: none;
  outline: none;
  transition: border-color 0.3s;
}

.input-textarea:focus {
  border-color: #2980b9;
}

.output-textarea {
  border: 2px solid #2ecc71;
  background-color: #f9f9f9;
  overflow-y: auto;
}

.output-textarea.placeholder {
  color: #95a5a6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.output-textarea.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.action-buttons, .copy-section {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn {
  background-color: #e74c3c;
  color: white;
}

.clear-btn:hover {
  background-color: #c0392b;
}

.translate-btn {
  background-color: #3498db;
  color: white;
}

.translate-btn:hover {
  background-color: #2980b9;
}

.translate-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.copy-btn {
  background-color: #2ecc71;
  color: white;
}

.copy-btn:hover {
  background-color: #27ae60;
}

.app-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.app-footer a {
  color: #3498db;
  text-decoration: none;
}

.app-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .translate-container {
    flex-direction: column;
  }
  
  .input-textarea, .output-textarea {
    min-height: 150px;
  }
}
</style>