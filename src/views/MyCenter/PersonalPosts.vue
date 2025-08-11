<template>
  <div class="notes-container">
    <!-- 顶部标题栏 -->
    <div class="notes-header">
      <h1>我的发布管理</h1>
    </div>

    <!-- 笔记列表 -->
    <div class="notes-list">
      <div v-for="note in notes" :key="note.id" class="note-card" :class="{ 'active': activeNoteId === note.id }"
        @click="setActiveNote(note.id)">
        <div class="note-header">
          <h3>{{ note.title }}</h3>
          <span class="note-date">{{ formatDate(note.date) }}</span>
        </div>
        <p class="note-preview">{{ truncateContent(note.content) }}</p>
        <div class="note-tags">
          <span v-for="tag in parseTags(note.tags)" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div class="note-meta">
          <span class="note-location" v-if="note.location"><i class="icon-location"></i> {{ note.location }}</span>
          <span class="author"><i class="icon-user"></i> {{ note.username }}</span>
        </div>
        <div class="note-actions">
          <button class="view-btn" @click.stop="openDetails(note)">查看</button>
          <button class="edit-btn" @click.stop="openEditor(note)">编辑</button>
          <button class="delete-btn" @click.stop="postToDelete(note.id)">删除</button>
        </div>
      </div>
    </div>

    <!-- 笔记编辑器模态框 -->
    <div v-if="showEditor" class="modal-overlay" @click.self="closeEditor">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingNote ? '编辑笔记' : '新建笔记' }}</h2>
          <button class="close-btn" @click="closeEditor">&times;</button>
        </div>
        <form @submit.prevent="submitNote">
          <div class="form-group">
            <label>标题:</label>
            <input v-model="editorData.title" type="text" required>
          </div>
          <div class="form-group">
            <label>位置:</label>
            <input v-model="editorData.location" type="text" placeholder="例如: 昆明">
          </div>
          <div class="form-group">
            <label>日期:</label>
            <input v-model="editorData.date" type="datetime-local">
          </div>
          <div class="form-group">
            <label>标签 (逗号分隔):</label>
            <input v-model="editorData.tagsInput" type="text" placeholder="例如: 旅行,探险">
          </div>
          <div class="form-group">
            <label>图片:</label>
            <div class="image-preview-container">
              <div v-if="editorData.images" class="preview-images">
                <img v-for="(img, index) in editorData.images.split('\n')" 
                    :key="index" 
                    :src="img" 
                    class="preview-image" />
              </div>
              <input v-model="editorData.images" rows="8" required class="note-images"></input>
              <button @click="addImage" class="add-image-btn" type="button" title="添加图片">
                <svg t="1752841532188" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12057"><path d="M896 0 128 0C57.6 0 0 57.6 0 128L0 896C0 966.4 57.6 1024 128 1024L896 1024C966.4 1024 1024 966.4 1024 896L1024 128C1024 57.6 966.4 0 896 0L896 0ZM256 128C326.4 128 384 185.6 384 256 384 326.4 326.4 384 256 384 185.6 384 128 326.4 128 256 128 185.6 185.6 128 256 128L256 128ZM64 960 64 838.4 179.2 684.8C224 627.2 294.4 627.2 339.2 678.4L563.2 953.6 64 953.6 64 960ZM960 960 640 960 512 793.6 723.2 524.8C768 467.2 838.4 467.2 883.2 524.8L966.4 633.6 966.4 960 960 960Z" fill="#666666" p-id="12058"></path></svg>
              </button>
            </div>
          </div>
          <div class="form-group">
            <label>内容:</label>
            <textarea v-model="editorData.content" rows="8" required></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeEditor">取消</button>
            <button type="submit" class="save-btn" :disabled="isSubmitting">
              {{ isSubmitting ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 笔记详情模态框 -->
    <div v-if="showDetails" class="modal-overlay" @click.self="closeDetails">
      <div class="modal-content details-modal">
        <div class="modal-header">
          <h2>{{ currentNote.title }}</h2>
          <button class="close-btn" @click="closeDetails">&times;</button>
        </div>
        <div class="note-img">
          <div class="note-img-container" v-if="currentNote.images && currentNote.images.length">
            <img :src="currentNote.images" alt="Note image"
              class="note-image" />
          </div>
        </div>
        <div class="note-meta">
          <span class="date"><i class="icon-calendar"></i> {{ formatDateTime(currentNote.date) }}</span>
          <span class="note-location" v-if="currentNote.location"><i class="icon-location"></i> {{ currentNote.location
          }}</span>
          <span class="author"><i class="icon-user"></i> {{ currentNote.username }}</span>
        </div>
        <div class="note-tags">
          <span v-for="tag in parseTags(currentNote.tags)" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div class="note-content">
          <span class="note-content" v-if="currentNote.location"><i class="icon-location"></i> {{ currentNote.content
            }}</span>
        </div>
        <div class="modal-footer">
          <button class="edit-btn edit-btn-primary" @click="openEditor(currentNote)">编辑</button>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirm" class="modal-overlay">
      <div class="confirm-dialog">
        <div class="modal-header">
          <h3>确认删除</h3>
        </div>
        <div class="confirm-content">
          <p>确定要删除这篇笔记吗？此操作无法撤销。</p>
        </div>
        <div class="confirm-actions">
          <button @click="showDeleteConfirm = false">取消</button>
          <button @click="confirmDelete" class="confirm-delete">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

// 笔记数据
const notes = ref([])
const activeNoteId = ref(null)
const isSubmitting = ref(false)
const currentNote = ref({})

// 模态框状态
const showEditor = ref(false)
const showDetails = ref(false)
const showDeleteConfirm = ref(false)
const editingNote = ref(null)
const noteToDelete = ref(null)

// 编辑器数据
const editorData = ref({
  title: '',
  content: '',
  location: '',
  date: '',
  tagsInput: ''
})

// 加载笔记列表
const fetchNotes = async () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const response = await request.get('/api/public/posts', {
      params: {
        username: userInfo?.username
      }
    })
    notes.value = response.data?.list || []
  } catch (error) {
    console.error('获取笔记失败:', error)
  }
}

