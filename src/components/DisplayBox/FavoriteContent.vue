<template>
  <div class="novelreading-container" :class="{'novelreading-dark': darkMode}">
    <!-- 顶部导航栏 -->
    <div class="novelreading-navbar">
      <h1 class="novelreading-title">博览阅读器</h1>
      <div class="novelreading-controls">
        <div class="novelreading-file-control">
          <input 
            type="file" 
            id="novelreading-file-input" 
            accept=".txt" 
            @change="handleFileUpload" 
            class="novelreading-file-input"
          />
          <label for="novelreading-file-input" class="novelreading-file-label">
            <span class="novelreading-file-icon">📖</span>
            选择小说
          </label>
          <button 
            @click="resetReader" 
            class="novelreading-reset-btn"
            :disabled="!novelContent"
          >
            <span class="novelreading-reset-icon">🔄</span>
            重置
          </button>
        </div>
        
        <div class="novelreading-theme-control">
          <button 
            @click="toggleTheme" 
            class="novelreading-theme-btn"
          >
            {{ darkMode ? '亮色模式' : '黑夜模式' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 设置面板 -->
    <div class="novelreading-settings" v-if="showSettings">
      <div class="novelreading-setting-group">
        <label class="novelreading-setting-label">字体大小</label>
        <div class="novelreading-setting-control">
          <button 
            @click="changeFontSize(-1)" 
            class="novelreading-font-btn"
            :disabled="fontSize <= 14"
          >
            -
          </button>
          <span class="novelreading-font-size">{{ fontSize }}px</span>
          <button 
            @click="changeFontSize(1)" 
            class="novelreading-font-btn"
            :disabled="fontSize >= 24"
          >
            +
          </button>
        </div>
      </div>
      
      <div class="novelreading-setting-group">
        <label class="novelreading-setting-label">行间距</label>
        <div class="novelreading-setting-control">
          <button 
            @click="changeLineHeight(-0.1)" 
            class="novelreading-font-btn"
            :disabled="lineHeight <= 1.4"
          >
            -
          </button>
          <span class="novelreading-font-size">{{ lineHeight.toFixed(1) }}</span>
          <button 
            @click="changeLineHeight(0.1)" 
            class="novelreading-font-btn"
            :disabled="lineHeight >= 2.2"
          >
            +
          </button>
        </div>
      </div>
      
      <div class="novelreading-setting-group">
        <label class="novelreading-setting-label">背景主题</label>
        <div class="novelreading-theme-selector">
          <div 
            v-for="(theme, index) in themes" 
            :key="index"
            class="novelreading-theme-option"
            :class="{'novelreading-theme-active': selectedTheme === theme.name}"
            @click="selectTheme(theme)"
            :style="{
              backgroundColor: theme.bgColor,
              color: theme.textColor
            }"
          >
            {{ theme.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="novelreading-main">
      <!-- 书籍封面 -->
      <div class="novelreading-cover" v-if="!novelContent">
        <div class="novelreading-cover-image">
          <div class="novelreading-cover-design"></div>
          <div class="novelreading-cover-title">博览阅读器</div>
          <div class="novelreading-cover-subtitle">沉浸式阅读体验</div>
        </div>
      </div>
      
      <!-- 书籍内容 -->
      <div 
        class="novelreading-book" 
        ref="bookRef"
        :style="{
          'font-size': `${fontSize}px`,
          'line-height': lineHeight,
          'background-color': currentTheme.bgColor,
          'color': currentTheme.textColor
        }"
      >
        <div 
          v-if="!novelContent" 
          class="novelreading-placeholder"
        >
          <div class="novelreading-welcome">
            <h2>欢迎使用博览阅读器</h2>
            <p>请选择一本TXT格式的小说开始阅读</p>
            <div class="novelreading-animation">
              <div class="novelreading-star"></div>
              <div class="novelreading-star"></div>
              <div class="novelreading-star"></div>
              <div class="novelreading-star"></div>
              <div class="novelreading-star"></div>
            </div>
          </div>
        </div>
        
        <div v-else class="novelreading-text">
          <pre :style="{'font-size': `${fontSize}px`, 'line-height': lineHeight}">{{ currentPageContent }}</pre>
          
          <!-- 章节导航 -->
          <div class="novelreading-chapters" v-if="chapters.length > 0">
            <div class="novelreading-chapter-title">章节导航</div>
            <div class="novelreading-chapter-list">
              <div 
                v-for="(chapter, index) in visibleChapters" 
                :key="index"
                class="novelreading-chapter-item"
                :class="{'novelreading-chapter-current': currentChapterIndex === index}"
                @click="goToChapter(index)"
              >
                {{ chapter.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 搜索面板 -->
      <div class="novelreading-search-panel" v-if="showSearch">
        <div class="novelreading-search-box">
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="输入搜索内容..."
            class="novelreading-search-input"
            @keyup.enter="performSearch"
          />
          <button @click="performSearch" class="novelreading-search-btn">搜索</button>
          <button @click="closeSearch" class="novelreading-search-close">×</button>
        </div>
        
        <div class="novelreading-search-results" v-if="searchResults.length > 0">
          <div class="novelreading-search-count">找到 {{ searchResults.length }} 个结果</div>
          <div 
            v-for="(result, index) in searchResults" 
            :key="index"
            class="novelreading-search-result"
            @click="goToSearchResult(result)"
          >
            <div class="novelreading-result-context">
              ...{{ result.context }}...
            </div>
            <div class="novelreading-result-page">
              第 {{ result.page }} 页
            </div>
          </div>
        </div>
        <div class="novelreading-search-empty" v-else-if="searchPerformed">
          未找到匹配的内容
        </div>
      </div>
    </div>

    <!-- 底部控制栏 -->
    <div class="novelreading-footer-controls">
      <div class="novelreading-footer-left">
        <button 
          @click="toggleSettings" 
          class="novelreading-footer-btn"
        >
          ⚙️ 设置
        </button>
        
        <button 
          @click="toggleBookmark" 
          class="novelreading-footer-btn"
          :class="{'novelreading-bookmarked': isBookmarked}"
          :disabled="!novelContent"
        >
          {{ isBookmarked ? '📑 已收藏' : '🔖 收藏' }}
        </button>
      </div>
      
      <div class="novelreading-pagination" v-if="novelContent">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="novelreading-page-btn"
        >
          ◀ 上一页
        </button>
        <div class="novelreading-page-control">
          <input 
            type="number" 
            v-model.number="jumpPage" 
            min="1" 
            :max="totalPages" 
            class="novelreading-page-input"
          />
          <button 
            @click="goToPage" 
            class="novelreading-page-jump"
          >
            跳转
          </button>
        </div>
        <span class="novelreading-page-info">
          第 {{ currentPage }} / {{ totalPages }} 页
        </span>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="novelreading-page-btn"
        >
          下一页 ▶
        </button>
      </div>
      
      <div class="novelreading-footer-right">
        <button 
          @click="toggleSearch" 
          class="novelreading-footer-btn"
          :disabled="!novelContent"
        >
          🔍 搜索
        </button>
        
        <button 
          @click="toggleFullscreen" 
          class="novelreading-footer-btn"
        >
          {{ isFullscreen ? '⤵️ 退出全屏' : '⤴️ 全屏' }}
        </button>
      </div>
    </div>
    
    <!-- 进度条 -->
    <div class="novelreading-progress" v-if="novelContent">
      <div 
        class="novelreading-progress-bar" 
        :style="{ width: progress + '%' }"
      ></div>
      <div class="novelreading-progress-text">{{ progress.toFixed(1) }}%</div>
    </div>
    
    <!-- 书签提示 -->
    <div class="novelreading-bookmark-toast" v-if="bookmarkToast">
      {{ bookmarkToast }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';

const novelContent = ref('');
const currentPage = ref(1);
const linesPerPage = ref(30);
const bookRef = ref(null);
const darkMode = ref(false);
const fontSize = ref(18);
const lineHeight = ref(1.8);
const showSettings = ref(false);
const jumpPage = ref(1);
const showSearch = ref(false);
const searchTerm = ref('');
const searchResults = ref([]);
const searchPerformed = ref(false);
const isFullscreen = ref(false);
const chapters = ref([]);
const currentChapterIndex = ref(-1);
const isBookmarked = ref(false);
const bookmarkToast = ref(null);

// 主题设置
const themes = ref([
  { name: '默认', bgColor: '#fffaf0', textColor: '#333' },
  { name: '护眼', bgColor: '#e3edcd', textColor: '#333' },
  { name: '羊皮纸', bgColor: '#f0e6d2', textColor: '#5c3b1e' },
  { name: '深蓝', bgColor: '#0f1c2c', textColor: '#cbd5e1' },
  { name: '暗黑', bgColor: '#121212', textColor: '#e0e0e0' }
]);

const selectedTheme = ref('默认');
const currentTheme = computed(() => {
  return themes.value.find(t => t.name === selectedTheme.value) || themes.value[0];
});

// 计算属性
const totalPages = computed(() => {
  if (!novelContent.value) return 0;
  const lines = novelContent.value.split('\n');
  return Math.ceil(lines.length / linesPerPage.value);
});

const currentPageContent = computed(() => {
  if (!novelContent.value) return '';
  const lines = novelContent.value.split('\n');
  const start = (currentPage.value - 1) * linesPerPage.value;
  const end = start + linesPerPage.value;
  
  // 检测当前页是否包含章节标题
  detectCurrentChapter(start, end);
  
  return lines.slice(start, end).join('\n');
});

const progress = computed(() => {
  return (currentPage.value / totalPages.value) * 100;
});

const visibleChapters = computed(() => {
  return chapters.value.slice(0, 5);
});

// 方法
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    novelContent.value = e.target.result;
    currentPage.value = 1;
    jumpPage.value = 1;
    adjustLinesPerPage();
    extractChapters();
    checkBookmark(file.name);
  };
  reader.readAsText(file, 'utf-8');
};

const resetReader = () => {
  novelContent.value = '';
  currentPage.value = 1;
  jumpPage.value = 1;
  chapters.value = [];
  isBookmarked.value = false;
  showSearch.value = false;
  searchTerm.value = '';
  searchResults.value = [];
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    jumpPage.value = currentPage.value;
    scrollToTop();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    jumpPage.value = currentPage.value;
    scrollToTop();
  }
};

const goToPage = () => {
  if (jumpPage.value >= 1 && jumpPage.value <= totalPages.value) {
    currentPage.value = jumpPage.value;
    scrollToTop();
  } else {
    jumpPage.value = currentPage.value;
  }
};

const scrollToTop = () => {
  if (bookRef.value) {
    bookRef.value.scrollTop = 0;
  }
};

const toggleTheme = () => {
  darkMode.value = !darkMode.value;
  selectedTheme.value = darkMode.value ? '暗黑' : '默认';
};

const changeFontSize = (delta) => {
  fontSize.value = Math.min(24, Math.max(14, fontSize.value + delta));
};

const changeLineHeight = (delta) => {
  lineHeight.value = parseFloat(Math.min(2.2, Math.max(1.4, lineHeight.value + delta)).toFixed(1));
};

const toggleSettings = () => {
  showSettings.value = !showSettings.value;
  if (showSettings.value) {
    showSearch.value = false;
  }
};

const selectTheme = (theme) => {
  selectedTheme.value = theme.name;
  darkMode.value = theme.name === '暗黑' || theme.name === '深蓝';
};

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  if (showSearch.value) {
    showSettings.value = false;
    searchTerm.value = '';
    searchResults.value = [];
    searchPerformed.value = false;
  }
};

const closeSearch = () => {
  showSearch.value = false;
};

const performSearch = () => {
  if (!searchTerm.value.trim()) return;
  
  searchResults.value = [];
  const searchText = searchTerm.value.toLowerCase();
  const lines = novelContent.value.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.toLowerCase().includes(searchText)) {
      const contextStart = Math.max(0, i - 2);
      const contextEnd = Math.min(lines.length, i + 3);
      const context = lines.slice(contextStart, contextEnd).join(' ');
      
      const page = Math.floor(i / linesPerPage.value) + 1;
      
      searchResults.value.push({
        page,
        lineIndex: i,
        context: context.replace(new RegExp(searchText, 'gi'), match => `<span class="novelreading-search-highlight">${match}</span>`)
      });
      
      // 限制最多显示50个结果
      if (searchResults.value.length >= 50) break;
    }
  }
  
  searchPerformed.value = true;
};

