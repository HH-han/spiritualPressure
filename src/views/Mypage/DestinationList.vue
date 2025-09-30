<template>
    <div class="destination-list-container">
        <h1 class="destination-list-title">热门目的地</h1>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>正在加载目的地数据...</p>
        </div>
        
        <!-- 错误状态 -->
        <div v-else-if="error" class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>数据加载失败</h3>
            <p>{{ error }}</p>
            <button @click="fetchHotDestinations" class="retry-button">重新加载</button>
        </div>
        
        <!-- 正常显示 -->
        <div v-else>
            <div class="tabs">
                <button 
                    v-for="tab in tabs" 
                    :key="tab.name" 
                    :class="{ active: currentTab === tab.name }" 
                    @click="currentTab = tab.name"
                    class="tab-button">
                    {{ tab.name }}
                    <span class="tab-indicator"></span>
                </button>
            </div>

            <div class="destinations-container">
                <transition name="fade" mode="out-in">
                    <!-- 有数据的标签页 -->
                    <div v-if="filteredDestinations.length > 0" class="destinations-grid-container">
                        <div 
                            v-for="region in filteredDestinations" 
                            :key="region.id" 
                            class="region-card">
                            <h3 class="region-title">{{ region.provinceName }}</h3>
                            <ul class="city-list">
                                <li 
                                    v-for="city in region.cities" 
                                    :key="city" 
                                    class="city-item"
                                    @click="handleCityClick(region.provinceName, city)">
                                    {{ city }}
                                    <span class="city-hover-effect"></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <!-- 空状态 -->
                    <div v-else class="empty-state">
                        <div class="empty-icon">🌎</div>
                        <h3>更多目的地即将上线</h3>
                        <p>我们正在努力添加更多精彩旅行目的地</p>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getHotDestinations } from '@/api/destination';

// 标签页配置
const tabs = ref([
  { name: '国内', regionId: 1 },
  { name: '港澳台', regionId: 2 },
  { name: '日本', regionId: 3 },
  { name: '东南亚', regionId: 4 },
  { name: '南亚西亚', regionId: 5 },
  { name: '欧洲美洲', regionId: 6 },
  { name: '澳洲非洲', regionId: 7 }
]);

const currentTab = ref('国内');
const destinations = ref([]);
const loading = ref(false);
const error = ref(null);

// 根据当前标签筛选目的地数据
const filteredDestinations = computed(() => {
  if (!destinations.value.length) return [];
  
  const currentRegion = tabs.value.find(tab => tab.name === currentTab.value);
  if (!currentRegion) return [];
  
  return destinations.value.filter(dest => dest.region.id === currentRegion.regionId);
});

// 获取热门目的地数据
const fetchHotDestinations = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await getHotDestinations();
    
    if (response.code === '0' && response.data) {
      // 转换后端数据格式为前端需要的格式
      destinations.value = response.data.map(item => ({
        id: item.id,
        provinceName: item.provinceName,
        region: item.region,
        cities: item.cities.map(city => city.cityName)
      }));
      
      console.log('获取到的热门目的地数据:', destinations.value);
    } else {
      throw new Error(response.msg || '获取数据失败');
    }
  } catch (err) {
    console.error('获取热门目的地失败:', err);
    error.value = err.message || '网络请求失败，请稍后重试';
    
    // 如果API调用失败，使用默认数据作为fallback
    destinations.value = [
      {
        id: 1,
        provinceName: '直辖市',
        region: { id: 1, name: '国内' },
        cities: ['北京', '上海', '重庆', '天津']
      },
      {
        id: 2,
        provinceName: '云南',
        region: { id: 1, name: '国内' },
        cities: ['丽江', '大理', '昆明', '香格里拉', '泸沽湖', '双廊', '西双版纳', '束河', '腾冲', '雨崩']
      },
      {
        id: 3,
        provinceName: '四川',
        region: { id: 1, name: '国内' },
        cities: ['成都', '九寨沟', '稻城', '色达', '若尔盖', '都江堰', '亚丁', '阿坝', '峨眉山', '牛背山']
      }
    ];
  } finally {
    loading.value = false;
  }
};

// 处理城市点击事件
const handleCityClick = (provinceName, cityName) => {
  console.log(`点击了 ${provinceName} - ${cityName}`);
  // 这里可以添加跳转到城市详情页的逻辑
};

onMounted(() => {
  fetchHotDestinations();
});
</script>
<style scoped>
/* 基础样式 */
.destination-list-container {
    padding: 1rem;
    color: #2d3436;
}

.destination-list-title {
    font-size: 40px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold;
}

/* 标签页样式 */
.tabs {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 32px;
    position: relative;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.tab-button {
    position: relative;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    color: #636e72;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 12px 12px 0 0;
}

.tab-button:hover {
    color: #4a6bff;
    background: rgba(74, 107, 255, 0.05);
}

.tab-button.active {
    color: #4a6bff;
}

.tab-indicator {
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #4a6bff, #6c5ce7);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    border-radius: 3px;
}

.tab-button.active .tab-indicator {
    transform: scaleX(1);
}

/* 目的地内容区域 */
.destinations-container {
    min-height: 400px;
}

.destinations-grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
}

.region-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.region-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.region-title {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 20px;
    color: #4a6bff;
    position: relative;
    padding-bottom: 12px;
}

.region-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #4a6bff, #6c5ce7);
    border-radius: 3px;
}

.city-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
}

.city-item {
    position: relative;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.3s ease;
    cursor: pointer;
    overflow: hidden;
}

.city-hover-effect {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(74, 107, 255, 0.1), rgba(108, 94, 231, 0.1));
    transform: translateX(-100%);
    transition: all 0.3s ease;
    z-index: -1;
}

.city-item:hover {
    color: #4a6bff;
    transform: translateX(5px);
}

.city-item:hover .city-hover-effect {
    transform: translateY(0);
}

/* 加载状态样式 */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 60px 0;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4a6bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-state p {
    margin: 0;
    color: #636e72;
    font-size: 16px;
}

/* 错误状态样式 */
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 48px 0;
}

.error-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.error-state h3 {
    margin: 0 0 8px;
    color: #e74c3c;
}

.error-state p {
    margin: 0 0 20px;
    color: #636e72;
    max-width: 400px;
}

.retry-button {
    padding: 10px 24px;
    background: linear-gradient(135deg, #4a6bff, #6c5ce7);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.retry-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 107, 255, 0.3);
}

/* 空状态样式 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 48px 0;
}

.empty-icon {
    font-size: 64px;
    margin-bottom: 24px;
    opacity: 0.7;
}

.empty-state h3 {
    margin: 0 0 8px;
    color: #2d3436;
}

.empty-state p {
    margin: 0;
    color: #636e72;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .tabs {
        flex-wrap: wrap;
    }

    .destinations-grid {
        grid-template-columns: 1fr;
    }

    .city-list {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
}
</style>