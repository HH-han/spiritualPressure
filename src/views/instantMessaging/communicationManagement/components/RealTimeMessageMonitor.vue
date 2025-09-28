<template>
  <div class="real-time-monitor">
    <el-card class="content-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">实时消息监控</span>
          <div class="monitor-controls">
            <el-button-group>
              <el-button 
                :type="filterType === 'all' ? 'primary' : 'default'"
                @click="filterType = 'all'"
              >
                全部
              </el-button>
              <el-button 
                :type="filterType === 'text' ? 'primary' : 'default'"
                @click="filterType = 'text'"
              >
                文本
              </el-button>
              <el-button 
                :type="filterType === 'image' ? 'primary' : 'default'"
                @click="filterType = 'image'"
              >
                图片
              </el-button>
              <el-button 
                :type="filterType === 'file' ? 'primary' : 'default'"
                @click="filterType = 'file'"
              >
                文件
              </el-button>
            </el-button-group>
            
            <el-switch
              v-model="autoScroll"
              active-text="自动滚动"
              inactive-text="暂停滚动"
              style="margin-left: 16px;"
            />
            
            <el-button 
              type="danger" 
              size="small" 
              @click="clearMessages"
              style="margin-left: 16px;"
            >
              <el-icon><Delete /></el-icon>
              清空
            </el-button>
          </div>
        </div>
      </template>

      <div class="monitor-container">
        <div class="stats-row">
          <el-row :gutter="16">
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-label">消息总数</div>
                <div class="stat-value">{{ totalMessages }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-label">在线用户</div>
                <div class="stat-value">{{ onlineUsers }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-label">活跃群组</div>
                <div class="stat-value">{{ activeGroups }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-label">消息频率</div>
                <div class="stat-value">{{ messageRate }}/分钟</div>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="message-list" ref="messageListRef">
          <div 
            v-for="message in filteredMessages" 
            :key="message.id"
            class="message-item"
            :class="{ 'system-message': message.type === 'system' }"
          >
            <div class="message-header">
              <div class="message-sender">
                <el-avatar :size="24" :src="message.avatar" :alt="message.sender">
                  {{ message.sender?.charAt(0) }}
                </el-avatar>
                <span class="sender-name">{{ message.sender }}</span>
                <el-tag v-if="message.group" size="small" type="info">
                  {{ message.group }}
                </el-tag>
              </div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
            
            <div class="message-content">
              <template v-if="message.type === 'text'">
                <span class="text-content">{{ message.content }}</span>
              </template>
              
              <template v-else-if="message.type === 'image'">
                <div class="image-content">
                  <el-image
                    :src="message.content"
                    :preview-src-list="[message.content]"
                    fit="cover"
                    style="width: 100px; height: 100px;"
                  >
                    <template #error>
                      <div class="image-error">图片加载失败</div>
                    </template>
                  </el-image>
                  <span class="image-label">[图片]</span>
                </div>
              </template>
              
              <template v-else-if="message.type === 'file'">
                <div class="file-content">
                  <el-icon><Document /></el-icon>
                  <span class="file-name">{{ message.fileName }}</span>
                  <span class="file-size">({{ formatFileSize(message.fileSize) }})</span>
                </div>
              </template>
              
              <template v-else-if="message.type === 'system'">
                <span class="system-content">{{ message.content }}</span>
              </template>
            </div>
          </div>
          
          <div v-if="filteredMessages.length === 0" class="empty-state">
            <el-icon><ChatLineRound /></el-icon>
            <p>暂无消息记录</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Delete, Document, ChatLineRound } from '@element-plus/icons-vue'

// 模拟实时消息数据
const mockMessages = [
  {
    id: 1,
    type: 'text',
    sender: '张三',
    avatar: '',
    group: '前端开发交流群',
    content: '大家早上好！今天有什么技术分享吗？',
    timestamp: new Date().getTime() - 300000 // 5分钟前
  },
  {
    id: 2,
    type: 'text',
    sender: '李四',
    avatar: '',
    group: '前端开发交流群',
    content: '我最近在研究Vue 3的组合式API，感觉比选项式API灵活很多',
    timestamp: new Date().getTime() - 240000 // 4分钟前
  },
  {
    id: 3,
    type: 'image',
    sender: '王五',
    avatar: '',
    group: '前端开发交流群',
    content: 'https://via.placeholder.com/100',
    timestamp: new Date().getTime() - 180000 // 3分钟前
  },
  {
    id: 4,
    type: 'file',
    sender: '赵六',
    avatar: '',
    group: '项目管理小组',
    content: '',
    fileName: '项目计划书.docx',
    fileSize: 2048000,
    timestamp: new Date().getTime() - 120000 // 2分钟前
  },
  {
    id: 5,
    type: 'system',
    sender: '系统',
    avatar: '',
    content: '用户 "钱七" 加入了群组 "技术分享群"',
    timestamp: new Date().getTime() - 60000 // 1分钟前
  }
]

const messages = ref([...mockMessages])
const filterType = ref('all')
const autoScroll = ref(true)
const messageListRef = ref(null)
const totalMessages = ref(1256)
const onlineUsers = ref(42)
const activeGroups = ref(8)
const messageRate = ref(12)

// 模拟WebSocket连接
let wsConnection = null
let messageInterval = null

// 计算属性
const filteredMessages = computed(() => {
  if (filterType.value === 'all') {
    return messages.value
  }
  return messages.value.filter(msg => msg.type === filterType.value)
})

// 方法
const formatTime = (timestamp) => {
  const now = new Date().getTime()
  const diff = now - timestamp
  
  if (diff < 60000) { // 1分钟内
    return '刚刚'
  } else if (diff < 3600000) { // 1小时内
    return Math.floor(diff / 60000) + '分钟前'
  } else if (diff < 86400000) { // 1天内
    return Math.floor(diff / 3600000) + '小时前'
  } else {
    return new Date(timestamp).toLocaleString('zh-CN')
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const scrollToBottom = async () => {
  await nextTick()
  if (messageListRef.value && autoScroll.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

const clearMessages = () => {
  messages.value = []
  totalMessages.value = 0
}

const addMockMessage = () => {
  const messageTypes = ['text', 'image', 'file', 'system']
  const senders = ['张三', '李四', '王五', '赵六', '钱七']
  const groups = ['前端开发交流群', '项目管理小组', '技术分享群', '设计讨论组']
  
  const type = messageTypes[Math.floor(Math.random() * messageTypes.length)]
  const sender = senders[Math.floor(Math.random() * senders.length)]
  const group = groups[Math.floor(Math.random() * groups.length)]
  
  const newMessage = {
    id: messages.value.length + 1,
    type,
    sender,
    avatar: '',
    group: type !== 'system' ? group : undefined,
    content: '',
    timestamp: new Date().getTime()
  }
  
  switch (type) {
    case 'text':
      newMessage.content = `这是一条测试消息 ${Math.random().toString(36).substr(2, 5)}`
      break
    case 'image':
      newMessage.content = `https://via.placeholder.com/100?text=Image${messages.value.length + 1}`
      break
    case 'file':
      newMessage.fileName = `文件${messages.value.length + 1}.txt`
      newMessage.fileSize = Math.floor(Math.random() * 1000000)
      break
    case 'system':
      newMessage.content = `系统消息: ${sender} ${Math.random() > 0.5 ? '加入' : '离开'}了群组`
      break
  }
  
  messages.value.push(newMessage)
  totalMessages.value++
  messageRate.value = Math.floor(Math.random() * 20) + 5
  
  scrollToBottom()
}

// 模拟WebSocket连接
const connectWebSocket = () => {
  // 这里应该是真实的WebSocket连接代码
  console.log('连接WebSocket服务器...')
  
  // 模拟接收消息
  messageInterval = setInterval(() => {
    if (Math.random() > 0.3) { // 70%概率接收新消息
      addMockMessage()
    }
  }, 5000) // 每5秒可能接收一条新消息
}

// 生命周期
onMounted(() => {
  connectWebSocket()
  scrollToBottom()
})

onUnmounted(() => {
  if (messageInterval) {
    clearInterval(messageInterval)
  }
  if (wsConnection) {
    wsConnection.close()
  }
})

// 监听消息变化
import { watch } from 'vue'
watch(filteredMessages, scrollToBottom)
</script>

<style scoped>
.real-time-monitor {
  width: 100%;
}

.monitor-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.monitor-container {
  height: 500px;
  display: flex;
  flex-direction: column;
}

.stats-row {
  margin-bottom: 16px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  padding: 16px;
  background: #fafafa;
}

.message-item {
  margin-bottom: 16px;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message-item.system-message {
  background: #f0f9ff;
  border-left: 3px solid #1890ff;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.message-sender {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sender-name {
  font-weight: 500;
  color: #303133;
}

.message-time {
  font-size: 12px;
  color: #909399;
}

.message-content {
  margin-left: 32px;
}

.text-content {
  color: #606266;
  line-height: 1.5;
}

.image-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.image-error {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  color: #909399;
  border-radius: 4px;
}

.image-label {
  color: #909399;
  font-size: 12px;
}

.file-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
}

.file-name {
  font-weight: 500;
}

.file-size {
  color: #909399;
  font-size: 12px;
}

.system-content {
  color: #1890ff;
  font-style: italic;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}

.empty-state .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #c0c4cc;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* 滚动条样式 */
.message-list::-webkit-scrollbar {
  width: 6px;
}

.message-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.message-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.message-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (max-width: 768px) {
  .monitor-controls {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .message-content {
    margin-left: 0;
  }
}
</style>