<template>
  <div>
    <Home_2 />
  </div>
  <div class="mydestination-all">
    <header class="main-section">
      <!-- 主视觉区 -->
      <div class="hero-section">
        <!-- 内容区 -->
        <div class="content-section">
          <h1>"神仙海岛的三款热门玩法，去普吉一定不能错过"</h1>
          <p>
            "普吉岛是泰国最受欢迎的旅游胜地之一，拥有丰富的自然景观和多样的活动选择。无论是潜水、冲浪还是沙滩度假，这里都能满足你的需求。"
          </p>
        </div>
        <!-- 轮播图容器 -->
        <div class="carousel">
          <!-- 图片轮播 -->
          <div v-for="(item, index) in mediaList.images" :key="index"
            :class="['carousel-item', { active: currentIndex === index }]">
            <img :src="item" alt="普吉岛风景" />
          </div>

          <!-- 视频轮播 -->
          <div v-for="(video, index) in mediaList.videos" :key="'video-' + index"
            :class="['carousel-item', { active: currentIndex === mediaList.images.length + index }]">
            <video :src="video.url" controls></video>
          </div>
        </div>

        <!-- 轮播切换按钮 -->
        <div class="carousel-buttons">
          <button @click="prevSlide">‹</button>
          <button @click="nextSlide">›</button>
        </div>
      </div>
    </header>
    <main class="destination-page">
      <!-- 互动按钮 -->
      <div class="action-buttons">
        <button @click="readMore">阅读全文</button>
        <button @click="bookTrip">预订行程</button>
        <button @click="viewMoreRecommendations">查看更多推荐</button>
        <button @click="share">分享</button>
      </div>
      <h1 class="page-title">探索世界目的地 🌍</h1>
      <div class="controls">
        <div class="search-container">
          <input type="text" v-model="searchQuery" placeholder="输入城市名称进行搜索..." class="search-input"
            @input="handleSearchInput" />
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="category-tabs">
          <span v-for="category in categories" :key="category" :class="{ active: activeCategory === category }"
            @click="setActiveCategory(category)">
            {{ category }}
          </span>
        </div>
      </div>

      <div v-if="paginatedDestinations.length" class="destination-list">
        <div v-for="destination in paginatedDestinations" :key="destination.name" class="destination-card"
          @click="showDestinationDetail(destination)">
          <div class="image-container">
            <img :src="destination.image || defaultImage" :alt="destination.name" class="destination-image"
              @error="handleImageError" />
            <div class="image-overlay"></div>
            <span class="destination-category">{{ destination.category }}</span>
          </div>
          <div class="card-content">
            <h3 class="destination-name">{{ destination.name }}</h3>
            <ul class="city-list">
              <li v-for="city in destination.cities" :key="city" class="city-item">
                <svg t="1748482186834" class="icon" viewBox="0 0 1028 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="13371" width="16" height="16">
                  <path
                    d="M491.492169 512m-470.460777 0a470.460777 470.460777 0 1 0 940.921554 0 470.460777 470.460777 0 1 0-940.921554 0Z"
                    fill="#70C4FF" p-id="13372"></path>
                  <path
                    d="M485.261285 57.145509s-47.072247 265.851027 55.3884 285.237382 146.77469-8.307845 199.38827 44.309889 170.842516 34.394477 174.464736-19.386355c0 0-72.004089-268.621693-429.241406-310.160916zM194.054717 864.796774s108.666607 16.528457 208.477052-25.106306c105.704861-44.093885 201.465231-149.807054 147.634552-275.558743C465.501077 366.388408 383.635576 471.017403 412.364103 315.785327c28.724373-155.232076-61.527897-217.100595-124.480589-217.100595s-337.672343 410.465677-93.828797 766.112042z"
                    fill="#A3D9FF" opacity=".26" p-id="13373"></path>
                  <path
                    d="M171.233068 856.285387s94.27742 15.63121 180.878392-23.739665c91.71445-41.692918 174.79705-141.665366 128.090348-260.546468-73.457962-186.972196-144.485879-88.038229-119.562345-234.81292s-53.390363-205.274378-108.00198-205.274378c-54.619924 0-292.971985 388.105114-81.404415 724.373431z"
                    fill="#A3D9FF" opacity=".26" p-id="13374"></path>
                  <path
                    d="M185.073937 147.364547c149.416585 22.929651 95.585906 150.558913 137.710832 299.792726 27.336963 96.815467 68.614488 82.667208 105.580243 154.471908 56.464266 74.662599-216.003959 324.005939-362.093253 115.703352-144.801577-357.540553 118.802178-569.967986 118.802178-569.967986z"
                    fill="#9EE3C3" p-id="13375"></path>
                  <path
                    d="M210.267476 815.165711c-62.587147 0-117.086608-30.535483-157.595658-88.299927l-1.088328-1.549413-0.710321-1.752955c-77.100952-190.365951-39.524571-340.318392 5.574564-432.589467 48.862588-99.972448 115.395961-154.284982 118.204013-156.54887l5.703335-4.594238 7.244441 1.113251c116.463519 17.870174 123.40057 95.747909 131.425947 185.925408 3.402062 38.199469 7.256902 81.499955 19.756054 125.772459 14.555344 51.546022 32.479518 68.020478 53.240823 87.099443 15.84306 14.559498 33.779696 31.042261 50.511695 63.106388 14.061027 19.768516 13.288397 47.711951-2.234811 78.912061-34.311398 68.971726-132.015804 143.405859-230.031754 143.40586z m-129.307447-105.850248c34.340476 48.189653 77.836196 72.61887 129.307447 72.618869 90.106882 0 174.211347-72.585638 200.277209-124.97906 9.790795-19.685438 11.456518-36.201433 4.569315-45.30683l-0.864016-1.142329-0.65632-1.275254c-14.20226-27.586198-28.707757-40.916135-44.060654-55.022855-22.427026-20.615916-45.622529-41.925538-62.736688-102.539571-13.342398-47.263328-17.342626-92.204613-20.87346-131.857956-7.668141-86.110809-12.382842-139.056703-95.884988-154.750221-16.445378 14.85858-66.662145 64.065944-104.363144 141.78583-60.39803 124.517975-61.980675 259.927534-4.714701 402.469377z"
                    fill="#6E6E96" p-id="13376"></path>
                  <path
                    d="M531.506902 43.250639s-73.703043 251.225066 88.258387 251.225066c164.578401 0 195.433736 148.984577 298.359623 19.049888-109.759089-264.405462-386.61801-270.274954-386.61801-270.274954z"
                    fill="#9EE3C3" p-id="13377"></path>
                  <path
                    d="M838.552376 383.332257h-0.020769c-26.531102-0.004154-49.963377-13.155472-77.100952-28.383751-36.633441-20.557761-78.156048-43.861265-141.665366-43.861266-40.600436 0-71.792239-14.164875-92.707238-42.095848-56.181799-75.032298-13.342398-224.112416-11.493903-230.422224l3.580681-12.204223 12.71931 0.270005c2.953439 0.062309 73.325036 1.939882 158.181361 37.256529 78.558978 32.695522 184.558767 101.438782 243.432308 243.257843l3.746838 9.026473-6.06888 7.659833c-32.595828 41.148754-61.158198 59.496629-92.60339 59.496629z m-294.425858-322.55622c-3.41037 14.227184-8.573696 38.83502-11.149127 66.529219-5.088555 54.82762 2.068653 96.944238 20.698994 121.80131 14.501343 19.34897 36.1142 28.75345 66.08475 28.75345 72.195169 0 119.732656 26.676489 157.932126 48.110728 24.022133 13.479478 42.99725 24.130135 60.8425 24.134289h0.012461c11.822063 0 30.6601-4.270232 60.335722-39.304413-44.135424-100.321377-118.266322-172.877938-220.465272-215.738108-58.719846-24.628605-110.913879-32.076588-134.292154-34.286475z"
                    fill="#6E6E96" p-id="13378"></path>
                  <path
                    d="M487.338246 37.385301C227.510407 37.385301 21.031392 248.018238 21.031392 507.846078s206.479015 470.460777 466.306854 470.460777 470.460777-210.632938 470.460778-470.460777S747.166086 37.385301 487.338246 37.385301z m339.840691 523.921757c-16.607381 57.984601-116.833218 40.068734-156.64441 83.186447-32.392286 35.084028-1.050942 134.304616-44.538354 155.290231-50.05061 24.142596-106.178408 37.65946-165.467341 37.65946-65.665204 0 80.062698-119.778349 26.119863-149.001193-19.191121-10.401421-29.040071 46.889475-38.079005-80.357626-3.318984-46.727472-70.550216-68.394331-114.573485-175.374446-11.057741-26.871723-31.715197-216.074576-39.815345-205.26607-49.847068 66.462757-8.307845 274.76119 38.768557 383.544107 29.754545 68.755722-171.735609 188.259912-171.73561 81.429339 0-211.584186-95.498674-86.966517-82.027503-236.316639C98.10742 246.356669 249.920818 74.770601 460.528832 74.770601c88.848244 0 179.1919 25.550776 243.702313 76.681406 30.506405 24.163366 55.234705 54.063299 71.302076 89.666566 28.196825 62.487453-197.224077 22.327332-176.728624 32.583367 41.796766 20.919153 254.959442 98.663962 232.411952 92.536927-294.151699-79.933927-11.23636 67.974784 10.642349 89.870109 36.500515 36.492207-5.113478 71.783931-14.679961 105.198082z"
                    fill="#6E6E96" opacity=".2" p-id="13379"></path>
                  <path
                    d="M487.948873 994.926698c-192.563376 0-375.306879-114.922414-451.996592-304.067112-48.883358-120.567595-47.886416-252.957252 2.799743-372.781294C89.442338 198.254249 183.761297 105.343469 304.328892 56.460112s252.957252-47.894724 372.77714 2.799743c119.824042 50.690314 212.730668 145.005119 261.609872 265.576868a487.363087 487.363087 0 0 1 33.243841 133.095824 16.615689 16.615689 0 1 1-33.05276 3.414525 454.189863 454.189863 0 0 0-30.98826-124.023658c-45.547758-112.346982-132.115499-200.231516-243.764622-247.461613-111.644969-47.23425-234.999846-48.160575-347.342675-2.608663-112.338674 45.551912-200.219054 132.123806-247.44915 243.772929-47.23425 111.644969-48.160575 235.004-2.608664 347.346829 94.032339 231.909328 359.206276 344.090153 591.115604 250.057814a16.615689 16.615689 0 0 1 12.486691 30.79718c-59.750018 24.225675-121.581152 35.698808-182.407036 35.698808z"
                    fill="#6E6E96" p-id="13380"></path>
                  <path
                    d="M998.270688 675.797464c0 101.322473-140.107645 322.423294-183.433054 322.423294-22.090559 0-183.437208-221.10913-183.437209-322.423294 0-101.310011 82.127198-183.441362 183.437209-183.441363s183.433055 82.131352 183.433054 183.441363z"
                    fill="#FF9999" p-id="13381"></path>
                  <path
                    d="M674.36029 712.339518c0-94.647119 74.683369-171.390834 166.821519-171.390834 67.978938 0.008308 126.424625 41.80092 152.403255 101.712942-17.525398-83.036907-91.203518-145.374818-179.461905-145.387281-101.310011 0-183.428901 82.127198-183.4289 183.441363 0 101.322473 161.34665 322.423294 183.4289 322.423294 2.899438 0 6.255807-1.021865 9.952798-2.903591-44.388814-47.155326-149.715667-207.687807-149.715667-287.895893z"
                    fill="#FFADAD" p-id="13382"></path>
                  <path
                    d="M855.217912 485.369204c57.423822 23.893361 97.820716 80.523784 97.820717 146.60438 0 87.66853-121.244684 279.010653-158.742141 279.010652-19.124658 0-158.74214-191.337969-158.74214-279.010652 0-11.593597 1.283562-22.892266 3.634682-33.775543a182.776735 182.776735 0 0 0-11.942527 65.133502c0 101.326626 161.34665 322.423294 183.437209 322.423294 43.32541 0 183.428901-221.10913 183.4289-322.423294 0.004154-85.944652-59.110314-158.056743-138.8947-177.962339z"
                    fill="#6E6E96" opacity=".15" p-id="13383"></path>
                  <path
                    d="M814.837634 1014.836447c-8.266305 0-19.000041-3.260829-50.848163-42.232928-19.942981-24.404293-42.382469-55.903486-63.185312-88.702856-32.122281-50.640467-86.019423-145.021735-86.019423-208.107353 0-110.31156 89.741337-200.057052 200.052898-200.057052 110.307406 0 200.048744 89.745491 200.048744 200.057052 0 71.439156-59.554784 177.040168-77.807119 207.704422-20.682379 34.739252-42.951557 66.504296-62.715919 89.433947-32.367363 37.559765-49.473215 41.904768-59.525706 41.904768z m0-505.864656c-91.988609 0-166.821519 74.841218-166.821519 166.825673 0 88.175309 137.444981 281.872705 168.794632 305.088977 12.748388-5.670104 49.261364-42.303545 93.646024-117.643234 43.915266-74.550443 71.202382-146.375914 71.202382-187.445743-0.004154-91.988609-74.841218-166.825673-166.821519-166.825673z"
                    fill="#6E6E96" p-id="13384"></path>
                </svg>
                {{ city }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else class="no-results">
        <img :src="defaultImage" alt="无结果" />
        <p>没有找到匹配的目的地 😞</p>
      </div>
      <!-- 详情页面 -->
      <div v-if="selectedDestination" class="destination-detail" @click.self="closeDetail">
        <div class="destination-detail-content" @click.stop>
          <!-- 关闭按钮 -->
          <div class="destination-detail-header-top">
            <h3>详细信息</h3>
            <button class="destination-detail-close" @click="closeDetail">×</button>
          </div>
          <div class="destination-detail-info-container">
            <div>
              <img :src="selectedDestination.image || defaultImage" :alt="selectedDestination.name"
                class="destination-detail-image" />
            </div>
            <div class="destination-detail-info-background">
              <h2 class="destination-detail-name">{{ selectedDestination.name }}</h2>
              <p class="destination-detail-description">描述:{{ selectedDestination.description }}</p>
              <p class="destination-detail-price">价格: {{ selectedDestination.price }}￥</p>
              <p class="destination-detail-s">评价: {{ selectedDestination.s }}</p>
              <p class="destination-detail-ww">销量: {{ selectedDestination.ww }}</p>
              <p class="destination-detail-xx">详细信息: {{ selectedDestination.xx }}</p>
            </div>
          </div>
          <div class="destination-detail-actions">
            <button @click="OrderDetails(selectedDestination.id)" class="pay-button-GM">前往购买</button>
          </div>
        </div>
      </div>
      <div v-if="totalPages > 1" class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">
          <svg t="1742108758930" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="2657" width="32" height="32" style="vertical-align: middle;">
            <path
              d="M755.498667 225.834667a42.666667 42.666667 0 0 1 0 60.330666L529.664 512l225.834667 225.834667a42.666667 42.666667 0 1 1-60.330667 60.330666l-256-256a42.666667 42.666667 0 0 1 0-60.330666l256-256a42.666667 42.666667 0 0 1 60.330667 0z m-256 0a42.666667 42.666667 0 0 1 0 60.330666L273.664 512l225.834667 225.834667a42.666667 42.666667 0 1 1-60.330667 60.330666l-256-256a42.666667 42.666667 0 0 1 0-60.330666l256-256a42.666667 42.666667 0 0 1 60.330667 0z"
              fill="#ffffff" p-id="2658"></path>
          </svg>

        </button>
        <span class="page-indicator">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">
          <svg t="1742108660346" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="2335" width="32" height="32" style="vertical-align: middle;">
            <path
              d="M524.501333 225.834667a42.666667 42.666667 0 0 1 60.330667 0l256 256a42.666667 42.666667 0 0 1 0 60.330666l-256 256a42.666667 42.666667 0 1 1-60.330667-60.330666L750.336 512 524.501333 286.165333a42.666667 42.666667 0 0 1 0-60.330666z m-256 0a42.666667 42.666667 0 0 1 60.330667 0l256 256a42.666667 42.666667 0 0 1 0 60.330666l-256 256a42.666667 42.666667 0 1 1-60.330667-60.330666L494.336 512 268.501333 286.165333a42.666667 42.666667 0 0 1 0-60.330666z"
              fill="#ffffff" p-id="2336"></path>
          </svg>
        </button>
      </div>
      <div>
        <HomeFooter />
      </div>
    </main>
  </div>
</template>

<script setup>
import Home_2 from '@/components/NavigationComponent/HomeHeader.vue';
import HomeFooter from '@/components/DisplayBox/HomeFooter.vue'
import { onBeforeUnmount } from 'vue';
import { ref, onMounted, computed, } from 'vue';
import request from '@/utils/request';
import { useRouter } from 'vue-router';
import { ElMessage } from "element-plus";

// 处理购买按钮点击
const router = useRouter();
// 跳转购物车页面
const OrderDetails = (destinationId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    ElMessage.error('请先登录');
    return;
  }
  const destination = destinations.value.find((d) => d.id === destinationId);
  if (destination) {
    router.push({
      name: 'orderdetails',
      query: {
        item: JSON.stringify({
          id: destination.id,
          name: destination.name,
          price: destination.price,
          image: destination.image,
          rating: destination.sales,
          sales: destination.ww,
          details: destination.xx
        }),
      },
    });
  }
};
// 默认图片
const defaultImage = new URL('@/assets/defaultimage/moren.webp', import.meta.url).href

