<template>
  <div class="wechat-chat-window">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <div class="header-left">
        <el-avatar :size="40"
          :src="chat.image || (chat.type === 'friend' ? '/default-avatar.png' : '/default-group.png')" />
        <div class="chat-info">
          <div class="chat-name">{{ chat.username }}</div>
          <div class="chat-status">
            <span class="status-dot online"></span>
            在线
          </div>
        </div>
      </div>

      <div class="header-right">
        <el-tooltip content="语音通话" placement="bottom">
          <el-icon class="header-action"><Microphone /></el-icon>
        </el-tooltip>
        <el-tooltip content="视频通话" placement="bottom">
          <el-icon class="header-action"><VideoCamera /></el-icon>
        </el-tooltip>
        <el-tooltip content="更多操作" placement="bottom">
          <el-icon class="header-action"><MoreFilled /></el-icon>
        </el-tooltip>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="message-list" ref="messageListRef">
      <div v-for="message in messages" :key="message.id" :class="['message-item', { 'message-self': message.isSelf }]">
        <div class="message-avatar">
          <el-avatar :size="36" :src="message.image || '/default-avatar.png'" />
        </div>

        <div class="message-content">
          <div class="message-bubble" :class="{ 'bubble-self': message.isSelf }">
            <div v-if="message.messageType === 'IMAGE'" class="message-image">
              <img :src="message.contentImage" alt="图片消息" class="image-content" />
            </div>
            <div v-else class="message-text">{{ message.content }}</div>
          </div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>

      <div v-if="messages.length === 0" class="empty-messages">
        <div class="empty-content">
          <el-icon>
            <ChatLineRound />
          </el-icon>
          <p>还没有消息，开始聊天吧</p>
        </div>
      </div>
    </div>

    <!-- 消息输入区域 -->
    <div class="message-input-area">
      <div class="input-toolbar">
        <button @click="showEmojiPicker = !showEmojiPicker">
          <el-tooltip content="表情" placement="top">
            <el-icon class="toolbar-icon">
              <Comment />
            </el-icon>
          </el-tooltip>
        </button>
        <button @click="triggerImageSelect">
          <el-tooltip content="图片" placement="top">
            <el-icon class="toolbar-icon">
              <Picture />
            </el-icon>
          </el-tooltip>
        </button>
        <button>
          <el-tooltip content="文件" placement="top">
            <el-icon class="toolbar-icon">
              <Document />
            </el-icon>
          </el-tooltip>
        </button>
      </div>

      <!-- 表情选择器 -->
      <div v-if="showEmojiPicker" class="emoji-picker">
        <div class="emoji-header">
          <span class="emoji-title">表情</span>
          <el-icon class="emoji-close" @click="showEmojiPicker = false">
            <Close />
          </el-icon>
        </div>
        <div class="emoji-grid">
          <div v-for="(emoji, index) in emojiList" :key="index" class="emoji-item" @click="selectEmoji(emoji)">
            {{ emoji }}
          </div>
        </div>
      </div>
      <!-- 图片预览模态框 -->
      <div>
        <el-dialog v-model="showImagePicker" title="图片预览" width="500px" :close-on-click-modal="false">
          <div class="image-preview-container">
            <img v-if="imagePreview" :src="imagePreview" alt="图片预览" class="preview-image" />
            <div v-else class="no-image">
              <el-icon>
                <Picture />
              </el-icon>
              <p>请选择图片</p>
            </div>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="cancelImageSend">取消</el-button>
              <el-button type="primary" @click="sendImageMessage" :disabled="!selectedImage">
                发送
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
      <div class="input-main">
        <el-input v-model="inputMessage" type="textarea" :rows="3" placeholder="输入消息..." resize="none"
          @keydown.enter="handleSendMessage" class="message-input" />
      </div>

      <div class="input-actions">
        <el-button type="primary" @click="handleSendMessage" :disabled="!inputMessage.trim()" class="send-button">
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { sendSingleMessage, sendGroupMessageByParam, getSingleChatHistory, getGroupChatHistory } from '@/api/im.js'
import { useAuthStore } from '@/stores/auth.js'

const props = defineProps({
  chat: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['send-message'])

const inputMessage = ref('')
const messageListRef = ref(null)
const messages = ref([])
const authStore = useAuthStore()
const currentUserId = ref(authStore.user?.id || 0)
const showEmojiPicker = ref(false) // 控制表情选择器显示
const showImagePicker = ref(false) // 控制图片选择器显示
const selectedImage = ref(null) // 选中的图片Base64数据
const imagePreview = ref(null) // 图片预览URL

// 常用表情符号列表
const emojiList = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🫣',
  '🤗', '🫡', '🤔', '🫢', '🤭', '🤫', '🤥', '😶', '🫠', '😐',
  '🫤', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱',
  '😴', '🤤', '😪', '😵', '🫥', '🤐', '🥴', '🤢', '🤮', '🤧',
  '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡',
  '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸',
  '😹', '😻', '😼', '😽', '🙀', '😿', '😾'
]