// 设置当前活动笔记
const setActiveNote = (id) => {
  activeNoteId.value = id
}

// 打开详情模态框
const openDetails = (note) => {
  currentNote.value = note
  showDetails.value = true
}

// 关闭详情模态框
const closeDetails = () => {
  showDetails.value = false
}

// 打开编辑器模态框
const openEditor = (note = null) => {
  editingNote.value = note
  if (note) {
    editorData.value = {
      title: note.title,
      content: note.content,
      location: note.location || '',
      date: note.date ? formatDateForInput(note.date) : '',
      tagsInput: parseTags(note.tags).join(', ')
    }
  } else {
    editorData.value = {
      title: '',
      content: '',
      location: '',
      date: '',
      tagsInput: ''
    }
  }
  showEditor.value = true
  showDetails.value = false
}

// 关闭编辑器模态框
const closeEditor = () => {
  showEditor.value = false
}

// 提交笔记
const submitNote = async () => {
  isSubmitting.value = true
  try {
    const noteData = {
      title: editorData.value.title,
      content: editorData.value.content,
      location: editorData.value.location,
      date: editorData.value.date,
      tags: editorData.value.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    if (editingNote.value) {
      // 更新现有笔记
      await request.put(`/api/public/posts/${editingNote.value.id}`, { data: JSON.stringify(noteData) })
    } else {
      // 创建新笔记
      await request.post('/api/public/posts', { data: JSON.stringify(noteData) })
    }

    await fetchNotes()
    closeEditor()
  } catch (error) {
    ElMessage.error('保存笔记失败')
    console.error('保存笔记失败:', error)
  } finally {
    isSubmitting.value = false
  }
}
//删除
const postToDelete = (id) => {
  noteToDelete.value = id;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (noteToDelete.value) {
    try {
      await request.delete(`/api/public/posts/${noteToDelete.value}`);
      await fetchNotes();
      showDeleteConfirm.value = false;
      ElMessage.success('删除成功');
    } catch (error) {
      ElMessage.error('删除失败');
      console.error('删除失败:', error);
    }
  }
};
// 辅助函数
const parseTags = (tags) => {
  if (!tags) return []
  return typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString()
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16)
}

const truncateContent = (content) => {
  if (!content) return ''
  return content.length > 100 ? content.substring(0, 100) + '...' : content
}

// 初始化加载
onMounted(fetchNotes)
</script>

<style scoped>
/* 基础样式与变量定义 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

body {
  background: #f5f6fa;
  color: #2d3436;
  min-height: 100vh;
}

/* 容器样式 */
.notes-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* 头部样式 - Liquid Glass 效果 */
.notes-header {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  text-align: center;
}

