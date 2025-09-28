<template>
  <div class="group-members">
    <div class="members-header">
      <div class="header-info">
        <h3>{{ group.name }} - 成员管理</h3>
        <div class="member-stats">
          <span>总成员: {{ members.length }}</span>
          <span>在线: {{ onlineCount }}</span>
        </div>
      </div>
      
      <div class="header-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索成员"
          style="width: 200px; margin-right: 12px;"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleAddMember">
          <el-icon><Plus /></el-icon>
          添加成员
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </div>
    </div>

    <el-table
      :data="filteredMembers"
      v-loading="loading"
      style="width: 100%"
      :default-sort="{ prop: 'joinTime', order: 'descending' }"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="avatar" label="头像" width="80" align="center">
        <template #default="{ row }">
          <el-avatar :size="40" :src="row.avatar" :alt="row.username">
            {{ row.username?.charAt(0) }}
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" min-width="120" />
      <el-table-column prop="role" label="角色" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="getRoleType(row.role)">
            {{ getRoleLabel(row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="onlineStatus" label="在线状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.onlineStatus === 'online' ? 'success' : 'info'">
            {{ row.onlineStatus === 'online' ? '在线' : '离线' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastActiveTime" label="最后活跃" width="160">
        <template #default="{ row }">
          {{ formatTime(row.lastActiveTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="joinTime" label="加入时间" width="160" sortable>
        <template #default="{ row }">
          {{ formatTime(row.joinTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="messageCount" label="消息数量" width="100" align="center">
        <template #default="{ row }">
          {{ row.messageCount || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEditRole(row)">修改角色</el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="handleRemoveMember(row)"
            :disabled="row.role === 'owner'"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 修改角色对话框 -->
    <el-dialog
      v-model="roleDialogVisible"
      title="修改成员角色"
      width="400px"
    >
      <div class="role-dialog">
        <div class="member-info">
          <el-avatar :size="40" :src="selectedMember?.avatar" :alt="selectedMember?.username">
            {{ selectedMember?.username?.charAt(0) }}
          </el-avatar>
          <span class="member-name">{{ selectedMember?.username }}</span>
        </div>
        
        <el-radio-group v-model="selectedRole" style="margin-top: 16px;">
          <el-radio label="member">普通成员</el-radio>
          <el-radio label="admin">管理员</el-radio>
        </el-radio-group>
        
        <div class="dialog-actions">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRoleConfirm" :loading="roleLoading">
            确认
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 添加成员对话框 -->
    <el-dialog
      v-model="addMemberDialogVisible"
      title="添加成员"
      width="600px"
    >
      <AddMemberForm 
        :group="group"
        @submit="handleAddMemberSubmit"
        @cancel="addMemberDialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddMemberForm from './AddMemberForm.vue'

const props = defineProps({
  group: {
    type: Object,
    default: () => ({})
  }
})

// 模拟成员数据
const mockMembers = [
  {
    id: 1,
    username: '张三',
    avatar: '',
    role: 'owner',
    onlineStatus: 'online',
    lastActiveTime: new Date().getTime(),
    joinTime: new Date('2023-03-15').getTime(),
    messageCount: 156
  },
  {
    id: 2,
    username: '李四',
    avatar: '',
    role: 'admin',
    onlineStatus: 'online',
    lastActiveTime: new Date().getTime() - 300000,
    joinTime: new Date('2023-04-20').getTime(),
    messageCount: 89
  },
  {
    id: 3,
    username: '王五',
    avatar: '',
    role: 'member',
    onlineStatus: 'offline',
    lastActiveTime: new Date('2024-01-14').getTime(),
    joinTime: new Date('2023-05-10').getTime(),
    messageCount: 42
  }
]

const members = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const roleDialogVisible = ref(false)
const addMemberDialogVisible = ref(false)
const selectedMember = ref(null)
const selectedRole = ref('member')
const roleLoading = ref(false)

// 计算属性
const filteredMembers = computed(() => {
  let filtered = members.value
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(member => 
      member.username.toLowerCase().includes(keyword)
    )
  }
  
  total.value = filtered.length
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

const onlineCount = computed(() => {
  return members.value.filter(member => member.onlineStatus === 'online').length
})

// 方法
const formatTime = (timestamp) => {
  if (!timestamp) return '-'
  return new Date(timestamp).toLocaleString('zh-CN')
}

const getRoleType = (role) => {
  const types = {
    owner: 'danger',
    admin: 'warning',
    member: 'info'
  }
  return types[role] || 'info'
}

const getRoleLabel = (role) => {
  const labels = {
    owner: '群主',
    admin: '管理员',
    member: '成员'
  }
  return labels[role] || '成员'
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const handleAddMember = () => {
  addMemberDialogVisible.value = true
}

const handleExport = () => {
  ElMessage.success('导出功能开发中...')
}

const handleEditRole = (member) => {
  selectedMember.value = member
  selectedRole.value = member.role
  roleDialogVisible.value = true
}

const handleRemoveMember = async (member) => {
  try {
    await ElMessageBox.confirm(
      `确定要移除成员 "${member.username}" 吗？`,
      '确认移除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = members.value.findIndex(m => m.id === member.id)
    if (index !== -1) {
      members.value.splice(index, 1)
    }
    
    ElMessage.success('成员移除成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('移除成员失败:', error)
      ElMessage.error('移除失败，请重试')
    }
  } finally {
    loading.value = false
  }
}

const handleRoleConfirm = async () => {
  if (!selectedMember.value) return
  
  try {
    roleLoading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const member = members.value.find(m => m.id === selectedMember.value.id)
    if (member) {
      member.role = selectedRole.value
    }
    
    roleDialogVisible.value = false
    ElMessage.success('角色修改成功')
  } catch (error) {
    console.error('修改角色失败:', error)
    ElMessage.error('修改失败，请重试')
  } finally {
    roleLoading.value = false
  }
}

const handleAddMemberSubmit = async (newMembers) => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 添加新成员
    newMembers.forEach(member => {
      members.value.push({
        ...member,
        id: Math.max(...members.value.map(m => m.id)) + 1,
        role: 'member',
        onlineStatus: 'offline',
        joinTime: new Date().getTime(),
        messageCount: 0
      })
    })
    
    addMemberDialogVisible.value = false
    ElMessage.success('成员添加成功')
  } catch (error) {
    console.error('添加成员失败:', error)
    ElMessage.error('添加失败，请重试')
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loading.value = true
  // 模拟数据加载
  setTimeout(() => {
    members.value = mockMembers
    total.value = mockMembers.length
    loading.value = false
  }, 800)
})
</script>

<style scoped>
.group-members {
  padding: 0;
}

.members-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.header-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #303133;
}

.member-stats {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #909399;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.role-dialog {
  padding: 0;
}

.member-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.member-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.dialog-actions {
  margin-top: 20px;
  text-align: right;
}

@media (max-width: 768px) {
  .members-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .header-actions .el-input {
    flex: 1;
    margin-right: 12px;
  }
}
</style>