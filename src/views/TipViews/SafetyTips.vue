<template>
  <div>
    <Home_2 />
    <div class="safety-tips-container">
      <div class="safety-tips-content">
        <h1 class="safety-title">安全知识提示</h1>
        <!-- 错误提示 -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- 数据列表 -->
        <ul v-if="tips.length > 0" class="tips-list">
          <li v-for="tip in tips" :key="tip.id" class="safety-card">
            <div class="card-header">
              <h2 class="tip-title">{{ tip.title }}</h2>
              <img :src="tip.imageUrl || require('@/assets/scenery/风景 (5).jpg')" class="tip-illustration"
                :alt="tip.title" />
            </div>
            <div>
              <p class="tip-description">{{ tip.description }}</p>
            </div>
            <div class="tip-time-container">
              <p class="tip-time" v-if="tip.createTime">
                发布时间: {{ formatDate(tip.createTime) }}
              </p>
            </div>
          </li>
        </ul>

        <div v-else class="no-data">
          暂无数据
        </div>

        <!-- 加载更多按钮（可选） -->
        <button v-if="useLoadMore" class="view-more-btn" @click="loadMoreTips" :disabled="loading || !hasMore">
          {{ loading ? '加载中...' : hasMore ? '查看更多' : '没有更多了' }}
        </button>
      </div>

      <!-- 分页器 -->
      <div class="block" v-if="!useLoadMore">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="total" />
      </div>
    </div>
  </div>
  <!-- 背景样式 -->
  <div>
    <BackgroundStyle />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import Home_2 from '@/components/NavigationComponent/HomeHeader.vue'
import BackgroundStyle from '@/components/ThemeComponents/BackgroundStyle.vue';

// 配置选项
const useLoadMore = ref(false) // true使用加载更多，false使用分页器

// 响应式数据
const tips = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const hasMore = ref(true)
const error = ref(null)
const searchKeyword = ref('')

// 日期格式化
const formatDate = (timestamp) => {
  if (!timestamp) return ''
  try {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return '无效日期'
  }
}

// 获取安全提示数据
const fetchSafetyTips = async () => {
  try {
    loading.value = true
    error.value = null

    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    }

    const response = await request.get('/api/public/safety-tips/page', { params })

    // 根据实际API响应结构调整
    if (response.data) {
      return {
        data: response.data.list || [],
        total: response.data.total || 0
      }
    }
    return { data: [], total: 0 }
  } catch (err) {
    console.error('获取安全提示失败:', err)
    error.value = `获取数据失败: ${err.message}`
    return { data: [], total: 0 }
  } finally {
    loading.value = false
  }
}

// 加载数据
const loadData = async () => {
  const { data, total: totalCount } = await fetchSafetyTips()
  tips.value = data
  total.value = totalCount
  hasMore.value = tips.value.length < total.value
}
// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  loadData()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  loadData()
}

// 加载更多
const loadMoreTips = async () => {
  if (loading.value || !hasMore.value) return

  currentPage.value++
  const { data } = await fetchSafetyTips()
  tips.value = [...tips.value, ...data]
  hasMore.value = tips.value.length < total.value
}

// 初始化加载
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* 基础容器样式 */
.safety-tips-container {
  position: absolute;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
  border-radius: 25px;
  z-index: 1000;
}

/* 背景装饰元素 */
.safety-tips-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* 内容区域 */
.safety-tips-content {
  padding: 2rem;
  position: relative;
}

/* 标题样式 */
.safety-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2c3e50;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.safety-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #9b59b6);
  border-radius: 3px;
}

/* 提示列表布局 */
.tips-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  list-style: none;
  padding: 0;
}

/* 卡片样式 */
.safety-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
  gap: 20px;
}

.safety-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #3498db, #9b59b6);
}

.safety-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.tip-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 0;
  flex: 1;
}

/* 插图样式 */
.tip-illustration {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 40px;
  margin-left: 1rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.safety-card:hover .tip-illustration {
  transform: scale(1.1) rotate(5deg);
}

/* 描述文本 */
.tip-description {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

/* 时间显示 */
.tip-time-container {
  display: flex;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  align-items: center;
}

.tip-time {
  font-size: 0.8rem;
  color: #7f8c8d;
  text-align: right;
  margin-top: 1rem;
  font-style: italic;
}

/* 加载更多按钮 */
.view-more-btn {
  display: block;
  margin: 3rem auto 0;
  padding: 12px 30px;
  background: linear-gradient(90deg, #3498db, #9b59b6);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
  position: relative;
  overflow: hidden;
}

.view-more-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.view-more-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.6);
}

.view-more-btn:hover::before {
  left: 100%;
}

.view-more-btn:disabled {
  background: #2397e3;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}

/* 错误提示 */
.error-message {
  background: #e74c3c;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
  animation: shake 0.5s ease;
}

/* 动画效果 */
@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tips-list {
    grid-template-columns: 1fr;
  }

  .safety-title {
    font-size: 2rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .tip-illustration {
    margin: 1rem 0 0 0;
    width: 100%;
    height: auto;
    max-height: 150px;
  }
}
</style>