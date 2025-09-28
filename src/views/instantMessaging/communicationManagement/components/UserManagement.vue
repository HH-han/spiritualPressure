<template>
  <div class="user-management">
    <el-card class="content-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">用户管理</span>
          <div class="card-actions">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索用户名、邮箱或手机号"
              style="width: 300px; margin-right: 12px;"
              clearable
              @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleAddUser">
              <el-icon><Plus /></el-icon>
              添加用户
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="filteredUsers"
        v-loading="loading"
        style="width: 100%"
        :default-sort="{ prop: 'createTime', order: 'descending' }"
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
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="phone" label="手机号" min-width="130" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '活跃' : '禁用' }}
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
        <el-table-column prop="lastLoginTime" label="最后登录" width="160">
          <template #default="{ row }">
            {{ formatTime(row.lastLoginTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="160" sortable>
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="row.status === 'active' ? 'danger' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button size="small" type="warning" @click="handleViewDetail(row)">详情</el-button>
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
    </el-card>

    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="selectedUser ? selectedUser.username + ' - 用户详情' : '用户详情'"
      width="600px"
    >
      <UserDetail :user="selectedUser" v-if="detailDialogVisible" />
    </el-dialog>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEdit ? '编辑用户' : '添加用户'"
      width="500px"
    >
      <UserForm 
        :user="selectedUser" 
        :is-edit="isEdit"
        @submit="handleFormSubmit"
        @cancel="editDialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import UserDetail from './UserDetail.vue'
import UserForm from './UserForm.vue'

// 模拟数据
const mockUsers = [
  {
    id: 1,
    username: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    avatar: '',
    status: 'active',
    onlineStatus: 'online',
    lastLoginTime: new Date().getTime(),
    createTime: new Date('2023-01-15').getTime()
  },
  {
    id: 2,
    username: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    avatar: '',
    status: 'active',
    onlineStatus: 'offline',
    lastLoginTime: new Date('2024-01-14').getTime(),
    createTime: new Date('2023-02-20').getTime()
  },
  {
    id: 3,
    username: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    avatar: '',
    status: 'inactive',
    onlineStatus: 'offline',
    lastLoginTime: new Date('2024-01-10').getTime(),
    createTime: new Date('2023-03-10').getTime()
  }
]

const users = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailDialogVisible = ref(false)
const editDialogVisible = ref(false)
const selectedUser = ref(null)
const isEdit = ref(false)

// 计算属性
const filteredUsers = computed(() => {
  let filtered = users.value
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.username.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      user.phone.includes(keyword)
    )
  }
  
  total.value = filtered.length
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

// 方法
const formatTime = (timestamp) => {
  if (!timestamp) return '-'
  return new Date(timestamp).toLocaleString('zh-CN')
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

const handleAddUser = () => {
  selectedUser.value = null
  isEdit.value = false
  editDialogVisible.value = true
}

const handleEdit = (user) => {
  selectedUser.value = { ...user }
  isEdit.value = true
  editDialogVisible.value = true
}

const handleToggleStatus = async (user) => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const userIndex = users.value.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      users.value[userIndex].status = user.status === 'active' ? 'inactive' : 'active'
    }
  } catch (error) {
    console.error('切换用户状态失败:', error)
  } finally {
    loading.value = false
  }
}

const handleViewDetail = (user) => {
  selectedUser.value = user
  detailDialogVisible.value = true
}

const handleFormSubmit = async (formData) => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (isEdit.value) {
      // 编辑用户
      const index = users.value.findIndex(u => u.id === selectedUser.value.id)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...formData }
      }
    } else {
      // 添加用户
      const newUser = {
        id: Math.max(...users.value.map(u => u.id)) + 1,
        ...formData,
        createTime: new Date().getTime(),
        onlineStatus: 'offline'
      }
      users.value.unshift(newUser)
    }
    
    editDialogVisible.value = false
  } catch (error) {
    console.error('保存用户失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loading.value = true
  // 模拟数据加载
  setTimeout(() => {
    users.value = mockUsers
    total.value = mockUsers.length
    loading.value = false
  }, 800)
})
</script>

<style scoped>
.user-management {
  width: 100%;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .card-actions {
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
  
  .card-actions .el-input {
    width: 100% !important;
    margin-right: 0 !important;
  }
}
</style>