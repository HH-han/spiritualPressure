<template>
    <div class="glass-app">
        <div class="header">
            <h1>旅行笔记</h1>
        </div>
        <div class="notes-container">
            <div v-for="note in notes" :key="note.id" class="glass-note"
                @click="selectNote(note.id)">
                <div class="note-header">
                    <h3>{{ note.title }}</h3>
                    <div class="note-actions">
                        <button @click.stop="editNote(note.id)" class="icon-button">
                            <svg t="1751019530438" class="icon" viewBox="0 0 1070 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6150"><path d="M876.683636 1014.737455H175.848727a153.320727 153.320727 0 0 1-153.181091-153.134546V160.721455a153.320727 153.320727 0 0 1 153.134546-153.134546h350.487273a50.362182 50.362182 0 1 1 0 100.770909h-350.487273c-28.858182 0-52.363636 23.458909-52.363637 52.363637v700.881454c0 28.858182 23.458909 52.363636 52.410182 52.363636h700.834909c28.858182 0 52.363636-23.458909 52.363637-52.363636v-350.487273a50.362182 50.362182 0 1 1 100.817454 0v350.487273a153.320727 153.320727 0 0 1-153.181091 153.134546z" fill="#FFB730" p-id="6151"></path><path d="M475.089455 799.650909c-2.141091 0-4.142545-0.139636-6.237091-0.372364l-158.72-19.828363a50.269091 50.269091 0 0 1-43.659637-43.659637l-19.828363-158.72c-1.861818-15.453091 3.397818-30.906182 14.382545-41.890909l442.042182-442.042181a154.763636 154.763636 0 0 1 218.670545 0l31.045819 30.999272c29.277091 29.184 45.335273 67.956364 45.335272 109.381818a153.6 153.6 0 0 1-45.335272 109.428364l-442.042182 441.949091a50.408727 50.408727 0 0 1-35.653818 14.754909z m-113.617455-115.293091l95.325091 11.915637 424.587636-424.587637a53.666909 53.666909 0 0 0 0-76.241454l-31.045818-31.045819a53.992727 53.992727 0 0 0-76.194909 0L349.556364 588.986182l11.915636 95.371636z" fill="#FFB730" p-id="6152"></path></svg>
                        </button>
                        <button @click.stop="deleteNote(note.id)" class="icon-button">
                            <svg t="1751019574529" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7140" width="256" height="256"><path d="M519.620465 0c-103.924093 0-188.511256 82.467721-192.083349 185.820279H85.015814A48.91386 48.91386 0 0 0 36.101953 234.686512a48.91386 48.91386 0 0 0 48.913861 48.866232h54.010046V831.345116c0 102.852465 69.822512 186.844279 155.909954 186.844279h439.200744c86.087442 0 155.909953-83.491721 155.909954-186.844279V284.100465h48.91386a48.91386 48.91386 0 0 0 48.913861-48.890046 48.91386 48.91386 0 0 0-48.913861-48.866233h-227.756651A191.559442 191.559442 0 0 0 519.620465 0z m-107.234232 177.080558c3.548279-49.771163 46.627721-88.540279 99.851907-88.540279 53.224186 0 96.327442 38.745302 99.351813 88.540279h-199.20372z m-111.997024 752.044651c-30.981953 0-65.083535-39.15014-65.083535-95.041488V287.744h575.488v546.839814c0 55.915163-34.077767 95.041488-65.059721 95.041488H300.389209v-0.500093z" fill="#D81E06" p-id="7141"></path><path d="M368.116093 796.814884c24.361674 0 44.27014-21.670698 44.27014-48.818605v-278.623256c0-27.147907-19.908465-48.818605-44.27014-48.818604-24.33786 0-44.27014 21.670698-44.27014 48.818604v278.623256c0 27.147907 19.360744 48.818605 44.293954 48.818605z m154.933581 0c24.361674 0 44.293953-21.670698 44.293954-48.818605v-278.623256c0-27.147907-19.932279-48.818605-44.293954-48.818604-24.33786 0-44.27014 21.670698-44.270139 48.818604v278.623256c0 27.147907 19.932279 48.818605 44.293953 48.818605z m132.810419 0c24.33786 0 44.27014-21.670698 44.27014-48.818605v-278.623256c0-27.147907-19.932279-48.818605-44.27014-48.818604s-44.27014 21.670698-44.27014 48.818604v278.623256c0 27.147907 19.360744 48.818605 44.27014 48.818605z" fill="#D81E06" p-id="7142"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="note-content-preview" v-html="renderMarkdownPreview(note.content)"></div>
                <div class="note-footer">
                    <span>{{ formatDate(note.updatedAt) }}</span>
                </div>
            </div>
        </div>

        <div v-if="editingNote" class="glass-modal-overlay" @click.self="cancelEdit">
            <div class="glass-modal">
                <!-- 标题 -->
                <div class="modal-header">
                    <h3>修改标题：</h3>
                    <input v-model="editingNote.title" placeholder="标题" class="glass-input title-input" />
                </div>

                <div class="modal-content">
                    <div class="editor-container">
                        <!-- 输入框 -->
                        <h3>笔记编辑：</h3>
                        <textarea v-model="editingNote.content" placeholder="输入Markdown内容..."
                            class="glass-input markdown-editor container-textarea">
                        </textarea>
                        <!-- 预览区域 -->
                        <h3>笔记预览：</h3>
                        <div class="markdown-preview glass-preview" v-html="renderMarkdown(editingNote.content)"></div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button @click="cancelEdit" class="glass-button">取消</button>
                    <button @click="saveNote" class="glass-button primary">保存</button>
                </div>
            </div>
        </div>
        <!-- 自定义删除确认框 -->
        <div v-if="showDeleteConfirm" class="glass-modal-overlay" @click.self="cancelDelete">
            <div class="glass-delete-modal">
                <div class="modal-header">
                    <h3>删除确认</h3>
                </div>
                <div class="modal-content">
                    <p>确定要删除这条笔记吗？</p>
                    <p class="delete-note-title">"{{ noteToDelete?.title }}"</p>
                </div>
                <div class="modal-footer">
                    <button @click="cancelDelete" class="glass-button">取消</button>
                    <button @click="confirmDelete" class="glass-button danger">确认删除</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import request from '@/utils/request';
