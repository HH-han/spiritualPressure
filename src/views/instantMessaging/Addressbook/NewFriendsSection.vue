<template>
  <div class="contacts-section">
    <div class="section-header" @click="toggleSection">
      <div class="section-title">
        <el-icon><User /></el-icon>
        <span>新的朋友</span>
        <span class="section-badge" v-if="friendRequests.length > 0">{{ friendRequests.length }}</span>
      </div>
      <el-icon :class="{ 'rotate-180': expanded }">
        <ArrowDown />
      </el-icon>
    </div>
    <div v-show="expanded" class="section-content">
      <div v-if="friendRequests.length > 0" class="request-list">
        <div v-for="request in friendRequests" :key="request.id" class="request-item">
          <div class="request-info" @click="showUserDetail(request)">
            <div class="avatar">
              <img :src="request.senderAvatar || '/default-avatar.png'" alt="头像" />
            </div>
            <div class="info">
              <div class="name">{{ request.senderNickname || '未知用户' }}</div>
            </div>
          </div>
          <div class="request-actions">
            <el-button 
              v-if="request.status === 0"
              type="primary" 
              size="small" 
              :disabled="request.loading"
              @click="handleAccept(request)">
              接受
            </el-button>
            <el-button 
              v-if="request.status === 0"
              type="danger" 
              size="small" 
              :disabled="request.loading"
              @click="handleReject(request)">
              拒绝
            </el-button>
            <span v-else class="status-text">{{ getStatusText(request.status) }}</span>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">
          <el-icon><User /></el-icon>
        </div>
        <div class="empty-text">暂无好友申请</div>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, ArrowDown } from '@element-plus/icons-vue'
import { acceptFriendRequest, rejectFriendRequest } from '@/api/im.js'
import { useAuthStore } from '@/stores/auth.js'

const props = defineProps({
  friendRequests: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['refresh-requests', 'refresh-friends'])

const expanded = ref(true)
const userDetailVisible = ref(false)
const selectedUser = ref(null)
const authStore = useAuthStore()

const toggleSection = () => {
  expanded.value = !expanded.value
}

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
    0: '待处理',
    1: '已接受',
    2: '已拒绝'
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
      ElMessage.success('好友申请已接受')
      emit('refresh-requests')
      emit('refresh-friends')
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
    await ElMessageBox.confirm(
      `确定要拒绝 ${request.senderNickname || '该用户'} 的好友申请吗？`,
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await rejectFriendRequest({
      requestId: request.id,
      receiverId: request.receiverId,
      senderId: request.senderId
    })
    
    if (response.code === 0 || response.code === '0') {
      ElMessage.success('好友申请已拒绝')
      emit('refresh-requests')
    } else {
      ElMessage.error(response.message || '拒绝好友申请失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('拒绝好友申请请求失败:', error)
      ElMessage.error('拒绝失败')
    }
  }
}
</script>

<style scoped>
.contacts-section {
  background: white;
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.section-header:hover {
  background: #f8f8f8;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.section-badge {
  background: #ff3b30;
  color: white;
  border-radius: 10px;
  font-size: 12px;
  min-width: 20px;
  text-align: center;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.section-content {
  padding: 0;
}

.request-list {
  padding: 8px 0;
}

.request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f8f8f8;
  transition: background-color 0.2s;
}

.request-item:hover {
  background: #f8f8f8;
}

.request-item:last-child {
  border-bottom: none;
}

.request-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
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
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.message {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.time {
  font-size: 11px;
  color: #999;
}

.request-actions {
  display: flex;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #ccc;
}

.empty-text {
  font-size: 14px;
}

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
  min-width: 80px;
}

.value {
  color: #333;
  text-align: right;
  flex: 1;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>