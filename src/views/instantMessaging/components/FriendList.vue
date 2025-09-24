<template>
  <div class="wechat-friend-list">
    <!-- 好友列表头部 -->
    <div class="list-header">
      <span class="header-title">好友</span>
      <el-button 
        type="primary" 
        size="small" 
        @click="showAddFriendDialog = true"
        class="add-button"
      >
        <el-icon><Plus /></el-icon>
        添加好友
      </el-button>
    </div>
    
    <!-- 搜索框 -->
    <div class="search-container">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索好友用户名"
        size="large"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    
    <!-- 好友列表 -->
    <div class="friend-items">
      <div 
        v-for="friend in filteredFriends" 
        :key="friend.id"
        class="friend-item"
        :class="{ active: selectedFriendId === friend.id }"
        @click="handleSelectFriend(friend)"
      >
        <el-avatar :size="48" :src="friend.image || '/default-avatar.png'" />
        <div class="friend-info">
          <div class="friend-name">{{ friend.username }}</div>
          <div class="friend-status">
            <span class="status-dot online"></span>
            在线
          </div>
        </div>
        <!-- 好友操作按钮 -->
        <div class="friend-actions" @click.stop="showFriendDetail(friend)">
          <button>
            <el-icon><More /></el-icon>
          </button>
        </div>
      </div>
      
      <div v-if="filteredFriends.length === 0" class="empty-state">
        <el-empty :description="searchKeyword ? '未找到匹配的好友' : '暂无好友'" />
      </div>
    </div>
    
    <!-- 添加好友对话框 -->
    <el-dialog
      v-model="showAddFriendDialog"
      title="添加好友"
      width="400px"
      :before-close="handleCloseDialog"
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

    <!-- 好友详情模态框 -->
    <el-dialog
      v-model="showFriendDetailDialog"
      :title="selectedFriend ? selectedFriend.username + '的详细信息' : '好友详情'"
      width="500px"
    >
      <div v-if="selectedFriend" class="friend-detail-content">
        <!-- 好友基本信息 -->
        <div class="friend-basic-info">
          <el-avatar :size="80" :src="selectedFriend.image || '/default-avatar.png'" />
          <div class="friend-main-info">
            <h3>{{ selectedFriend.username }}</h3>
            <p class="friend-id">ID: {{ selectedFriend.id }}</p>
            <p class="friend-status-text">
              <span class="status-dot online"></span>
              在线
            </p>
          </div>
        </div>
        <!-- 详细信息 -->
        <div class="friend-detail-info">
          <h4>详细信息</h4>
          <div class="info-item">
            <span class="info-label">签名：</span>
            <span class="info-value">{{ selectedFriend?.signature || '这个人很懒，什么都没留下~' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">昵称：</span>
            <span class="info-value">{{ selectedFriend?.nickname || selectedFriend?.username }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">邮箱：</span>
            <span class="info-value">{{ selectedFriend?.email || '未设置' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">手机：</span>
            <span class="info-value">{{ selectedFriend?.phone || '未设置' }}</span>
          </div>
        </div>
        <!-- 好友关系设置 -->
        <div class="friend-relationship">
          <h4>关系设置</h4>
          <el-checkbox v-model="isSpecialFriend" @change="handleSetSpecialFriend">
            设为特别关心
          </el-checkbox>
          <el-checkbox v-model="isMuted" @change="handleMuteFriend">
            消息免打扰
          </el-checkbox>
        </div>

        <!-- 操作按钮 -->
        <div class="friend-operations">
          <el-button type="primary" @click="handleSendMessage">
            发送消息
          </el-button>
          <el-button @click="handleViewProfile">
            查看资料
          </el-button>
          <el-button type="warning" @click="handleBlockFriend">
            加入黑名单
          </el-button>
          <el-button type="danger" @click="handleDeleteFriend">
            删除好友
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, More, Search } from '@element-plus/icons-vue'
import { sendFriendRequest, deleteFriend, blockFriend, setSpecialFriend } from '@/api/im.js'
import { useAuthStore } from '@/stores/auth.js'

const props = defineProps({
  friends: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select-friend', 'refresh-friends'])

const showAddFriendDialog = ref(false)
const showFriendDetailDialog = ref(false)
const selectedFriendId = ref(null)
const selectedFriend = ref(null)
const friendForm = ref({
  phone: '',
  message: '你好，我想添加你为好友'
})
const isSpecialFriend = ref(false)
const isMuted = ref(false)
const searchKeyword = ref('')
const authStore = useAuthStore()

// 过滤后的好友列表
const filteredFriends = computed(() => {
  if (!searchKeyword.value.trim()) {
    return props.friends
  }
  
  const keyword = searchKeyword.value.toLowerCase().trim()
  return props.friends.filter(friend => 
    friend.username?.toLowerCase().includes(keyword)
  )
})

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已通过computed属性自动处理
}

// 选择好友
const handleSelectFriend = (friend) => {
  selectedFriendId.value = friend.id
  emit('select-friend', friend)
}

// 显示好友详情
const showFriendDetail = (friend) => {
  selectedFriend.value = friend
  showFriendDetailDialog.value = true
  // 初始化关系设置状态（这里需要根据实际API获取）
  isSpecialFriend.value = friend.isSpecial || false
  isMuted.value = friend.isMuted || false
}

// 设为特别关心
const handleSetSpecialFriend = async () => {
  try {
    await ensureUserInfoLoaded()
    const response = await setSpecialFriend({
      userId: authStore.user?.id,
      friendId: selectedFriend.value.id,
      isSpecial: isSpecialFriend.value
    })
    
    if (response.code === 0 || response.code === '0') {
      ElMessage.success(isSpecialFriend.value ? '已设为特别关心' : '已取消特别关心')
    } else {
      ElMessage.error(response.msg || '设置失败')
    }
  } catch (error) {
    console.error('设置特别关心失败:', error)
    ElMessage.error('设置失败')
  }
}

// 消息免打扰
const handleMuteFriend = async () => {
  ElMessage.success(isMuted.value ? '已设置消息免打扰' : '已取消消息免打扰')
  // 这里需要调用相应的API来实现消息免打扰功能
}

// 发送消息
const handleSendMessage = () => {
  if (selectedFriend.value) {
    handleSelectFriend(selectedFriend.value)
    showFriendDetailDialog.value = false
  }
}

// 查看资料
const handleViewProfile = () => {
  ElMessage.info('查看好友资料功能待实现')
  // 这里可以跳转到好友资料页面
}

// 加入黑名单
const handleBlockFriend = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要将 ${selectedFriend.value.username} 加入黑名单吗？加入黑名单后将不再接收对方的消息`,
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await ensureUserInfoLoaded()
    const response = await blockFriend({
      userId: authStore.user?.id,
      blockedUserId: selectedFriend.value.id
    })
    
    if (response.code === 0 || response.code === '0') {
      ElMessage.success('已加入黑名单')
      showFriendDetailDialog.value = false
      emit('refresh-friends') // 刷新好友列表
    } else {
      ElMessage.error(response.msg || '操作失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('加入黑名单失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

// 删除好友
const handleDeleteFriend = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除好友 ${selectedFriend.value.username} 吗？此操作不可恢复`,
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error'
      }
    )
    
    await ensureUserInfoLoaded()
    const response = await deleteFriend({
      userId: authStore.user?.id,
      friendId: selectedFriend.value.id
    })
    
    if (response.code === 0 || response.code === '0') {
      ElMessage.success('好友删除成功')
      showFriendDetailDialog.value = false
      emit('refresh-friends') // 刷新好友列表
    } else {
      ElMessage.error(response.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除好友失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 确保用户信息已加载
const ensureUserInfoLoaded = async () => {
  if (!authStore.user?.id) {
    try {
      await authStore.getUserInfo()
    } catch (error) {
      console.error('获取用户信息失败:', error)
      ElMessage.error('获取用户信息失败')
    }
  }
}

// 添加好友
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
    
    await ensureUserInfoLoaded()
    
    const requestData = {
      senderId: authStore.user?.id || 0, // 使用当前用户真实ID
      receiverPhone: friendForm.value.phone,
      message: friendForm.value.message
    }
    
    const response = await sendFriendRequest(requestData)
    if (response.code === 0 || response.code === '0') {
      ElMessage.success('好友申请发送成功')
      showAddFriendDialog.value = false
      friendForm.value = { phone: '', message: '你好，我想添加你为好友' }
    } else {
      ElMessage.error(response.msg || '发送申请失败')
    }
  } catch (error) {
    ElMessage.error('发送申请失败')
    console.error('发送好友申请失败:', error)
  }
}

// 关闭对话框
const handleCloseDialog = () => {
  showAddFriendDialog.value = false
  friendForm.value = { phone: '', message: '你好，我想添加你为好友' }
}
</script>

<style scoped>
@import '../Imcss/friend-list.css';
</style>