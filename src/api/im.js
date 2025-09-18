import request from '../utils/request.js'

// 发送单聊消息（参数方式）
export const sendSingleMessageByParam = (data) => {
  return request({
    url: `api/public/im/single/send/param`,
    method: 'POST',
    data
  })
}

// 发送单聊消息（实体方式）
export const sendSingleMessage = (data) => {
  return request({
    url: `api/public/im/single/send`,
    method: 'POST',
    data
  })
}

// 发送群聊消息（参数方式）
export const sendGroupMessageByParam = (data) => {
  return request({
    url: `api/public/im/group/send/param`,
    method: 'POST',
    data
  })
}

// 获取单聊历史消息
export const getSingleChatHistory = (params) => {
  return request({
    url: `api/public/im/single/history`,
    method: 'GET',
    params
  })
}

// 获取群聊历史消息
export const getGroupChatHistory = (params) => {
  return request({
    url: `api/public/im/group/history`,
    method: 'GET',
    params
  })
}

// 发送好友申请
export const sendFriendRequest = (data) => {
  return request({
    url: `api/public/im/friend/request`,
    method: 'POST',
    data
  })
}

// 获取好友列表
export const getFriendList = (params) => {
  return request({
    url: `api/public/im/friend/list`,
    method: 'GET',
    params
  })
}

// 获取待处理好友申请
export const getPendingFriendRequests = (params) => {
  return request({
    url: `api/public/im/friend/request/pending`,
    method: 'GET',
    params
  })
}

// 接受好友申请
export const acceptFriendRequest = (data) => {
  return request({
    url: `api/public/im/friend/request/accept`,
    method: 'PUT',
    data
  })
}

// 拒绝好友申请
export const rejectFriendRequest = (data) => {
  return request({
    url: `api/public/im/friend/request/reject`,
    method: 'PUT',
    data
  })
}

// 群组管理API

// 根据ID查询群组
export const getChatGroupById = (id) => {
  return request({
    url: `api/public/chat-group/${id}`,
    method: 'GET'
  })
}

// 根据创建者ID查询群组
export const getChatGroupsByCreator = (creatorId) => {
  return request({
    url: `api/public/chat-group/creator/${creatorId}`,
    method: 'GET'
  })
}

// 根据名称搜索群组
export const searchChatGroups = (params) => {
  return request({
    url: `api/public/chat-group/search`,
    method: 'GET',
    params
  })
}

// 创建群组
export const createChatGroup = (data) => {
  return request({
    url: `api/public/chat-group`,
    method: 'POST',
    data
  })
}

// 更新群组信息
export const updateChatGroup = (data) => {
  return request({
    url: `api/public/chat-group`,
    method: 'PUT',
    data
  })
}

// 删除群组
export const deleteChatGroup = (id) => {
  return request({
    url: `api/public/chat-group/${id}`,
    method: 'DELETE'
  })
}

// 删除好友
export const deleteFriend = (data) => {
  return request({
    url: `api/public/im/friend/delete`,
    method: 'DELETE',
    data
  })
}

// 加入黑名单
export const blockFriend = (data) => {
  return request({
    url: `api/public/im/friend/block`,
    method: 'POST',
    data
  })
}

// 设置特别关心
export const setSpecialFriend = (data) => {
  return request({
    url: `api/public/im/friend/special`,
    method: 'POST',
    data
  })
}