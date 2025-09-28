<template>
  <div class="communication-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">即时通讯管理后台</h1>
      <div class="header-actions">
        <el-button type="primary" @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon user-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.totalUsers }}</div>
                <div class="stat-label">总用户数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon group-icon">
                <el-icon><UserFilled /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.totalGroups }}</div>
                <div class="stat-label">群组数量</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon message-icon">
                <el-icon><ChatDotRound /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.totalMessages }}</div>
                <div class="stat-label">今日消息</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon online-icon">
                <el-icon><Connection /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.onlineUsers }}</div>
                <div class="stat-label">在线用户</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <el-row :gutter="20">
        <!-- 左侧：用户管理 -->
        <el-col :span="12">
          <el-card class="content-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">用户管理</span>
                <el-button type="primary" size="small" @click="showAddUserDialog = true">
                  <el-icon><Plus /></el-icon>
                  添加用户
                </el-button>
              </div>
            </template>
            <UserManagement 
              :users="users" 
              @edit-user="handleEditUser"
              @delete-user="handleDeleteUser"
            />
          </el-card>
        </el-col>

        <!-- 右侧：群组管理 -->
        <el-col :span="12">
          <el-card class="content-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">群组管理</span>
                <el-button type="primary" size="small" @click="showAddGroupDialog = true">
                  <el-icon><Plus /></el-icon>
                  创建群组
                </el-button>
              </div>
            </template>
            <GroupManagement 
              :groups="groups" 
              @edit-group="handleEditGroup"
              @delete-group="handleDeleteGroup"
            />
          </el-card>
        </el-col>
      </el-row>

      <!-- 消息监控 -->
      <el-card class="content-card message-monitor">
        <template #header>
          <div class="card-header">
            <span class="card-title">实时消息监控</span>
            <div class="monitor-controls">
              <el-switch
                v-model="monitorEnabled"
                active-text="开启监控"
                inactive-text="关闭监控"
              />
              <el-button size="small" @click="clearMessages">清空记录</el-button>
            </div>
          </div>
        </template>
        <RealTimeMessageMonitor :messages="monitorMessages" :enabled="monitorEnabled" />
      </el-card>
    </div>

    <!-- 添加用户对话框 -->
    <UserForm 
      v-model:visible="showAddUserDialog"
      :user="editingUser"
      @submit="handleUserSubmit"
    />

    <!-- 添加群组对话框 -->
    <GroupForm 
      v-model:visible="showAddGroupDialog"
      :group="editingGroup"
      @submit="handleGroupSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Refresh,
  User,
  UserFilled,
  ChatDotRound,
  Connection,
  Plus
} from '@element-plus/icons-vue'

// 导入组件
import UserManagement from './components/UserManagement.vue'
import GroupManagement from './components/GroupManagement.vue'
import RealTimeMessageMonitor from './components/RealTimeMessageMonitor.vue'
import UserForm from './components/UserForm.vue'
import GroupForm from './components/GroupForm.vue'

// 响应式数据
const stats = ref({
  totalUsers: 0,
  totalGroups: 0,
  totalMessages: 0,
  onlineUsers: 0
})

const users = ref([])
const groups = ref([])
const monitorMessages = ref([])
const monitorEnabled = ref(true)

const showAddUserDialog = ref(false)
const showAddGroupDialog = ref(false)
const editingUser = ref(null)
const editingGroup = ref(null)

// 方法
const refreshData = async () => {
  try {
    // 模拟数据加载
    await loadStats()
    await loadUsers()
    await loadGroups()
    ElMessage.success('数据刷新成功')
  } catch (error) {
    ElMessage.error('数据刷新失败')
  }
}

const loadStats = async () => {
  // 模拟统计数据
  stats.value = {
    totalUsers: 1250,
    totalGroups: 89,
    totalMessages: 3421,
    onlineUsers: 856
  }
}

const loadUsers = async () => {
  // 模拟用户数据
  users.value = [
    { id: 1, username: '张三', email: 'zhangsan@example.com', status: 'online', lastLogin: '2024-01-15 10:30:00' },
    { id: 2, username: '李四', email: 'lisi@example.com', status: 'offline', lastLogin: '2024-01-14 16:20:00' },
    { id: 3, username: '王五', email: 'wangwu@example.com', status: 'online', lastLogin: '2024-01-15 09:15:00' }
  ]
}

const loadGroups = async () => {
  // 模拟群组数据
  groups.value = [
    { id: 1, name: '技术交流群', memberCount: 45, creator: '张三', createTime: '2024-01-10' },
    { id: 2, name: '产品讨论组', memberCount: 23, creator: '李四', createTime: '2024-01-12' },
    { id: 3, name: '项目管理', memberCount: 12, creator: '王五', createTime: '2024-01-14' }
  ]
}

const handleEditUser = (user) => {
  editingUser.value = user
  showAddUserDialog.value = true
}

const handleDeleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户 "${user.username}" 吗？`, '确认删除', {
      type: 'warning'
    })
    // 模拟删除操作
    users.value = users.value.filter(u => u.id !== user.id)
    ElMessage.success('用户删除成功')
  } catch {
    // 用户取消删除
  }
}

const handleEditGroup = (group) => {
  editingGroup.value = group
  showAddGroupDialog.value = true
}

const handleDeleteGroup = async (group) => {
  try {
    await ElMessageBox.confirm(`确定要删除群组 "${group.name}" 吗？`, '确认删除', {
      type: 'warning'
    })
    // 模拟删除操作
    groups.value = groups.value.filter(g => g.id !== group.id)
    ElMessage.success('群组删除成功')
  } catch {
    // 用户取消删除
  }
}

const handleUserSubmit = (userData) => {
  if (editingUser.value) {
    // 编辑用户
    const index = users.value.findIndex(u => u.id === editingUser.value.id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...userData }
    }
    editingUser.value = null
  } else {
    // 添加新用户
    const newUser = {
      id: Date.now(),
      ...userData,
      status: 'offline',
      lastLogin: '从未登录'
    }
    users.value.unshift(newUser)
  }
  showAddUserDialog.value = false
  ElMessage.success(editingUser.value ? '用户更新成功' : '用户添加成功')
}

const handleGroupSubmit = (groupData) => {
  if (editingGroup.value) {
    // 编辑群组
    const index = groups.value.findIndex(g => g.id === editingGroup.value.id)
    if (index !== -1) {
      groups.value[index] = { ...groups.value[index], ...groupData }
    }
    editingGroup.value = null
  } else {
    // 添加新群组
    const newGroup = {
      id: Date.now(),
      ...groupData,
      memberCount: 1,
      createTime: new Date().toLocaleDateString()
    }
    groups.value.unshift(newGroup)
  }
  showAddGroupDialog.value = false
  ElMessage.success(editingGroup.value ? '群组更新成功' : '群组创建成功')
}

const clearMessages = () => {
  monitorMessages.value = []
  ElMessage.info('消息记录已清空')
}

// 生命周期
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
@import './css/communication-management.css';
</style>