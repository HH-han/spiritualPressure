<template>
  <div class="wechat-group-list">
    <!-- 群组列表头部 -->
    <div class="list-header">
      <span class="header-title">群聊</span>
      <el-button 
        type="primary" 
        size="small" 
        @click="showCreateGroupDialog = true"
        class="create-button"
      >
        <el-icon><Plus /></el-icon>
        创建群聊
      </el-button>
    </div>
    
    <!-- 群组列表 -->
    <div class="group-items">
      <div 
        v-for="group in groups" 
        :key="group.id"
        class="group-item"
        :class="{ active: selectedGroupId === group.id }"
        @click="handleSelectGroup(group)"
      >
        <el-avatar :size="48" :src="group.avatar || '/default-group.png'" />
        <div class="group-info">
          <div class="group-name">{{ group.name }}</div>
          <div class="group-members">
            <span class="member-count">{{ group.memberCount }}人</span>
            <span class="last-message">{{ group.lastMessage || '暂无消息' }}</span>
          </div>
        </div>
        <div class="group-badge" v-if="group.unreadCount > 0">
          {{ group.unreadCount > 99 ? '99+' : group.unreadCount }}
        </div>
      </div>
      
      <div v-if="groups.length === 0" class="empty-state">
        <el-empty description="暂无群聊" />
      </div>
    </div>
    
    <!-- 创建群组对话框 -->
    <el-dialog
      v-model="showCreateGroupDialog"
      title="创建群聊"
      width="450px"
      :before-close="handleCloseDialog"
    >
      <el-form :model="groupForm" label-width="80px">
        <el-form-item label="群名称">
          <el-input 
            v-model="groupForm.name" 
            placeholder="请输入群名称"
            size="large"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="群描述">
          <el-input
            v-model="groupForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入群描述（可选）"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="初始成员">
          <el-select
            v-model="groupForm.members"
            multiple
            filterable
            placeholder="请选择初始成员"
            style="width: 100%"
          >
            <el-option
              v-for="friend in availableFriends"
              :key="friend.id"
              :label="friend.name"
              :value="friend.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateGroupDialog = false">取消</el-button>
          <el-button type="primary" @click="handleCreateGroup">
            创建群聊
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { createChatGroup } from '@/api/im.js'

const props = defineProps({
  groups: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select-group'])

const showCreateGroupDialog = ref(false)
const selectedGroupId = ref(null)
const groupForm = ref({
  name: '',
  description: '',
  members: []
})

// 模拟可用好友列表（实际应该从API获取）
const availableFriends = ref([
  { id: 2, name: '张三' },
  { id: 3, name: '李四' },
  { id: 4, name: '王五' },
  { id: 5, name: '赵六' }
])

// 选择群组
const handleSelectGroup = (group) => {
  selectedGroupId.value = group.id
  emit('select-group', group)
}

// 创建群组
const handleCreateGroup = async () => {
  try {
    if (!groupForm.value.name) {
      ElMessage.warning('请输入群名称')
      return
    }
    
    const requestData = {
      creatorId: 1, // 当前用户ID
      name: groupForm.value.name,
      description: groupForm.value.description,
      memberIds: groupForm.value.members
    }
    
    const response = await createChatGroup(requestData)
    if (response.code === 0 || response.code === '0') {
      ElMessage.success('群聊创建成功')
      showCreateGroupDialog.value = false
      groupForm.value = { name: '', description: '', members: [] }
      // 刷新群组列表
      emit('refresh')
    } else {
      ElMessage.error(response.msg || '创建群聊失败')
    }
  } catch (error) {
    ElMessage.error('创建群聊失败')
    console.error('创建群聊失败:', error)
  }
}

// 关闭对话框
const handleCloseDialog = () => {
  showCreateGroupDialog.value = false
  groupForm.value = { name: '', description: '', members: [] }
}
</script>

<style scoped>
@import '../css/group-list.css';
</style>