<template>
  <div class="glassnotes-background">
    <div class="glassnotes-container">
      <!-- 星空背景 -->
      <div class="glassnotes-stars"></div>
      <div class="glassnotes-twinkling"></div>

      <!-- 主容器 -->
      <div class="glassnotes-app">
        <!-- 顶部导航 -->
        <header class="glassnotes-header">
          <h1 class="glassnotes-logo">✨ 玻璃笔记</h1>
          <div class="glassnotes-actions">
            <button @click="toggleDarkMode" class="glassnotes-mode-btn">
              {{ darkMode ? '☀️ 日间模式' : '🌙 夜间模式' }}
            </button>
            <button @click="createNewNote" class="glassnotes-new-btn">
              + 新建笔记
            </button>
            <button @click="closeNote" class="glassnotes-fullscreen-btn">
              关闭笔记
            </button>
          </div>
        </header>

        <!-- 主内容区 -->
        <div class="glassnotes-main">
          <!-- 侧边栏 -->
          <aside class="glassnotes-sidebar">
            <div class="glassnotes-search">
              <input v-model="searchQuery" placeholder="搜索笔记..." class="glassnotes-search-input" />
              <span class="glassnotes-search-icon">🔍</span>
            </div>

            <div class="glassnotes-list">
              <div v-for="note in filteredNotes" :key="note.id" @click="selectNote(note.id)"
                :class="['glassnotes-item', { 'active': activeNoteId === note.id }]"
                :style="{ '--note-color': note.color }">
                <h3 class="glassnotes-item-title">{{ note.title || '未命名笔记' }}</h3>
                <p class="glassnotes-item-preview">{{ truncateContent(note.content) }}</p>
                <span class="glassnotes-item-date">{{ formatDate(note.updatedAt) }}</span>
              </div>
            </div>
          </aside>

          <!-- 编辑区 -->
          <div class="glassnotes-editor">
            <div v-if="activeNote" class="glassnotes-editor-content">
              <!-- 工具栏 -->
              <div class="glassnotes-toolbar">
                <button v-for="style in textStyles" :key="style.name" @click="applyTextStyle(style.tag)"
                  class="glassnotes-tool-btn" :title="style.name">
                  {{ style.icon }}
                </button>
                <select v-model="activeNote.color" class="glassnotes-color-picker">
                  <option v-for="color in noteColors" :value="color.value" :key="color.value">
                    {{ color.label }}
                  </option>
                </select>
                <button @click="confirmDeleteNote" class="glassnotes-delete-btn">
                  🗑️ 删除
                </button>
                <button @click="saveNote" class="glassnotes-save-btn" :disabled="!hasChanges">
                  💾 {{ saving ? '保存中...' : '保存' }}
                </button>
              </div>

              <!-- 编辑区 -->
              <input v-model="activeNote.title" placeholder="笔记标题" class="glassnotes-title-input"
                :style="{ color: activeNote.color }" />
              <textarea v-model="activeNote.content" ref="editor" placeholder="开始记录你的想法..."
                class="glassnotes-content-input" @input="handleContentChange"></textarea>

              <!-- 预览区 -->
              <div class="glassnotes-preview" v-html="compiledMarkdown"></div>
            </div>

            <!-- 空状态 -->
            <div v-else class="glassnotes-empty">
              <div class="glassnotes-empty-icon">📝</div>
              <h2>选择或创建笔记</h2>
              <p>让灵感在玻璃般清澈的界面中流动</p>
              <button @click="createNewNote" class="glassnotes-empty-btn">
                创建第一份笔记
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 删除确认弹窗 -->
      <div v-if="showDeleteConfirm" class="glassnotes-modal">
        <div class="glassnotes-dialog">
          <h3>确认删除</h3>
          <p>确定要删除这篇笔记吗？此操作不可撤销。</p>
          <div class="glassnotes-dialog-actions">
            <button @click="showDeleteConfirm = false" class="glassnotes-cancel-btn">
              取消
            </button>
            <button @click="deleteNote" class="glassnotes-confirm-btn">
              确认删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { marked } from 'marked'
import { ElMessage } from 'element-plus';
import DOMPurify from 'dompurify'
import request from '@/utils/request'