.notes-header h1 {
  color: #6c5ce7;
  font-size: 2.2rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 笔记列表网格布局 */
.notes-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

/* 笔记卡片 - Liquid Glass 效果 */
.note-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.note-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  z-index: -1;
}

.note-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.25);
}

.note-card.active {
  border: 1px solid #6c5ce7;
  box-shadow: 0 0 0 2px #a29bfe;
}

/* 笔记卡片内部元素 */
.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.note-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #6c5ce7;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.note-date {
  font-size: 0.85rem;
  color: #636e72;
  margin-left: 1rem;
}

.note-preview {
  color: #2d3436;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 标签样式 */
.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: rgba(108, 92, 231, 0.15);
  color: #6c5ce7;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tag:hover {
  background: rgba(108, 92, 231, 0.3);
}

/* 元信息样式 */
.note-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #636e72;
}

.note-meta span {
  display: flex;
  align-items: center;
}

.note-meta i {
  margin-right: 0.3rem;
  font-size: 0.9rem;
}

/* 按钮区域 */
.note-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.note-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn {
  background: rgba(45, 52, 54, 0.1);
  color: #2d3436;
}

.view-btn:hover {
  background: rgba(45, 52, 54, 0.2);
}

.edit-btn {
  background: rgba(253, 121, 168, 0.1);
  color: #fd79a8;
}

.edit-btn:hover {
  background: rgba(253, 121, 168, 0.2);
}

.delete-btn {
  background: rgba(214, 48, 49, 0.1);
  color: #d63031;
}

.delete-btn:hover {
  background: rgba(214, 48, 49, 0.2);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  padding: 15px;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  display: flex;
  flex-direction: column;
  gap: 15px;
  animation: fadeIn 0.3s ease;
}

.modal-content::-webkit-scrollbar {
  display: none;            /* Chrome, Safari, Opera */
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  color: #6c5ce7;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #636e72;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.25rem;
  line-height: 1;
}

.close-btn:hover {
  color: #fd79a8;
  transform: rotate(90deg);
}

/* 表单样式 */
.form-group {
  margin-bottom: 1.5rem;
  padding: 0 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3436;
}

.form-group input,
.form-group textarea,
.form-group .note-images {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.3);
  color: #2d3436;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group .note-images:focus {
  outline: none;
  border-color: #6c5ce7;
  box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
}

.form-group textarea,
.form-group .note-images {
  min-height: 120px;
  resize: vertical;
}

/* 图片预览 */
.image-preview-container {
  position: relative;
}

.preview-images {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.preview-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.add-image-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background: #6c5ce7;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-image-btn:hover {
  background: #a29bfe;
  transform: scale(1.1);
}

.add-image-btn svg {
  width: 18px;
  height: 18px;
}

/* 表单按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
}

.form-actions button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: rgba(45, 52, 54, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #2d3436;
}

.cancel-btn:hover {
  background: rgba(45, 52, 54, 0.2);
}

.save-btn {
  background: #6c5ce7;
  border: none;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #a29bfe;
  transform: translateY(-2px);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 详情模态框 */
.details-modal {
  max-width: 800px;
  padding: 15px;
}

.note-img {
  width: 100%;
}

.note-img-container {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 16px;
}

.note-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.note-image:hover {
  transform: scale(1.02);
}

.note-content {
  line-height: 1.6;
  color: #2d3436;
}

.modal-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  text-align: right;
}

.edit-btn-primary {
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn-primary:hover {
  background: #a29bfe;
}

/* 删除确认对话框 */
.confirm-dialog {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  width: 100%;
  max-width: 400px;
  padding: 1.5rem;
  animation: fadeIn 0.3s ease;
}

.confirm-content {
  padding: 1.5rem 0;
  text-align: center;
  color: #2d3436;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.confirm-actions button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-actions button:first-child {
  background: rgba(45, 52, 54, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #2d3436;
}

.confirm-actions button:first-child:hover {
  background: rgba(45, 52, 54, 0.2);
}

.confirm-delete {
  background: #d63031;
  border: none;
  color: white;
}

.confirm-delete:hover {
  background: #ff7675;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notes-list {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    max-height: 85vh;
  }
  
  .note-img-container {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .notes-container {
    padding: 1rem;
  }
  
  .note-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .note-actions button {
    width: 100%;
  }
  
  .form-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
  
  .form-actions button {
    width: 100%;
  }
}
</style>