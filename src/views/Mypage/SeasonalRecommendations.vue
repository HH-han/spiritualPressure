<template>
    <div class="seasonal-recommendations">
        <h2 class="section-title-conter">当季推荐</h2>
        <div class="month-tabs">
            <button v-for="month in months" :key="month" :class="{ active: currentMonth === month }"
                @click="handleMonthChange(month)" class="month-tab">
                {{ month }}
                <span class="tab-underline"></span>
            </button>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>正在加载推荐数据...</p>
        </div>
        
        <!-- 错误状态 -->
        <div v-else-if="error" class="error-state">
            <div class="error-icon">⚠️</div>
            <p>加载失败，请稍后重试</p>
            <button @click="retryFetch" class="retry-button">重试</button>
        </div>
        
        <!-- 数据展示 -->
        <div v-else class="recommendation-grid">
            <div v-for="destination in getRecommendationsForMonth(currentMonth)" :key="destination.id"
                class="destination-card">
                <div class="image-wrapper">
                    <img :src="destination.imageUrl" :alt="destination.name + '图片'" class="destination-image" />
                    <div class="image-overlay"></div>
                </div>
                <div class="destination-info">
                    <h3 class="destination-name">{{ destination.name }}</h3>
                    <p class="destination-desc">{{ destination.description }}</p>
                    <div class="destination-tags">
                        <span v-for="tag in destination.parsedTags" :key="tag" class="tag">{{ tag }}</span>
                    </div>
                </div>
            </div>
            
            <!-- 空状态 -->
            <div v-if="getRecommendationsForMonth(currentMonth).length === 0" class="empty-state">
                <p>暂无该月份的推荐数据</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getRecommendByMonth } from '@/api/destination'

const currentMonth = ref('一月')
const loading = ref(false)
const error = ref(null)

const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

// 使用响应式对象存储推荐数据
const recommendations = ref({})

// 默认数据作为API调用失败的fallback
const defaultRecommendations = {}

// 处理tags字段（后端返回的是JSON字符串）
const parseTags = (tagsString) => {
    try {
        return JSON.parse(tagsString) || []
    } catch {
        return []
    }
}

// 获取当前月份的推荐数据
const getRecommendationsForMonth = (month) => {
    const monthData = recommendations.value[month] || []
    
    // 为每个目的地添加解析后的tags字段
    return monthData.map(destination => ({
        ...destination,
        parsedTags: parseTags(destination.tags)
    }))
}

const handleMonthChange = (month) => {
    currentMonth.value = month
}

// 获取推荐数据
const fetchRecommendations = async (month) => {
    loading.value = true
    error.value = null
    
    try {
        const response = await getRecommendByMonth({ month })
        
        // 根据后端数据格式处理响应
        if (response.code === '0' && response.data) {
            return response.data
        } else {
            throw new Error(response.msg || '获取数据失败')
        }
    } catch (err) {
        console.error('获取推荐数据失败:', err)
        error.value = err.message || '网络错误'
        // API调用失败时使用默认数据
        return defaultRecommendations[month] || []
    } finally {
        loading.value = false
    }
}

// 重试获取数据
const retryFetch = () => {
    error.value = null
    fetchRecommendations(currentMonth.value).then((data) => {
        recommendations.value[currentMonth.value] = data
    })
}

// 初始化时获取当前月份的推荐
onMounted(() => {
    fetchRecommendations(currentMonth.value).then((data) => {
        recommendations.value[currentMonth.value] = data
    })
})

// 监听月份变化，更新推荐数据
watch(currentMonth, (newMonth) => {
    // 如果该月份的数据尚未加载，则获取数据
    if (!recommendations.value[newMonth]) {
        fetchRecommendations(newMonth).then((data) => {
            recommendations.value[newMonth] = data
        })
    }
})
</script>

<style scoped>
.seasonal-recommendations {
    margin: 0 auto;
    padding: 40px 0px 40px 0px;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.section-title-conter {
    text-align: center;
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 40px;
    color: #333;
    position: relative;
    padding-bottom: 15px;
}

.section-title-conter::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #ff6b6b, #ff8e53);
}

.month-tabs {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 40px;
    flex-wrap: wrap;
}

.month-tab {
    position: relative;
    padding: 8px 20px;
    font-size: 16px;
    font-weight: 500;
    color: #666;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 20px;
}

.month-tab:hover {
    color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
}

.month-tab.active {
    color: #ff6b6b;
    font-weight: 600;
}

.tab-underline {
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 50%;
    height: 2px;
    background: linear-gradient(90deg, #ff6b6b, #ff8e53);
    transition: transform 0.3s ease;
}

.month-tab.active .tab-underline {
    transform: translateX(-50%) scaleX(1);
}

/* 加载状态样式 */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #ff6b6b;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-state p {
    color: #666;
    font-size: 16px;
    margin: 0;
}

/* 错误状态样式 */
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
}

.error-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.error-state p {
    color: #ff6b6b;
    font-size: 16px;
    margin-bottom: 20px;
}

.retry-button {
    padding: 10px 24px;
    background: #ff6b6b;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.retry-button:hover {
    background: #ff5252;
}

/* 空状态样式 */
.empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
    color: #999;
    font-size: 16px;
}

.recommendation-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    padding: 0 20px;
}

.destination-card {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background: white;
}

.destination-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.image-wrapper {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
}

.destination-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.destination-card:hover .destination-image {
    transform: scale(1.05);
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1));
}

.destination-info {
    padding: 20px;
}

.destination-name {
    margin: 0 0 10px;
    font-size: 20px;
    font-weight: 600;
    color: #333;
}

.destination-desc {
    margin: 0 0 15px;
    font-size: 14px;
    color: #666;
    line-height: 1.5;
}

.destination-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tag {
    padding: 4px 12px;
    font-size: 12px;
    background: #f3f3f3;
    border-radius: 20px;
    color: #666;
}

@media (max-width: 768px) {
    .section-title-conter {
        font-size: 26px;
        margin-bottom: 30px;
    }

    .month-tabs {
        gap: 6px;
        margin-bottom: 30px;
    }

    .month-tab {
        padding: 6px 15px;
        font-size: 14px;
    }

    .recommendation-grid {
        grid-template-columns: 1fr;
        gap: 20px;
        padding: 0 10px;
    }

    .image-wrapper {
        height: 180px;
    }
    
    .loading-state,
    .error-state {
        padding: 40px 20px;
    }
    
    .loading-spinner {
        width: 32px;
        height: 32px;
    }
    
    .error-icon {
        font-size: 36px;
    }
}
</style>