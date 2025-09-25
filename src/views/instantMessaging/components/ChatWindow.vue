<template>
  <div class="wechat-chat-window">
    <!-- 语音通话控制组件 -->
    <div class="voice-call-container" :style="{ display: isVoiceCallActive ? 'block' : 'none' }">
      <VoiceCallControl ref="voiceCallControl" :current-chat="chat" @callStarted="handleCallStarted"
        @callEnded="handleCallEnded" />
    </div>

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
      <!-- 头部操作项 -->
      <div class="header-right">
        <button>
          <el-tooltip content="更多操作" placement="bottom">
            <el-icon class="header-action">
              <MoreFilled />
            </el-icon>
          </el-tooltip>
        </button>

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
              <img :src="message.contentImage" alt="图片消息" class="image-content"
                @click="showImagePreview(message.contentImage)" />
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
        <div class="toolbar-container">
          <button @click="showEmojiPicker = !showEmojiPicker">
            <el-tooltip content="表情" placement="top">
              <el-icon class="toolbar-icon">
                <Comment />
              </el-icon>
            </el-tooltip>
          </button>
          <button>
            <ImageUploader ref="imageUploaderRef" :chat="chat" @image-sent="handleImageSent"
              @upload-start="handleUploadStart" @upload-complete="handleUploadComplete">
              <el-tooltip content="图片" placement="top">
                <el-icon class="toolbar-icon">
                  <Picture />
                </el-icon>
              </el-tooltip>
            </ImageUploader>
          </button>
          <button>
            <el-tooltip content="文件" placement="top">
              <el-icon class="toolbar-icon">
                <Document />
              </el-icon>
            </el-tooltip>
          </button>
        </div>
        <div class="toolbar-container">
          <button @click="initiateVoiceCall">
            <el-tooltip content="语音通话" placement="bottom">
              <el-icon class="header-action">
                <Microphone />
              </el-icon>
            </el-tooltip>
          </button>
          <button>
            <el-tooltip content="视频通话" placement="bottom">
              <el-icon class="header-action">
                <VideoCamera />
              </el-icon>
            </el-tooltip>
          </button>
        </div>

      </div>

      <!-- 表情选择器组件 -->
      <EmojiList :show-emoji-picker="showEmojiPicker" @select-emoji="selectEmoji"
        @close-picker="showEmojiPicker = false" />
      <!-- 信息输入框  -->
      <div class="input-main">
        <el-input v-model="inputMessage" type="textarea" :rows="3" placeholder="输入消息..." resize="none"
          @keydown.enter="handleSendMessage" class="message-input" />
      </div>
      <!-- 发送按钮 -->
      <div class="input-actions">
        <el-button type="primary" @click="handleSendMessage" :disabled="!inputMessage.trim()" class="send-button">
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { sendSingleMessage, sendGroupMessageByParam, getSingleChatHistory, getGroupChatHistory } from '@/api/im.js'
import { useAuthStore } from '@/stores/auth.js'
import VoiceCallControl from './VoiceCallControl.vue'
import ImageUploader from './ImageUploader.vue'
import EmojiList from './EmojiList.vue'
import { voiceWebSocket } from '@/utils/voice-websocket'
import { initMessageWebSocket, sendMessageViaWebSocket, handleWebSocketMessage } from '../Imjs/im.js'

