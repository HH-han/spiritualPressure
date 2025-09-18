<template>
  <div class="friend-request-list">
    <!-- 头部 -->
    <div class="header">
      <h3>好友申请</h3>
      <span class="badge">{{ requests.length }}</span>
    </div>

    <!-- 申请列表 -->
    <div class="request-list">
      <div 
        v-for="request in requests" 
        :key="request.id" 
        class="request-item"
      >
        <div class="request-info">
          <div class="avatar" @click="showUserDetail(request)">
            <img :src="request.senderAvatar || '/default-avatar.png'" alt="头像" />
          </div>
          <div class="info">
            <div class="name">{{ request.senderNickname || '未知用户' }}</div>
          </div>
        </div>
        <div class="request-actions">
          <button 
            type="success" round
            class="btn btn-success btn-sm" 
            @click="handleAccept(request)"
            :disabled="request.status !== 0"
          >
            接受
          </button>
          <button 
            type="danger" round
            class="btn btn-danger btn-sm" 
            @click="handleReject(request)"
            :disabled="request.status !== 0"
          >
            拒绝
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="requests.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-people"></i>
        </div>
        <div class="empty-text">暂无好友申请</div>
      </div>
    </div>

    <!-- 用户详情模态框 -->
    <el-dialog
      v-model="userDetailVisible"
      :title="selectedUser ? selectedUser.senderNickname + ' 的详细信息' : '用户信息'"
      width="500px"
      :close-on-click-modal="false"
    >
      <div v-if="selectedUser" class="user-detail-content">
        <div class="user-avatar">
          <img :src="selectedUser.senderAvatar || '/default-avatar.png'" alt="用户头像" />
        </div>
        <div class="user-info">
          <div class="info-item">
            <span class="label">用户名：</span>
            <span class="value">{{ selectedUser.senderNickname || '未知' }}</span>
          </div>
          <div class="info-item">
            <span class="label">申请时间：</span>
            <span class="value">{{ formatTime(selectedUser.createdAt) }}</span>
          </div>
          <div class="info-item">
            <span class="label">申请消息：</span>
            <span class="value">{{ selectedUser.message || '无' }}</span>
          </div>
          <div class="info-item">
            <span class="label">状态：</span>
            <span class="value">{{ getStatusText(selectedUser.status) }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userDetailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { acceptFriendRequest, rejectFriendRequest } from '@/api/im.js'

const props = defineProps({
  requests: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update-requests'])

const userDetailVisible = ref(false)
const selectedUser = ref(null)

// 显示用户详情
const showUserDetail = (request) => {
  selectedUser.value = request
  userDetailVisible.value = true
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待处理',
    accepted: '已接受',
    rejected: '已拒绝'
  }
  return statusMap[status] || '未知状态'
}

// 处理接受申请
const handleAccept = async (request) => {
  try {
    const response = await acceptFriendRequest({
      requestId: request.id,
      receiverId: request.receiverId,
      senderId: request.senderId
    })
    
    if (response.code === 0 || response.code === '0') {
      // 更新申请状态
      emit('update-requests', props.requests.map(req => 
        req.id === request.id ? { ...req, status: 'accepted' } : req
      ))
      ElMessage.success('好友申请已接受')
    } else {
      ElMessage.error(response.message || '接受好友申请失败')
    }
  } catch (error) {
    console.error('接受好友申请请求失败:', error)
    ElMessage.error('接受好友申请失败')
  }
}

// 处理拒绝申请
const handleReject = async (request) => {
  try {
    const response = await rejectFriendRequest({
      requestId: request.id,
      receiverId: request.receiverId,
      senderId: request.senderId
    })
    
    if (response.code === 0 || response.code === '0') {
      // 更新申请状态
      emit('update-requests', props.requests.map(req => 
        req.id === request.id ? { ...req, status: 'rejected' } : req
      ))
      ElMessage.success('好友申请已拒绝')
    } else {
      ElMessage.error(response.message || '拒绝好友申请失败')
    }
  } catch (error) {
    console.error('拒绝好友申请请求失败:', error)
    ElMessage.error('拒绝好友申请失败')
  }
}
</script>

<style scoped>
.friend-request-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

.header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header .badge {
  background-color: #007bff;
  color: white;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 12px;
}

.request-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  transition: box-shadow 0.2s;
}

.request-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.request-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.avatar:hover {
  transform: scale(1.1);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  flex: 1;
}

.name {
  font-weight: 500;
  margin-bottom: 2px;
}

.message {
  color: #666;
  font-size: 14px;
  margin-bottom: 2px;
}

.time {
  color: #999;
  font-size: 12px;
}

.request-actions {
  display: flex;
  gap: 8px;
}

.request-actions button {
  border-radius: 5px;
  border: none;
  min-width: 60px;
}

.btn-success{
  background-color: #5bd878;
  color: #fff;
}

.btn-danger{
  background-color: #ff0019;
  color: #fff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
}

/* 用户详情样式 */
.user-detail-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #f0f0f0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  width: 100%;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #666;
}

.value {
  color: #333;
  text-align: right;
}
</style>