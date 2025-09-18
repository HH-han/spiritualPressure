# SpiritualPressure - 大学生毕业项目管理系统

## 📖 项目概述

SpiritualPressure 是一个为大学生毕业设计提供完整解决方案的项目管理系统，采用前后端分离架构，提供从项目构思到实现的完整流程支持。

## 🚀 核心功能模块

### 1. 用户权限管理系统
#### 🔐 认证与授权
- **多方式登录**: 邮箱登录、用户名登录、手机号登录、二维码登录
- **权限控制**: 基于角色的权限管理系统 (RBAC)
- **安全机制**: JWT令牌认证、密码加密存储

#### 👥 用户管理
- **用户信息管理**: 基本信息、头像上传、个人资料编辑
- **权限管理**: 用户状态控制、权限级别设置
- **批量操作**: 批量登录、批量权限设置、Excel导入导出

**相关API**:
- `EmailCaptcha()` - 邮箱验证码发送
- `Emaillogin()` - 邮箱登录
- `loginname()` - 用户名登录  
- `getUserInfo()` - 获取用户信息
- `getUserList()` - 获取用户列表
- `updateUserInfo()` - 更新用户信息
- `uploadAvatar()` - 头像上传
- `changePassword()` - 修改密码

### 2. 后台管理系统
#### 📊 数据管理
- **用户管理**: 完整的CRUD操作、搜索筛选、批量处理
- **内容管理**: 文章、博客、新闻内容管理
- **订单管理**: 支付订单查询、状态管理

#### 📈 系统监控
- **操作日志**: 用户操作记录追踪
- **登录日志**: 用户登录行为监控
- **系统状态**: 实时系统运行状态监控

**相关API**:
- `getOperationLogs()` - 获取操作日志
- `getLoginLogs()` - 获取登录日志
- `getSystemStatus()` - 获取系统状态
- `getSystemConfig()` - 获取系统配置
- `updateSystemConfig()` - 更新系统配置

### 3. 旅游服务系统
#### 🏞️ 景点推荐
- **热门景点**: 轮播展示推荐景点
- **智能推荐**: 基于用户偏好的个性化推荐
- **收藏功能**: 用户收藏管理

#### 📰 旅游资讯
- **新闻资讯**: 旅游行业动态
- **攻略分享**: 用户生成内容(UGC)
- **社区互动**: 问答交流功能

**相关API**:
- `getTravelRecommendations()` - 获取旅行推荐
- `getAttractionBlogs()` - 获取景点博客
- `likeAttraction()` - 景点点赞
- `collectAttraction()` - 景点收藏
- `getSlideshow()` - 获取轮播列表
- `getTravelNews()` - 获取旅游新闻
- `getTravelCollections()` - 获取收藏详情

### 4. 即时通讯系统
#### 💬 实时聊天
- **单聊/群聊**: 支持一对一和群组聊天
- **多媒体消息**: 文本、图片、表情消息
- **好友管理**: 好友列表、好友申请处理

#### 👥 社交功能
- **好友系统**: 添加好友、删除好友、拉黑管理
- **群组管理**: 创建群组、群成员管理
- **消息历史**: 聊天记录保存与查询

**相关API**:
- 单聊消息发送 (2种方式)
- 群聊消息发送
- 聊天历史获取
- 好友管理 (申请、列表、接受/拒绝、删除、拉黑、特别关心)
- 群组管理 (查询、创建、更新、删除、搜索)

### 5. 电商功能模块
#### 🛒 商品服务
- **商品展示**: 特色商品推荐
- **购物车**: 商品添加、数量管理
- **订单管理**: 订单创建、支付、状态跟踪

#### 💳 支付系统
- **订单支付**: 多种支付方式集成
- **交易记录**: 支付历史查询
- **退款处理**: 订单退款流程

### 6. 数据可视化系统
#### 📊 数据报表
- **销售统计**: 年度利润分析
- **营销报告**: 市场活动效果分析
- **产品分析**: 热销产品排行

#### 📈 实时监控
- **交易监控**: 近期交易动态
- **用户行为**: 用户活跃度分析
- **系统性能**: 资源使用情况监控

## 🏗️ 项目结构

```
spiritualPressure-ui/
├── src/
│   ├── api/                 # API接口定义
│   │   ├── user.js         # 用户相关API
│   │   ├── system.js       # 系统管理API
│   │   ├── travel.js       # 旅游服务API
│   │   ├── im.js          # 即时通讯API
│   │   ├── log.js         # 日志管理API
│   │   └── content.js     # 内容管理API
│   ├── assets/             # 静态资源
│   ├── components/         # 公共组件
│   ├── router/             # 路由配置
│   ├── stores/             # 状态管理(Pinia)
│   ├── utils/              # 工具函数
│   └── views/              # 页面视图
│       ├── LoginViews/     # 登录相关页面
│       ├── ManagementViews/ # 后台管理页面
│       ├── instantMessaging/ # 即时通讯
│       ├── DashboardViews/ # 数据仪表板
│       ├── MyCenter/       # 个人中心
│       ├── Mypage/         # 我的页面
│       ├── TourismCommunity/ # 旅游社区
│       └── TravelServiceoptions/ # 旅游服务
├── public/                 # 公共资源
└── vite.config.js         # Vite配置
```

