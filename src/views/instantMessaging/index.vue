<template>
  <div class="wechat-container">
    <div class="wechat-layout">
      <!-- 左侧联系人列表 -->
      <div class="wechat-sidebar">
        <div class="sidebar-header">
          <div class="header-title">
            <el-avatar :size="36" :src="userInfo.image || '/default-avatar.png'" />
            <span class="title-text">{{ userInfo.nickname }}</span>
          </div>
          <div class="header-actions">
            <el-icon><Search /></el-icon>
            <el-icon><Plus /></el-icon>
          </div>
        </div>
        
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索"
            size="large"
            :prefix-icon="Search"
            class="wechat-search"
          />
        </div>
        
        <el-tabs v-model="activeTab" class="wechat-tabs">
          <el-tab-pane label="聊天" name="chats">
            <friend-list 
              :friends="filteredFriends" 
              @select-friend="handleSelectFriend"
              @refresh-friends="loadFriends"
            />
          </el-tab-pane>
          
          <el-tab-pane label="联系人" name="contacts">
            <group-list 
              :groups="filteredGroups" 
              @select-group="handleSelectGroup"
            />
          </el-tab-pane>
          
          <el-tab-pane label="发现" name="discover">
            <friend-request-list 
              :requests="pendingRequests" 
              @update-requests="handleUpdateRequests"
            />
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 右侧聊天区域 -->
      <div class="wechat-main">
        <chat-window 
          v-if="currentChat.type"
          :chat="currentChat"
          @send-message="handleSendMessage"
        />
        
        <div v-else class="welcome-screen">
          <div class="welcome-content">
            <div class="welcome-icon">
              <el-icon><ChatDotRound /></el-icon>
            </div>
            <h3>欢迎使用博览即时通讯</h3>
            <p>选择一个聊天开始对话</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 背景样式 -->
  <div>
    <DynamicParticle />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Plus, ChatDotRound } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import FriendList from './components/FriendList.vue'
import GroupList from './components/GroupList.vue'
import FriendRequestList from './components/FriendRequestList.vue'
import ChatWindow from './components/ChatWindow.vue'
import DynamicParticle from '@/components/ThemeComponents/DynamicParticle.vue';
import { getFriendList, getPendingFriendRequests, getChatGroupsByCreator } from '@/api/im.js'
import { getUserInfo } from '@/api/user.js'

const searchKeyword = ref('')
const activeTab = ref('chats')
const friends = ref([])
const groups = ref([])
const pendingRequests = ref([])
const currentChat = ref({ type: null, id: null, name: null })
const userInfo = ref({})
const authStore = useAuthStore()

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

// 过滤后的好友列表
const filteredFriends = computed(() => {
  if (!searchKeyword.value) return friends.value
  return friends.value.filter(friend => 
    friend.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 过滤后的群组列表
const filteredGroups = computed(() => {
  if (!searchKeyword.value) return groups.value
  return groups.value.filter(group => 
    group.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const response = await getUserInfo()
    if (response.code === 0 || response.code === '0') {
      userInfo.value = response.data
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
    // 如果获取用户信息失败，使用默认用户名
    userInfo.value = { username: authStore.user || '用户' }
  }
}

// 加载好友列表
const loadFriends = async () => {
  try {
    await ensureUserInfoLoaded()
    const userId = authStore.user?.id || 0
    const response = await getFriendList({ userId })
    if (response.code === 0 || response.code === '0') {
      friends.value = response.data
    }
  } catch (error) {
    ElMessage.error('加载好友列表失败')
    console.error('加载好友列表失败:', error)
  }
}

// 加载群组列表
const loadGroups = async () => {
  try {
    await ensureUserInfoLoaded()
    const creatorId = authStore.user?.id || 0
    const response = await getChatGroupsByCreator(creatorId)
    if (response.code === 0 || response.code === '0') {
      groups.value = response.data
    }
  } catch (error) {
    ElMessage.error('加载群组列表失败')
    console.error('加载群组列表失败:', error)
  }
}

// 加载好友申请
const loadFriendRequests = async () => {
  try {
    await ensureUserInfoLoaded()
    const userId = authStore.user?.id || 0
    const response = await getPendingFriendRequests({ userId })
    if (response.code === 0 || response.code === '0') {
      pendingRequests.value = response.data
    }
  } catch (error) {
    ElMessage.error('加载好友申请失败')
    console.error('加载好友申请失败:', error)
  }
}

// 选择好友
const handleSelectFriend = (friend) => {
  currentChat.value = {
    type: 'friend',
    id: friend.id,
    username: friend.username,
    image: friend.image
  }
}

// 选择群组
const handleSelectGroup = (group) => {
  currentChat.value = {
    type: 'group',
    id: group.id,
    name: group.name,
    image: group.avatar || '/default-group.png'
  }
}

// 处理好友申请更新
const handleUpdateRequests = (updatedRequests) => {
  pendingRequests.value = updatedRequests
}

// 发送消息
const handleSendMessage = async (messageData) => {
  try {
    console.log('发送消息:', messageData)
    
    // 根据消息类型重新加载相应数据
    if (messageData.type === 'friend') {
      // 对于好友消息，重新加载好友列表以更新最后消息时间
      await loadFriends()
    } else if (messageData.type === 'group') {
      // 对于群组消息，重新加载群组列表以更新最后消息时间
      await loadGroups()
    }
    
    ElMessage.success('消息发送成功')
  } catch (error) {
    ElMessage.error('消息发送失败')
    console.error('消息发送失败:', error)
  }
}

// 初始化加载数据
onMounted(() => {
  loadUserInfo()
  loadFriends()
  loadGroups()
  loadFriendRequests()
})
</script>

<style scoped>
.wechat-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1200px;
  padding: 20px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.wechat-layout {
  width: 100%;
  max-width: 1200px;
  height: 90vh;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  overflow: hidden;
}

.wechat-sidebar {
  width: 320px;
  background: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px 20px;
  background: #ededed;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 16px;
  color: #666;
  cursor: pointer;
}

.search-box {
  padding: 16px 20px;
  background: #f5f5f5;
}

.wechat-search :deep(.el-input__wrapper) {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.wechat-tabs {
  flex: 1;
  overflow: hidden;
}

.wechat-tabs :deep(.el-tabs__header) {
  margin: 0;
  background: #f5f5f5;
}

.wechat-tabs :deep(.el-tabs__nav-wrap) {
  padding: 0 20px;
}

.wechat-tabs :deep(.el-tabs__item) {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.wechat-tabs :deep(.el-tabs__item.is-active) {
  color: #07c160;
}

.wechat-tabs :deep(.el-tabs__active-bar) {
  background-color: #07c160;
}

.wechat-tabs :deep(.el-tabs__content) {
  height: calc(100% - 55px);
  overflow: auto;
  background: #fff;
}

.wechat-main {
  flex: 1;
  background: #f5f5f5;
  position: relative;
}

.welcome-screen {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.welcome-content {
  text-align: center;
  color: #999;
}

.welcome-icon {
  font-size: 64px;
  color: #ccc;
  margin-bottom: 20px;
}

.welcome-content h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
}

.welcome-content p {
  font-size: 14px;
  color: #666;
}
</style>