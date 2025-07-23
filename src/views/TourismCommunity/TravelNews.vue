<template>
  <div class="information-container">
    <!-- 加载状态 -->
    <div v-if="state.loading" class="information-loading">
      加载中...
    </div>

    <!-- 错误状态 -->
    <div v-else-if="state.error" class="information-error">
      {{ state.error }}
      <button @click="onMounted">重试</button>
    </div>

    <!-- 正常状态 -->
    <template v-else>
      <h2 class="information-title">旅游资讯中心</h2>

      <div class="information-content">
        <!-- 左侧资讯区 -->
        <div class="information-left">
          <div class="information-header">
            <h3>最新资讯</h3>
            <span class="information-more">查看更多 <i class="fas fa-chevron-right"></i></span>
          </div>

          <div class="information-card" v-for="item in state.leftNews" :key="item.id">
            <div class="information-card-header">
              <h4>{{ item.title }}</h4>
              <span class="information-time">{{ formatTime(item.time) }}</span>
            </div>
            <p class="information-content-text">{{ item.content }}</p>
            <div class="information-actions">
              <button @click="incrementFavorite(item)" class="information-btn" :disabled="item.favoriteDisabled">
                <i class="fas fa-heart"></i> 收藏:{{ item.favorites }}
              </button>
              <button @click="incrementLike(item)" class="information-btn" :disabled="item.likeDisabled">
                <i class="fas fa-thumbs-up"></i> 点赞:{{ item.likes }}
              </button>
              <button class="information-btn">
                <i class="fas fa-comment"></i> 评论:{{ item.comments }}
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧分类区 -->
        <div class="information-right">
          <div class="information-tabs">
            <button v-for="(category, index) in categories" :key="index"
              :class="['information-tab', { 'information-tab-active': activeCategory === index }]"
              @click="setCategory(index)">
              {{ category }}
            </button>
          </div>

          <div class="information-section">
            <h4>目的地推荐</h4>
            <div class="information-destination" v-for="item in filteredDestinations" :key="item.city">
              <div class="information-tag">{{ item.city }}</div>
              <p>{{ item.content }}</p>
              <div class="information-actions">
                <button @click="incrementLike(item)" class="information-btn" :disabled="item.likeDisabled">
                  <i class="fas fa-thumbs-up"></i> 点赞:{{ item.likes }}
                </button>
                <button class="information-btn">
                  <i class="fas fa-comment"></i> 评论:{{ item.comments }}
                </button>
              </div>
            </div>
          </div>

          <div class="information-section">
            <h4>旅游攻略</h4>
            <div class="information-guide" v-for="item in state.guides" :key="item.city">
              <div class="information-guide-header">
                <span class="information-tag">{{ item.city }}</span>
                <div class="information-expert"><i class="fas fa-star"></i> 达人推荐</div>
              </div>
              <p>{{ item.content }}</p>
              <div class="information-actions">
                <button @click="incrementLike(item)" class="information-btn" :disabled="item.likeDisabled">
                  <i class="fas fa-thumbs-up"></i> 点赞:{{ item.likes }}
                </button>
                <button class="information-btn">
                  <i class="fas fa-comment"></i> 评论:{{ item.comments }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// 模拟API获取数据
const fetchNewsData = async () => {
  // 实际项目中这里应该是API调用
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        leftNews: [
          {
            id: 1,
            title: '旅游政策变化',
            content: 'XX景点：暑期游客量限制政策更新',
            likes: 22,
            favorites: 12,
            comments: 5,
            time: '2023-06-15 10:30'
          },
          // 其他数据...
        ],
        destinations: [
          // 目的地数据...
        ],
        guides: [
          // 攻略数据...
        ]
      })
    }, 500)
  })
}

// 数据状态
const state = reactive({
  loading: false,
  error: null,
  leftNews: [],
  destinations: [],
  guides: []
})

// 分类状态
const categories = ['全部', '按目的地', '政策资讯', '活动资讯', '攻略推荐']
const activeCategory = ref(0)