const goToSearchResult = (result) => {
  currentPage.value = result.page;
  jumpPage.value = result.page;
  showSearch.value = false;
  scrollToTop();
};

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`全屏请求错误: ${err.message}`);
    });
    isFullscreen.value = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      isFullscreen.value = false;
    }
  }
};

const extractChapters = () => {
  chapters.value = [];
  if (!novelContent.value) return;
  
  const lines = novelContent.value.split('\n');
  const chapterRegex = /^(第[零一二三四五六七八九十百千]+章|第\d+章|chapter \d+|【.+】)/i;
  
  lines.forEach((line, index) => {
    if (chapterRegex.test(line.trim())) {
      const page = Math.floor(index / linesPerPage.value) + 1;
      chapters.value.push({
        title: line.trim(),
        page,
        lineIndex: index
      });
    }
  });
};

const detectCurrentChapter = (start, end) => {
  currentChapterIndex.value = -1;
  for (let i = chapters.value.length - 1; i >= 0; i--) {
    const chapter = chapters.value[i];
    if (chapter.lineIndex >= start && chapter.lineIndex <= end) {
      currentChapterIndex.value = i;
      break;
    }
  }
};

const goToChapter = (index) => {
  const chapter = chapters.value[index];
  if (chapter) {
    currentPage.value = chapter.page;
    jumpPage.value = chapter.page;
    scrollToTop();
  }
};

