<template>
  <div class="glass-container">
    <div class="glass-card-container">
      <h2 class="title">业务概览</h2>
      
      <div class="metrics-grid">
        <!-- 关键指标卡片 -->
        <div class="metric-card" v-for="metric in metrics" :key="metric.title">
          <div class="metric-icon">
            <component :is="metric.icon" />
          </div>
          <div class="metric-content">
            <h3>{{ metric.title }}</h3>
            <p class="value">{{ metric.value }}</p>
            <p class="change" :class="{ positive: metric.change >= 0, negative: metric.change < 0 }">
              {{ metric.change >= 0 ? '+' : '' }}{{ metric.change }}%
              <component :is="metric.change >= 0 ? ArrowUp : ArrowDown" />
            </p>
          </div>
        </div>
      </div>
      
      <!-- 快速操作按钮 -->
      <div class="quick-actions">
        <button 
          v-for="action in quickActions" 
          :key="action.label"
          class="glass-button"
          @click="action.handler"
        >
          <component :is="action.icon" />
          <span>{{ action.label }}</span>
        </button>
      </div>
      
      <!-- 数据图表 -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>近期业务趋势</h3>
          <div class="time-filters">
            <button 
              v-for="filter in timeFilters" 
              :key="filter"
              :class="{ active: activeFilter === filter }"
              @click="activeFilter = filter"
            >
              {{ filter }}
            </button>
          </div>
        </div>
        <div class="chart-placeholder" ref="chartRef">
          <!-- ECharts图表容器 -->
        </div>
      </div>
    </div>
    
    <!-- 通知提醒 -->
    <div class="notifications">
      <div class="notification-bell" @click="toggleNotifications">
        <Bell />
        <span class="badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
      </div>
      <div class="notification-panel" v-if="showNotifications">
        <h3>通知 ({{ unreadCount }}条未读)</h3>
        <div class="notification-list">
          <div 
            v-for="note in notifications" 
            :key="note.id"
            class="notification-item"
            :class="{ unread: !note.read }"
            @click="markAsRead(note.id)"
          >
            <p>{{ note.message }}</p>
            <small>{{ formatTime(note.time) }}</small>
          </div>
        </div>
        <button class="clear-btn" @click="markAllAsRead">全部标记为已读</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { getUserList } from '@/api/user';
import { getPaymentList } from '@/api/travel';
import * as echarts from 'echarts';
import { ElMessage } from "element-plus";

import { 
  User, ShoppingCart, DollarSign, Package, 
  ArrowUp, ArrowDown, Bell, Plus, RefreshCw, 
  FileText, Settings, BarChart2 
} from 'lucide-vue-next'

// ECharts实例
const chartRef = ref(null)
let chartInstance = null

// 关键指标数据
const metrics = ref([
  { title: '总用户数', value: '12,845', change: 5.2, icon: User },
  { title: '今日订单', value: '324', change: 12.7, icon: ShoppingCart },
  { title: '总收入', value: '¥48,756', change: 3.4, icon: DollarSign },
  { title: '库存商品', value: '1,245', change: -2.1, icon: Package }
])

// 时间过滤器
const timeFilters = ['今日', '本周', '本月', '全年']
const activeFilter = ref('本周')

// 监听时间筛选器变化
watch(activeFilter, () => {
  updateChart()
})

// 通知相关
const notifications = ref([
  { id: 1, message: '新订单 #12345 已创建', time: new Date(Date.now() - 1000 * 60 * 5), read: false },
  { id: 2, message: '用户反馈已提交', time: new Date(Date.now() - 1000 * 60 * 30), read: false },
  { id: 3, message: '系统维护计划通知', time: new Date(Date.now() - 1000 * 60 * 60 * 2), read: true },
  { id: 4, message: '库存预警: 商品A库存不足', time: new Date(Date.now() - 1000 * 60 * 60 * 5), read: false }
])

const showNotifications = ref(false)
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

function markAsRead(id) {
  const note = notifications.value.find(n => n.id === id)
  if (note) note.read = true
}

function markAllAsRead() {
  notifications.value.forEach(n => n.read = true)
}

function formatTime(date) {
  const now = new Date()
  const diff = now - date
  
  if (diff < 1000 * 60) return '刚刚'
  if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}分钟前`
  if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}小时前`
  return `${Math.floor(diff / (1000 * 60 * 60 * 24))}天前`
}

// 刷新数据函数
const refreshData = async () => {
  console.log('刷新数据...')
  await getUserData(); // 获取最新的用户数据
  await getOrderData(); // 获取最新的订单数据

  // 模拟其他指标的随机变化
  metrics.value.forEach((metric, index) => {
    if (index !== 0) { // 跳过用户总数指标（索引0）
      const change = (Math.random() * 10 - 2).toFixed(1)
      metric.change = parseFloat(change)
    }
  })
  
  // 更新图表数据
  updateChart()
}

