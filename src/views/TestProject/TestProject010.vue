<template>
  <div class="image-upload-container">
    <div class="upload-header">
      <h3>上传图片</h3>
      <p>支持 JPG, PNG 格式，最大 5MB</p>
    </div>
    
    <div class="upload-area" 
        @click="triggerFileInput"
        @dragover.prevent="dragOver = true"
        @dragleave="dragOver = false"
        @drop.prevent="handleDrop"
        :class="{ 'drag-active': dragOver }">
      <input type="file" 
            ref="fileInput"
            @change="handleFileUpload"
            accept="image/*"
            class="file-input" />
      
      <div class="upload-content">
        <div class="upload-icon">
          <svg viewBox="0 0 24 24">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
        </div>
        <p class="upload-text">点击或拖拽文件到此处</p>
        <p class="upload-hint">推荐尺寸：1200×800px</p>
      </div>
    </div>
    
    <!-- 图片预览区域 -->
    <div class="preview-container" v-if="previewImage">
      <div class="preview-card">
        <img :src="previewImage" alt="预览图片" class="preview-image" />
        <div class="preview-actions">
          <button class="action-btn edit-btn" @click="triggerFileInput">
            <svg viewBox="0 0 24 24">
              <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
            </svg>
          </button>
          <button class="action-btn delete-btn" @click="removeImage">
            <svg viewBox="0 0 24 24">
              <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
            </svg>
          </button>
        </div>
        <div class="preview-footer">
          <div class="file-info">
            <span class="file-name">{{ fileName }}</span>
            <span class="file-size">{{ fileSize }}</span>
          </div>
          <div class="upload-progress" v-if="uploading">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Vue 组件脚本部分
export default {
  data() {
    return {
      dragOver: false,
      previewImage: null,
      fileName: '',
      fileSize: '',
      uploading: false,
      progress: 0
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    
    handleFileUpload(e) {
      this.dragOver = false
      const file = e.target.files[0] || e.dataTransfer.files[0]
      
      if (!file) return
      
      if (!file.type.match('image.*')) {
        alert('请选择图片文件')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('文件大小不能超过5MB')
        return
      }
      
      this.fileName = file.name
      this.fileSize = this.formatFileSize(file.size)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        this.previewImage = e.target.result
      }
      reader.readAsDataURL(file)
      
      // 模拟上传进度
      this.uploading = true
      const interval = setInterval(() => {
        this.progress += Math.random() * 10
        if (this.progress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            this.uploading = false
          }, 500)
        }
      }, 300)
    },
    
    handleDrop(e) {
      this.handleFileUpload(e)
    },
    
    removeImage() {
      this.previewImage = null
      this.fileName = ''
      this.fileSize = ''
      this.progress = 0
      this.uploading = false
      this.$refs.fileInput.value = ''
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
  }
}
</script>

<style scoped>
/* 主容器 */
.image-upload-container {
  max-width: 600px;
  margin: 2rem auto;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.upload-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.upload-header h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.upload-header p {
  color: #7f8c8d;
  font-size: 0.9rem;
}

/* 上传区域 */
.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2.5rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f8fafc;
  position: relative;
  overflow: hidden;
}

.upload-area:hover {
  border-color: #9ca3af;
  background-color: #f3f4f6;
}

.upload-area.drag-active {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
  transform: translateY(-2px);
}

.file-input {
  display: none;
}

.upload-content {
  pointer-events: none;
}

.upload-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.upload-icon svg {
  width: 30px;
  height: 30px;
  fill: white;
}

.upload-text {
  font-size: 1.1rem;
  color: #1f2937;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.upload-hint {
  font-size: 0.85rem;
  color: #6b7280;
}

/* 预览区域 */
.preview-container {
  margin-top: 1.5rem;
  animation: fadeIn 0.4s ease-out;
}

.preview-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  position: relative;
}

.preview-image {
  width: 100%;
  display: block;
  max-height: 400px;
  object-fit: contain;
  background: #f3f4f6;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.preview-actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.edit-btn {
  background-color: white;
}

.edit-btn svg {
  fill: #3b82f6;
}

.delete-btn {
  background-color: white;
}

.delete-btn svg {
  fill: #ef4444;
}

.preview-footer {
  padding: 1rem;
  background: white;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.file-name {
  font-weight: 500;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;
}

.file-size {
  font-size: 0.85rem;
  color: #6b7280;
}

.upload-progress {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transition: width 0.3s ease;
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .image-upload-container {
    margin: 1rem;
  }
  
  .upload-area {
    padding: 1.5rem 1rem;
  }
  
  .preview-image {
    max-height: 300px;
  }
}
</style>