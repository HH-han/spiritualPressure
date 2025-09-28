<template>
    <HomeHeader></HomeHeader>
    <div class="hero-image-container">
        <img src="@/assets/scenery/风景1.webp" alt="旅行英雄图" class="hero-image">
        <div class="overlay-content">
            <h1 class="title">探索世界奇境</h1>
            <p class="subtitle">发现地球上最令人惊叹的旅行目的地</p>
            <button class="explore-btn">开始探索</button>
        </div>
    </div>
    <div class="travel-container">
        <div class="destinations-grid">
            <div v-for="(destination, index) in cards" :key="destination.id" class="destination-card"
                :class="{ 'card-large': index % 3 === 0, 'card-wide': index % 5 === 0 }"
                @mouseenter="hoverCard = destination.id" @mouseleave="hoverCard = null">

                <div class="card-image" :style="{ backgroundImage: `url(${destination.hotelImage})` }">
                    <div class="image-overlay"></div>
                </div>

                <div class="card-content" :class="{ 'content-visible': hoverCard === destination.id }">
                    <div class="content-wrapper">
                        <h2 class="hotel-name">{{ destination.hotelName }}</h2>
                        <div class="location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>{{ destination.hotelDescription }}</span>
                        </div>
                        <div class="price-rating">
                            <span class="price">{{ destination.hotelPrice }}￥</span>
                            <div class="rating">
                                <i class="fas fa-star" v-for="i in 5" :key="i"></i>
                            </div>
                        </div>
                        <div class="card-footer">
                            <button class="book-btn" @click="OrderDetails(destination.id)">
                                <span>立即预订</span>
                                <i class="fas fa-arrow-right"></i>
                            </button>
                            <div class="tags">
                                <span v-if="index % 2 === 0" class="tag">热门</span>
                                <span v-if="index % 3 === 0" class="tag">特惠</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card-corner">
                    <i class="fas fa-heart"></i>
                </div>
            </div>
        </div>
    </div>
    <!-- 分页 -->
    <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[14, 28, 56, 112]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '../../utils/request'
import { useRouter } from 'vue-router';
import { ElMessage } from "element-plus";
import HomeHeader from '../../components/NavigationComponent/HomeHeader.vue';

const router = useRouter();
// 卡片数据
const cards = ref([])
// 分页相关
const currentPage = ref(1)
const pageSize = ref(14)
const total = ref(0)
// 加载状态
const isLoading = ref(true)
// 跳转购物车
const OrderDetails = (cardId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        ElMessage.error('请先登录');
        // router.push('/login');
        return;
    }
    const card = cards.value.find((c) => c.id === cardId);
    if (card) {
        router.push({
            name: 'orderdetails',
            query: {
                item: JSON.stringify({
                    id: card.id,
                    name: card.hotelName,
                    price: card.hotelPrice,
                    image: card.hotelImage,
                    rating: card.sales,
                    sales: card.evaluation,
                    details: card.hotelDescription
                }),
            },
        });
    }
};
// 获取卡片数据
const fetchCards = async () => {
    try {
        const res = await request.get('/api/public/hotel', {
            params: {
                page: currentPage.value,
                pageSize: pageSize.value
            }
        })
        // 为 hotel_name 设置默认值
        cards.value = Array.isArray(res.data?.list) 
        ? res.data.list.map(card => ({
            ...card,
            hotel_name: card.hotel_name || '未知酒店'
        })) 
        : []
        total.value = res.data.total
    } catch (error) {
        console.error('获取数据失败:', error)
    } finally {
        isLoading.value = false // 数据加载完成
    }
}

// 分页方法
const handleSizeChange = (newSize) => {
    pageSize.value = newSize
    currentPage.value = 1
    fetchCards()
}

const handleCurrentChange = (newPage) => {
    currentPage.value = newPage
    fetchCards()
}

// 初始化加载数据
onMounted(() => {
    fetchCards()
})
</script>

<style  scoped>
/* 样式tf */
@import "@/css/TravelServiceoptions/TravelFreely.css";
</style>