// 获取用户数据
const getUserData = async () => {
  try {
    const res = await getUserList()
    if (res && res.data) {
      // 更新用户总数指标
      metrics.value[0].value = res.data.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    return res?.data
  } catch (error) {
    console.error('获取用户数据失败:', error)
    return null
  }
}
//获取订单数据
const getOrderData = async () => {
  try {
    const res = await getPaymentList()
    if (res && res.data) {
      // 更新订单总数指标
      metrics.value[1].value = res.data.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    return res?.data
  } catch (error) {
    console.error('获取订单数据失败:', error)
    return null
  }
}
// 生成报表函数
const generateReport = async () => {
  try {
    console.log('开始生成报表...')
    
    // 获取当前时间
    const now = new Date()
    const timestamp = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    // 获取最新的数据
    await refreshData()
    
    // 构建报表数据
    const reportData = {
      title: '系统数据统计报表',
      timestamp: timestamp,
      metrics: metrics.value.map(metric => ({
        label: metric.label,
        value: metric.value,
        change: metric.change,
        icon: metric.icon
      })),
      timeFilter: activeFilter.value
    }
    
    // 这里可以添加实际的报表生成逻辑
    // 例如：生成PDF、Excel或发送到服务器
    
    console.log('报表数据:', reportData)
    
    // 模拟生成报表文件
    const fileName = `系统报表_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}.pdf`
    
    // 显示成功提示
    ElMessage.success({
      message: `报表生成成功！\n文件名: ${fileName}\n生成时间: ${timestamp}\n\n包含 ${reportData.metrics.length} 个指标数据`,
      duration: 5000,
      showClose: true
    })
    
    // 这里可以添加实际的文件下载逻辑
    // const blob = new Blob([reportData], { type: 'application/pdf' })
    // const url = URL.createObjectURL(blob)
    // const link = document.createElement('a')
    // link.href = url
    // link.download = fileName
    // link.click()
    // URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('生成报表失败:', error)
    ElMessage.error('生成报表时发生错误，请重试')
  }
}

// 快速操作
const quickActions = ref([
  { label: '新增订单', icon: Plus, handler: () => console.log('新增订单') },
  { label: '刷新数据', icon: RefreshCw, handler: refreshData },
  { label: '生成报表', icon: FileText, handler: generateReport },
  { label: '系统设置', icon: Settings, handler: () => console.log('系统设置') }
])

// 定时器引用
let refreshInterval = null

onMounted(() => {
  getUserData();
  getOrderData()
  // 每5秒刷新一次数据
  refreshInterval = setInterval(refreshData, 5000)
  
  // 初始化ECharts图表
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    updateChart()
  }
})

onBeforeUnmount(() => {
  // 清除定时器
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
  
  // 销毁ECharts实例
  if (chartInstance) {
    chartInstance.dispose()
  }
})

// 更新图表数据
function updateChart() {
  if (!chartInstance) return
  
  const option = {
    title: {
      text: `${activeFilter.value}数据统计`
    },
    tooltip: {},
    legend: {
      data: ['数据']
    },
    xAxis: {
      data: metrics.value.map(item => item.title)
    },
    yAxis: {},
    series: [{
      name: '数值',
      type: 'bar',
      data: metrics.value.map(item => parseFloat(item.value.replace(/[^0-9.]/g, '')))
    }]
  }
  
  chartInstance.setOption(option)
}
</script>

<style scoped>
/* 玻璃拟态基础样式 */
.glass-container {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(210, 224, 225, 0.3) 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  border-radius: 25px;
}

.glass-card-container {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  color: #333;
  transition: all 0.3s ease;
}

.glass-card-container:hover{
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.248);
}

.title {
  margin: 0 0 1.5rem 0;
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
}

/* 指标卡片样式 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
}

.metric-icon {
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.metric-icon svg {
  width: 24px;
  height: 24px;
  color: #3498db;
}

.metric-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: #555;
}

.metric-content .value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.metric-content .change {
  margin: 0.25rem 0 0 0;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.change.positive {
  color: #27ae60;
}

.change.negative {
  color: #e74c3c;
}

.change svg {
  width: 16px;
  height: 16px;
  margin-left: 4px;
}

/* 快速操作按钮 */
.quick-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.glass-button {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.glass-button svg {
  width: 18px;
  height: 18px;
}

/* 图表区域 */
.chart-container {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.time-filters {
  display: flex;
  gap: 0.5rem;
}

.time-filters button {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.time-filters button:hover, .time-filters button.active {
  background: rgba(255, 255, 255, 0.4);
}

.chart-placeholder {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #555;
}

/* 通知样式 */
.notifications {
  position: fixed;
  top: 2rem;
  right: 2rem;
}

.notification-bell {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.notification-bell:hover {
  background: rgba(255, 255, 255, 0.4);
}

.notification-bell svg {
  width: 24px;
  height: 24px;
  color: #2c3e50;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
}

.notification-panel {
  position: absolute;
  right: 0;
  top: 60px;
  width: 320px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.notification-panel h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: background 0.3s ease;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.notification-item.unread {
  background: rgba(52, 152, 219, 0.1);
}

.notification-item p {
  margin: 0 0 0.25rem 0;
}

.notification-item small {
  color: #666;
  font-size: 0.8rem;
}

.clear-btn {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 8px;
  color: #2c3e50;
  cursor: pointer;
  transition: background 0.3s ease;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .notification-panel {
    width: 280px;
  }
}
</style>