const toggleBookmark = () => {
  if (!novelContent.value) return;
  
  isBookmarked.value = !isBookmarked.value;
  
  if (isBookmarked.value) {
    // 保存书签
    const bookmark = {
      fileName: document.querySelector('input[type=file]').files[0].name,
      page: currentPage.value,
      timestamp: new Date().getTime()
    };
    localStorage.setItem('novelBookmark', JSON.stringify(bookmark));
    showBookmarkToast('书签已保存！');
  } else {
    // 移除书签
    localStorage.removeItem('novelBookmark');
    showBookmarkToast('书签已移除！');
  }
};

const checkBookmark = (fileName) => {
  const bookmarkData = localStorage.getItem('novelBookmark');
  if (bookmarkData) {
    const bookmark = JSON.parse(bookmarkData);
    if (bookmark.fileName === fileName) {
      isBookmarked.value = true;
      currentPage.value = bookmark.page;
      jumpPage.value = bookmark.page;
      showBookmarkToast('已恢复书签位置');
    }
  }
};

const showBookmarkToast = (message) => {
  bookmarkToast.value = message;
  setTimeout(() => {
    bookmarkToast.value = null;
  }, 3000);
};

const adjustLinesPerPage = () => {
  if (!bookRef.value) return;
  
  // 根据容器高度动态计算每页行数
  const containerHeight = bookRef.value.clientHeight;
  const calculatedLineHeight = fontSize.value * lineHeight.value;
  linesPerPage.value = Math.max(10, Math.floor(containerHeight / calculatedLineHeight) - 2);
};

