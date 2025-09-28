<template>
  <!-- 选择按钮 -->
  <div class="emoji-option">
    <OptionItem label="图片表情" option-type="emoji" @select="showEmojiDialog = true">
      <template #icon>
        <svg t="1758944789375" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="4753" width="16" height="16">
          <path
            d="M341.333333 284.444444a56.888889 56.888889 0 0 1 56.888889 56.888889v113.777778a56.888889 56.888889 0 1 1-113.777778 0V341.333333a56.888889 56.888889 0 0 1 56.888889-56.888889z m341.333334 0a56.888889 56.888889 0 0 1 56.888889 56.888889v113.777778a56.888889 56.888889 0 1 1-113.777778 0V341.333333a56.888889 56.888889 0 0 1 56.888889-56.888889zM113.777778 74.524444a39.253333 39.253333 0 0 0-39.253334 39.253334v796.444444c0 21.674667 17.578667 39.253333 39.253334 39.253334h796.444444a39.253333 39.253333 0 0 0 39.253334-39.253334V113.777778a39.253333 39.253333 0 0 0-39.253334-39.253334H113.777778zM113.777778 0h796.444444a113.777778 113.777778 0 0 1 113.777778 113.777778v796.444444a113.777778 113.777778 0 0 1-113.777778 113.777778H113.777778a113.777778 113.777778 0 0 1-113.777778-113.777778V113.777778a113.777778 113.777778 0 0 1 113.777778-113.777778z m150.016 762.88a37.262222 37.262222 0 0 1 38.855111-63.658667c70.997333 43.349333 140.970667 64.739556 210.488889 64.739556 69.404444 0 139.434667-21.390222 210.488889-64.739556a37.262222 37.262222 0 1 1 38.798222 63.601778c-82.261333 50.232889-165.546667 75.662222-249.287111 75.662222-83.797333 0-167.082667-25.429333-249.344-75.662222z"
            fill="#6E6E6E" p-id="4754"></path>
        </svg>
      </template>
    </OptionItem>

    <!-- 表情选择对话框 -->
    <el-dialog v-model="showEmojiDialog" title="选择图片表情" width="600px" :before-close="handleClose"
      custom-class="emoji-dialog" :close-on-click-modal="true" :close-on-press-escape="true" align-center>
      <div class="emoji-dialog-content">


        <!-- 表情网格 -->
        <div class="emoji-grid">
          <div v-for="emoji in emojis" :key="emoji.id" class="emoji-item" @click="selectEmoji(emoji)">
            <el-image :src="emoji.image" :alt="emoji.name" fit="cover" class="emoji-image">
              <template #error>
                <div class="emoji-error">
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
            <div class="emoji-name">{{ emoji.name }}</div>
          </div>

          <!-- 新增表情按钮 -->
          <div class="emoji-item add-emoji-item" @click="openAddEmojiDialog">
            <div class="add-emoji-icon">
              <el-icon>
                <Plus />
              </el-icon>
            </div>
            <div class="emoji-name">新增表情</div>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="sendSelectedEmoji" :disabled="!selectedEmoji">
            发送表情
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增表情对话框 -->
    <el-dialog v-model="showAddEmojiDialog" title="新增图片表情" width="500px" :before-close="handleAddDialogClose"
      custom-class="add-emoji-dialog" :close-on-click-modal="true" :close-on-press-escape="true" align-center>
      <div class="add-emoji-content">
        <!-- 图片上传 -->
        <div class="upload-section">
          <div class="upload-title">选择图片</div>
          <el-upload class="emoji-upload" drag action="#" :auto-upload="false" :show-file-list="false"
            :on-change="handleFileChange" accept="image/*">
            <div class="upload-area">
              <el-icon class="upload-icon">
                <Upload />
              </el-icon>
              <div class="upload-text">
                <div>点击或拖拽图片到此处</div>
                <div class="upload-hint">支持 JPG、PNG、GIF 格式，大小不超过 2MB</div>
              </div>
            </div>
          </el-upload>

          <!-- 图片预览 -->
          <div v-if="newEmojiImage" class="image-preview has-image">
            <img :src="newEmojiImage" alt="表情预览" class="preview-image" />
            <div class="clear-btn" @click="clearImage">
              <el-icon>
                <Close />
              </el-icon>
            </div>
          </div>
          <div v-else class="upload-tip">
            请上传表情图片，支持 JPG、PNG、GIF 格式，大小不超过 2MB
          </div>
        </div>

        <!-- 表情信息 -->
        <div class="emoji-info-section">
          <div class="info-title">表情信息</div>
          <el-form :model="newEmojiForm" :rules="emojiRules" ref="emojiFormRef" label-width="80px">
            <el-form-item label="表情名称" prop="name">
              <el-input v-model="newEmojiForm.name" placeholder="请输入表情名称" maxlength="20" show-word-limit />
            </el-form-item>

          </el-form>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleAddDialogClose">取消</el-button>
          <el-button type="primary" @click="addNewEmoji" :disabled="!newEmojiImage || !newEmojiForm.name"
            :loading="addingEmoji">
            添加表情
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import OptionItem from './OptionItem.vue'
import { getEmojiImageList, addEmojiImage } from '@/api/im'

