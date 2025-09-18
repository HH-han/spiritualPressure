<template>
  <div class="wechat-test-page">
    <div class="test-header">
      <el-icon class="back-icon" @click="goBack">
        <ArrowLeft />
      </el-icon>
      <h2>即时通讯测试</h2>
      <div class="header-actions">
        <el-tooltip content="刷新" placement="bottom">
          <el-icon class="action-icon" @click="refreshPage">
            <Refresh />
          </el-icon>
        </el-tooltip>
      </div>
    </div>
    
    <div class="test-content">
      <!-- API连接测试 -->
      <el-card class="test-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon class="card-icon">
              <Connection />
            </el-icon>
            <span>API连接测试</span>
          </div>
        </template>
        
        <div class="test-section">
          <el-button 
            type="primary" 
            @click="testGetFriendList" 
            :loading="friendListLoading"
            class="test-button"
          >
            <el-icon class="button-icon">
              <User />
            </el-icon>
            获取好友列表
          </el-button>
          
          <div v-if="friendListResult" class="test-result">
            <div class="result-title">测试结果：</div>
            <pre class="result-content">{{ JSON.stringify(friendListResult, null, 2) }}</pre>
          </div>
        </div>
      </el-card>
      
      <!-- 发送消息测试 -->
      <el-card class="test-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon class="card-icon">
              <ChatDotRound />
            </el-icon>
            <span>发送消息测试</span>
          </div>
        </template>
        
        <div class="test-section">
          <el-form :model="messageForm" label-width="80px" class="message-form">
            <el-form-item label="接收方ID">
              <el-input 
                v-model="messageForm.receiverId" 
                placeholder="请输入好友ID"
                class="form-input"
              />
            </el-form-item>
            
            <el-form-item label="消息内容">
              <el-input 
                v-model="messageForm.content" 
                type="textarea" 
                :rows="3"
                placeholder="请输入消息内容"
                class="form-textarea"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="success" 
                @click="testSendMessage" 
                :loading="sendMessageLoading"
                :disabled="!messageForm.receiverId || !messageForm.content"
                class="send-button"
              >
                <el-icon class="button-icon">
                  <Promotion />
                </el-icon>
                发送消息
              </el-button>
            </el-form-item>
          </el-form>
          
          <div v-if="sendMessageResult" class="test-result">
            <div class="result-title">发送结果：</div>
            <pre class="result-content">{{ JSON.stringify(sendMessageResult, null, 2) }}</pre>
          </div>
        </div>
      </el-card>
      
      <!-- 路由测试 -->
      <el-card class="test-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon class="card-icon">
              <Position />
            </el-icon>
            <span>路由测试</span>
          </div>
        </template>
        
        <div class="test-section">
          <div class="route-buttons">
            <el-button 
              type="info" 
              @click="goToMainIM"
              class="route-button"
            >
              <el-icon class="button-icon">
                <ChatLineSquare />
              </el-icon>
              主聊天页面
            </el-button>
            
            <el-button 
              type="warning" 
              @click="goToFriendList"
              class="route-button"
            >
              <el-icon class="button-icon">
                <User />
              </el-icon>
              好友列表
            </el-button>
            
            <el-button 
              type="danger" 
              @click="goToGroupList"
              class="route-button"
            >
              <el-icon class="button-icon">
                <ChatLineRound />
              </el-icon>
              群组列表
            </el-button>
          </div>
          
          <div class="route-info">
            <div class="info-item">
              <span class="info-label">当前路由：</span>
              <span class="info-value">{{ currentRoute }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">可用路由：</span>
              <span class="info-value">/im, /im/test, /im/friends, /im/groups</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 操作结果提示 -->
    <div class="test-notifications">
      <el-alert 
        v-if="testNotification" 
        :title="testNotification" 
        :type="testNotificationType"
        :closable="false"
        show-icon
        class="notification-alert"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  getFriendList, 
  sendSingleMessageByParam 
} from '@/api/im.js'
import {
  ArrowLeft,
  Refresh,
  Connection,
  User,
  ChatDotRound,
  Promotion,
  Position,
  ChatLineSquare,
  ChatLineRound
} from '@element-plus/icons-vue'

const router = useRouter()

// 测试状态
const friendListLoading = ref(false)
const sendMessageLoading = ref(false)
const friendListResult = ref(null)
const sendMessageResult = ref(null)
const testNotification = ref('')
const testNotificationType = ref('info')

// 消息表单
const messageForm = ref({
  receiverId: '',
  content: ''
})