// 键盘快捷键
const handleKeyDown = (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    prevPage();
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    nextPage();
  } else if (e.key === 'f' && e.ctrlKey) {
    toggleSearch();
    e.preventDefault();
  } else if (e.key === 'Escape' && showSearch.value) {
    closeSearch();
  }
};

// 生命周期钩子
onMounted(() => {
  window.addEventListener('resize', adjustLinesPerPage);
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });
  
  adjustLinesPerPage();
});

onUnmounted(() => {
  window.removeEventListener('resize', adjustLinesPerPage);
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('fullscreenchange', () => {});
});

// 监听器
watch(darkMode, (newVal) => {
  document.body.style.backgroundColor = newVal ? '#121212' : '#f5f5f5';
});

watch([fontSize, lineHeight], () => {
  adjustLinesPerPage();
});
</script>

<style scoped>
.novelreading-dark {
  background-color: #121212;
  color: #e0e0e0;
}

/* 容器样式 */
.novelreading-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
  position: relative;
}

.novelreading-dark .novelreading-container {
  background-color: #1e1e1e;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

/* 导航栏样式 */
.novelreading-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
  flex-wrap: wrap;
}

.novelreading-dark .novelreading-navbar {
  border-bottom-color: #444;
}

.novelreading-title {
  margin: 0;
  font-size: 2.5rem;
  background: linear-gradient(90deg, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 700;
  letter-spacing: 1px;
}

.novelreading-controls {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.novelreading-file-control, .novelreading-theme-control {
  display: flex;
  gap: 10px;
}

/* 文件输入样式 */
.novelreading-file-input {
  display: none;
}

.novelreading-file-label, .novelreading-reset-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
  border: none;
  font-size: 1rem;
  font-weight: 500;
}

.novelreading-file-label:hover, .novelreading-reset-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
}

.novelreading-reset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.novelreading-theme-btn {
  padding: 10px 20px;
  background-color: #4ecdc4;
  color: white;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  font-size: 1rem;
  font-weight: 500;
}

