# 即时通讯功能 - 项目文档

## 📋 项目概述

基于Vue 3 + Element Plus开发的现代化即时通讯系统，提供完整的聊天、好友管理、群组管理功能。系统采用模块化设计，支持单聊、群聊、好友申请处理等核心功能。

### ✨ 核心特性

- **💬 实时消息通信** - 支持文本、图片消息发送
- **👥 好友管理** - 完整的添加、删除、黑名单功能
- **👨‍👩‍👧‍👦 群组管理** - 创建、管理群组，群聊消息支持
- **📱 现代化UI** - 基于Element Plus的优雅界面设计
- **🔒 用户认证** - 集成用户认证系统
- **📊 消息历史** - 完整的聊天记录管理

## 🗂️ 项目结构

```
src/
├── api/
│   └── im.js                    # 即时通讯API接口封装
├── views/
│   └── instantMessaging/
│       ├── index.vue            # 主页面 - 即时通讯入口
│       ├── TestPage.vue         # 测试页面 - API功能验证
│       └── components/
│           ├── FriendList.vue           # 好友列表组件
│           ├── GroupList.vue            # 群组列表组件
│           ├── FriendRequestList.vue   # 好友申请处理组件
│           └── ChatWindow.vue           # 聊天窗口组件
└── stores/
    └── auth.js                  # 用户认证状态管理
```

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 pnpm
- Vue 3.0+
- Element Plus 2.0+

### 安装依赖
```bash
npm install
# 或
pnpm install
```

### 启动开发服务器
```bash
npm run dev
# 访问 http://localhost:9527
```

## 📡 API接口文档

### 即时通讯接口

#### 消息发送
- `sendSingleMessageByParam(data)` - 发送单聊消息（参数方式）
- `sendSingleMessage(data)` - 发送单聊消息（实体方式）
- `sendGroupMessageByParam(data)` - 发送群聊消息（参数方式）

#### 消息历史
- `getSingleChatHistory(params)` - 获取单聊历史消息
- `getGroupChatHistory(params)` - 获取群聊历史消息

#### 好友管理
- `sendFriendRequest(data)` - 发送好友申请
- `getFriendList(params)` - 获取好友列表
- `getPendingFriendRequests(params)` - 获取待处理好友申请
- `acceptFriendRequest(data)` - 接受好友申请
- `rejectFriendRequest(data)` - 拒绝好友申请
- `deleteFriend(data)` - 删除好友
- `blockFriend(data)` - 加入黑名单
- `setSpecialFriend(data)` - 设置特别关心

### 群组管理接口
- `getChatGroupById(id)` - 根据ID查询群组
- `getChatGroupsByCreator(creatorId)` - 根据创建者ID查询群组
- `searchChatGroups(params)` - 根据名称搜索群组
- `createChatGroup(data)` - 创建群组
- `updateChatGroup(data)` - 更新群组信息
- `deleteChatGroup(id)` - 删除群组

## 🎯 使用指南

### 1. 功能测试
访问 `/im/test` 页面进行API连接测试：
- ✅ 验证API连接状态
- ✅ 测试消息发送功能
- ✅ 检查接口响应格式

### 2. 主功能页面
访问 `/im` 页面使用完整即时通讯功能：

**左侧面板功能：**
- **聊天** - 好友列表，支持搜索和选择聊天
- **联系人** - 群组列表，支持创建和管理群组
- **发现** - 好友申请处理，支持接受/拒绝申请

**右侧聊天区域：**
- 实时消息显示
- 支持文本和图片消息发送
- 消息时间戳显示
- 在线状态指示

### 3. 消息类型支持

#### 文本消息
```javascript
{
  senderId: 1,
  receiverId: 2,
  content: "Hello World",
  messageType: "TEXT"
}
```

#### 图片消息
```javascript
{
  senderId: 1,
  receiverId: 2,
  content: "[图片]",
  image: "data:image/png;base64,...",
  messageType: "IMAGE"
}
```

## ⚙️ 配置说明

### 基础URL配置
在 `src/api/im.js` 中配置API请求的基础URL：
```javascript
// 开发环境配置
const baseURL = 'http://localhost:2025/api/public'

// 生产环境配置（在.env.production中设置）
VITE_API_BASE_URL=https://your-api-domain.com/api/public
```

### 用户认证集成
当前版本已集成用户认证系统，从 `authStore` 获取用户信息：
```javascript
import { useAuthStore } from '@/stores/auth.js'
const authStore = useAuthStore()
const userId = authStore.user?.id
```

### 消息格式配置
所有消息遵循统一格式：
```javascript
{
  id: number,           // 消息ID
  content: string,      // 消息内容
  messageType: string,  // 消息类型：TEXT/IMAGE
  timestamp: number,    // 时间戳
  isSelf: boolean,      // 是否自己发送
  image?: string        // 图片数据（仅IMAGE类型）
}
```

