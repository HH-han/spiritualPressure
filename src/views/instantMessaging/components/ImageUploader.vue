<template>
  <div class="image-uploader">
    <!-- 图片选择触发器 -->
    <div @click="triggerImageSelect" class="upload-trigger">
      <slot>
        <el-button type="primary" :icon="Picture">选择图片</el-button>
      </slot>
    </div>

    <!-- 图片预览模态框 -->
    <el-dialog 
      v-model="showImagePicker" 
      title="图片预览" 
      width="500px" 
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <div class="image-preview-container">
        <img v-if="imagePreview" :src="imagePreview" alt="图片预览" class="preview-image" />
        <div v-else class="no-image">
          <el-icon><Picture /></el-icon>
          <p>请选择图片</p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelImageSend">取消</el-button>
          <el-button type="primary" @click="sendImageMessage" :disabled="!selectedImage || uploading">
            {{ uploading ? '上传中...' : '发送' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 消息图片预览模态框 -->
    <el-dialog 
      v-model="showMessageImagePreview" 
      title="查看图片" 
      width="600px" 
      :close-on-click-modal="true"
      @close="handlePreviewClose"
    >
      <div class="message-image-preview-container">
        <img v-if="messageImagePreviewUrl" :src="messageImagePreviewUrl" alt="消息图片预览" class="message-preview-image" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showMessageImagePreview = false" type="danger" round>关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth.js'
import { sendMessageViaWebSocket } from '../Imjs/im.js'

const props = defineProps({
  chat: {
    type: Object,
    required: true
  },
  onImageSent: {
    type: Function,
    default: () => {}
  }
})

const emit = defineEmits(['image-sent', 'upload-start', 'upload-complete'])

const authStore = useAuthStore()

// 状态变量
const selectedImage = ref(null)
const imagePreview = ref(null)
const showImagePicker = ref(false)
const showMessageImagePreview = ref(false)
const messageImagePreviewUrl = ref('')
const uploading = ref(false)

// 获取当前用户ID
const getCurrentUserId = () => {
  return authStore.user?.id || 0
}

// 选择图片
const handleImageSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }

  // 检查文件大小（限制2MB）
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过2MB')
    return
  }

  // 保存文件对象用于上传
  selectedImage.value = file
  
  // 创建预览URL
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
    showImagePicker.value = true
  }
  reader.onerror = () => {
    ElMessage.error('图片读取失败')
  }
  reader.readAsDataURL(file)
}

// 触发图片选择
const triggerImageSelect = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = handleImageSelect
  input.click()
}

// 发送图片消息（Base64格式）
const sendImageMessage = async () => {
  if (!selectedImage.value) return

  uploading.value = true
  emit('upload-start')

  try {
    // 创建图片消息数据
    const messageData = {
      senderId: getCurrentUserId(),
      content: '[图片]',
      messageType: 'IMAGE',
      image: imagePreview.value, // 使用Base64格式的图片数据
      timestamp: Date.now()
    }
    
    if (props.chat.type === 'friend') {
      messageData.receiverId = props.chat.id
    } else if (props.chat.type === 'group') {
      messageData.groupId = props.chat.id
    }

    // 通过WebSocket发送消息
    const response = await sendMessageViaWebSocket(messageData, props.chat, getCurrentUserId())

    if (response) {
      ElMessage.success('图片发送成功')
      
      // 发送成功事件
      emit('image-sent', {
        type: props.chat.type,
        targetId: props.chat.id,
        content: '[图片]',
        image: imagePreview.value, // 使用Base64图片数据
        timestamp: Date.now(),
        isImage: true,
        response: response
      })

      // 执行回调函数
      if (props.onImageSent) {
        props.onImageSent(response)
      }

      // 重置状态
      resetUploadState()
      
    } else {
      ElMessage.error('图片发送失败')
      uploading.value = false
      emit('upload-complete', { success: false, error: '图片发送失败' })
    }
    
  } catch (error) {
    console.error('图片发送失败:', error)
    ElMessage.error('图片发送失败')
    uploading.value = false
    emit('upload-complete', { success: false, error: error.message })
  }
}

// 取消图片发送
const cancelImageSend = () => {
  resetUploadState()
}

// 重置上传状态
const resetUploadState = () => {
  selectedImage.value = null
  imagePreview.value = null
  showImagePicker.value = false
  uploading.value = false
  emit('upload-complete', { success: true })
}

// 显示消息图片预览
const showImagePreview = (imageUrl) => {
  messageImagePreviewUrl.value = imageUrl
  showMessageImagePreview.value = true
}

// 处理对话框关闭
const handleDialogClose = () => {
  if (!uploading.value) {
    resetUploadState()
  }
}

// 处理预览关闭
const handlePreviewClose = () => {
  messageImagePreviewUrl.value = ''
}

// 暴露方法给父组件
const openImagePreview = (imageUrl) => {
  showImagePreview(imageUrl)
}

// 暴露给父组件的方法
defineExpose({
  triggerImageSelect,
  showImagePreview: openImagePreview,
  resetUploadState
})
</script>

<style scoped>
@import '../Imcss/image-uploader.css';
</style>