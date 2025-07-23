<template>
    <div class="tw-container">
        <div class="tw-content">
            <!-- 标题栏 -->
            <header class="tw-glass-card tw-app-header">
                <div class="tw-logo">
                    <i class="fas fa-compass tw-logo-icon"></i>
                    <h1>旅行者</h1>
                </div>
                <div class="tw-nav-controls">
                    <button v-for="(nav, index) in navItems" :key="index" class="tw-nav-btn">
                        <i :class="nav.icon"></i> {{ nav.text }}
                    </button>
                    <div class="tw-user-avatar">{{ userInitials }}</div>
                </div>
            </header>

            <!-- 主要内容区域 -->
            <main class="tw-main-content">
                <!-- 个性化推荐 -->
                <section class="tw-glass-card tw-recommendations">
                    <div class="tw-section-title">
                        <h2>为您推荐</h2>
                        <a href="#">查看全部 <i class="fas fa-chevron-right"></i></a>
                    </div>
                    <div class="tw-destination-cards">
                        <div v-for="destination in destinations" :key="destination.id" class="tw-destination-card">
                            <img :src="destination.image" :alt="destination.name">
                            <div class="tw-destination-overlay">
                                <div class="tw-destination-name">{{ destination.name }}</div>
                                <div class="tw-destination-tags">
                                    <span v-for="(tag, index) in destination.tags" :key="index" class="tw-tag">
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>
                            <div class="tw-budget-indicator">{{ destination.budget }}</div>
                        </div>
                    </div>
                </section>

                <!-- 行程规划工具 -->
                <section class="tw-glass-card tw-trip-planner">
                    <div class="tw-section-title">
                        <h2>行程规划</h2>
                        <a href="#">保存行程 <i class="fas fa-save"></i></a>
                    </div>
                    <div class="tw-map-container">
                        <div ref="mapContainer" style="width: 100%; height: 100%;"></div>
                        <div class="tw-map-overlay">
                            <h3><i class="fas fa-map-marker-alt"></i> 当前行程</h3>
                            <p>{{ currentTrip.destination }}</p>
                            <p>{{ currentTrip.dates }}</p>
                        </div>
                    </div>
                    <div class="tw-timeline-container">
                        <div v-for="(item, index) in timelineItems" :key="index" class="tw-timeline-item"
                            draggable="true" @dragstart="handleDragStart($event, index)">
                            <i :class="item.icon"></i>
                            <h4>{{ item.name }}</h4>
                        </div>
                    </div>
                </section>
            </main>

            <!-- 预算跟踪器 -->
            <aside class="tw-glass-card tw-budget-tracker">
                <div class="tw-section-title">
                    <h2>预算跟踪</h2>
                    <a href="#"><i class="fas fa-sync-alt"></i></a>
                </div>
                <div class="tw-budget-overview">
                    <div class="tw-budget-total">
                        <h3>总预算</h3>
                        <div class="tw-amount">¥{{ budget.total }}</div>
                        <div class="tw-remaining">剩余 ¥{{ budget.remaining }}</div>
                    </div>
                    <div class="tw-budget-total">
                        <h3>已花费</h3>
                        <div class="tw-amount" style="color: var(--accent-orange);">¥{{ budget.spent }}</div>
                        <div class="tw-remaining">{{ budget.spentPercentage }}%</div>
                    </div>
                </div>
                <div class="tw-progress-bars">
                    <div v-for="category in budget.categories" :key="category.name" class="tw-progress-item"
                        :class="category.class">
                        <div class="tw-progress-header">
                            <span>{{ category.name }}</span>
                            <span>¥{{ category.spent }} / ¥{{ category.total }}</span>
                        </div>
                        <div class="tw-progress-bar">
                            <div class="tw-progress-fill" :style="{ width: category.percentage + '%' }"></div>
                        </div>
                    </div>
                </div>
                <div class="tw-budget-categories">
                    <div v-for="item in budget.items" :key="item.name" class="tw-category-item">
                        <div class="tw-category-icon">
                            <i :class="item.icon"></i>
                        </div>
                        <div class="tw-category-details">
                            <div class="tw-category-name">{{ item.name }}</div>
                            <div class="tw-category-amount">{{ item.description }}</div>
                        </div>
                        <div class="tw-category-percent">¥{{ item.amount }}</div>
                    </div>
                </div>
            </aside>

            <!-- 社区分享 -->
            <section class="tw-glass-card tw-community">
                <div class="tw-section-title">
                    <h2>社区分享</h2>
                    <a href="#">发布新游记 <i class="fas fa-plus-circle"></i></a>
                </div>
                <div class="tw-community-posts">
                    <div v-for="post in communityPosts" :key="post.id" class="tw-post-card">
                        <img :src="post.image" :alt="post.title">
                        <div class="tw-post-content">
                            <div class="tw-post-user">
                                <div class="tw-user-avatar-sm">{{ post.userInitials }}</div>
                                <div>{{ post.userName }} · {{ post.time }}</div>
                            </div>
                            <div class="tw-post-title">{{ post.title }}</div>
                            <p style="font-size: 14px; opacity: 0.9;">{{ post.excerpt }}</p>
                            <div class="tw-post-stats">
                                <div class="tw-post-stat"><i class="fas fa-heart"></i> {{ post.likes }}</div>
                                <div class="tw-post-stat"><i class="fas fa-comment"></i> {{ post.comments }}</div>
                                <div class="tw-post-stat"><i class="fas fa-bookmark"></i> 收藏</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
    <!-- 背景样式 -->
    <div class="background-style">
        <BackgroundStyle />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import mapboxgl from 'mapbox-gl';