import { ElMessage } from 'element-plus'


const notes = ref([])
// 加载笔记列表
const fetchNotes = async () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const response = await request.get('/api/public/notes/search', {
      params: {
        username: userInfo?.username
      }
    })
    notes.value = response.data?.list || []
  } catch (error) {
    console.error('获取笔记失败:', error)
  }
}
// 初始化时获取数据
fetchNotes()
// 编辑状态
const editingNote = ref(null)
const originalNote = ref(null)

// 生成随机浅色
const getRandomLightColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 80%, 90%)`;
}


// 选择笔记进行编辑
const editNote = (id) => {
    const note = notes.value.find(n => n.id === id)
    if (note) {
        editingNote.value = { ...note }
        originalNote.value = note
    }
}

// 删除笔记
const deleteNote = (id) => {
  const note = notes.value.find(n => n.id === id);
  if (note) {
    noteToDelete.value = note;
    showDeleteConfirm.value = true;
  }
}
// 保存笔记
const saveNote = async () => {
  if (editingNote.value) {
    try {
      await request.put('/api/public/notes', editingNote.value);
      const index = notes.value.findIndex(n => n.id === originalNote.value.id);
      if (index !== -1) {
        editingNote.value.updatedAt = new Date().toISOString();
        notes.value[index] = { ...editingNote.value };
      }
        ElMessage.success('保存成功');
        cancelEdit();
    } catch (error) {
        ElMessage.error('保存失败');
        console.error('更新笔记失败:', error);
    }
  }
}

// 取消编辑
const cancelEdit = () => {
    editingNote.value = null
    originalNote.value = null
}
// 选择笔记查看
const selectNote = (id) => {
    const note = notes.value.find(n => n.id === id)
    if (note) {
        editNote(id)
    }
}

// Markdown渲染
const renderMarkdown = (content) => {
    if (!content) return ''
    return DOMPurify.sanitize(marked(content))
}

// 预览Markdown渲染 (简略版)
const renderMarkdownPreview = (content) => {
    if (!content) return ''
    const plainText = content.replace(/#+\s|\[|\]|\(|\)|\*|\_|`/g, '')
    const shortText = plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText
    return DOMPurify.sanitize(shortText)
}

// 日期格式化
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString(undefined, options)
}

// 调整颜色透明度
const adjustOpacity = (color, opacity) => {
    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        return { r, g, b }
    }
    const rgb = hexToRgb(color)
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
}
// 新增的删除相关状态
const showDeleteConfirm = ref(false)
const noteToDelete = ref(null)

