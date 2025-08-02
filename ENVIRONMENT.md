# 环境变量说明

## 基础配置

| 变量名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `VITE_APP_NAME` | string | `"博览旅行"` | 应用名称 |
| `VITE_APP_VERSION` | string | `"1.0.0"` | 应用版本 |
| `VITE_BASE_URL` | string | `"/"` | 应用基础路径 |

## API 相关

| 变量名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `VITE_API_BASE_URL` | string | `"http://localhost:3000/api"` | API基础地址 |
| `VITE_API_TIMEOUT` | number | `10000` | API请求超时时间(ms) |

## 第三方服务

| 变量名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `VITE_GOOGLE_MAP_KEY` | string | - | Google地图API密钥 |
| `VITE_SENTRY_DSN` | string | - | Sentry错误监控DSN |

## 开发环境

| 变量名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `VITE_DEV_PROXY` | boolean | `true` | 是否启用开发代理 |
| `VITE_MOCK_ENABLED` | boolean | `true` | 是否启用Mock数据 |

## 生产环境

| 变量名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `VITE_CDN_URL` | string | - | CDN资源地址 |
| `VITE_ANALYTICS_ID` | string | - | 统计工具ID |

## 使用说明

1. 在项目根目录创建 `.env` 或 `.env.local` 文件
2. 添加需要的环境变量，例如：
   ```
   VITE_API_BASE_URL=https://api.example.com
   VITE_GOOGLE_MAP_KEY=your_key_here
   ```
3. 在代码中通过 `import.meta.env.VITE_*` 访问