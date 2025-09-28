<template>
    <div class="tt-container">
        <!-- 主内容区 -->
        <div class="tt-content">
            <!-- 标题区 -->
            <header class="tt-header">
                <h1 class="tt-title">探索世界之美</h1>
                <p class="tt-subtitle">精选全球热门跟团游线路，开启您的梦幻之旅</p>
            </header>

            <!-- 筛选区 -->
            <div class="tt-filter-group">
                <div class="tt-filter-card">
                    <div class="tt-filter-item" v-for="filter in filters" :key="filter.id"
                        @click="activeFilter = filter.id">
                        <div class="tt-filter-icon" :class="{ 'tt-active': activeFilter === filter.id }">
                            <i :class="filter.icon"></i>
                        </div>
                        <span class="tt-filter-label">{{ filter.label }}</span>
                    </div>
                </div>
            </div>

            <!-- 搜索框 -->
            <div class="tt-search-card">
                <div class="tt-search-input">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="搜索目的地、景点或关键词..." v-model="searchQuery">
                    <button class="tt-search-btn">搜索</button>
                </div>
            </div>

            <!-- 旅游卡片列表 -->
            <div class="tt-tour-list">
                <div class="tt-tour-card" v-for="tour in paginatedTours" :key="tour.id"
                    @mouseenter="hoverCard = tour.id" @mouseleave="hoverCard = null"
                    :class="{ 'tt-card-hover': hoverCard === tour.id }">
                    <div class="tt-card-image" :style="{ backgroundImage: `url(${tour.image})` }">
                        <div class="tt-card-tag" v-if="tour.tag">{{ tour.tag }}</div>
                        <div class="tt-card-price">¥{{ tour.price }}<span>起</span></div>
                    </div>
                    <div class="tt-card-content">
                        <h3 class="tt-card-title">{{ tour.title }}</h3>
                        <div class="tt-card-meta">
                            <span><i class="fas fa-calendar-alt"></i> {{ tour.duration }}天</span>
                            <span><i class="fas fa-map-marker-alt"></i> {{ tour.destination }}</span>
                        </div>
                        <div class="tt-card-desc">{{ tour.description }}</div>
                        <div class="tt-card-footer">
                            <div class="tt-rating">
                                <i class="fas fa-star" v-for="n in 5" :key="n"
                                    :class="{ 'tt-rated': n <= tour.rating }"></i>
                                <span>({{ tour.reviews }})</span>
                            </div>
                            <button class="tt-book-btn">立即预订</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 分页控制 -->
            <div class="tt-pagination">
                <button class="tt-page-btn" :disabled="currentPage === 1" @click="currentPage--">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <span class="tt-page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
                <button class="tt-page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    </div>
    <!-- 背景层 -->
    <div class="tt-background">
        <BackgroundStyle />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BackgroundStyle from '@/components/ThemeComponents/BackgroundStyle.vue';
// 筛选条件
const filters = ref([
    { id: 'all', label: '全部', icon: 'fas fa-globe' },
    { id: 'hot', label: '热门', icon: 'fas fa-fire' },
    { id: 'domestic', label: '国内', icon: 'fas fa-mountain' },
    { id: 'international', label: '国际', icon: 'fas fa-plane' },
    { id: 'family', label: '亲子', icon: 'fas fa-child' },
    { id: 'luxury', label: '奢华', icon: 'fas fa-gem' }
])

// 当前激活的筛选条件
const activeFilter = ref('all')
const searchQuery = ref('')
const hoverCard = ref(null)
const currentPage = ref(1)
const itemsPerPage = 6

// 模拟旅游数据
const tours = ref([
    {
        id: 1,
        title: '浪漫三亚五日游',
        destination: '海南三亚',
        duration: 5,
        description: '亚龙湾豪华海景酒店，蜈支洲岛一日游，天涯海角浪漫之旅',
        price: 3280,
        rating: 4,
        reviews: 128,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tag: '热卖',
        type: 'domestic'
    },
    {
        id: 2,
        title: '日本京都大阪七日游',
        destination: '日本',
        duration: 7,
        description: '京都古都文化体验，大阪环球影城，奈良小鹿公园',
        price: 8999,
        rating: 5,
        reviews: 256,
        image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tag: '新品',
        type: 'international'
    },
    {
        id: 3,
        title: '云南丽江香格里拉六日游',
        destination: '云南',
        duration: 6,
        description: '丽江古城自由活动，玉龙雪山冰川公园，香格里拉普达措国家公园',
        price: 4580,
        rating: 4,
        reviews: 189,
        image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tag: '特惠',
        type: 'domestic'
    },
    {
        id: 4,
        title: '欧洲四国十二日游',
        destination: '法国/瑞士/意大利/德国',
        duration: 12,
        description: '巴黎埃菲尔铁塔，瑞士阿尔卑斯山，威尼斯水城，新天鹅堡',
        price: 18999,
        rating: 5,
        reviews: 312,
        image: 'https://images.unsplash.com/photo-1493707553966-283afac8c358?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        type: 'international'
    },
    {
        id: 5,
        title: '桂林阳朔亲子四日游',
        destination: '广西桂林',
        duration: 4,
        description: '漓江竹筏漂流，阳朔西街，象鼻山公园，亲子互动体验',
        price: 2980,
        rating: 4,
        reviews: 145,
        image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        type: 'family'
    },
    {
        id: 6,
        title: '马尔代夫豪华六日游',
        destination: '马尔代夫',
        duration: 6,
        description: '水上别墅住宿，私人沙滩，浮潜体验，日落巡航',
        price: 25999,
        rating: 5,
        reviews: 278,
        image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        type: 'luxury'
    },
    {
        id: 7,
        title: '西安兵马俑三日游',
        destination: '陕西西安',
        duration: 3,
        description: '兵马俑博物馆，华清池，大雁塔，回民街美食',
        price: 1980,
        rating: 4,
        reviews: 167,
        image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        type: 'domestic'
    },
    {
        id: 8,
        title: '泰国普吉岛五日游',
        destination: '泰国',
        duration: 5,
        description: 'PP岛一日游，神仙半岛，西蒙人妖秀，泰式按摩体验',
        price: 5899,
        rating: 4,
        reviews: 203,
        image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        tag: '特惠',
        type: 'international'
    }
])

// 筛选后的旅游列表
const filteredTours = computed(() => {
    let result = tours.value

    // 按筛选条件过滤
    if (activeFilter.value !== 'all') {
        if (activeFilter.value === 'hot') {
            result = result.filter(tour => tour.rating >= 4.5 || tour.tag === '热卖')
        } else {
            result = result.filter(tour => tour.type === activeFilter.value)
        }
    }

    // 按搜索关键词过滤
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(tour =>
            tour.title.toLowerCase().includes(query) ||
            tour.destination.toLowerCase().includes(query) ||
            tour.description.toLowerCase().includes(query)
        )
    }

    return result
})

// 分页相关计算
const paginatedTours = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredTours.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(filteredTours.value.length / itemsPerPage)
})
</script>

<style  scoped>
/* 样式tt */
@import "@/css/TravelServiceoptions/TravelTeam.css";
</style>