<template>
  <!-- 顶部导航 -->
  <Home_2 />
  <!-- 搜索区域 -->
  <div class="food-container-all">
    <div class="food-search_background">
      <div>
        <img src="../../assets/pagebackground/面条.jpg" alt="">
      </div>
      <!-- 搜索框 -->
      <div class="food-search-box">
        <input type="text" v-model="searchQuery" placeholder="搜索美食..." class="food-search-input" @input="searchFoods">
      </div>
    </div>
    <!-- 美食推荐 -->
    <div>
      <FoodRecommend />
    </div>
    <!-- 标题 -->
    <div class="food-container-h1">
      <h1 class="action-H1-BH-title">美食推荐🍛</h1>
    </div>

    <div class="food-container">
      <!-- 右侧内容区 -->
      <div class="food-main">
        <!-- 加载动画 -->
        <div v-if="loading" class="food-loading">
          <div class="food-loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <!-- 美食卡片 -->
        <div v-else class="food-card-container">
          <div v-for="food in paginatedFoods" :key="food.id" class="food-card" @click="openDetail(food)">
            <img :src="food.image" :alt="food.name" class="food-card-image">
            <div class="food-card-content">
              <h3 class="food-card-title">{{ food.name }}</h3>
              <p class="food-card-desc">{{ food.description }}</p>
              <div class="food-card-stats">
                <span class="food-card-sales">
                  <svg t="1745755200324" class="icon" viewBox="0 0 1331 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="5802" width="16" height="16">
                    <path
                      d="M330.67008 602.84928V1024h198.4V602.84928l-99.20512-82.5856-99.19488 82.5856zM0 1024h198.4V701.93152L0 858.83904V1024z m992-520.25344V1024h198.4V338.5856L992 503.74656z m-330.65984 206.4384V1024h198.38976V611.10272L702.6688 743.2192l-41.32864-33.03424zM1322.67008 0H942.3872l157.07136 148.64384-405.07392 330.32192L429.8752 256 0 594.5856V743.2192l429.8752-338.5856L702.6688 627.6096l487.7312-396.3904 132.27008 123.87328V0z"
                      fill="#d81e06" p-id="5803"></path>
                  </svg> 销量:{{ food.sales }}
                </span>
                <span class="food-card-rating">
                  <svg t="1745755283144" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="6920" width="16" height="16">
                    <path
                      d="M264.107 948.053a34.133 34.133 0 0 1-50.774-35.84l46.934-276.053L61.44 440.747A34.133 34.133 0 0 1 80.213 384l277.334-42.667 124.16-250.88a34.133 34.133 0 0 1 61.013 0l123.733 250.88L943.787 384a34.133 34.133 0 0 1 18.773 58.027L762.453 637.44l48.214 274.773a34.133 34.133 0 0 1-49.494 35.84l-247.893-128z"
                      fill="#d81e06" p-id="6921"></path>
                  </svg> 评分:{{ food.rating }}
                </span>
              </div>
              <div class="food-card-footer">
                <span class="food-card-price">¥{{ food.price }}</span>
                <div class="food-card-buttons">
                  <button @click="OrderDetails(food.id)" class="btn pay">前往购买</button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="paginatedFoods.length === 0" class="food-empty-state">
            <p>暂无美食数据</p>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="!loading" class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[12, 24, 48, 96]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="filteredFoods.length">
          </el-pagination>
        </div>
      </div>

      <!-- 美食详情弹窗 -->
      <div v-if="selectedFood" class="food-detail-modal" @click.self="closeDetail">
        <div class="food-detail-content" @click.stop>
          <button class="food-detail-close" @click="closeDetail">
            <i class="fas fa-times"></i>
          </button>
          <img :src="selectedFood.image" :alt="selectedFood.name" class="food-detail-image">
          <div class="food-detail-info">
            <h2>{{ selectedFood.name }}</h2>
            <p class="food-detail-desc">{{ selectedFood.description }}</p>
            <div class="food-detail-stats">
              <p><i class="fas fa-tag"></i> 价格: ¥{{ selectedFood.price }}</p>
              <p><i class="fas fa-chart-line"></i> 销量: {{ selectedFood.sales }}</p>
              <p><i class="fas fa-star"></i> 评分: {{ selectedFood.rating }}</p>
            </div>
            <!-- 按钮 -->
            <div class="btn-container-collection">
              <TavoriteBtn :foodId="selectedFood.id" />
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
import request from '@/utils/request';
import Home_2 from '../../components/NavigationComponent/HomeHeader.vue';
import HomeFooter from '@/components/DisplayBox/HomeFooter.vue';
import FoodRecommend from '@/views/Mypage/FoodRecommend.vue';
import TavoriteBtn from '@/views/Mypage/TavoriteBtn.vue'
import { useRouter } from 'vue-router';
import { ElMessage } from "element-plus";

const router = useRouter();
// 跳转购物车页面
const OrderDetails = (foodId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    ElMessage.error('请先登录');
    return;
  }
  const food = paginatedFoods.value.find((f) => f.id === foodId);
  if (food) {
    router.push({
      name: 'itempurchase',
      query: {
        item: JSON.stringify({
          id: food.id,
          name: food.name,
          price: food.price,
          image: food.image,
          rating: food.rating,
          details: food.description
        }),
      },
    });
  }
};
// 数据定义
const searchQuery = ref(''); // 搜索关键词
const loading = ref(false); // 加载状态
const selectedFood = ref(null); // 选中的美食详情
const currentPage = ref(1); // 当前页码
const pageSize = ref(12); // 当前每页显示的数量
const foods = ref([]); // 美食列表
const total = ref(0); // 总数量

// 计算属性：搜索过滤后的美食列表
const filteredFoods = computed(() => {
  let result = Array.isArray(foods.value) ? foods.value : []; // 确保是数组
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase(); // 确保 searchQuery 是字符串
    result = result.filter(
      (food) =>
        (food.name?.toLowerCase() || '').includes(query) ||
        (food.description?.toLowerCase() || '').includes(query)
    );
  }
  return result;
});

// 计算属性：分页后的美食列表
const paginatedFoods = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredFoods.value.slice(start, end);
});

// 切换分页
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
};

// 切换每页显示数量
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // 重置到第一页
};

// 模拟加载状态
const simulateLoading = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 800);
};

// 获取所有美食数据
const fetchAllFoods = () => {
  simulateLoading();
  request
    .get('/api/public/foods', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        keyword: searchQuery.value,
      },
    })
    .then((response) => {
      if (response.code === '0') {
        foods.value = response.data.list; // 解析 list 字段
        total.value = response.data.total; // 解析 total 字段
      } else {
        console.error('Error fetching all foods:', response.msg);
      }
    })
    .catch((error) => {
      console.error('Error fetching all foods:', error);
    })
    .finally(() => {
      loading.value = false;
    });
};

// 打开美食详情弹窗
const openDetail = (food) => {
  request
    .get(`/api/public/foods/${food.id}`)
    .then((response) => {
      if (response.code === '0') {
        selectedFood.value = response.data;
      } else {
        console.error('Error fetching food details:', response.msg);
      }
    })
    .catch((error) => {
      console.error('Error fetching food details:', error);
    });
};

// 关闭美食详情弹窗
const closeDetail = () => {
  selectedFood.value = null;
};

// 初始化加载美食数据
onMounted(() => {
  fetchAllFoods(); // 默认加载所有美食
});
</script>

<style scoped>
@import '@/css/Mypage/FoodRecommendation.css';
@import "@/css/Btn/btn.css";
</style>