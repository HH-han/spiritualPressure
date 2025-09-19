<template>
  <div class="login-status-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="el-icon-lock"></i>
        Token状态信息
      </h1>
      <p class="page-subtitle">查看和管理您的登录令牌状态</p>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- Token基本信息卡片 -->
      <el-card class="info-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">基本信息</span>
            <el-button 
              type="primary" 
              size="small" 
              :loading="loading"
              @click="fetchTokenStatus"
            >
              <i class="el-icon-refresh"></i>
              刷新状态
            </el-button>
          </div>
        </template>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">登录状态:</span>
            <el-tag 
              :type="tokenData?.valid ? 'success' : 'danger'" 
              size="small"
            >
              {{ tokenData?.valid ? '有效' : '无效' }}
            </el-tag>
          </div>
          
          <div class="info-item">
            <span class="info-label">用户名:</span>
            <span class="info-value">{{ tokenData?.username || '未获取' }}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">是否过期:</span>
            <el-tag 
              :type="tokenData?.expired ? 'danger' : 'success'" 
              size="small"
            >
              {{ tokenData?.expired ? '已过期' : '未过期' }}
            </el-tag>
          </div>
          
          <div class="info-item">
            <span class="info-label">签发时间:</span>
            <span class="info-value">{{ formatDate(tokenData?.issuedAt) }}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">过期时间:</span>
            <span class="info-value">{{ formatDate(tokenData?.expiration) }}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">剩余有效期:</span>
            <span 
              class="info-value" 
              :class="{ 'text-warning': isTokenExpiringSoon }"
            >
              {{ tokenData?.message || remainingTime }}
            </span>
          </div>
        </div>
      </el-card>

      <!-- Token详细信息卡片 -->
      <el-card class="details-card" shadow="hover" v-if="tokenData">
        <template #header>
          <div class="card-header">
            <span class="card-title">详细信息</span>
          </div>
        </template>
        
        <el-collapse v-model="activeNames">
          <el-collapse-item title="权限信息" name="permissions">
            <div class="permissions-list">
              <el-tag 
                v-for="permission in tokenData?.permissions || []" 
                :key="permission"
                type="info" 
                size="small"
                class="permission-tag"
              >
                {{ permission }}
              </el-tag>
              <p v-if="!tokenData?.permissions?.length" class="no-data">暂无权限信息</p>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="Token元数据" name="metadata">
            <pre class="token-metadata">{{ JSON.stringify(tokenData, null, 2) }}</pre>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <!-- 操作按钮区域 -->
      <div class="action-buttons">
        <el-button 
          type="primary" 
          :loading="refreshing"
          @click="handleRefreshToken"
        >
          <i class="el-icon-refresh-left"></i>
          刷新Token
        </el-button>
        
        <el-button 
          type="info" 
          @click="handleCopyToken"
          :disabled="!tokenData"
        >
          <i class="el-icon-document-copy"></i>
          复制Token
        </el-button>
        
        <el-button 
          type="danger" 
          @click="handleLogout"
        >
          <i class="el-icon-switch-button"></i>
          安全退出
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <el-skeleton :rows="6" animated v-if="loading && !tokenData" />
    
    <!-- 错误状态 -->
    <el-empty 
      v-else-if="error && !tokenData" 
      description="获取Token信息失败"
      :image-size="200"
    >
      <el-button type="primary" @click="fetchTokenStatus">重试</el-button>
    </el-empty>
  </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { tokenApi } from '@/api/token'
import { clearAuthData } from '@/utils/tokenValidator'

const router = useRouter()

// 响应式数据
const tokenData = ref(null)
const loading = ref(false)
const refreshing = ref(false)
const error = ref(null)
const activeNames = ref(['permissions'])

// 计算属性
const isTokenExpiringSoon = computed(() => {
  if (!tokenData.value?.expiration) return false
  const expiration = new Date(tokenData.value.expiration).getTime()
  const now = Date.now()
  return expiration - now < 30 * 60 * 1000 // 30分钟内过期
})

const remainingTime = computed(() => {
  if (!tokenData.value?.expiration) return '未知'
  
  const expiration = new Date(tokenData.value.expiration).getTime()
  const now = Date.now()
  const diff = expiration - now
  
  if (diff <= 0) return '已过期'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  } else {
    return `${minutes}分钟`
  }
})

// 方法
const fetchTokenStatus = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await tokenApi.getTokenStatus()
    
    if (response.code === '0') {
      tokenData.value = response.data
      ElMessage.success('Token状态获取成功')
    } else {
      throw new Error(response.msg || '获取Token状态失败')
    }
  } catch (err) {
    console.error('获取Token状态失败:', err)
    error.value = err.message
    ElMessage.error('获取Token状态失败')
  } finally {
    loading.value = false
  }
}

const handleRefreshToken = async () => {
  try {
    refreshing.value = true
    const response = await tokenApi.refreshToken()
    
    if (response.code === '0') {
      ElMessage.success('Token刷新成功')
      await fetchTokenStatus() // 重新获取状态
    } else {
      throw new Error(response.msg || '刷新Token失败')
    }
  } catch (err) {
    console.error('刷新Token失败:', err)
    ElMessage.error('刷新Token失败')
  } finally {
    refreshing.value = false
  }
}

const handleCopyToken = async () => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      await navigator.clipboard.writeText(token)
      ElMessage.success('Token已复制到剪贴板')
    } else {
      ElMessage.warning('未找到Token')
    }
  } catch (err) {
    console.error('复制Token失败:', err)
    ElMessage.error('复制Token失败')
  }
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '确认退出',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    clearAuthData()
    ElMessage.success('已安全退出')
    router.push('/login')
  } catch {
    // 用户取消退出
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '未知'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch {
    return '格式错误'
  }
}

// 生命周期钩子
onMounted(() => {
  fetchTokenStatus()
})
</script>

<style scoped>
.login-status-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  color: #303133;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.page-subtitle {
  color: #606266;
  font-size: 16px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
  color: #606266;
  min-width: 100px;
}

.info-value {
  color: #303133;
  font-weight: 500;
}

.text-warning {
  color: #e6a23c;
  font-weight: 600;
}

.permissions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.permission-tag {
  margin: 2px;
}

.no-data {
  color: #909399;
  font-style: italic;
  text-align: center;
  padding: 20px;
}

.token-metadata {
  background-color: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.5;
  color: #606266;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-status-container {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-buttons .el-button {
    width: 100%;
  }
}

/* 动画效果 */
.info-card,
.details-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.info-card:hover,
.details-card:hover {
  transform: translateY(-2px);
}
</style>