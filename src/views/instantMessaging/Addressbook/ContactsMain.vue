<template>
  <div class="wechat-contacts">
    <!-- 搜索框 -->
    <ContactsSearch @search="handleSearch" />

    <!-- 通讯录列表 -->
    <div class="contacts-list">
      <!-- 新的朋友 -->
      <NewFriendsSection 
        :friend-requests="friendRequests"
        @refresh-requests="loadFriendRequests"
        @refresh-friends="loadFriends"
      />

      <!-- 群聊 -->
      <GroupsSection 
        :groups="groups"
        :available-friends="availableFriends"
        @select-group="handleSelectGroup"
        @refresh-groups="loadGroups"
      />

      <!-- 标签 -->
      <TagsSection 
        :tags="tags"
        @refresh-tags="loadTags"
      />

      <!-- 公众号 -->
      <OfficialAccountsSection 
        :official-accounts="officialAccounts"
      />

      <!-- 好友列表 -->
      <FriendsSection 
        :friends="friends"
        @select-friend="handleSelectFriend"
        @refresh-friends="loadFriends"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ContactsSearch from './ContactsSearch.vue'
import NewFriendsSection from './NewFriendsSection.vue'
import GroupsSection from './GroupsSection.vue'
import TagsSection from './TagsSection.vue'
import OfficialAccountsSection from './OfficialAccountsSection.vue'
import FriendsSection from './FriendsSection.vue'
import { getPendingFriendRequests, getFriendList, getChatGroupsByCreator } from '@/api/im.js'
import { useAuthStore } from '@/stores/auth.js'

const emit = defineEmits(['select-friend', 'select-group'])

// 数据
const friendRequests = ref([])
const groups = ref([])
const tags = ref([])
const officialAccounts = ref([])
const friends = ref([])
const availableFriends = ref([])

const authStore = useAuthStore()

// 搜索处理
const handleSearch = (keyword) => {
  // 这里可以实现全局搜索逻辑
  console.log('搜索关键词:', keyword)
}

// 选择好友
const handleSelectFriend = (friend) => {
  emit('select-friend', friend)
}

// 选择群聊
const handleSelectGroup = (group) => {
  emit('select-group', group)
}

// 加载数据
const loadFriendRequests = async () => {
  try {
    const response = await getPendingFriendRequests({ userId: authStore.user?.id })
    if (response.code === 0 || response.code === '0') {
      friendRequests.value = response.data || []
    }
  } catch (error) {
    console.error('加载好友申请失败:', error)
  }
}

const loadFriends = async () => {
  try {
    const response = await getFriendList({ userId: authStore.user?.id })
    if (response.code === 0 || response.code === '0') {
      friends.value = response.data || []
      availableFriends.value = response.data || []
    }
  } catch (error) {
    console.error('加载好友列表失败:', error)
  }
}

const loadGroups = async () => {
  try {
    const response = await getChatGroupsByCreator(authStore.user?.id)
    if (response.code === 0 || response.code === '0') {
      groups.value = response.data || []
    }
  } catch (error) {
    console.error('加载群组列表失败:', error)
  }
}

const loadTags = async () => {
  try {
    // 模拟标签数据
    tags.value = [
      { id: 1, name: '家人', count: 5 },
      { id: 2, name: '同事', count: 12 },
      { id: 3, name: '同学', count: 8 }
    ]
  } catch (error) {
    console.error('加载标签失败:', error)
  }
}

const loadOfficialAccounts = async () => {
  try {
    // 模拟公众号数据
    officialAccounts.value = [
      { id: 1, name: '微信团队', avatar: '/official-account-1.png', description: '微信官方账号' },
      { id: 2, name: '腾讯新闻', avatar: '/official-account-2.png', description: '最新资讯' }
    ]
  } catch (error) {
    console.error('加载公众号失败:', error)
  }
}

// 初始化加载数据
onMounted(() => {
  loadFriendRequests()
  loadFriends()
  loadGroups()
  loadTags()
  loadOfficialAccounts()
})
</script>

<style scoped>
.wechat-contacts {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
}

.contacts-list {
  flex: 1;
  overflow-y: auto;
    -ms-overflow-style: none;  /* IE 10+ */
  scrollbar-width: none;  /* Firefox */
}
/* Firefox */
.contacts-list::-webkit-scrollbar {
  display: none;
}
</style>