// 选择图片
const handleImageSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      ElMessage.error('请选择图片文件')
      return
    }

    // 检查文件大小（限制5MB）
    if (file.size > 5 * 1024 * 1024) {
      ElMessage.error('图片大小不能超过5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImage.value = e.target.result // Base64数据
      imagePreview.value = e.target.result // 预览URL
      showImagePicker.value = true // 显示预览模态框
    }
    reader.onerror = () => {
      ElMessage.error('图片读取失败')
    }
    reader.readAsDataURL(file)
  }
}

// 触发图片选择
const triggerImageSelect = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = handleImageSelect
  input.click()
}

// 发送图片消息
const sendImageMessage = async () => {
  if (!selectedImage.value) return

  await ensureUserInfoLoaded()

  try {
    let response
    const imageData = {
      image: selectedImage.value,
      timestamp: Date.now(),
      fileName: `image_${Date.now()}.jpg`
    }

    if (props.chat.type === 'friend') {
      response = await sendSingleMessage({
        senderId: currentUserId.value,
        receiverId: props.chat.id,
        content: '[图片]',
        image: selectedImage.value,
        messageType: 'IMAGE'
      })
    } else if (props.chat.type === 'group') {
      response = await sendGroupMessageByParam({
        senderId: currentUserId.value,
        groupId: props.chat.id,
        content: '[图片]',
        image: selectedImage.value,
        messageType: 'IMAGE'
      })
    }

    if (response.code === 0 || response.code === '0') {
      // 发送成功后重新加载聊天历史
      await loadChatHistory()

      // 发送消息事件
      emit('send-message', {
        type: props.chat.type,
        targetId: props.chat.id,
        content: '[图片]',
        image: selectedImage.value,
        timestamp: Date.now(),
        isImage: true
      })

      // 重置状态
      selectedImage.value = null
      imagePreview.value = null
      showImagePicker.value = false

      ElMessage.success('图片发送成功')
    } else {
      ElMessage.error(response.msg || '图片发送失败')
    }
  } catch (error) {
    console.error('图片发送失败:', error)
    ElMessage.error('图片发送失败')
  }
}

// 取消图片发送
const cancelImageSend = () => {
  selectedImage.value = null
  imagePreview.value = null
  showImagePicker.value = false
}

// 选择表情
const selectEmoji = (emoji) => {
  const textarea = document.querySelector('.message-input textarea')
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    inputMessage.value =
      inputMessage.value.substring(0, start) +
      emoji +
      inputMessage.value.substring(end)

    // 设置光标位置
    const newPosition = start + emoji.length
    nextTick(() => {
      textarea.setSelectionRange(newPosition, newPosition)
      textarea.focus()
    })
  } else {
    inputMessage.value += emoji
  }
  showEmojiPicker.value = false
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 确保用户信息已加载
const ensureUserInfoLoaded = async () => {
  if (!authStore.user?.id) {
    try {
      await authStore.getUserInfo()
      currentUserId.value = authStore.user?.id || 0
    } catch (error) {
      console.error('获取用户信息失败:', error)
      ElMessage.error('获取用户信息失败')
    }
  } else {
    currentUserId.value = authStore.user.id
  }
}

// 加载聊天历史
const loadChatHistory = async () => {
  await ensureUserInfoLoaded()

  try {
    let response
    if (props.chat.type === 'friend') {
      response = await getSingleChatHistory({
        userId1: currentUserId.value,
        userId2: props.chat.id
      })
    } else if (props.chat.type === 'group') {
      response = await getGroupChatHistory({
        groupId: props.chat.id
      })
    }

    if (response.code === 0 || response.code === '0') {
      // 按消息ID从小到大排序
      messages.value = response.data
        .map(msg => ({
          id: msg.id,
          content: msg.content,
          timestamp: msg.sendTime,
          isSelf: msg.senderId === currentUserId.value,
          contentImage: msg.image,
          image:msg.senderAvatar || '/default-avatar.png', // 使用图片数据或发送者头像
          messageType: msg.messageType // 添加messageType字段
        }))
        .sort((a, b) => a.id - b.id) // 按消息ID升序排序
      scrollToBottom()
    }
  } catch (error) {
    console.error('加载聊天历史失败:', error)
    ElMessage.error('加载聊天历史失败')
  }
}

