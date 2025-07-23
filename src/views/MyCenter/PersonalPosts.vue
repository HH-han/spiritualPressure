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
.notes-container {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(197, 197, 197, 0.2) 100%);
  backdrop-filter: blur(10px);
  color: #fff;
  border-radius: 25px;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.notes-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.note-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(197, 197, 197, 0.2) 100%);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.note-card.active {
  border-left: 4px solid #4CAF50;
}

.note-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.note-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.note-date {
  font-size: 12px;
  color: #666;
}

.note-preview {
  color: #666;
  margin: 10px 0;
  flex-grow: 1;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 10px 0;
}

.tag {
  background: #e0f7fa;
  color: #00838f;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.note-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
  color: #666;
  margin: 10px 0;
}

.note-meta i {
  margin-right: 3px;
}

.note-location {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  opacity: 0.9;
}
.author{
  font-size: 1rem;
  opacity: 0.9;
  color: #000;
}
.note-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.note-actions button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.view-btn {
  background: #2196F3;
  color: white;
}

.edit-btn {
  background: #FFC107;
  color: #333;
}

.edit-btn-primary {
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
}

.delete-btn {
  background: #f44336;
  color: white;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3,
h2 {
  margin: 0;
  color: #333;
}

.note-img-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.note-image {
  max-width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333; /* 添加字体颜色确保可见 */
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 2px solid #b4b4b4;
  border-radius: 10px;
  font-size: 14px;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}
.image-preview-container {
  position: relative;
}
.preview-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.preview-image {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
  border-radius: 4px;
}
.note-images {
  width: 100%;
  padding: 8px;
  border: 2px solid #b4b4b4;
  border-radius: 10px;
  font-size: 14px;
  resize: vertical;
  height: 100px;
}
.add-image-btn {
  position: absolute;
  top: 40%;
  right: 50%;
  transform: translate(50%, -50%);
  background: none;
  color: rgb(155, 155, 155);
  border: none;
  border-radius: 50%;
  font-size: 90px;
  cursor: pointer;
  
}
.add-image-btn svg {
  transition: transform 0.2s ease;
  width: 60px;
  height: 60px;
}
.add-image-btn svg:hover {
  transform: scale(1.1);
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  background: #f5f5f5;
  color: #333;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn {
  background: #4CAF50;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

/* 详情模态框样式 */
.details-modal {
  max-width: 700px;
}

.details-modal .note-content {
  margin: 20px 0;
  line-height: 1.6;
  color: #000;
}

.details-modal .modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* 删除确认对话框 */
.confirm-dialog {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
}

.confirm-content {
  margin: 20px 0;
}

.confirm-content p {
  color: #000;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirm-actions button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-delete {
  background: #f44336;
  color: white;
}

@media (max-width: 768px) {
  .notes-list {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
  }
}
</style>