## 🛠️ 技术栈

### 前端技术
- **Vue 3** + Composition API
- **Vite** - 下一代前端构建工具
- **Element Plus** - 企业级UI组件库
- **ECharts** - 数据可视化图表
- **Axios** - HTTP客户端
- **Pinia** - 状态管理
- **Vue Router** - 路由管理

### 后端技术
- **Java Spring Boot** - 后端框架
- **MySQL** - 关系型数据库
- **Redis** - 缓存数据库
- **JWT** - 认证令牌
- **Maven** - 项目构建工具

## 🚀 快速开始

### 环境要求
- Node.js 16+ 
- npm/pnpm
- Java 17+
- MySQL 8.0+
- Redis 6.0+

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/HH-han/spiritualPressure-ui.git
   cd spiritualPressure-ui
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **环境配置**
   ```bash
   cp .env.example .env
   # 编辑.env文件，配置数据库连接等信息
   ```

4. **启动项目**
   ```bash
   # 启动前端开发服务器
   npm run dev
   
   # 启动后端服务 (需要先配置好Java环境)
   mvn spring-boot:run
   ```

## 📊 API接口规范

### 请求格式
```javascript
{
  "url": '/api/{module}/{action}',
  "method": 'get|post|put|delete',
  "params": {},    // GET参数
  "data": {}       // POST/PUT数据
}
```

### 响应格式
```javascript
{
  "code": 200,     // 状态码
  "message": "成功", // 消息
  "data": {}       // 返回数据
  "timestamp": "2023-12-01T10:00:00"
}
```

### 状态码说明
- `200`: 成功
- `400`: 参数错误
- `401`: 未授权
- `403`: 禁止访问
- `404`: 资源不存在
- `500`: 服务器错误

## 🎨 UI组件说明

### 管理界面组件
- **SearchBar**: 通用搜索栏组件
- **DataTable**: 数据表格组件
- **Pagination**: 分页组件
- **Dialog**: 模态框组件
- **Form**: 表单组件

### 业务组件
- **ChatWindow**: 聊天窗口组件
- **FriendList**: 好友列表组件
- **UserCard**: 用户卡片组件
- **ProductCard**: 商品卡片组件
- **ChartContainer**: 图表容器组件

## 🔧 开发指南

### 代码规范
- 使用ESLint + Prettier统一代码风格
- 组件命名采用PascalCase
- 变量命名采用camelCase
- 常量命名采用UPPER_SNAKE_CASE

### 组件开发
1. 使用Composition API编写组件
2. 合理使用Pinia进行状态管理
3. 组件props需要类型定义
4. 事件使用emit方式传递

### API开发
1. 统一使用request工具发送请求
2. 错误处理使用try-catch
3.  loading状态需要统一管理

## ⚡ 性能优化

### 前端优化
- 组件懒加载
- 图片懒加载
- 代码分割
- 缓存策略

### 后端优化
- 数据库索引优化
- Redis缓存
- 连接池管理
- 异步处理

## 📱 浏览器兼容性

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🔮 后续开发计划

### 短期计划 (1-2个月)
- [ ] 移动端适配优化
- [ ] 实时通知系统
- [ ] 文件上传优化
- [ ] 搜索功能增强

### 中期计划 (3-6个月)
- [ ] 微服务架构改造
- [ ] 消息队列集成
- [ ] 分布式缓存
- [ ] 容器化部署

### 长期计划 (6-12个月)
- [ ] AI智能推荐
- [ ] 大数据分析
- [ ] 多语言支持
- [ ] 第三方登录集成

## ❓ 常见问题

### Q: 如何添加新的API接口？
A: 在src/api目录下创建对应的js文件，使用request工具定义接口

### Q: 如何添加新的页面？
A: 在src/views下创建vue文件，并在router/index.js中添加路由配置

### Q: 如何修改主题样式？
A: 修改src/assets/styles中的CSS变量和主题文件

### Q: 如何处理表单验证？
A: 使用Element Plus的Form组件配合自定义验证规则

## 📄 许可证

MIT License - 详见LICENSE文件

## 🤝 贡献指南

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📞 技术支持

- 作者：bolan
- 邮箱：25601773654@qq.com
- GitHub：https://github.com/HH-han
- 文档：https://github.com/HH-han/spiritualPressure-ui/wiki

---

**最后更新**: 2023年12月1日  
**版本**: v1.0.0