// 当前路由信息
const currentRoute = ref(router.currentRoute.value.path)

// 获取好友列表测试
const testGetFriendList = async () => {
  friendListLoading.value = true
  try {
    const response = await getFriendList()
    friendListResult.value = response
    showNotification('获取好友列表成功', 'success')
  } catch (error) {
    console.error('获取好友列表失败:', error)
    friendListResult.value = { error: error.message }
    showNotification('获取好友列表失败', 'error')
  } finally {
    friendListLoading.value = false
  }
}

// 发送消息测试
const testSendMessage = async () => {
  if (!messageForm.value.receiverId || !messageForm.value.content) {
    showNotification('请填写接收方ID和消息内容', 'warning')
    return
  }
  
  sendMessageLoading.value = true
  try {
    const messageData = {
      senderId: 1, // 当前用户ID
      receiverId: parseInt(messageForm.value.receiverId),
      content: messageForm.value.content,
      messageType: 'text'
    }
    
    const response = await sendSingleMessageByParam(messageData)
    sendMessageResult.value = response
    showNotification('消息发送成功', 'success')
  } catch (error) {
    console.error('发送消息失败:', error)
    sendMessageResult.value = { error: error.message }
    showNotification('发送消息失败', 'error')
  } finally {
    sendMessageLoading.value = false
  }
}

// 路由导航
const goToMainIM = () => {
  router.push('/im')
}

const goToFriendList = () => {
  // 假设有好友列表路由
  showNotification('好友列表功能开发中', 'info')
}

const goToGroupList = () => {
  // 假设有群组列表路由
  showNotification('群组列表功能开发中', 'info')
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 刷新页面
const refreshPage = () => {
  window.location.reload()
}

// 显示通知
const showNotification = (message, type = 'info') => {
  testNotification.value = message
  testNotificationType.value = type
  
  // 3秒后自动清除
  setTimeout(() => {
    testNotification.value = ''
  }, 3000)
}

// 初始化
onMounted(() => {
  showNotification('欢迎使用即时通讯测试页面', 'info')
})
</script>

<style scoped>
.wechat-test-page {
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  overflow-y: auto;
}

.test-header {
  background: #fff;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.back-icon {
  font-size: 20px;
  color: #07c160;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.back-icon:hover {
  background: #f0f9eb;
}

.test-header h2 {
  margin: 0;
  color: #333;
  font-weight: 600;
  font-size: 20px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-icon {
  font-size: 18px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
}

.action-icon:hover {
  color: #07c160;
  background: #f0f9eb;
  transform: rotate(180deg);
}

.test-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 20px;
}

.test-card {
  border-radius: 12px;
  border: none;
  transition: transform 0.2s;
}

.test-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: #333;
}

.card-icon {
  color: #07c160;
  font-size: 18px;
}

.test-section {
  padding: 16px 0;
}

.test-button {
  background: linear-gradient(45deg, #07c160, #06ae56);
  border: none;
  border-radius: 20px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.2s;
}

.test-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
}

.button-icon {
  margin-right: 6px;
}

.message-form {
  margin-top: 16px;
}

.form-input :deep(.el-input__inner),
.form-textarea :deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
}

.form-input :deep(.el-input__inner):focus,
.form-textarea :deep(.el-textarea__inner):focus {
  border-color: #07c160;
  box-shadow: 0 0 0 1px #07c160;
}

.send-button {
  background: linear-gradient(45deg, #67c23a, #5daf34);
  border: none;
  border-radius: 20px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.2s;
}

.send-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

.test-result {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #07c160;
}

.result-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.result-content {
  background: #fff;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  overflow-x: auto;
  margin: 0;
  border: 1px solid #e0e0e0;
}

.route-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.route-button {
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.2s;
}

.route-button:hover {
  transform: translateY(-1px);
}

.route-info {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 600;
  color: #333;
  min-width: 80px;
  font-size: 14px;
}

.info-value {
  color: #666;
  font-size: 14px;
  word-break: break-all;
}

.test-notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  max-width: 400px;
}

.notification-alert {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .test-content {
    grid-template-columns: 1fr;
  }
  
  .route-buttons {
    flex-direction: column;
  }
  
  .route-button {
    width: 100%;
  }
}

/* 动画效果 */
.test-card {
  animation: slideInUp 0.5s ease-out;
}

.test-card:nth-child(1) { animation-delay: 0.1s; }
.test-card:nth-child(2) { animation-delay: 0.2s; }
.test-card:nth-child(3) { animation-delay: 0.3s; }

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>