const emit = defineEmits(['select'])

// 对话框状态
const showEmojiDialog = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)
const selectedEmoji = ref(null)

// 模拟表情数据
const emojis = ref([])

// 分页后的表情
const paginatedEmojis = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return emojis.value.slice(start, end)
})

// 获取表情列表
const fetchEmojis = async () => {
  try {
    const response = await getEmojiImageList()
    emojis.value = response.data || []
  } catch (error) {
    console.error('获取表情列表失败:', error)
    ElMessage.error('获取表情列表失败，请稍后重试')
  }
}

// 选择表情
const selectEmoji = (emoji) => {
  selectedEmoji.value = emoji
  ElMessage.success(`已选择: ${emoji.name}`)
}

// 发送表情
const sendSelectedEmoji = () => {
  if (!selectedEmoji.value) {
    ElMessage.warning('请先选择一个表情')
    return
  }
  
  // 发送表情图片消息，传递表情数据
  emit('select', 'emoji', {
    name: selectedEmoji.value.name,
    image: selectedEmoji.value.image
  })
  
  // 关闭对话框
  showEmojiDialog.value = false
  // 重置选中状态
  selectedEmoji.value = null
}

// 关闭对话框
const handleClose = () => {
  showEmojiDialog.value = false
  selectedEmoji.value = null
  currentPage.value = 1
}

// 新增表情相关状态
const showAddEmojiDialog = ref(false)
const newEmojiImage = ref('')
const newEmojiForm = ref({
  name: ''
})
const addingEmoji = ref(false)
const emojiFormRef = ref(null)

// 表单验证规则
const emojiRules = {
  name: [
    { required: true, message: '请输入表情名称', trigger: 'blur' },
    { min: 1, max: 20, message: '表情名称长度在 1 到 20 个字符', trigger: 'blur' }
  ]
}

// 显示新增表情对话框
const openAddEmojiDialog = () => {
  showAddEmojiDialog.value = true
}

