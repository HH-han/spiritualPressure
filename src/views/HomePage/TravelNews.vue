<template>
    <!-- 安全提示 -->
    <div class="recommend-left">
        <div class="recommend-left_button">
            <button @click="navigateTo('/SafetyTips')">
                <span>旅游知识安全提示</span>
                <svg t="1754492983638" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="53974">
                    <path
                        d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m187.733333-546.133333l-256-256C435.2 213.333333 426.666667 213.333333 409.6 213.333333c-8.533333 0-25.6 0-34.133333 8.533334-17.066667 17.066667-17.066667 42.666667 0 59.733333l230.4 230.4-230.4 230.4c-17.066667 17.066667-17.066667 42.666667 0 59.733333 17.066667 17.066667 42.666667 17.066667 59.733333 0l256-264.533333c25.6-17.066667 25.6-42.666667 8.533333-59.733333z"
                        fill="#1296db" p-id="53975"></path>
                </svg>
            </button>
        </div>
        <!-- 攻略/当地游推荐 -->
        <div class="recommend-left_boxshadow">
            <div class="recommend-left_tj">
                <h3>攻略推荐</h3>
                <button @click="navigateTo('/RecommendAtion')">更多</button>
            </div>
            <div class="recommend-left_list">
                <div class="recommend-left_imga">
                    <img :src="currentImage" alt="旅游攻略推荐" v-if="currentImage">
                    <img src="@/assets/scenery/风景1.webp" alt="默认图片" v-else>
                </div>
                <div class="recommend-left_js">
                    <div>
                        <h3>{{ currentNewsItem?.title || '秋日旅行好去处' }}</h3>
                    </div>
                    <div class="recommend-left_content">
                        <p>{{ currentNewsItem?.created_at ? formatDate(currentNewsItem.created_at) : '2024-12-1' }}
                        </p>
                        <p>{{ currentNewsItem?.content || '秋天是旅行的绝佳季节，推荐几个适合秋游的地方：北京香山、南京栖霞山、长沙岳麓山等，漫山红叶，美不胜收。' }}</p>
                    </div>
                </div>
                <div class="recommend-left_zx">
                    <h3>旅游网最新资讯</h3>
                    <div>
                        <ul>
                            <li v-for="(item, index) in topNews" :key="index">
                                <p>
                                    <span>{{ item.created_at ? formatDate(item.created_at) : '2024-12-1' }}</span>
                                    <button>
                                        <span>{{ item.title ? item.title.substring(0, 10) : '未设置' }}...</span>
                                    </button>
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div  class="recommend-left_list-news">
                        <!-- 更多 -->
                        <button  @click="showNewslist" class="recommend-left_more-button">更多</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 新闻资讯列表 -->
    <div v-if="Newslist" class="travel-news-container">
        <Newsinformationlist @close="closeNewslist" />
    </div>
</template>
<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import Newsinformationlist from '@/views/Mypage/Newsinformationlist.vue';

import { getTravelNews } from '@/api/travel';

const NewsItems = ref([]);
const currentIndex = ref(0);

const Newslist = ref(false);
 // 点击更多按钮显示全部数据
 const showNewslist = () => {
    Newslist.value = true;
   // 这里可以跳转到专门的资讯页面或者显示模态框
   console.log('显示全部资讯数据:', NewsItems.value);
 };
// 关闭新闻列表
const closeNewslist = () => {
    Newslist.value = false;
};

// 获取数据
const fetchData = async () => {
    try {
        const response = await getTravelNews();
        NewsItems.value = response.data.list.map(item => ({
            id: item.id,
            coverImage: item.coverImage,
            title: item.title,
            content: item.content,
            created_at: item.created_at,
            location: item.location,
            updated_at: item.updated_at
        }));
    } catch (error) {
        console.error('获取景点数据失败:', error);
    }
};

// 当前显示的新闻项
const currentNewsItem = computed(() => {
    return NewsItems.value.length > 0 ? NewsItems.value[currentIndex.value] : null;
});

// 前七条最新资讯
 const topNews = computed(() => {
     return NewsItems.value.slice(0, 7);
 });

// 当前显示的图片（取前5张图片轮播）
const currentImage = computed(() => {
    if (!currentNewsItem.value?.coverImage) return null;

    const images = currentNewsItem.value.coverImage;
    if (Array.isArray(images) && images.length > 0) {
        // 取前5张图片轮播显示
        const imageIndex = currentIndex.value % Math.min(5, images.length);
        return images[imageIndex];
    }
    return images;
});

// 格式化日期
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
};

// 图片轮播定时器
let imageCarouselTimer = null;

// 启动图片轮播
const startImageCarousel = () => {
    if (NewsItems.value.length > 0) {
        imageCarouselTimer = setInterval(() => {
            currentIndex.value = (currentIndex.value + 1) % NewsItems.value.length;
        }, 3000);
    }
};

// 停止图片轮播
const stopImageCarousel = () => {
    if (imageCarouselTimer) {
        clearInterval(imageCarouselTimer);
        imageCarouselTimer = null;
    }
};

// 监听NewsItems变化，当有数据时启动轮播
watch(NewsItems, (newValue) => {
    if (newValue.length > 0) {
        stopImageCarousel();
        startImageCarousel();
    }
}, { deep: true });

// 初始化时获取数据
onMounted(() => {
    fetchData();
});

// 组件卸载时清理定时器
onUnmounted(() => {
    stopImageCarousel();
});
</script>
<style>
@import "@/css/Home/HomeViews.css";
</style>