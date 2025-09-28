<template>
  <div class="user-detail">
    <div class="user-info">
      <div class="avatar-section">
        <el-avatar :size="80" :src="user.avatar" :alt="user.username">
          {{ user.username?.charAt(0) }}
        </el-avatar>
        <div class="user-basic">
          <h3>{{ user.username }}</h3>
          <el-tag :type="user.status === 'active' ? 'success' : 'danger'">
            {{ user.status === 'active' ? '活跃' : '禁用' }}
          </el-tag>
          <el-tag :type="user.onlineStatus === 'online' ? 'success' : 'info'" style="margin-left: 8px;">
            {{ user.onlineStatus === 'online' ? '在线' : '离线' }}
          </el-tag>
        </div>
      </div>
      
      <el-divider />
      
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户ID">{{ user.id }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ user.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ user.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ formatTime(user.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="最后登录">{{ formatTime(user.lastLoginTime) || '-' }}</el-descriptions-item>
        <el-descriptions-item label="登录次数">{{ user.loginCount || 0 }}</el-descriptions-item>
      </el-descriptions>
    </div>
    
    <div class="user-stats">
      <h4>用户统计</h4>
      <el-row :gutter="16">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ userStats.groupCount || 0 }}</div>
            <div class="stat-label">加入群组</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ userStats.messageCount || 0 }}</div>
            <div class="stat-label">发送消息</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ userStats.friendCount || 0 }}</div>
            <div class="stat-label">好友数量</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ userStats.onlineTime || 0 }}</div>
            <div class="stat-label">在线时长(小时)</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})

const userStats = ref({})

const formatTime = (timestamp) => {
  if (!timestamp) return '-'
  return new Date(timestamp).toLocaleString('zh-CN')
}

onMounted(() => {
  // 模拟获取用户统计数据
  userStats.value = {
    groupCount: Math.floor(Math.random() * 10),
    messageCount: Math.floor(Math.random() * 1000),
    friendCount: Math.floor(Math.random() * 50),
    onlineTime: Math.floor(Math.random() * 100)
  }
})
</script>

<style scoped>
.user-detail {
  padding: 0;
}

.user-info {
  margin-bottom: 24px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.user-basic h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #303133;
}

.user-stats h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #606266;
}

.stat-card {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

@media (max-width: 768px) {
  .avatar-section {
    flex-direction: column;
    text-align: center;
  }
  
  .user-stats .el-col {
    margin-bottom: 12px;
  }
  
  .user-stats .el-col:last-child {
    margin-bottom: 0;
  }
}
</style>