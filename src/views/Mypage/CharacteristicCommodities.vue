<template>
    <div class="cc-container-all">
        <div>
            <!-- 使用Carousel组件 -->
            <Carousel :items="mediaList.images" :interval="5000" :showArrows="true" :showIndicators="true"
                aspect-ratio="16/9" />
        </div>
        <!-- 纪念品推荐 -->
        <div>
            <SouvenirRecommend />
        </div>
        <!-- 搜索区域 -->
        <div class="search_background">
            <div class="search_flex">
                <input type="text" placeholder="🔍搜索景点" class="search_input_Browse" v-model="searchTitle"
                    @input="handleSearch">
            </div>
        </div>
        <!-- 提示区域 -->
        <h1 class="action-H1-BH-title">小物件点推荐🧺</h1>
        <div class="cc-container-bottom">
            <!-- 图片列表 -->
            <div class="cc-card-container">
                <div v-for="item in filteredList" :key="item.id" class="cc-card">
                    <div @click="() => showDetail(item)" class="cc-card-image-wrapper">
                        <div class="cc-image-container">
                            <img :src="item.image" :alt="item.title" class="cc-image-main">
                            <div class="cc-image-hover-effect"></div>
                        </div>
                    </div>
                    <div class="cc-content">
                        <h2 class="cc-title">{{ item.title }}</h2>
                        <p class="cc-description">{{ item.description }}</p>
                    </div>
                </div>
            </div>
            <!-- 分页 -->
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[12, 24, 58, 116]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="filteredTotal">
                </el-pagination>
            </div>
            <!-- 详情模态框 -->
            <div v-if="currentImage" class="cc-image-enlarged" @click.self="closeDetail">
                <div class="cc-enlarged-image">
                    <div class="cc-full-image-img">
                        <img :src="currentImage.image" :alt="currentImage.title" class="cc-enlarged-img">
                        <div class="cc-image-overlay">
                            <span class="cc-close-icon" @click="closeDetail">×</span>
                        </div>
                    </div>
                    <div class="cc-content-center">
                        <div class="cc-price-box">
                            <p class="cc-price-label">珍藏版画价格:</p>
                            <p class="cc-price">¥ {{ formatPrice(currentImage.price) }}</p>
                            <p v-if="currentImage.frameIncluded" class="cc-discount">(含实木框装裱)</p>
                        </div>
                        <!-- 按钮 -->
                        <div class="btn-container-collection">
                            <button @click="OrderDetails(currentImage.id)" class="btn pay">
                                <span class="cc-icon">前往购买</span>
                            </button>
                            <TavoriteBtn />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <HomeFooter />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import HomeFooter from '@/components/DisplayBox/HomeFooter.vue';
import SouvenirRecommend from '@/views/Mypage/SouvenirRecommend.vue'
import TavoriteBtn from '@/views/Mypage/TavoriteBtn.vue'
import Carousel from '@/views/Mypage/components/Carousel.vue'

import { getCarouselList } from '@/api/carousel'
import request from '@/utils/request';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchTitle = ref('');
const rawImageList = ref([]);
const currentImage = ref(null);
const isEnlarged = ref(false);
const mediaList = ref({ images: [] });

// 分页相关
const currentPage = ref(1);
const pageSize = ref(12);
const total = ref(0);
// 跳转购物车页面
const OrderDetails = (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        ElMessage.error('请先登录');
        return;
    }
    const item = rawImageList.value.find((c) => c.id === itemId);
    if (item) {
        router.push({
            name: 'itempurchase',
            query: {
                item: JSON.stringify({
                    id: item.id,
                    name: item.title,
                    price: item.price,
                    image: item.image,
                    rating: item.sales,
                    details: item.description
                }),
            },
        });
    }
};
// 搜索处理
const handleSearch = () => {
    currentPage.value = 1;
};

// 过滤后的列表
const filteredList = computed(() => {
    const filtered = rawImageList.value.filter(item =>
        item.title.toLowerCase().includes(searchTitle.value.toLowerCase())
    );
    // 分页处理
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filtered.slice(start, end);
});

// 过滤后的总数
const filteredTotal = computed(() => {
    return rawImageList.value.filter(item =>
        item.title.toLowerCase().includes(searchTitle.value.toLowerCase())
    ).length;
});

// 分页处理函数
const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    currentPage.value = 1;
};

const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
};

// 格式化价格显示
const formatPrice = (price) => {
    return price?.toFixed(2) || '0.00';
};

// 获取图片列表数据
const fetchImageList = async () => {
    try {
        const params = {
            page: currentPage.value,
            pageSize: pageSize.value,
        };

        const response = await request.get('/api/public/order', { params });

        if (response.data) {
            rawImageList.value = response.data.list || [];
            total.value = response.data.total || 0;
        } else {
            throw new Error('无效的响应数据');
        }
    } catch (error) {
        console.error('获取订单数据失败:', error);
        ElMessage.error('数据加载失败');
    }
};

// 显示详情
const showDetail = (item) => {
    currentImage.value = item;
    isEnlarged.value = true;
};

// 关闭详情
const closeDetail = () => {
    isEnlarged.value = false;
    currentImage.value = null;
};


// 获取图片背景
const fetchcarousel = async () => {
    try {
        const result = await getCarouselList()
        if (result.data && result.data.list) {
            const filteredList = result.data.list.filter(item => item.type === 'xc')
            mediaList.value.images = filteredList.map((item) => ({
                image: item.image || '默认图片链接',
                title: item.title || '默认标题',
                location: item.location || '默认位置',
                description: item.description || '默认描述'
            }))
        }
    } catch (error) {
        console.error('获取轮播图数据失败：', error)
    }
}
// 初始化加载数据
onMounted(() => {
    fetchImageList();
    fetchcarousel();
});
</script>
<style scoped>
@import '@/css/Mypage/CharacteristicCommodities.css';
@import "@/css/Mypage/BrowseHotel.css";
@import "@/css/Btn/btn.css";
</style>