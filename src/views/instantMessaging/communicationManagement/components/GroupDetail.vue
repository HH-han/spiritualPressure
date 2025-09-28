<template>
  <div class="group-detail">
    <div class="group-info">
      <div class="avatar-section">
        <el-avatar :size="80" :src="group.avatar" :alt="group.name">
          {{ group.name?.charAt(0) }}
        </el-avatar>
        <div class="group-basic">
          <h3>{{ group.name }}</h3>
          <el-tag :type="group.status === 'active' ? 'success' : 'danger'">
            {{ group.status === 'active' ? '活跃' : '禁用' }}
          </el-tag>
          <el-tag :type="group.type === 'public' ? 'success' : 'warning'" style="margin-left: 8px;">
            {{ group.type === 'public' ? '公开群' : '私有群' }}
          </el-tag>
        </div>
      </div>
      
      <el-divider />
      
      <div class="group-description">
        <h4>群组描述</h4>
        <p>{{ group.description || '暂无描述' }}</p>
      </div>
      
      <el-descriptions :column="2" border>
        <el-descriptions-item label="群组ID">{{ group.id }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatTime(group.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="成员数量">{{ group.memberCount }}</el-descriptions-item>
        <el-descriptions-item label="在线人数">{{ group.onlineCount }}</el-descriptions-item>
        <el-descriptions-item label="最后活跃">{{ formatTime(group.lastActivityTime) || '-' }}</el-descriptions-item>
        <el-descriptions-item label="群主">{{ group.owner || '未知' }}</el-descriptions-item>
      </el-descriptions>
    </div>
    
    <div class="group-stats">
      <h4>群组统计</h4>
      <el-row :gutter="16">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ groupStats.messageCount || 0 }}</div>
            <div class="stat-label">今日消息</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ groupStats.activeMembers || 0 }}</div>
            <div class="stat-label">活跃成员</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ groupStats.avgOnlineTime || 0 }}</div>
            <div class="stat-label">平均在线(小时)</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ groupStats.fileCount || 0 }}</div>
            <div class="stat-label">文件数量</div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <div class="recent-activity">
      <h4>最近活动</h4>
      <el-timeline>
        <el-timeline-item
          v-for="activity in recentActivities"
          :key="activity.id"
          :timestamp="formatTime(activity.timestamp)"
          :type="activity.type"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  group: {
    type: Object,
    default: () => ({})
  }
})

const groupStats = ref({})
const recentActivities = ref([])

const formatTime = (timestamp) => {
  if (!timestamp) return '-'
  return new Date(timestamp).toLocaleString('zh-CN')
}

onMounted(() => {
  // 模拟获取群组统计数据
  groupStats.value = {
    messageCount: Math.floor(Math.random() * 100),
    activeMembers: Math.floor(Math.random() * 20),
    avgOnlineTime: Math.floor(Math.random() * 8),
    fileCount: Math.floor(Math.random() * 15)
  }
  
  // 模拟最近活动数据
  recentActivities.value = [
    {
      id: 1,
      type: 'primary',
      content: '用户 "张三" 加入了群组',
      timestamp: new Date().getTime() - 3600000 // 1小时前
    },
    {
      id: 2,
      type: 'success',
      content: '群组公告已更新',
      timestamp: new Date().getTime() - 7200000 // 2小时前
    },
    {
      id: 3,
      type: 'warning',
      content: '用户 "李四" 上传了文件 "项目文档.pdf"',
      timestamp: new Date().getTime() - 10800000 // 3小时前
    },
    {
      id: 4,
      type: 'info',
      content: '群组设置已修改',
      timestamp: new Date().getTime() - 14400000 // 4小时前
    }
  ]
})
</script>

<style scoped>
.group-detail {
  padding: 0;
}

.group-info {
  margin-bottom: 24px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.group-basic h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #303133;
}

.group-description {
  margin-bottom: 16px;
}

.group-description h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #606266;
}

.group-description p {
  margin: 0;
  color: #909399;
  line-height: 1.5;
}

.group-stats {
  margin-bottom: 24px;
}

.group-stats h4 {
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

.recent-activity h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #606266;
}

@media (max-width: 768px) {
  .avatar-section {
    flex-direction: column;
    text-align: center;
  }
  
  .group-stats .el-col {
    margin-bottom: 12px;
  }
  
  .group-stats .el-col:last-child {
    margin-bottom: 0;
  }
}
</style>