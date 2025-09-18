# 即时通讯功能说明

## 功能概述

基于接口文档开发的即时通讯功能，包含以下主要特性：

- ✅ 单聊消息发送
- ✅ 群聊消息发送  
- ✅ 好友列表管理
- ✅ 群组管理
- ✅ 好友申请处理
- ✅ 聊天历史记录
- ✅ 实时消息显示

## 文件结构

```
src/
├── api/
│   └── im.js                 # 即时通讯API接口
└── views/
    └── instantMessaging/
        ├── index.vue         # 主页面
        ├── TestPage.vue      # 测试页面
        └── components/
            ├── FriendList.vue       # 好友列表
            ├── GroupList.vue        # 群组列表
            ├── FriendRequestList.vue # 好友申请
            └── ChatWindow.vue       # 聊天窗口
```

## API接口

### 即时通讯接口
- `sendSingleMessageByParam` - 发送单聊消息（参数方式）
- `sendSingleMessage` - 发送单聊消息（实体方式）
- `sendGroupMessageByParam` - 发送群聊消息（参数方式）
- `getSingleChatHistory` - 获取单聊历史消息
- `getGroupChatHistory` - 获取群聊历史消息
- `sendFriendRequest` - 发送好友申请
- `getFriendList` - 获取好友列表
- `getPendingFriendRequests` - 获取待处理好友申请

### 群组管理接口
- `getChatGroupById` - 根据ID查询群组
- `getChatGroupsByCreator` - 根据创建者ID查询群组
- `searchChatGroups` - 根据名称搜索群组
- `createChatGroup` - 创建群组
- `updateChatGroup` - 更新群组信息
- `deleteChatGroup` - 删除群组

## 使用说明

### 1. 启动测试
访问 `/im/test` 页面进行API连接测试：
- 测试API连接状态
- 测试消息发送功能
- 验证接口响应

### 2. 主功能页面
访问 `/im` 页面使用完整即时通讯功能：

**左侧面板：**
- 好友列表：显示所有好友，支持搜索和添加好友
- 群组列表：显示用户创建的群组，支持创建新群组
- 好友申请：显示待处理的好友申请，支持接受/拒绝

**右侧面板：**
- 聊天窗口：显示消息历史，支持发送文本消息
- 实时状态显示：好友在线状态、群组成员数

### 3. 配置说明

**基础URL配置：**
API请求的基础URL在 `src/api/im.js` 中配置：
```javascript
const baseURL = 'http://localhost:2025/api/public'
```

**用户ID配置：**
当前代码中使用硬编码的用户ID（如 `userId: 1`），在实际使用时需要替换为真实的用户ID。

## 技术栈

- Vue 3 + Composition API
- Element Plus UI组件库
- Vue Router 路由管理
- Axios HTTP请求
- `<script setup>` 语法糖

## 开发注意事项

1. **用户认证**：当前版本使用硬编码用户ID，需要集成实际的用户认证系统
2. **WebSocket支持**：当前为HTTP轮询方式，建议后续添加WebSocket实现实时通信
3. **消息推送**：需要后端支持消息推送机制
4. **文件上传**：当前支持文本消息，需要扩展图片、文件等消息类型
5. **错误处理**：已包含基本错误处理，可根据需要增强

## 接口响应格式

所有接口遵循统一的响应格式：
```json
{
  "code": 200,           // 状态码：200成功，其他为错误
  "message": "成功",     // 提示信息
  "data": { ... }       // 返回数据
}
```

## 错误代码

- `400` - 请求参数错误
- `401` - 未授权访问  
- `404` - 资源不存在
- `500` - 服务器内部错误

## 后续优化建议

1. 添加消息已读/未读状态
2. 实现消息撤回功能
3. 添加消息表情回复
4. 支持消息搜索和过滤
5. 添加聊天记录导出
6. 实现多端消息同步

## 浏览器兼容性

支持现代浏览器（Chrome、Firefox、Safari、Edge）的最新版本。