// 新增的删除确认函数
const confirmDelete = async () => {
    if (noteToDelete.value) {
        try {
            await request.delete(`/api/public/notes/${noteToDelete.value.id}`);
            notes.value = notes.value.filter(note => note.id !== noteToDelete.value.id);
            ElMessage.success('删除成功');
            cancelDelete();
        } catch (error) {
            ElMessage.error('删除笔记失败');
            console.error('删除笔记失败:', error);
        }
    }
}

// 新增的取消删除函数
const cancelDelete = () => {
    showDeleteConfirm.value = false
    noteToDelete.value = null
}

</script>

<style scoped>
/* 基础样式 */
.glass-app {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    min-height: 100vh;
    padding: 2rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(197, 197, 197, 0.2) 100%);
    backdrop-filter: blur(10px);
    color: #fff;
    border-radius: 25px;
}

/* 头部样式 */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header h1 {
    margin: 0;
    font-weight: 600;
    font-size: 2rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 玻璃按钮样式 */
.glass-button {
    padding: 0.6rem 1.2rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 2rem;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.glass-button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
}

.glass-button.primary {
    background: rgba(101, 115, 255, 0.3);
}

.glass-button.primary:hover {
    background: rgba(101, 115, 255, 0.4);
}

.glass-button.danger {
    background: rgba(255, 90, 90, 0.3);
}

.glass-button.danger:hover {
    background: rgb(255, 0, 0);
}

/* 笔记容器 */
.notes-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
}

/* 玻璃笔记卡片 */
.glass-note {
    padding: 1.5rem;
    border-radius: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-note:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.note-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.note-header h3 {
    margin: 0;
    font-weight: 600;
    font-size: 1.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 70%;
}

.note-actions {
    display: flex;
    gap: 0.5rem;
}

.icon-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    opacity: 0.7;
    transition: all 0.2s ease;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}
.icon-button:hover {
    opacity: 1;
}

.note-content-preview {
    flex-grow: 1;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    line-height: 1.5;
    opacity: 0.9;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    line-clamp: 5;
    -webkit-box-orient: vertical;
}

.note-footer {
    font-size: 0.8rem;
    opacity: 0.7;
    margin-top: auto;
}

/* 模态框样式 */
.glass-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 25px;
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.glass-delete-modal{
    width: 400px;
    border-radius: 25px;
    background-color: rgba(255, 255, 255, 0.5);
    border: 2px solid #ff6b6b;
    padding: 20px;

}
.glass-modal {
    width: 80%;
    max-width: 800px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
    backdrop-filter: blur(12px);
    overflow: hidden;
    color: #fff;
}

.modal-header {
    padding: 20px;
    display: flex;
    gap: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-direction: column;
}

.modal-content {
    padding: 20px;
}

.modal-footer {
    padding: 15px 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.editor-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 20px;
}

.glass-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 12px 15px;
    color: white;
    font-size: 16px;
    transition: all 0.3s ease;
    outline: none;
}

.glass-input:focus {
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
    border: 2px dashed rgba(167, 41, 206, 0.473);
}

.title-input {
    font-size: 20px;
    font-weight: bold;
}

.markdown-editor {
    color: #000;
    height: 250px;
    resize: none;
    font-family: 'Courier New', monospace;
    -ms-overflow-style: none;
}
.markdown-editor::-webkit-scrollbar {
  display: none;
}
/* 编辑背景 */
.container-textarea {
  width: 100%;
  --color: #E1E1E1;
  background-color: #F3F3F3;
  background-image: linear-gradient(0deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent),
      linear-gradient(90deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent);
  background-size: 55px 55px;
}
.glass-preview {
    height: 250px;
    overflow-y: auto;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    -ms-overflow-style: none;
}
/* 编辑器样式 */
.delete-note-title {
    font-weight: 600;
    margin-top: 0.5rem;
    color: #ff6b6b;
    text-align: center;
}
.glass-preview::-webkit-scrollbar {
  display: none;
}
/* 响应式调整 */
@media (max-width: 768px) {
    .editor-container {
        grid-template-columns: 1fr;
        height: auto;
    }

    .notes-container {
        grid-template-columns: 1fr;
    }

    .glass-modal {
        width: 95%;
    }
}
</style>