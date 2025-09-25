<template>
  <div class="contacts-section">
    <div class="section-header" @click="toggleSection">
      <div class="section-title">
        <el-icon><ChatDotRound /></el-icon>
        <span>群聊</span>
        <span class="section-badge" v-if="groups.length > 0">{{ groups.length }}</span>
      </div>
      <el-icon :class="{ 'rotate-180': expanded }">
        <ArrowDown />
      </el-icon>
    </div>
    <div v-show="expanded" class="section-content">
      <div 
        v-for="group in groups" 
        :key="group.id"
        class="group-item"
        @click="handleSelectGroup(group)"
      >
        <el-avatar :size="40" :src="group.avatar || '/default-group.png'" />
        <div class="group-info">
          <div class="group-name">{{ group.name }}</div>
          <div class="group-members">{{ group.memberCount }}人</div>
        </div>
        <div class="group-badge" v-if="group.unreadCount > 0">
          {{ group.unreadCount > 99 ? '99+' : group.unreadCount }}
        </div>
      </div>
      <div class="create-group-btn" @click="showCreateGroupDialog = true">
        <el-icon><Plus /></el-icon>
        <span>创建群聊</span>
      </div>
    </div>
  </div>

  <!-- 创建群聊对话框 -->
  <el-dialog
    v-model="showCreateGroupDialog"
    title="创建群聊"
    width="450px"
    :before-close="handleCloseCreateGroupDialog"
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
            :label="friend.username"
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
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ChatDotRound, ArrowDown, Plus } from '@element-plus/icons-vue'
import { createChatGroup } from '@/api/im.js'

const props = defineProps({
  groups: {
    type: Array,
    default: () => []
  },
  availableFriends: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select-group', 'refresh-groups'])

const expanded = ref(true)
const showCreateGroupDialog = ref(false)
const groupForm = ref({
  name: '',
  description: '',
  members: []
})

const toggleSection = () => {
  expanded.value = !expanded.value
}

const handleSelectGroup = (group) => {
  emit('select-group', group)
}

const handleCreateGroup = async () => {
  try {
    if (!groupForm.value.name) {
      ElMessage.warning('请输入群名称')
      return
    }
    
    const requestData = {
      creatorId: 1, // 这里需要从store获取当前用户ID
      name: groupForm.value.name,
      description: groupForm.value.description,
      memberIds: groupForm.value.members
    }
    
    const response = await createChatGroup(requestData)
    if (response.code === 0 || response.code === '0') {
      ElMessage.success('群聊创建成功')
      showCreateGroupDialog.value = false
      groupForm.value = { name: '', description: '', members: [] }
      emit('refresh-groups')
    } else {
      ElMessage.error(response.msg || '创建群聊失败')
    }
  } catch (error) {
    ElMessage.error('创建群聊失败')
    console.error('创建群聊失败:', error)
  }
}

const handleCloseCreateGroupDialog = () => {
  showCreateGroupDialog.value = false
  groupForm.value = { name: '', description: '', members: [] }
}
</script>

<style scoped>
.contacts-section {
  background: white;
  margin-bottom: 8px;
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
  padding: 8px 0;
}

.group-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f8f8f8;
}

.group-item:hover {
  background: #f8f8f8;
}

.group-info {
  flex: 1;
  margin-left: 12px;
}

.group-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.group-members {
  font-size: 12px;
  color: #999;
}

.group-badge {
  background: #ff3b30;
  color: white;
  border-radius: 10px;
  padding: 4px 8px;
  font-size: 12px;
  min-width: 20px;
  text-align: center;
}

.create-group-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  cursor: pointer;
  color: #07c160;
  font-size: 14px;
  transition: background-color 0.2s;
}

.create-group-btn:hover {
  background: #f8f8f8;
}
</style>