const emit = defineEmits(['close'])

// 状态管理
const darkMode = ref(false)
const searchQuery = ref('')
const notes = ref([])
const activeNoteId = ref(null)
const activeNote = ref(null)
const showDeleteConfirm = ref(false)
const saving = ref(false)
const lastSavedContent = ref('')

// 笔记颜色选项
const noteColors = [
  { label: '默认', value: '#ffffff' },
  { label: '柔红', value: '#ffb3ba' },
  { label: '柔橙', value: '#ffdfba' },
  { label: '柔黄', value: '#ffffba' },
  { label: '柔绿', value: '#baffc9' },
  { label: '柔蓝', value: '#bae1ff' },
  { label: '柔紫', value: '#d9baff' }
]

// 文本样式选项
const textStyles = [
  { name: '加粗', tag: 'bold', icon: 'B' },
  { name: '斜体', tag: 'italic', icon: 'I' },
  { name: '标题1', tag: 'h1', icon: 'H1' },
  { name: '标题2', tag: 'h2', icon: 'H2' },
  { name: '引用', tag: 'quote', icon: '❝' },
  { name: '代码', tag: 'code', icon: '</>' },
  { name: '链接', tag: 'link', icon: '🔗' }
]

// 计算属性
const filteredNotes = computed(() => {
  return notes.value.filter(note => {
    if (!note || !note.title || !note.content) return false;
    return (
      note.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

const compiledMarkdown = computed(() => {
  return activeNote.value && activeNote.value.content
    ? DOMPurify.sanitize(marked(activeNote.value.content))
    : ''
})

const hasChanges = computed(() => {
  return activeNote.value &&
    (activeNote.value.content !== lastSavedContent.value ||
      activeNote.value.title !== lastSavedContent.title)
})

// 生命周期钩子
onMounted(() => {
  loadNotes()
  // 初始化示例数据
  if (notes.value.length === 0) {
    notes.value = [{}]
    activeNoteId.value = '1'
    activeNote.value = { ...notes.value[0] }
    lastSavedContent.value = activeNote.value.content
  }
})

// 方法
const loadNotes = () => {
  // 实际项目中这里应该是API调用
  const savedNotes = localStorage.getItem('glass-notes')
  if (savedNotes) {
    notes.value = JSON.parse(savedNotes)
  }
}
// 本地获取用户数据
const user = JSON.parse(localStorage.getItem('user'))

const saveNotes = async () => {
  if (!activeNote.value) return

  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user?.username) {
      throw new Error('请先登录后再保存笔记')
    }
    const response = await request.post('/api/public/notes/insert', {
      id: activeNote.value.id,
      title: activeNote.value.title,
      content: activeNote.value.content,
      color: activeNote.value.color,
      updatedAt: activeNote.value.updatedAt,
      username: user.username
    })
    if (response.code === 200 || response.code === '0') {
      ElMessage.success('笔记保存成功')
      console.log('笔记保存成功')
      // 同时保存到本地存储
      const savedNotes = localStorage.getItem('glass-notes') || '[]'
      const notes = JSON.parse(savedNotes)
      const existingIndex = notes.findIndex(n => n.id === activeNote.value.id)
      if (existingIndex >= 0) {
        notes[existingIndex] = { ...activeNote.value }
      } else {
        notes.push({ ...activeNote.value })
      }
      localStorage.setItem('glass-notes', JSON.stringify(notes))
      return true
    } else {
      throw new Error(response.message || '保存失败，请重试')
    }
  } catch (error) {
    ElMessage.error('保存笔记失败')
    console.error('保存笔记失败:', error)
    return false
  }
}

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
}

const createNewNote = () => {
  const newNote = {
    id: Date.now().toString(),
    title: '',
    content: '',
    color: '#ffffff',
    updatedAt: new Date().toISOString()
  }
  notes.value.unshift(newNote)
  selectNote(newNote.id)
}

const selectNote = (id) => {
  activeNoteId.value = id
  const note = notes.value.find(n => n.id === id)
  if (note) {
    activeNote.value = { ...note }
    lastSavedContent.value = activeNote.value.content
  }
}

const saveNote = () => {
  if (!activeNote.value) return

  saving.value = true
  activeNote.value.updatedAt = new Date().toISOString()

  const index = notes.value.findIndex(n => n.id === activeNoteId.value)
  if (index !== -1) {
    notes.value[index] = { ...activeNote.value }
  }

  saveNotes()
  lastSavedContent.value = activeNote.value.content

  setTimeout(() => {
    saving.value = false
  }, 800)
}

const handleContentChange = () => {
  // 自动保存逻辑可以在这里实现
}

const confirmDeleteNote = () => {
  if (activeNoteId.value) {
    showDeleteConfirm.value = true
  }
}

const deleteNote = () => {
  const index = notes.value.findIndex(n => n.id === activeNoteId.value)
  if (index !== -1) {
    notes.value.splice(index, 1)
    saveNotes()
  }

  if (notes.value.length > 0) {
    selectNote(notes.value[0].id)
  } else {
    activeNoteId.value = null
    activeNote.value = null
  }

  showDeleteConfirm.value = false
}
const closeNote = () => {
  console.log('closeNote');
  emit('close');
};
const applyTextStyle = (tag) => {
  if (!activeNote.value) return

  const textarea = document.querySelector('.glassnotes-content-input')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = activeNote.value.content.substring(start, end)
  let newText = ''

  switch (tag) {
    case 'bold':
      newText = `**${selectedText}**`
      break
    case 'italic':
      newText = `*${selectedText}*`
      break
    case 'h1':
      newText = `# ${selectedText}`
      break
    case 'h2':
      newText = `## ${selectedText}`
      break
    case 'quote':
      newText = `> ${selectedText}`
      break
    case 'code':
      newText = `\`${selectedText}\``
      break
    case 'link':
      newText = `[${selectedText}](url)`
      break
    default:
      newText = selectedText
  }

  activeNote.value.content =
    activeNote.value.content.substring(0, start) +
    newText +
    activeNote.value.content.substring(end)

  // 保持焦点在文本框
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start, start + newText.length)
  })
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const truncateContent = (content) => {
  if (!content) return ''
  const plainText = content.replace(/[#*`>\[\]]/g, '')
  return plainText.length > 60 ? plainText.substring(0, 60) + '...' : plainText
}

// 监听暗黑模式变化
watch(darkMode, (newVal) => {
  document.body.className = newVal ? 'dark' : ''
})
</script>

<style scoped>
/* 基础样式 */
.glassnotes-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
}

.glassnotes-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1100;
  max-width: 1000px;
  max-width: 80vh;
  border-radius: 25px;
  overflow: hidden;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

}

