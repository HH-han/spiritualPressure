<template>
    <div class="world-liquid-glass-container">
        <header class="world-page-header">
            <h1>全球特色地点探索</h1>
            <p class="world-subtitle">穿越时空的文化与自然奇观</p>
        </header>

        <div class="world-filter-controls">
            <button v-for="category in categories" :key="category" @click="filterByCategory(category)"
                :class="{ 'world-active': activeCategory === category }">
                {{ category }}
            </button>
        </div>

        <div class="world-locations-grid">
            <div v-for="location in filteredLocations" :key="location.id" class="world-location-card"
                :style="{ '--card-accent': location.color }">
                <div class="world-card-image">
                    <img :src="location.image" :alt="location.name" />
                    <div class="world-image-overlay"></div>
                </div>
                <div class="world-card-content">
                    <div class="world-card-header">
                        <h2>{{ location.name }}</h2>
                        <span class="world-location-country">{{ location.country }}</span>
                    </div>
                    <div class="world-card-tags">
                        <span v-for="tag in location.tags" :key="tag" class="world-tag">{{ tag }}</span>
                    </div>
                    <p class="world-card-description">{{ location.description }}</p>
                    <div class="world-card-details">
                        <div class="world-detail-item">
                            <span class="world-detail-label">特色</span>
                            <p>{{ location.features }}</p>
                        </div>
                        <div class="world-detail-item">
                            <span class="world-detail-label">历史</span>
                            <p>{{ location.history }}</p>
                        </div>
                        <div class="world-detail-item">
                            <span class="world-detail-label">人文</span>
                            <p>{{ location.culture }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 分页 -->
    <div class="block-world">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" />
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getWorldHistoryDetail } from '@/api/travel';

// 地点数据
const locations = ref([]);
const loading = ref(false);
// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const handleSizeChange = (val) => {
    pageSize.value = val;
    fetchWorldHistoryDetail();
};

const handleCurrentChange = (val) => {
    currentPage.value = val;
    fetchWorldHistoryDetail();
};

// 获取数据
const fetchWorldHistoryDetail = async () => {
    loading.value = true;
    try {
        const params = {
            activeCategory: activeCategory.value,
            currentPage: currentPage.value,
            pageSize: pageSize.value,
        };
        const response = await getWorldHistoryDetail(params);
        locations.value = (response.data.travelWorldcharacteristics || []).map(item => ({
            ...item,
            tags: Array.isArray(item.tags) ? item.tags : (typeof item.tags === 'string' ? item.tags.split(',').map(tag => tag.trim()) : [])
        }));
        total.value = response.data.total || 1;
    } catch (error) {
        console.error('获取目的地数据失败:', error);
    } finally {
        loading.value = false;
    }
};


// 分类筛选
const categories = ref(['全部', '历史遗迹', '自然景观', '城市风情']);
const activeCategory = ref('全部');

const filterByCategory = (category) => {
    activeCategory.value = category;
};

const filteredLocations = computed(() => {
    if (activeCategory.value === '全部') {
        return locations.value;
    }
    return locations.value.filter(location => location.category === activeCategory.value);
});
onMounted(() => {
    fetchWorldHistoryDetail();
});
</script>

<style scoped>
.world-liquid-glass-container {
    width: 100%;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
}

.world-page-header {
    text-align: center;
    margin-bottom: 3rem;
}

.world-page-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(90deg, #3a7bd5, #00d2ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.world-subtitle {
    font-size: 1.2rem;
    color: #666;
}

.world-filter-controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.world-filter-controls button {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 2rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    color: #333;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.world-filter-controls button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.world-filter-controls button.active {
    background: linear-gradient(90deg, #3a7bd5, #00d2ff);
    color: white;
}

.world-locations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}

.world-location-card {
    width: 100%;
    max-width: 300px;
    border-radius: 1rem;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.world-location-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.world-card-image {
    position: relative;
    height: 600px;
    overflow: hidden;
}

.world-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.world-location-card:hover .world-card-image img {
    transform: scale(1.05);
}

.world-image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.7));
}

.world-card-content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    opacity: 1;
    transition: all 0.4s ease;
}

.world-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    position: relative;
}

.world-card-header::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, var(--card-accent), transparent);
}

.world-card-header h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: #222;
}

.world-location-country {
    background: var(--card-accent);
    color: white;
    padding: 0.2rem 0.8rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 600;
}

.world-card-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
}

.world-tag {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    padding: 0.2rem 0.8rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    color: #343434;
}

.world-card-description {
    color: #343434;
    margin-bottom: 1.5rem;
    line-height: 1.6;
}

.world-card-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1rem;
}

.world-detail-item {
    background: rgba(255, 255, 255, 0.3);
    padding: 0.8rem;
    border-radius: 0.5rem;
    backdrop-filter: blur(5px);
}

.world-detail-label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.3rem;
    color: var(--card-accent);
}

.world-detail-item p {
    margin: 0;
    font-size: 0.9rem;
    color: #343434;
    line-height: 1.5;
}

.block-world{
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
}
@media (max-width: 768px) {
    .world-locations-grid {
        grid-template-columns: 1fr;
    }

    .world-filter-controls {
        flex-wrap: wrap;
    }
}
</style>