// 处理文件选择
const handleFileChange = (file) => {
  // 检查文件类型
  const isImage = file.raw.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('请选择图片文件')
    return
  }

  // 检查文件大小（2MB限制）
  const isLt2M = file.raw.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
    return
  }

  // 创建图片预览
  const reader = new FileReader()
  reader.onload = (e) => {
    newEmojiImage.value = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 清除图片
const clearImage = () => {
  newEmojiImage.value = ''
}

// 添加新表情
const addNewEmoji = async () => {
  if (!emojiFormRef.value) return

  try {
    // 验证表单
    await emojiFormRef.value.validate()

    if (!newEmojiImage.value) {
      ElMessage.error('请选择表情图片')
      return
    }

    addingEmoji.value = true

    // 调用真实API添加表情
    const response = await addEmojiImage({
      name: newEmojiForm.value.name,
      image: newEmojiImage.value
    })

    console.log('API响应:', response)

    if (response.code === "0") {
      // 添加成功后重新获取表情列表
      await fetchEmojis()
      ElMessage.success(`表情"${newEmojiForm.value.name}"添加成功`)
      
      // 重置表单
      handleAddDialogClose()
    } else {
      ElMessage.error(response.message || response.msg || '添加表情失败')
    }

  } catch (error) {
    console.error('添加表情失败:', error)
    ElMessage.error('添加表情失败，请重试')
  } finally {
    addingEmoji.value = false
  }
}

// 关闭新增表情对话框
const handleAddDialogClose = () => {
  showAddEmojiDialog.value = false
  newEmojiImage.value = ''
  newEmojiForm.value = {
    name: ''
  }
  if (emojiFormRef.value) {
    emojiFormRef.value.resetFields()
  }
}

// 初始获取表情列表
onMounted(() => {
  fetchEmojis()
})
</script>

<style scoped>
.emoji-option {
  width: 100%;
}

.emoji-dialog-content {
  display: flex;
  flex-direction: column;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 20px 0 20px 0;
  max-height: 400px;
  overflow-y: auto;
}
.emoji-grid::-webkit-scrollbar {
  display: none;
}

.emoji-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.emoji-item:hover {
  background-color: #f5f7fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.add-emoji-item{
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.emoji-item.selected {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.emoji-image {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 8px;
}

.emoji-error {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #999;
}

.emoji-name {
  font-size: 12px;
  color: #666;
  text-align: center;
  line-height: 1.4;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 新增表情对话框样式 */
.add-emoji-dialog .el-dialog__body {
  padding: 24px;
}

.add-emoji-dialog .upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.add-emoji-dialog .image-preview {
  position: relative;
  width: 120px;
  height: 120px;
  border: 2px dashed var(--el-border-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--el-bg-color-page);
}

.add-emoji-dialog .image-preview.has-image {
  border-style: solid;
  border-color: var(--el-color-primary);
}
.preview-image {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.add-emoji-dialog .image-preview .clear-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.add-emoji-dialog .image-preview .clear-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.add-emoji-dialog .upload-tip {
  text-align: center;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.add-emoji-dialog .emoji-form .el-form-item {
  margin-bottom: 20px;
}

.add-emoji-dialog .emoji-form .el-input,
.add-emoji-dialog .emoji-form .el-select {
  width: 100%;
}

.add-emoji-dialog .dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--el-border-color-light);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .emoji-dialog {
    width: 90vw !important;
    max-width: 500px;
  }

  .emoji-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .emoji-item {
    padding: 8px;
  }

  .emoji-image {
    width: 40px;
    height: 40px;
  }

  .emoji-name {
    font-size: 12px;
  }

  .add-emoji-dialog {
    .el-dialog {
      width: 90vw !important;
      max-width: 500px;
    }

    .image-preview {
      width: 100px;
      height: 100px;
    }
  }
}

@media (max-width: 480px) {
  .emoji-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .add-emoji-dialog {
    .el-dialog__body {
      padding: 16px;
    }

    .image-preview {
      width: 80px;
      height: 80px;
    }

    .dialog-footer {
      flex-direction: column;
      gap: 8px;

      .el-button {
        width: 100%;
      }
    }
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .emoji-dialog {
    background: var(--el-bg-color);
    color: var(--el-text-color-primary);
  }

  .emoji-item:hover {
    background: var(--el-bg-color-page);
  }

  .emoji-item.selected {
    background: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary);
  }

  .add-emoji-dialog {
    .image-preview {
      background: var(--el-bg-color-page);
      border-color: var(--el-border-color);

      &.has-image {
        border-color: var(--el-color-primary);
      }
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .emoji-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .emoji-image {
    width: 56px;
    height: 56px;
  }

  .emoji-error {
    width: 56px;
    height: 56px;
  }
}

@media (max-width: 480px) {
  .emoji-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .emoji-categories {
    justify-content: center;
  }

  .emoji-image {
    width: 48px;
    height: 48px;
  }

  .emoji-error {
    width: 48px;
    height: 48px;
  }
}

/* 动画效果 */
.emoji-item {
  animation: fadeInUp 0.4s ease-out;
  animation-fill-mode: both;
}

.emoji-item:nth-child(1) {
  animation-delay: 0.05s;
}

.emoji-item:nth-child(2) {
  animation-delay: 0.1s;
}

.emoji-item:nth-child(3) {
  animation-delay: 0.15s;
}

.emoji-item:nth-child(4) {
  animation-delay: 0.2s;
}

.emoji-item:nth-child(5) {
  animation-delay: 0.25s;
}

.emoji-item:nth-child(6) {
  animation-delay: 0.3s;
}

.emoji-item:nth-child(7) {
  animation-delay: 0.35s;
}

.emoji-item:nth-child(8) {
  animation-delay: 0.4s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 深色主题支持 */
@media (prefers-color-scheme: dark) {
  .emoji-item:hover {
    background-color: #2d3748;
  }

  .emoji-item.selected {
    background-color: #2b6cb0;
    border-color: #4299e1;
  }

  .emoji-error {
    background-color: #4a5568;
    color: #cbd5e0;
  }

  .emoji-name {
    color: #cbd5e0;
  }
}
</style>