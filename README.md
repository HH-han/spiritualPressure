# SpiritualPressure - 大学生毕业项目管理系统

## 项目简介
SpiritualPressure 是一个为大学生毕业设计提供完整解决方案的项目管理系统，包含前后端分离架构，提供从项目构思到实现的完整流程支持。

## 核心功能
- **用户权限管理**：基于角色的权限控制系统
- **后台管理系统**：完整的数据管理和业务处理功能
- **前台展示系统**：商品/服务展示与交互界面
- **数据可视化**：丰富的图表和报表功能

## 技术栈
### 前端技术
- Vue 3 + Vite
- Element Plus UI组件库
- ECharts 数据可视化
- Axios HTTP客户端
- Pinia 状态管理

### 后端技术
- Java Spring Boot
- MySQL 数据库
- Redis 缓存
- JWT 认证

## 项目结构
spiritualPressure-ui/
├── src/
│   ├── api/            # API接口定义
│   ├── assets/         # 静态资源
│   ├── components/     # 公共组件
│   ├── router/         # 路由配置
│   ├── stores/         # 状态管理
│   ├── utils/          # 工具函数
│   └── views/          # 页面视图
├── public/             # 公共资源
└── vite.config.js      # Vite配置

## 快速开始
### 环境要求
- Node.js 16+
- npm/pnpm
- Java 17+
- MySQL 8.0+

### 安装步骤
1. 克隆仓库
   ```bash
   git clone https://github.com/HH-han/spiritualPressure-ui.git
2. 安装依赖
    ```bash
    cd spiritualPressure-ui
    pnpm install
    ```
3. 配置环境变量
   - 复制 `.env.example` 为 `.env`
   - 填写数据库连接信息和其他配置
4. 启动项目
   - 前端：`npm run dev`
   - 后端：`mvn spring-boot:run`
### 项目截图
![项目截图](screenshot.png)
### 许可证
MIT License

## 联系方式
- 作者：bolan
- 邮箱： 25601773654@qq.com
- GitHub： https://github.com/HH-han
## 相关项目
- 后端项目： springboot-server
- 前端项目： spiritualPressure-ui
- 数据库项目： spiritualPressure-db


### 许可证
MIT License