import BackgroundStyle from '@/components/ThemeComponents/BackgroundStyle.vue';

// 导航项数据
const navItems = ref([
    { icon: 'fas fa-home', text: '首页' },
    { icon: 'fas fa-map-marked-alt', text: '目的地' },
    { icon: 'fas fa-route', text: '行程' },
    { icon: 'fas fa-users', text: '社区' }
]);

// 用户数据
const userInitials = ref('JS');

// 目的地推荐数据
const destinations = ref([
    {
        id: 1,
        name: '京都, 日本',
        image: 'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        tags: ['古寺', '樱花', '文化'],
        budget: '¥4,200起'
    },
    {
        id: 2,
        name: '巴黎, 法国',
        image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        tags: ['艺术', '美食', '浪漫'],
        budget: '¥6,800起'
    },
    {
        id: 3,
        name: '巴厘岛, 印尼',
        image: 'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        tags: ['海滩', '冲浪', '度假'],
        budget: '¥3,500起'
    },
    {
        id: 4,
        name: '皇后镇, 新西兰',
        image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        tags: ['冒险', '自然', '户外'],
        budget: '¥8,200起'
    },
    {
        id: 5,
        name: '罗马, 意大利',
        image: 'https://images.pexels.com/photos/373290/pexels-photo-373290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        tags: ['历史', '建筑', '美食'],
        budget: '¥5,600起'
    }
]);

// 行程数据
const currentTrip = ref({
    destination: '东京 5日游',
    dates: '2023.11.15 - 2023.11.20'
});

const timelineItems = ref([
    { icon: 'fas fa-landmark', name: '浅草寺' },
    { icon: 'fas fa-shopping-bag', name: '涩谷购物' },
    { icon: 'fas fa-mountain', name: '富士山' },
    { icon: 'fas fa-utensils', name: '寿司体验' },
    { icon: 'fas fa-theater-masks', name: '歌舞伎町' },
    { icon: 'fas fa-plus-circle', name: '添加景点' }
]);

// 预算数据
const budget = ref({
    total: '12,800',
    remaining: '3,420',
    spent: '9,380',
    spentPercentage: 73,
    categories: [
        {
            name: '交通',
            spent: '2,800',
            total: '4,000',
            percentage: 70,
            class: 'transport'
        },
        {
            name: '住宿',
            spent: '4,200',
            total: '5,000',
            percentage: 84,
            class: 'accommodation'
        },
        {
            name: '餐饮',
            spent: '1,200',
            total: '2,000',
            percentage: 60,
            class: 'food'
        },
        {
            name: '活动',
            spent: '1,180',
            total: '1,800',
            percentage: 65,
            class: 'activities'
        }
    ],
    items: [
        {
            icon: 'fas fa-plane',
            name: '机票',
            description: '上海 → 东京',
            amount: '2,400'
        },
        {
            icon: 'fas fa-hotel',
            name: '酒店',
            description: '新宿格兰贝尔酒店',
            amount: '3,800'
        },
        {
            icon: 'fas fa-train',
            name: 'JR通票',
            description: '7日通行证',
            amount: '1,600'
        },
        {
            icon: 'fas fa-ticket-alt',
            name: '景点门票',
            description: '迪士尼乐园',
            amount: '720'
        }
    ]
});

// 社区帖子数据
const communityPosts = ref([
    {
        id: 1,
        title: '京都红叶季深度游',
        image: 'https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        userInitials: 'TL',
        userName: '谭琳',
        time: '3天前',
        excerpt: '探索古都最美的季节，感受传统与现代的交融...',
        likes: 248,
        comments: 42
    },
    {
        id: 2,
        title: '追逐冰岛极光的奇幻之旅',
        image: 'https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        userInitials: 'MW',
        userName: '王明',
        time: '1周前',
        excerpt: '在世界的尽头，遇见最美的极光...',
        likes: 512,
        comments: 87
    },
    {
        id: 3,
        title: '意大利美食之旅：从北到南',
        image: 'https://images.pexels.com/photos/219998/pexels-photo-219998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        userInitials: 'CC',
        userName: '陈晨',
        time: '2周前',
        excerpt: '品尝最地道的意式风味，探索美食背后的文化...',
        likes: 367,
        comments: 63
    },
    {
        id: 4,
        title: '新西兰南岛自驾全攻略',
        image: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        userInitials: 'LJ',
        userName: '李静',
        time: '3天前',
        excerpt: '穿越山脉、湖泊与海岸线的终极自驾体验...',
        likes: 421,
        comments: 78
    }
]);

// 地图容器引用
const mapContainer = ref(null);

// 初始化地图
onMounted(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

    const map = new mapboxgl.Map({
        container: mapContainer.value,
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [139.6917, 35.6895], // 东京
        zoom: 11
    });

    // 添加标记
    new mapboxgl.Marker({ color: '#5d8bf4' })
        .setLngLat([139.6917, 35.6895])
        .addTo(map);

    new mapboxgl.Marker({ color: '#ff9a76' })
        .setLngLat([139.8107, 35.7090])
        .setPopup(new mapboxgl.Popup().setHTML("<b>浅草寺</b><br>东京最古老的寺庙"))
        .addTo(map);

    new mapboxgl.Marker({ color: '#6dd6a0' })
        .setLngLat([139.7000, 35.6580])
        .setPopup(new mapboxgl.Popup().setHTML("<b>涩谷</b><br>购物和娱乐中心"))
        .addTo(map);
});

// 处理拖拽开始
const handleDragStart = (event, index) => {
    event.dataTransfer.setData('text/plain', index);
};
</script>
<style>
/* 引入样式文件travel-world.css */
@import "@/css/TravelServiceoptions/TravelWorld.css";
</style>