## 🛠️ 技术架构

### 前端技术栈
- **Vue 3** - 渐进式JavaScript框架
- **Composition API** - 组合式API，更好的逻辑复用
- **Element Plus** - 企业级UI组件库
- **Vue Router** - 官方路由管理器
- **Pinia** - 状态管理库
- **Axios** - HTTP请求库
- **`<script setup>`** - 编译时语法糖

### 开发特性
- **模块化设计** - 组件化开发，易于维护和扩展
- **TypeScript支持** - 完整的类型支持（可选）
- **响应式设计** - 支持移动端和桌面端
- **国际化** - 支持多语言（基于Element Plus）

## 📊 接口规范

### 请求格式
所有API请求使用统一的请求格式：
```javascript
// GET请求
const response = await getFriendList({ userId: 1 })

// POST请求  
const response = await sendSingleMessage({
  senderId: 1,
  receiverId: 2,
  content: "Hello",
  messageType: "TEXT"
})
```

### 响应格式
所有接口遵循统一的响应格式：
```json
{
  "code": 200,           // 状态码：200成功，其他为错误
  "message": "成功",     // 提示信息
  "data": {             // 返回数据
    "id": 1,
    "username": "user1",
    "avatar": "avatar-url"
  }
}
```

### 错误代码
- `200` - 请求成功
- `400` - 请求参数错误
- `401` - 未授权访问  
- `403` - 禁止访问
- `404` - 资源不存在
- `500` - 服务器内部错误
- `503` - 服务不可用

## 🎨 UI组件说明

### ChatWindow 组件
主要聊天窗口，支持：
- 消息发送和接收显示
- 图片消息预览
- 表情选择器
- 消息时间格式化
- 滚动到最新消息

### FriendList 组件
好友列表管理，功能包括：
- 好友搜索和过滤
- 在线状态显示
- 好友选择聊天
- 列表刷新功能

### GroupList 组件  
群组管理，支持：
- 群组创建和搜索
- 群组成员管理
- 群组选择聊天

### FriendRequestList 组件
好友申请处理：
- 申请列表显示
- 接受/拒绝操作
- 申请状态更新

## 🔧 开发指南

### 添加新消息类型
1. 在 `im.js` 中添加对应的API接口
2. 在 `ChatWindow.vue` 中添加消息处理逻辑
3. 更新消息渲染组件支持新类型
4. 添加对应的CSS样式

### 集成WebSocket
```javascript
// 示例WebSocket集成
const setupWebSocket = (userId) => {
  const ws = new WebSocket(`ws://localhost:2025/ws?userId=${userId}`)
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    // 处理实时消息
  }
  
  ws.onclose = () => {
    // 重连逻辑
  }
}
```

### 自定义主题
修改Element Plus主题变量：
```scss
// 在CSS文件中覆盖主题变量
:root {
  --el-color-primary: #07c160;
  --el-color-success: #67c23a;
  --el-color-warning: #e6a23c;
  --el-color-danger: #f56c6c;
}
```

## 🚀 性能优化

### 消息列表优化
- 虚拟滚动支持大量消息
- 消息分页加载
- 图片懒加载

### 网络优化
- 请求防抖处理
- 图片压缩上传
- WebSocket连接复用

### 内存管理
- 消息缓存清理
- 图片资源释放
- 事件监听器清理

## 📱 浏览器兼容性

### 支持浏览器
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

### 移动端支持
- iOS Safari 14+
- Android Chrome 88+
- 响应式设计适配

## 🔮 后续开发计划

### 短期优化
- [ ] 消息已读/未读状态显示
- [ ] 消息撤回功能
- [ ] 消息表情回复
- [ ] 聊天记录搜索

### 中期功能  
- [ ] 语音消息支持
- [ ] 视频通话集成
- [ ] 文件传输功能
- [ ] 消息加密传输

### 长期规划
- [ ] 多端消息同步
- [ ] 消息云端备份
- [ ] 智能消息推荐
- [ ] 群组语音聊天

## 🐛 常见问题

### Q: 图标不显示怎么办？
A: 确保已正确注册Element Plus图标组件：
```javascript
// 在main.js中注册图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

### Q: 消息发送失败？
A: 检查API服务是否正常运行，确认baseURL配置正确。

### Q: 用户认证失败？
A: 确保用户已登录，检查localStorage中的用户信息。

## 📄 许可证

本项目基于MIT许可证开源，欢迎贡献代码和提出建议。

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📞 技术支持

- 文档：本项目README
- 问题：GitHub Issues
- 邮箱：开发团队联系方式

---

*最后更新: 2025年9月*
*版本: v1.0.0*