// 媒体资源数据
const mediaList = ref({
  images: [
    new URL('@/assets/pagebackground/北京天坛.jpg', import.meta.url).href,
    new URL('@/assets/pagebackground/陕西兵马俑.jpg', import.meta.url).href,
    new URL('@/assets/pagebackground/埃菲尔铁塔.webp', import.meta.url).href,
    new URL('@/assets/pagebackground/北京故宫.webp', import.meta.url).href,
    new URL('@/assets/pagebackground/埃及金字塔.webp', import.meta.url).href,
  ],
  videos: [
    { url: 'https://example.com/phuket-video2.mp4' },
    { url: 'https://example.com/phuket-video2.mp4' },
  ],
});

// 当前轮播索引
const currentIndex = ref(0);

// 总轮播项数
const totalSlides = computed(() => {
  return mediaList.value.images.length + mediaList.value.videos.length;
});

// 切换到上一张
const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + totalSlides.value) % totalSlides.value;
};

// 切换到下一张
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % totalSlides.value;
};

// 自动播放定时器
let autoplayTimer;

// 启动自动播放
const startAutoplay = () => {
  autoplayTimer = setInterval(nextSlide, 3000); // 每3秒切换一次
};

// 停止自动播放
const stopAutoplay = () => {
  clearInterval(autoplayTimer);
};