// 计算属性
const filteredDestinations = computed(() => {
  if (activeCategory.value === 1) return state.destinations
  return state.destinations.slice(0, 2)
})

// 格式化时间显示
const formatTime = (timeStr) => {
  const now = new Date()
  const time = new Date(timeStr)
  const diffHours = Math.floor((now - time) / (1000 * 60 * 60))

  if (diffHours < 1) return '刚刚'
  if (diffHours < 24) return `${diffHours}小时前`
  return time.toLocaleDateString()
}

// 交互方法
const incrementLike = (item) => {
  item.likes++
  // 实际项目中这里可以添加API调用更新后端数据
}

const incrementFavorite = (item) => {
  item.favorites++
  // 实际项目中这里可以添加API调用更新后端数据
}

const setCategory = (index) => {
  activeCategory.value = index
  // 可以根据分类加载不同数据
  loadCategoryData(index)
}

// 初始化加载数据
onMounted(async () => {
  try {
    state.loading = true
    const data = await fetchNewsData()
    state.leftNews = data.leftNews
    state.destinations = data.destinations
    state.guides = data.guides
  } catch (error) {
    state.error = error.message || '加载数据失败'
  } finally {
    state.loading = false
  }
})

// 模拟分类数据加载
const loadCategoryData = async (categoryIndex) => {
  // 实际项目中根据分类加载不同数据
  console.log('加载分类数据:', categories[categoryIndex])
}
</script>
<style scoped>
/* 基础样式 */
.information-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #333;
}

/* 加载状态 */
.information-loading,
.information-error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
}

.information-error {
  color: #e74c3c;
}

.information-error button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  cursor: pointer;
}

/* 标题样式 */
.information-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #2c3e50;
  position: relative;
  padding-bottom: 1rem;
}

.information-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #3498db, #9b59b6);
  border-radius: 2px;
}

/* 内容布局 */
.information-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 左侧资讯区 */
.information-left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.information-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.information-header h3 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 0;
}

.information-more {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
}

.information-more:hover {
  color: #2980b9;
  transform: translateX(3px);
}

/* 卡片通用样式 */
.information-card,
.information-destination,
.information-guide {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.information-card:hover,
.information-destination:hover,
.information-guide:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

/* 卡片头部 */
.information-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.information-card-header h4 {
  font-size: 1.1rem;
  margin: 0;
  color: #2c3e50;
}

.information-time {
  background: #f8f9fa;
  color: #7f8c8d;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* 内容文本 */
.information-content-text {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* 操作按钮区 */
.information-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 1rem;
}

.information-btn {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.85rem;
}

.information-btn:hover {
  background: rgba(52, 152, 219, 0.2);
}

.information-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.information-btn i {
  font-size: 0.9rem;
}

/* 右侧分类区 */
.information-right {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 分类标签 */
.information-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.information-tab {
  background: #f8f9fa;
  color: #555;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.information-tab-active {
  background: linear-gradient(135deg, #3498db, #9b59b6);
  color: white;
  box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);

}

/* 分类区块 */
.information-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.information-section h4 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

/* 目的地标签 */
.information-tag {
  background: #e8f4fd;
  color: #3498db;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
}

/* 达人推荐标签 */
.information-expert {
  background: #fff3e0;
  color: #ff9800;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

/* 攻略头部 */
.information-guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .information-content {
    grid-template-columns: 1fr;
  }

  .information-title {
    font-size: 1.8rem;
  }

  .information-header h3 {
    font-size: 1.2rem;
  }

  .information-tabs {
    padding-bottom: 0.8rem;
  }

  .information-tab {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.information-card,
.information-section {
  animation: fadeIn 0.5s ease-out forwards;
}

.information-card:nth-child(1) {
  animation-delay: 0.1s;
}

.information-card:nth-child(2) {
  animation-delay: 0.2s;
}

.information-card:nth-child(3) {
  animation-delay: 0.3s;
}

.information-card:nth-child(4) {
  animation-delay: 0.4s;
}
</style>