/* 星空背景动画 */
.glassnotes-stars,
.glassnotes-twinkling {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.glassnotes-stars {
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 0;
}

.glassnotes-twinkling {

  z-index: 1;
  animation: twinkle 200s linear infinite;
}

@keyframes twinkle {
  from {
    background-position: 0 0;
  }

  to {
    background-position: -10000px 5000px;
  }
}

/* 主应用容器 */
.glassnotes-app {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

/* 头部样式 - 玻璃拟态 */
.glassnotes-header {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
}

.glassnotes-logo {
  margin: 0;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.glassnotes-actions {
  display: flex;
  gap: 1rem;
}

/* 按钮样式 */
.glassnotes-mode-btn,
.glassnotes-new-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.glassnotes-fullscreen-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.glassnotes-mode-btn:hover,
.glassnotes-new-btn:hover,
.glassnotes-fullscreen-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 主内容区 */
.glassnotes-main {
  display: flex;
  flex: 1;
  gap: 2rem;
}

/* 侧边栏 - 玻璃拟态 */
.glassnotes-sidebar {
  width: 300px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  display: flex;
  flex-direction: column;
}

.glassnotes-search {
  position: relative;
  margin-bottom: 1.5rem;
}

.glassnotes-search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border-radius: 50px;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(5px);
}

.glassnotes-search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.glassnotes-search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
}

/* 笔记列表 */
.glassnotes-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* 自定义滚动条 */
.glassnotes-list::-webkit-scrollbar {
  width: 6px;
}

.glassnotes-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.glassnotes-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.glassnotes-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 笔记项 */
.glassnotes-item {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid var(--note-color, #ffffff);
}

.glassnotes-item:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(4px);
}

.glassnotes-item.active {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.glassnotes-item-title {
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
}

.glassnotes-item-preview {
  margin: 0 0 0.5rem 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.4;
}

.glassnotes-item-date {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
}

/* 编辑器区域 */
.glassnotes-editor {
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  display: flex;
  flex-direction: column;
}

.glassnotes-editor-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 工具栏 */
.glassnotes-toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.glassnotes-tool-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.glassnotes-tool-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.glassnotes-color-picker {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  height: 36px;
  margin-left: auto;
}

.glassnotes-color-picker option {
  background: #333;
  color: white;
}

.glassnotes-delete-btn,
.glassnotes-save-btn {
  padding: 0 1rem;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.glassnotes-delete-btn {
  background: rgba(255, 88, 88, 0.3);
  border: 1px solid rgba(255, 88, 88, 0.5);
  color: #ffcccc;
}

.glassnotes-delete-btn:hover {
  background: rgba(255, 88, 88, 0.4);
}

.glassnotes-save-btn {
  background: rgba(100, 255, 100, 0.3);
  border: 1px solid rgba(100, 255, 100, 0.5);
  color: #ccffcc;
}

.glassnotes-save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.glassnotes-save-btn:not(:disabled):hover {
  background: rgba(100, 255, 100, 0.4);
}

/* 输入区域 */
.glassnotes-title-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.8rem 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  width: 100%;
}

.glassnotes-title-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.glassnotes-content-input {
  flex: 1;
  background: transparent;
  border: none;
  resize: none;
  padding: 0.8rem;
  font-size: 1rem;
  line-height: 1.6;
  color: white;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
}

.glassnotes-content-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

/* 预览区域 */
.glassnotes-preview {
  flex: 1;
  padding: 1rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  color: white;
  line-height: 1.6;
  overflow-y: auto;
}

.glassnotes-preview :deep(h1),
.glassnotes-preview :deep(h2),
.glassnotes-preview :deep(h3) {
  color: white;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.glassnotes-preview :deep(p) {
  margin-bottom: 1rem;
}

.glassnotes-preview :deep(a) {
  color: #bae1ff;
}

.glassnotes-preview :deep(code) {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}

.glassnotes-preview :deep(pre) {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

/* 空状态 */
.glassnotes-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.glassnotes-empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.glassnotes-empty h2 {
  color: white;
  margin-bottom: 0.5rem;
}

.glassnotes-empty-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.glassnotes-empty-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* 模态框 */
.glassnotes-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glassnotes-dialog {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
}

.glassnotes-dialog h3 {
  color: white;
  margin-top: 0;
}

.glassnotes-dialog p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
}

.glassnotes-dialog-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.glassnotes-cancel-btn,
.glassnotes-confirm-btn {
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.glassnotes-cancel-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
}

.glassnotes-cancel-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.glassnotes-confirm-btn {
  background: rgba(255, 88, 88, 0.6);
  border: 1px solid rgba(255, 88, 88, 0.8);
  color: white;
}

.glassnotes-confirm-btn:hover {
  background: rgba(255, 88, 88, 0.7);
}

/* 暗黑模式 */
.dark .glassnotes-header,
.dark .glassnotes-sidebar,
.dark .glassnotes-editor {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .glassnotes-item {
  background: rgba(0, 0, 0, 0.2);
}

.dark .glassnotes-item:hover {
  background: rgba(0, 0, 0, 0.3);
}

.dark .glassnotes-item.active {
  background: rgba(0, 0, 0, 0.4);
}

.dark .glassnotes-content-input,
.dark .glassnotes-title-input {
  color: #f0f0f0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .glassnotes-main {
    flex-direction: column;
  }

  .glassnotes-sidebar {
    width: 100%;
    margin-bottom: 2rem;
  }
}

@media (max-width: 768px) {
  .glassnotes-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .glassnotes-actions {
    width: 100%;
    justify-content: center;
  }

  .glassnotes-app {
    padding: 1rem;
  }
}
</style>