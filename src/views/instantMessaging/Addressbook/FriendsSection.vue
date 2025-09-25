<template>
  <div class="contacts-section">
    <div class="section-header" @click="toggleSection">
      <div class="section-title">
        <el-icon><UserFilled /></el-icon>
        <span>好友</span>
        <span class="section-badge" v-if="sortedFriends.length > 0">{{ sortedFriends.length }}</span>
      </div>
      <el-icon :class="{ 'rotate-180': expanded }">
        <ArrowDown />
      </el-icon>
    </div>
    <div v-show="expanded" class="section-content">
      <div 
        v-for="(friendGroup, letter) in groupedFriends" 
        :key="letter"
        class="friend-group"
      >
        <div class="group-letter">{{ letter }}</div>
        <div 
          v-for="friend in friendGroup" 
          :key="friend.id"
          class="friend-item"
          @click="handleSelectFriend(friend)"
        >
          <el-avatar :size="40" :src="friend.image || '/default-avatar.png'" />
          <div class="friend-info">
            <div class="friend-name">{{ friend.nickname }}</div>
            <div class="friend-status">
              <span class="status-dot" :class="{ online: friend.onlineStatus }"></span>
              {{ friend.onlineStatus ? '在线' : '离线' }}
            </div>
          </div>
        </div>
      </div>
      <div class="add-friend-btn" @click="showAddFriendDialog = true">
        <el-icon><Plus /></el-icon>
        <span>添加好友</span>
      </div>
    </div>
  </div>

  <!-- 添加好友对话框 -->
  <el-dialog
    v-model="showAddFriendDialog"
    title="添加好友"
    width="400px"
    :before-close="handleCloseAddFriendDialog"
  >
    <el-form :model="friendForm" label-width="80px">
      <el-form-item label="手机号">
        <el-input 
          v-model="friendForm.phone" 
          placeholder="请输入好友手机号"
          size="large"
        />
      </el-form-item>
      <el-form-item label="验证信息">
        <el-input
          v-model="friendForm.message"
          type="textarea"
          :rows="3"
          placeholder="请输入验证信息"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddFriendDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddFriend">
          发送申请
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UserFilled, ArrowDown, Plus } from '@element-plus/icons-vue'
import { sendFriendRequest } from '@/api/im.js'
import { useAuthStore } from '@/stores/auth.js'

const props = defineProps({
  friends: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select-friend', 'refresh-friends'])

const expanded = ref(true)
const showAddFriendDialog = ref(false)
const friendForm = ref({
  phone: '',
  message: '你好，我想添加你为好友'
})

const authStore = useAuthStore()

// 按字母排序的好友列表
const sortedFriends = computed(() => {
  return [...props.friends].sort((a, b) => {
    const nameA = a.username.toUpperCase()
    const nameB = b.username.toUpperCase()
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  })
})

// 按字母分组的好友列表
const groupedFriends = computed(() => {
  const groups = {}
  sortedFriends.value.forEach(friend => {
    const firstLetter = friend.username.charAt(0).toUpperCase()
    if (!groups[firstLetter]) {
      groups[firstLetter] = []
    }
    groups[firstLetter].push(friend)
  })
  return groups
})

const toggleSection = () => {
  expanded.value = !expanded.value
}

const handleSelectFriend = (friend) => {
  emit('select-friend', friend)
}

const handleAddFriend = async () => {
  try {
    if (!friendForm.value.phone) {
      ElMessage.warning('请输入好友手机号')
      return
    }
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(friendForm.value.phone)) {
      ElMessage.warning('请输入正确的手机号格式')
      return
    }
    
    const requestData = {
      senderId: authStore.user?.id || 0,
      receiverPhone: friendForm.value.phone,
      message: friendForm.value.message
    }
    
    const response = await sendFriendRequest(requestData)
    if (response.code === 0 || response.code === '0') {
      ElMessage.success('好友申请发送成功')
      showAddFriendDialog.value = false
      friendForm.value = { phone: '', message: '你好，我想添加你为好友' }
      emit('refresh-friends')
    } else {
      ElMessage.error(response.msg || '发送申请失败')
    }
  } catch (error) {
    ElMessage.error('发送申请失败')
    console.error('发送好友申请失败:', error)
  }
}

const handleCloseAddFriendDialog = () => {
  showAddFriendDialog.value = false
  friendForm.value = { phone: '', message: '你好，我想添加你为好友' }
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

.friend-group {
  margin-bottom: 8px;
}

.group-letter {
  padding: 8px 16px;
  background: #f8f8f8;
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.friend-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f8f8f8;
}

.friend-item:hover {
  background: #f8f8f8;
}

.friend-info {
  flex: 1;
  margin-left: 12px;
}

.friend-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.friend-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ccc;
}

.status-dot.online {
  background: #07c160;
}

.add-friend-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  cursor: pointer;
  color: #07c160;
  font-size: 14px;
  transition: background-color 0.2s;
}

.add-friend-btn:hover {
  background: #f8f8f8;
}
</style>