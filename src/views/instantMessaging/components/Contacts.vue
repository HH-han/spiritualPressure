<template>
  <ContactsMain 
    @select-friend="handleSelectFriend"
    @select-group="handleSelectGroup"
  />
</template>

<script setup>
import { ContactsMain } from '../Addressbook'

// 处理好友选择事件
const handleSelectFriend = (friend) => {
  console.log('选择好友:', friend)
  // 这里可以跳转到聊天页面
}

// 处理群聊选择事件
const handleSelectGroup = (group) => {
  console.log('选择群聊:', group)
  // 这里可以跳转到群聊页面
}
</script>

<style scoped>
.wechat-contacts {
  height: 100%;
  background-color: #f5f5f5;
}
</style>