<template>
  <div class="add-member-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
      label-position="top"
    >
      <el-form-item label="搜索用户" prop="searchKeyword">
        <el-input
          v-model="formData.searchKeyword"
          placeholder="输入用户名、邮箱或手机号搜索用户"
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      
      <el-form-item label="选择用户" prop="selectedUsers">
        <div class="user-selection">
          <div class="search-results" v-if="searchResults.length > 0">
            <div class="result-header">搜索结果 ({{ searchResults.length }})</div>
            <div class="result-list">
              <div 
                v-for="user in searchResults" 
                :key="user.id"
                class="user-item"
                :class="{ selected: isUserSelected(user) }"
                @click="toggleUserSelection(user)"
              >
                <el-avatar :size="32" :src="user.avatar" :alt="user.username">
                  {{ user.username?.charAt(0) }}
                </el-avatar>
                <div class="user-info">
                  <div class="username">{{ user.username }}</div>
                  <div class="user-details">
                    <span>{{ user.email }}</span>
                    <span>{{ user.phone }}</span>
                  </div>
                </div>
                <el-icon class="check-icon" v-if="isUserSelected(user)">
                  <Check />
                </el-icon>
              </div>
            </div>
          </div>
          
          <div class="selected-users" v-if="formData.selectedUsers.length > 0">
            <div class="selected-header">已选择用户 ({{ formData.selectedUsers.length }})</div>
            <div class="selected-list">
              <el-tag
                v-for="user in formData.selectedUsers"
                :key="user.id"
                closable
                @close="removeSelectedUser(user)"
                class="selected-tag"
              >
                {{ user.username }}
              </el-tag>
            </div>
          </div>
          
          <div class="empty-state" v-if="searchResults.length === 0 && formData.selectedUsers.length === 0">
            <el-icon><User /></el-icon>
            <p>请输入关键词搜索用户</p>
          </div>
        </div>
      </el-form-item>
      
      <el-form-item label="欢迎消息" prop="welcomeMessage">
        <el-input
          v-model="formData.welcomeMessage"
          type="textarea"
          :rows="2"
          placeholder="可选：发送给新成员的欢迎消息"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading" :disabled="formData.selectedUsers.length === 0">
          添加成员
        </el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { Search, Check, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  group: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref()
const loading = ref(false)

const formData = reactive({
  searchKeyword: '',
  selectedUsers: [],
  welcomeMessage: ''
})

const searchResults = ref([])

const rules = {
  selectedUsers: [
    { required: true, message: '请至少选择一个用户', trigger: 'change' }
  ]
}

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    username: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    avatar: ''
  },
  {
    id: 2,
    username: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    avatar: ''
  },
  {
    id: 3,
    username: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    avatar: ''
  },
  {
    id: 4,
    username: '赵六',
    email: 'zhaoliu@example.com',
    phone: '13800138004',
    avatar: ''
  },
  {
    id: 5,
    username: '钱七',
    email: 'qianqi@example.com',
    phone: '13800138005',
    avatar: ''
  }
]

const handleSearch = () => {
  if (!formData.searchKeyword.trim()) {
    searchResults.value = []
    return
  }
  
  const keyword = formData.searchKeyword.toLowerCase()
  searchResults.value = mockUsers.filter(user => 
    user.username.toLowerCase().includes(keyword) ||
    user.email.toLowerCase().includes(keyword) ||
    user.phone.includes(keyword)
  )
}

const isUserSelected = (user) => {
  return formData.selectedUsers.some(selected => selected.id === user.id)
}

const toggleUserSelection = (user) => {
  if (isUserSelected(user)) {
    removeSelectedUser(user)
  } else {
    formData.selectedUsers.push(user)
  }
}

const removeSelectedUser = (user) => {
  const index = formData.selectedUsers.findIndex(selected => selected.id === user.id)
  if (index !== -1) {
    formData.selectedUsers.splice(index, 1)
  }
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (!valid) return
    
    loading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('submit', formData.selectedUsers)
    ElMessage.success(`成功添加 ${formData.selectedUsers.length} 个成员`)
  } catch (error) {
    console.error('添加成员失败:', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

// 重置表单
watch(() => props.group, () => {
  formData.searchKeyword = ''
  formData.selectedUsers = []
  formData.welcomeMessage = ''
  searchResults.value = []
}, { immediate: true })
</script>

<style scoped>
.add-member-form {
  padding: 0;
}

.user-selection {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 16px;
  min-height: 200px;
  max-height: 300px;
  overflow-y: auto;
}

.search-results {
  margin-bottom: 16px;
}

.result-header, .selected-header {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 8px;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
}

.user-item:hover {
  background-color: #f5f7fa;
}

.user-item.selected {
  background-color: #ecf5ff;
  border: 1px solid #409eff;
}

.user-info {
  flex: 1;
  margin-left: 12px;
}

.username {
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
}

.user-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}

.check-icon {
  color: #67c23a;
  font-size: 16px;
}

.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-tag {
  margin-bottom: 4px;
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

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

@media (max-width: 768px) {
  .user-details {
    flex-direction: column;
    gap: 2px;
  }
  
  .selected-list {
    justify-content: flex-start;
  }
}
</style>