const props = defineProps({
  chat: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['send-message'])

// 语音通话相关
const voiceCallControl = ref(null)
const isVoiceCallActive = ref(false)
const imageUploaderRef = ref(null)

const inputMessage = ref('')
const messageListRef = ref(null)
const messages = ref([])
const authStore = useAuthStore()
const currentUserId = ref(authStore.user?.id || 0)
const showEmojiPicker = ref(false)

// WebSocket连接状态
const isMessageWebSocketConnected = ref(false)



// 处理图片发送成功事件
const handleImageSent = async (imageData) => {
  // 重新加载聊天历史以显示新发送的图片
  await loadChatHistory()

  // 发送消息事件给父组件
  emit('send-message', imageData)
}

// 处理图片上传开始事件
const handleUploadStart = () => {
  // 可以在这里添加上传开始时的处理逻辑
  console.log('图片上传开始')
}

// 处理图片上传完成事件
const handleUploadComplete = (result) => {
  // 可以在这里添加上传完成时的处理逻辑
  if (!result.success) {
    console.error('图片上传失败:', result.error)
  }
}

// 显示消息图片预览（通过ImageUploader组件）
const showImagePreview = (imageUrl) => {
  if (imageUploaderRef.value) {
    imageUploaderRef.value.showImagePreview(imageUrl)
  }
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

// 消息WebSocket实例
let messageWebSocketInstance = null

// 初始化消息WebSocket连接
const setupMessageWebSocket = () => {
  messageWebSocketInstance = initMessageWebSocket(
    (message) => handleWebSocketMessage(message, props.chat, currentUserId.value, messages, scrollToBottom, playMessageSound),
    isMessageWebSocketConnected
  )
  messageWebSocketInstance.connect()
}



// 播放消息提示音
const playMessageSound = () => {
  // 这里可以添加消息提示音效
  console.log('播放消息提示音')
}

// 通过WebSocket发送消息
const sendMessageViaWebSocketWrapper = async (messageData) => {
  return await sendMessageViaWebSocket(messageData, props.chat, currentUserId.value)
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

    if (response.code === '0') {
      // 按消息ID从小到大排序
      messages.value = response.data
        .map(msg => ({
          id: msg.id,
          content: msg.content,
          timestamp: msg.sendTime,
          isSelf: msg.senderId === currentUserId.value,
          contentImage: msg.image,
          image: msg.senderAvatar || msg.avatar,
          messageType: msg.messageType
        }))
        .sort((a, b) => a.id - b.id)
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
    const messageData = {
      content: inputMessage.value.trim(),
      timestamp: Date.now(),
      messageType: 'TEXT'
    }

    // 优先尝试通过WebSocket发送
    const webSocketSuccess = await sendMessageViaWebSocketWrapper(messageData)

    if (!webSocketSuccess) {
      // WebSocket发送失败，回退到HTTP API
      let response

      if (props.chat.type === 'friend') {
        response = await sendSingleMessage({
          senderId: currentUserId.value,
          receiverId: props.chat.id,
          content: inputMessage.value.trim(),
          messageType: 'TEXT'
        })
      } else if (props.chat.type === 'group') {
        response = await sendGroupMessageByParam({
          senderId: currentUserId.value,
          groupId: props.chat.id,
          content: inputMessage.value.trim(),
          messageType: 'TEXT'
        })
      }

      if (response.code === 0 || response.code === '0') {
        // 发送成功后立即重新加载聊天历史，确保获取最新的消息数据（包括头像信息）
        await loadChatHistory()
      } else {
        ElMessage.error(response.msg || '消息发送失败')
        return
      }
    } else {
      // WebSocket发送成功，也需要重新加载聊天历史以确保消息显示
      await loadChatHistory()
    }

    // 发送消息事件（无论通过哪种方式发送成功）
    emit('send-message', {
      type: props.chat.type,
      targetId: props.chat.id,
      content: inputMessage.value.trim(),
      timestamp: Date.now()
    })

    inputMessage.value = ''

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
    messages.value = []
    loadChatHistory()
  }
})

// 初始化时加载聊天历史
onMounted(() => {
  ensureUserInfoLoaded().then(() => {
    loadChatHistory()
    scrollToBottom()
    // 初始化语音WebSocket连接
    initVoiceWebSocket()
    // 初始化消息WebSocket连接
    setupMessageWebSocket()
  })
})

// 语音通话相关方法
const initVoiceWebSocket = () => {
  const token = localStorage.getItem('token')
  if (token) {
    voiceWebSocket.connect(token, () => {
      console.log('语音WebSocket连接成功')
    }, (error) => {
      console.error('语音WebSocket连接失败:', error)
      ElMessage.error('语音通话功能初始化失败')
    })
  }
}

const initiateVoiceCall = () => {
  if (voiceCallControl.value) {
    voiceCallControl.value.initiateCall()
  }
}

const handleCallStarted = () => {
  isVoiceCallActive.value = true
  ElMessage.success('通话已开始')
}

const handleCallEnded = () => {
  isVoiceCallActive.value = false
  ElMessage.info('通话已结束')
}

// 组件卸载时断开WebSocket连接
onUnmounted(() => {
  voiceWebSocket.disconnect()
  // 断开消息WebSocket连接
  if (messageWebSocketInstance) {
    messageWebSocketInstance.disconnect()
  }
})
</script>

<style scoped>
@import '../Imcss/chat-window.css';
</style>