.novelreading-theme-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

/* 设置面板 */
.novelreading-settings {
  position: absolute;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  z-index: 10;
}

.novelreading-dark .novelreading-settings {
  background: rgba(30, 30, 30, 0.9);
}

.novelreading-setting-group {
  display: flex;
  flex-direction: column;
}

.novelreading-setting-label {
  font-weight: 600;
  margin-bottom: 10px;
  color: #6a11cb;
}

.novelreading-setting-control {
  display: flex;
  align-items: center;
  gap: 15px;
}

.novelreading-font-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #6a11cb;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.novelreading-font-btn:hover:not(:disabled) {
  background: #2575fc;
  transform: scale(1.1);
}

.novelreading-font-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.novelreading-font-size {
  font-size: 1.2rem;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
}

.novelreading-theme-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.novelreading-theme-option {
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  border: 2px solid transparent;
}

.novelreading-theme-option:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.novelreading-theme-active {
  border-color: #6a11cb;
  box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.3);
  font-weight: bold;
}

/* 主内容区 */
.novelreading-main {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: 20px;
  position: relative;
}

/* 书籍封面 */
.novelreading-cover {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.novelreading-cover-image {
  width: 300px;
  height: 450px;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  border-radius: 10px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transform-style: preserve-3d;
  perspective: 1000px;
  overflow: hidden;
}

.novelreading-cover-design {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%),
    linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%);
  background-size: 60px 60px;
  background-position: 0 0, 30px 30px;
}

.novelreading-cover-title {
  position: absolute;
  top: 40%;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  transform: translateY(-50%);
}

.novelreading-cover-subtitle {
  position: absolute;
  top: 55%;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

/* 书籍样式 */
.novelreading-book {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  position: relative;
  border-radius: 10px;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  max-height: 500px;
  background-image: linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 20px 20px;
}

.novelreading-text pre {
  white-space: pre-wrap;
  margin: 0;
  font-family: 'Noto Serif SC', 'Source Han Serif', serif;
  text-align: justify;
  letter-spacing: 0.5px;
}

/* 章节导航 */
.novelreading-chapters {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

.novelreading-chapter-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #6a11cb;
}

.novelreading-chapter-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.novelreading-chapter-item {
  padding: 8px 15px;
  background: rgba(106, 17, 203, 0.1);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.novelreading-chapter-item:hover {
  background: rgba(106, 17, 203, 0.2);
  transform: translateY(-2px);
}

.novelreading-chapter-current {
  background: rgba(106, 17, 203, 0.3);
  font-weight: bold;
}

/* 搜索面板 */
.novelreading-search-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 400px;
  max-height: 80vh;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 20px;
  display: flex;
  flex-direction: column;
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.novelreading-dark .novelreading-search-panel {
  background: rgba(30, 30, 30, 0.95);
}

.novelreading-search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.novelreading-search-input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #6a11cb;
  border-radius: 30px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.novelreading-search-input:focus {
  border-color: #2575fc;
  box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.3);
}

.novelreading-search-btn {
  padding: 10px 20px;
  background: #6a11cb;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.novelreading-search-btn:hover {
  background: #2575fc;
}

.novelreading-search-close {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ff6b6b;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.novelreading-search-results {
  flex: 1;
  overflow-y: auto;
}

.novelreading-search-count {
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.novelreading-search-result {
  padding: 15px;
  margin-bottom: 15px;
  background: rgba(106, 17, 203, 0.05);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.novelreading-search-result:hover {
  background: rgba(106, 17, 203, 0.1);
  transform: translateX(5px);
}

.novelreading-result-context {
  margin-bottom: 10px;
  line-height: 1.6;
}

.novelreading-result-page {
  font-size: 0.9rem;
  color: #6a11cb;
  font-weight: 500;
}

.novelreading-search-highlight {
  background-color: #ffeb3b;
  color: #000;
  font-weight: bold;
  padding: 0 2px;
  border-radius: 3px;
}

.novelreading-search-empty {
  text-align: center;
  padding: 40px 0;
  color: #888;
}

/* 底部控制栏 */
.novelreading-footer-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px solid #e0e0e0;
  flex-wrap: wrap;
  gap: 15px;
}

.novelreading-dark .novelreading-footer-controls {
  border-top-color: #444;
}

.novelreading-footer-left, .novelreading-footer-right {
  display: flex;
  gap: 10px;
}

.novelreading-pagination {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.novelreading-page-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(106, 17, 203, 0.3);
  font-weight: 500;
}

.novelreading-page-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(106, 17, 203, 0.4);
}

.novelreading-page-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.novelreading-page-control {
  display: flex;
  gap: 5px;
}

.novelreading-page-input {
  width: 60px;
  padding: 8px 12px;
  border: 2px solid #6a11cb;
  border-radius: 30px;
  text-align: center;
  font-size: 1rem;
  outline: none;
}

.novelreading-page-jump {
  padding: 8px 15px;
  background: #6a11cb;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.novelreading-page-jump:hover {
  background: #2575fc;
}

.novelreading-page-info {
  font-size: 1rem;
  font-weight: 500;
  min-width: 120px;
  text-align: center;
}

.novelreading-footer-btn {
  padding: 10px 20px;
  background: rgba(106, 17, 203, 0.1);
  color: #6a11cb;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.novelreading-footer-btn:hover:not(:disabled) {
  background: rgba(106, 17, 203, 0.2);
}

.novelreading-footer-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.novelreading-bookmarked {
  background: rgba(106, 17, 203, 0.3);
  color: white;
}

/* 进度条样式 */
.novelreading-progress {
  height: 8px;
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 15px;
  position: relative;
}

.novelreading-dark .novelreading-progress {
  background-color: #444;
}

.novelreading-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  transition: width 0.3s ease;
}

.novelreading-progress-text {
  position: absolute;
  top: -25px;
  right: 0;
  font-size: 0.8rem;
  color: #6a11cb;
  font-weight: 500;
}

/* 书签提示 */
.novelreading-bookmark-toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 25px;
  background: rgba(106, 17, 203, 0.9);
  color: white;
  border-radius: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: toastFade 3s forwards;
}

