<template>
    <div class="hotel-booking">
        <header>
            <h1>订酒店</h1>
            <div class="search-bar">
                <input type="text" placeholder="出行目的地" v-model="search.destination" />
                <input type="date" placeholder="入住日期" v-model="search.checkIn" />
                <input type="date" placeholder="离店日期" v-model="search.checkOut" />
                <input type="number" placeholder="人数" v-model="search.numberOfPeople" />
                <button @click="searchHotels">搜索</button>
            </div>
        </header>
        <section class="features">
            <div class="feature" v-for="feature in features" :key="feature.title">
                <h2>{{ feature.title }}</h2>
                <p>{{ feature.description }}</p>
            </div>
        </section>
        <section class="themed-hotels">
            <div class="section-header">
                <h2>主题住宿</h2>
                <div class="theme-tabs">
                    <button v-for="tab in tabs" :key="tab.id" :class="{ active: activeTab === tab.id }"
                        @click="activeTab = tab.id">
                        {{ tab.label }}
                    </button>
                </div>
            </div>

            <div class="hotel-list">
                <div class="hotel-item-list" v-for="hotel in filteredHotels" :key="hotel.name"
                    :data-theme="hotel.theme">
                    <div class="hotel-image">
                        <img :src="hotel.image" :alt="hotel.name" />
                        <span class="theme-badge">{{ getThemeLabel(hotel.theme) }}</span>
                    </div>
                    <div class="hotel-info">
                        <h3>{{ hotel.name }}</h3>
                        <p class="location">{{ hotel.location }}</p>
                        <div class="hotel-meta">
                            <span class="price">¥{{ hotel.price }}</span>
                            <span class="rating">★ {{ hotel.rating }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const search = ref({
    destination: '',
    checkIn: '',
    checkOut: '',
    numberOfPeople: ''
});


const activeTab = ref('all')

const tabs = [
    { id: 'all', label: '全部' },
    { id: 'luxury', label: '奢华酒店' },
    { id: 'boutique', label: '精品设计' },
    { id: 'resort', label: '度假村' },
    { id: 'business', label: '商务酒店' }
]

const hotels = [
    {
        name: '滨海湾金沙酒店',
        location: '新加坡',
        image: 'https://example.com/hotel1.jpg',
        theme: 'luxury',
        price: 3200,
        rating: 4.8
    },
    {
        name: '设计师艺术酒店',
        location: '上海',
        image: 'https://example.com/hotel2.jpg',
        theme: 'boutique',
        price: 1200,
        rating: 4.6
    },
    {
        name: '三亚亚龙湾度假村',
        location: '海南',
        image: 'https://example.com/hotel3.jpg',
        theme: 'resort',
        price: 1800,
        rating: 4.7
    },
    {
        name: '国际商务酒店',
        location: '北京',
        image: 'https://example.com/hotel4.jpg',
        theme: 'business',
        price: 800,
        rating: 4.3
    }
]


const features = [
    {
        title: '价格保障',
        description: '预订后降价，双倍差价赔付'
    },
    {
        title: '免费取消',
        description: '多数酒店可免费取消'
    },
    {
        title: '会员特权',
        description: '会员专享折扣及礼遇'
    },
    { 
        title: '住宿攻略', 
        description: '区域攻略到特色主题，应有尽有' 
    },
    { 
        title: '专享价格', 
        description: '多平台价格对比，天天专享特惠' 
    },
    { 
        title: '真实点评', 
        description: '超过100万真实用户点评和游记' 
    }
]

const filteredHotels = computed(() => {
    if (activeTab.value === 'all') return hotels
    return hotels.filter(hotel => hotel.theme === activeTab.value)
})

function getThemeLabel(theme) {
    const tab = tabs.find(t => t.id === theme)
    return tab ? tab.label : ''
}

function searchHotels() {
    // 搜索酒店逻辑
    console.log('搜索条件:', search.value)
}
</script>

<style scoped>
.hotel-booking {
    margin: 0px 30px;
    padding: 0 15px;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    color: #333;
}

/* 头部样式 */
header {
    text-align: center;
    padding: 30px 0;
    background: linear-gradient(135deg, #edc9a8 0%, #d7fed6 100%);
    border-radius: 0 0 20px 20px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #ee7f43, #377ec9);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
}

/* 搜索栏样式 */
.search-bar {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    background: white;
    padding: 1.5rem;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.search-bar input {
    padding: 0.8rem 1.2rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.search-bar input:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
}

.search-bar button {
    background: linear-gradient(135deg, #4361ee, #3f37c9);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.8rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.search-bar button:hover {
    background: linear-gradient(135deg, #3f37c9, #4361ee);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

/* 特色服务样式 */
.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.feature {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.feature h2 {
    color: #4361ee;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
}

.feature p {
    color: #adb5bd;
    line-height: 1.6;
}

/* 主题酒店样式 */
.themed-hotels {
    margin-top: 3rem;
}

.themed-hotels h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: #1e1e24;
    position: relative;
    display: inline-block;
}

.themed-hotels h2::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 50%;
    height: 4px;
    background: linear-gradient(90deg, #4361ee, transparent);
    border-radius: 2px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.theme-tabs {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.theme-tabs button {
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.theme-tabs button:hover {
    background: #f5f5f5;
}

.theme-tabs button.active {
    background: #4361ee;
    color: white;
    border-color: #4361ee;
}

.hotel-item {
    background: white;
    border-radius: 12px;
    width: 100%;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease;
    padding: 10px;
}

.hotel-image {
    position: relative;
    overflow: hidden;
    border-radius: 12px 12px 0 0;
    height: 180px;
}

.hotel-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.hotel-item:hover .hotel-image img {
    transform: scale(1.05);
}

.theme-badge {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
}

.hotel-info {
    padding: 1rem;
    background: white;
}

.hotel-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    font-size: 0.9rem;
}

.price {
    color: #4361ee;
    font-weight: bold;
}

.rating {
    color: #ffb400;
}

.hotel-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}

.hotel-item-list {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    padding: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease;
}

.hotel-item-list:hover {
    transform: translateY(-5px);
}

.hotel-item-list img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.hotel-item-list h3 {
    padding: 1rem 1rem 0.5rem;
    font-size: 1.1rem;
    color: #1e1e24;
}

.hotel-item-list p {
    padding: 0 1rem 1rem;
    color: #adb5bd;
    font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .search-bar {
        flex-direction: column;
    }

    .search-bar button {
        grid-column: auto;
    }

    header h1 {
        font-size: 2rem;
    }

    .features {
        grid-template-columns: 1fr;
    }
    .section-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .theme-tabs {
        width: 100%;
        overflow-x: auto;
        padding-bottom: 0.5rem;
    }
}
</style>