// 组件挂载时启动自动播放
onMounted(() => {
  startAutoplay();
  fetchDestinations(); // 初始化时加载数据
});

// 组件卸载时停止自动播放
onBeforeUnmount(() => {
  stopAutoplay();
});

// 互动按钮事件
const readMore = () => {
  window.location.href = '/article';
};

const bookTrip = () => {
  window.location.href = '/booking';
};

const viewMoreRecommendations = () => {
  window.location.href = '/recommendations';
};

const share = () => {
  alert('分享功能即将推出！');
};

// 搜索关键词
const searchQuery = ref('');
// 当前分类
const activeCategory = ref('全部');
// 当前页码
const currentPage = ref(1);
// 每页大小
const pageSize = ref(10);
// 目的地数据
const destinations = ref([]);
// 总页数
const totalPages = ref(0);

// 获取目的地数据
const fetchDestinations = async () => {
  try {
    const res = await request.get('/api/public/destination/list', {
      params: {
        searchQuery: searchQuery.value,
        activeCategory: activeCategory.value,
        currentPage: currentPage.value,
        pageSize: pageSize.value,
      },
    });
    destinations.value = res.data.destinations;
    totalPages.value = res.data.totalPages;
  } catch (error) {
    console.error('获取目的地数据失败:', error);
  }
};

// 处理搜索输入
const handleSearchInput = () => {
  currentPage.value = 1;
  fetchDestinations();
};

// 设置当前分类
const setActiveCategory = (category) => {
  activeCategory.value = category;
  currentPage.value = 1;
  fetchDestinations();
};

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchDestinations();
  }
};

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchDestinations();
  }
};

// 处理图片加载错误
const handleImageError = (e) => {
  e.target.src = defaultImage;
};

// 计算分类列表
const categories = computed(() => {
  const allCategories = destinations.value.map((d) => d.category);
  return ['全部', ...new Set(allCategories)];
});

// 计算分页后的目的地数据
const paginatedDestinations = computed(() => {
  return destinations.value;
});
// 当前选中的目的地
const selectedDestination = ref(null);

// 显示目的地详情
const showDestinationDetail = (destination) => {
  selectedDestination.value = destination;
};
// 关闭详情框
const closeDetail = () => {
  selectedDestination.value = null;
};


</script>

<style scoped>
@import '@/css/Mypage/MyDestination.css';
</style>