@keyframes toastFade {
  0% { opacity: 0; bottom: 0; }
  20% { opacity: 1; bottom: 30px; }
  80% { opacity: 1; bottom: 30px; }
  100% { opacity: 0; bottom: 0; }
}

/* 占位符样式 */
.novelreading-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.novelreading-welcome {
  text-align: center;
  max-width: 500px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.novelreading-dark .novelreading-welcome {
  background: rgba(30, 30, 30, 0.9);
}

.novelreading-welcome h2 {
  color: #6a11cb;
  margin-bottom: 20px;
}

.novelreading-dark .novelreading-welcome h2 {
  color: #8a2be2;
}

.novelreading-welcome p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.novelreading-dark .novelreading-welcome p {
  color: #aaa;
}

/* 动画星星 */
.novelreading-animation {
  position: relative;
  height: 100px;
  width: 100%;
}

.novelreading-star {
  position: absolute;
  background-color: #ffd700;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: twinkle 2s infinite ease-in-out;
}

.novelreading-star:nth-child(1) {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.novelreading-star:nth-child(2) {
  top: 40%;
  left: 60%;
  animation-delay: 0.4s;
}

.novelreading-star:nth-child(3) {
  top: 70%;
  left: 30%;
  animation-delay: 0.8s;
}

.novelreading-star:nth-child(4) {
  top: 30%;
  left: 80%;
  animation-delay: 1.2s;
}

.novelreading-star:nth-child(5) {
  top: 80%;
  left: 70%;
  animation-delay: 1.6s;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 10px #ffd700; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .novelreading-navbar {
    flex-direction: column;
    gap: 15px;
  }
  
  .novelreading-title {
    font-size: 2rem;
  }
  
  .novelreading-controls {
    justify-content: center;
  }
  
  .novelreading-book {
    padding: 20px;
  }
  
  .novelreading-footer-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .novelreading-pagination {
    order: 1;
    margin-top: 10px;
  }
  
  .novelreading-footer-left, .novelreading-footer-right {
    justify-content: center;
  }
  
  .novelreading-search-panel {
    width: 100%;
    height: auto;
    position: static;
    margin-top: 20px;
  }
}

@media (max-width: 480px) {
  .novelreading-title {
    font-size: 1.8rem;
  }
  
  .novelreading-file-label, .novelreading-reset-btn, .novelreading-theme-btn {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
  
  .novelreading-book {
    padding: 15px;
    min-height: 500px;
  }
  
  .novelreading-settings {
    grid-template-columns: 1fr;
  }
}
</style>