// 发送消息
const handleSendMessage = async () => {
  if (!inputMessage.value.trim()) return

  await ensureUserInfoLoaded()

  try {
    let response
    const messageData = {
      content: inputMessage.value.trim(),
      timestamp: Date.now()
    }

    if (props.chat.type === 'friend') {
      response = await sendSingleMessage({
        senderId: currentUserId.value, // 使用当前用户真实ID
        receiverId: props.chat.id,
        content: inputMessage.value.trim(),
        messageType: 'TEXT'
      })
    } else if (props.chat.type === 'group') {
      response = await sendGroupMessageByParam({
        senderId: currentUserId.value, // 使用当前用户真实ID
        groupId: props.chat.id,
        content: inputMessage.value.trim(),
        messageType: 'TEXT'
      })
    }

    if (response.code === 0 || response.code === '0') {
      // 发送成功后立即重新加载聊天历史，确保获取最新的消息数据（包括头像信息）
      await loadChatHistory()

      // 发送消息事件
      emit('send-message', {
        type: props.chat.type,
        targetId: props.chat.id,
        content: inputMessage.value.trim(),
        timestamp: Date.now()
      })

      inputMessage.value = ''
      ElMessage.success('消息发送成功')
    } else {
      ElMessage.error(response.msg || '消息发送失败')
    }
  } catch (error) {
    console.error('消息发送失败:', error)
    ElMessage.error('消息发送失败')
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

// 监听chat prop变化，切换好友时重新加载聊天历史
watch(() => props.chat, (newChat, oldChat) => {
  if (newChat.id !== oldChat?.id || newChat.type !== oldChat?.type) {
    messages.value = [] // 清空当前消息
    loadChatHistory() // 重新加载聊天历史
  }
})

// 初始化时加载聊天历史
onMounted(() => {
  ensureUserInfoLoaded().then(() => {
    loadChatHistory()
    scrollToBottom()
  })
})
</script>

<style scoped>
.wechat-chat-window {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.chat-header {
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-info {
  min-width: 0;
}

.chat-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.chat-status {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-dot.online {
  background: #07c160;
}

.header-right {
  display: flex;
  gap: 16px;
}

.header-action {
  color: #666;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.header-action:hover {
  background: #f0f0f0;
  color: #333;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5;
}

.message-item {
  display: flex;
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease-in;
}

.message-self {
  flex-direction: row-reverse;
}

.message-avatar {
  margin: 0 8px;
}

.message-content {
  max-width: 60%;
}

.message-bubble {
  background: #fff;
  border-radius: 18px;
  padding: 12px 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

.bubble-self {
  background: #95ec69;
  border-bottom-right-radius: 4px;
}

.message-text {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  word-break: break-word;
}

.message-image {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.message-image:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.image-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* 自己发送的图片消息样式 */
.bubble-self .message-image {
  background: linear-gradient(135deg, #95ec69, #7ad853);
}

/* 对方发送的图片消息样式 */
.message-bubble:not(.bubble-self) .message-image {
  background: #f0f0f0;
}

/* 图片加载失败时的样式 */
.message-image img[src=""],
.message-image img:not([src]) {
  display: none;
}

.message-image::before {
  content: "图片加载失败";
  display: none;
  font-size: 12px;
  color: #999;
  text-align: center;
  padding: 20px;
}

.message-image img[src=""]::before,
.message-image img:not([src])::before {
  display: block;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .message-image {
    max-width: 150px;
    max-height: 150px;
  }
}

@media (max-width: 480px) {
  .message-image {
    max-width: 120px;
    max-height: 120px;
  }
}

.bubble-self .message-text {
  color: #000;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  text-align: center;
}

.bubble-self .message-time {
  color: rgba(0, 0, 0, 0.6);
}

.empty-messages {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-content {
  text-align: center;
  color: #999;
}

.empty-content .el-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-content p {
  font-size: 14px;
  margin: 0;
}

.message-input-area {
  background: #fff;
  border-top: 1px solid #e0e0e0;
  padding: 16px 20px;
}

.input-toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.input-toolbar button {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
}

.toolbar-icon {
  color: #666;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.toolbar-icon:hover {
  background: #f0f0f0;
  color: #333;
}

.input-main {
  margin-bottom: 12px;
}

.message-input :deep(.el-textarea__inner) {
  border: none;
  border-radius: 8px;
  background: #f8f8f8;
  box-shadow: none;
  padding: 12px 16px;
  font-size: 14px;
}

.message-input :deep(.el-textarea__inner):focus {
  background: #fff;
  box-shadow: 0 0 0 1px #07c160;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
}

.send-button {
  background: #07c160;
  border: none;
  border-radius: 20px;
  padding: 8px 24px;
  font-weight: 500;
}

.send-button:hover {
  background: #06ae56;
}

.send-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 表情选择器样式 */
.emoji-picker {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-bottom: 8px;
}

.emoji-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  border-radius: 8px 8px 0 0;
}

.emoji-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.emoji-close {
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.emoji-close:hover {
  background: #f0f0f0;
  color: #333;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
  padding: 12px;
  max-height: 200px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: auto;
  -ms-overflow-style: auto;
  white-space: nowrap;
  box-sizing: border-box;
}

.emoji-grid::-webkit-scrollbar {
  height: 12px;
}

.emoji-grid::-webkit-scrollbar:vertical {
  width: 0;
}

.emoji-grid::-webkit-scrollbar:horizontal {
  height: 8px;
}

.emoji-grid::-webkit-scrollbar-thumb:horizontal {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.emoji-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
  user-select: none;
}

.emoji-item:hover {
  background: #f0f8ff;
  transform: scale(1.1);
}

/* 图片预览模态框样式 */
.image-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background: #f8f8f8;
  border-radius: 8px;
  border: 2px dashed #e0e0e0;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
}

.no-image {
  text-align: center;
  color: #999;
}

.no-image .el-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.no-image p {
  font-size: 14px;
  margin: 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

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
</style>
