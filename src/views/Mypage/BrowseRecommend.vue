<template>
    <div class="attraction-recommendation">
        <header>
            <h1>景点推荐</h1>
            <div class="search-bar">
                <input type="text" placeholder="输入目的地" v-model="search.destination" />
                <input type="date" placeholder="开始日期" v-model="search.startDate" />
                <input type="date" placeholder="结束日期" v-model="search.endDate" />
                <input type="number" placeholder="人数" v-model="search.travelers" />
                <button @click="searchAttractions">搜索</button>
            </div>
        </header>

        <section class="features">
            <div class="feature" v-for="feature in features" :key="feature.title">
                <h2>{{ feature.title }}</h2>
                <p>{{ feature.description }}</p>
            </div>
        </section>

        <section class="attraction-types">
            <div class="section-header">
                <h2>精选景点</h2>
                <div class="type-tabs">
                    <button v-for="type in attractionTypes" :key="type.id"
                        :class="{ active: activeAttractionType === type.id }" @click="activeAttractionType = type.id">
                        {{ type.label }}
                    </button>
                </div>
            </div>

            <div class="attraction-list">
                <div class="attraction-item" v-for="attraction in filteredAttractions" :key="attraction.name">
                    <div class="attraction-image">
                        <img :src="attraction.image" :alt="attraction.name" />
                        <span class="type-badge">{{ getTypeLabel(attraction.type) }}</span>
                    </div>
                    <div class="attraction-info">
                        <h3>{{ attraction.name }}</h3>
                        <p class="location">{{ attraction.location }}</p>
                        <div class="tags">
                            <span v-for="tag in attraction.tags" :key="tag">{{ tag }}</span>
                        </div>
                        <div class="attraction-meta">
                            <span class="price" v-if="attraction.price > 0">¥{{ attraction.price }}起</span>
                            <span class="free" v-else>免费</span>
                            <span class="rating">★ {{ attraction.rating }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 当前选中的景点类型
const activeAttractionType = ref('all')

// 景点类型分类
const attractionTypes = [
    { id: 'all', label: '全部景点' },
    { id: 'nature', label: '自然风光' },
    { id: 'history', label: '历史古迹' },
    { id: 'amusement', label: '主题乐园' },
    { id: 'museum', label: '博物馆' },
    { id: 'shopping', label: '购物中心' }
]

// 景点数据
const attractions = [
    {
        name: '九寨沟风景区',
        location: '四川',
        image: 'https://example.com/attraction1.jpg',
        type: 'nature',
        price: 220,
        rating: 4.9,
        tags: ['世界遗产', '5A景区']
    },
    {
        name: '故宫博物院',
        location: '北京',
        image: 'https://example.com/attraction2.jpg',
        type: 'history',
        price: 60,
        rating: 4.8,
        tags: ['世界遗产', '必去景点']
    },
    {
        name: '上海迪士尼乐园',
        location: '上海',
        image: 'https://example.com/attraction3.jpg',
        type: 'amusement',
        price: 399,
        rating: 4.7,
        tags: ['亲子游', '主题乐园']
    },
    {
        name: '大英博物馆',
        location: '伦敦',
        image: 'https://example.com/attraction4.jpg',
        type: 'museum',
        price: 0,
        rating: 4.6,
        tags: ['免费', '世界著名']
    },
    {
        name: '银座购物区',
        location: '东京',
        image: 'https://example.com/attraction5.jpg',
        type: 'shopping',
        price: 0,
        rating: 4.5,
        tags: ['购物天堂', '奢侈品']
    }
]

// 特色推荐
const features = [
    {
        title: '免排队',
        description: '电子票快速入园'
    },
    {
        title: '超值套餐',
        description: '门票+交通+导游优惠组合'
    },
    {
        title: '语音导览',
        description: '多语言讲解服务'
    }
]

// 根据类型筛选景点
const filteredAttractions = computed(() => {
    if (activeAttractionType.value === 'all') return attractions
    return attractions.filter(attraction => attraction.type === activeAttractionType.value)
})

// 获取类型标签
function getTypeLabel(type) {
    const foundType = attractionTypes.find(t => t.id === type)
    return foundType ? foundType.label : ''
}

// 搜索景点
function searchAttractions() {
    // 搜索逻辑实现
    console.log('搜索景点:', search.value)
}

// 搜索条件
const search = ref({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1
})
</script>

<style scoped>
/* 基础样式 */
.attraction-recommendation {
    margin: 0px 30px;
    padding: 0 15px;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    color: #333;
}

/* 头部样式 */
.attraction-recommendation header {
    text-align: center;
    padding: 30px 0;
    background: linear-gradient(135deg, #a8b7ed 0%, #d6fee1 100%);
    border-radius: 0 0 20px 20px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.attraction-recommendation h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #cc43ee, #3791c9);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
}

/* 搜索栏样式 */
.search-bar {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
    background: #fff;
    padding: 18px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-top: 20px;
}

.search-bar input {
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 15px;
    transition: all 0.3s ease;
}

.search-bar input:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
}

.search-bar button {
    background: linear-gradient(135deg, #4361ee, #3a0ca3);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.search-bar button:hover {
    background: linear-gradient(135deg, #3a0ca3, #4361ee);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

/* 特色推荐样式 */
.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
}

.feature {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.feature:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.feature h2 {
    color: #4361ee;
    margin-bottom: 8px;
    font-size: 18px;
}

.feature p {
    color: #666;
    line-height: 1.6;
    font-size: 14px;
}

/* 景点类型切换 */
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
}

.attraction-types h2 {
    font-size: 1.8rem;
    color: #333;
    position: relative;
}

.attraction-types h2::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 50px;
    height: 3px;
    background: #4361ee;
    border-radius: 2px;
}

.type-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.type-tabs button {
    padding: 8px 16px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.type-tabs button:hover {
    background: #f5f5f5;
}

.type-tabs button.active {
    background: #4361ee;
    color: white;
    border-color: #4361ee;
}

/* 景点列表 */
.attraction-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.attraction-item {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease;
}

.attraction-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.attraction-image {
    position: relative;
    height: 180px;
    overflow: hidden;
}

.attraction-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.attraction-item:hover .attraction-image img {
    transform: scale(1.05);
}

.type-badge {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
}

.attraction-info {
    padding: 16px;
}

.attraction-info h3 {
    font-size: 18px;
    margin-bottom: 6px;
    color: #333;
}

.location {
    color: #666;
    font-size: 14px;
    margin-bottom: 10px;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
}

.tags span {
    background: #f0f0f0;
    color: #555;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.attraction-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.price {
    color: #4361ee;
    font-weight: 600;
    font-size: 16px;
}

.free {
    color: #00a854;
    font-weight: 600;
    font-size: 16px;
}

.rating {
    color: #ffb400;
    font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .search-bar {
        grid-template-columns: 1fr;
    }

    .features {
        grid-template-columns: 1fr;
    }

    .section-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .type-tabs {
        width: 100%;
        overflow-x: auto;
        padding-bottom: 8px;
    }

    .attraction-recommendation h1 {
        font-size: 1.8rem;
    }
}
</style>