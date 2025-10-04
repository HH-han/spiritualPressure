<template>
  <div class="more-recommendation-background">
    <div class="dropdown-menu-more">
      <h1>更多推荐</h1>
      <div class="dropdown-item_action-btn">
        <span></span>
        <input type="text" v-model="searchQuery" placeholder="🔍 输入目的地" @keyup.enter="handleSearch">
      </div>

      <div class="recommendations-container">
        <div v-for="(card, index) in filteredCards" :key="index" class="more-recommended-card">
          <div class="more-recommended-card__shine"></div>
          <div class="more-recommended-card__glow"></div>
          <div class="more-recommended-card__content">
            <div v-if="card.badge" class="more-recommended-card__badge">{{ card.badge }}</div>
            <div :style="{ '--bg-color': card.color }" class="more-recommended-card__image">
              <img :src="card.image" :alt="card.title" class="more-recommended-card__image-img">
            </div>
            <div class="more-recommended-card__text">
              <p class="more-recommended-card__title">{{ card.title }}</p>
              <p class="more-recommended-card__description">{{ card.description }}</p>
            </div>
            <div class="more-recommended-card__footer">
              <div class="more-recommended-card__price">￥{{ card.price }}</div>
              <div class="more-recommended-card__button" @click="() => handleCardClick(card)">
                <svg height="16" width="16" viewBox="0 0 24 24">
                  <path stroke-width="2" stroke="currentColor" d="M4 12H20M12 4V20" fill="currentColor"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="more-recommended-pagination" v-if="pagination.total > 0">
        <button v-for="page in Math.ceil(pagination.total / pagination.pageSize)" :key="page"
          @click="handlePageChange(page)" :class="{ 'active': page === pagination.current }">
          {{ page }}
        </button>
      </div>
      <div class="more-recommend-button">
        <button @click="close">
          <span>关闭</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineExpose, defineEmits } from 'vue';
import request from '../../utils/request';
import defaultImage from '@/assets/scenery/scenery-1.webp';
import { useRouter } from 'vue-router';

// 路由
const router = useRouter();
const emit = defineEmits(['close', 'search', 'card-click']);

// 状态管理
const searchQuery = ref('');
const loading = ref(false);
const error = ref(null);
const cardsData = ref([]);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0
});

/**
 * 获取推荐卡片数据
 */
const fetchRecommendations = async (params = {}) => {
  try {
    loading.value = true;
    error.value = null;

    // 调用API获取数据
    const response = await request.get('/api/public/scenic', {
      params: {
        page: pagination.value.current,
        size: pagination.value.pageSize,
        ...params
      }
    });

    // 检查响应码
    if (response.code !== '0') {
      throw new Error(response.msg || '获取数据失败');
    }

    // 处理返回数据
    cardsData.value = response.data.list.map(item => ({
      id: item.id,
      image: item.image || defaultImage,
      title: item.title || '未知景点',
      description: item.subtitle || '暂无描述',
      price: item.price ? `${item.price}` : '价格待定',
      color: getRandomColor(),
      badge: getBadge(item.sales),
      sales: item.sales,
      evaluation: item.evaluation
    }));

    // 更新分页信息
    pagination.value.total = response.data.total;

  } catch (err) {
    console.error('获取推荐数据失败:', err);
    error.value = err.message || '获取推荐数据失败，请稍后重试';
    cardsData.value = [getDefaultCard()];
  } finally {
    loading.value = false;
  }
};

/**
 * 生成随机颜色
 */
const getRandomColor = () => {
  const colors = ['#a78bfa', '#fca5a5', '#86efac', '#7dd3fc', '#fcd34d'];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * 根据评分生成标签
 */
const getBadge = (sales) => {
  if (!sales) return '新品';
  if (sales >= 4.5) return '热门';
  if (sales >= 4.0) return '推荐';
  return '新品';
};

/**
 * 创建默认卡片数据
 */
const getDefaultCard = () => ({
  id: 0,
  image: defaultImage,
  title: '默认推荐',
  description: '暂无推荐内容',
  price: '￥0',
  color: '#a78bfa',
  badge: '默认',
  sales: null,
  evaluation: null
});

/**
 * 处理分页变化
 */
const handlePageChange = (page) => {
  pagination.value.current = page;
  fetchRecommendations();
};

/**
 * 搜索过滤
 */
const filteredCards = computed(() => {
  if (!searchQuery.value.trim()) {
    return cardsData.value;
  }
  const query = searchQuery.value.toLowerCase();
  return cardsData.value.filter(card =>
    card.title.toLowerCase().includes(query) ||
    card.description.toLowerCase().includes(query)
  );
});

/**
 * 处理搜索
 */
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    fetchRecommendations({ keyword: searchQuery.value.trim() });
  }
};

/**
 * 重置搜索
 */
const resetSearch = () => {
  searchQuery.value = '';
  fetchRecommendations();
};

/**
 * 处理卡片点击
 */
const handleCardClick = (card) => {
  const token = localStorage.getItem('token');
  if (!token) {
    ElMessage.error('请先登录');
    return;
  }
  router.push({
    name: 'orderdetails',
    query: {
      item: JSON.stringify({
        id: card.id,
        name: card.title,
        price: card.price,
        image: card.image,
        details: card.description
      })
    }
  })
}

/**
 * 关闭弹窗
 */
const close = () => {
  emit('close');
};
// 组件挂载时获取数据
onMounted(() => {
  fetchRecommendations();
});

// 暴露给父组件的方法
defineExpose({
  refresh: fetchRecommendations,
  getRecommendations: fetchRecommendations,
  resetSearch
});
</script>

<style scoped>
.more-recommendation-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  /* 更深的遮罩层 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  -webkit-backdrop-filter: blur(5px);
  /* 为 Safari 和 iOS Safari 添加前缀 */
  backdrop-filter: blur(5px);
  /* 背景模糊效果 */
}

.dropdown-menu-more {
  max-width: 700px;
  background-color: rgba(255, 255, 255, 0.9);
  min-width: 180px;
  box-shadow: 0px 8px 16px 0px rgba(87, 206, 230, 0.2);
  z-index: 1;
  transition: opacity 0.5s ease;
  border-radius: 15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  /* 可选: 添加边框 */

}

.recommendations-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 三列均分 */
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding: 8px;
}

.recommendations-container::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari */
}

.more-recommended-card {
  --card-bg: #ffffff;
  --card-accent: #7c3aed;
  --card-text: #1e293b;
  --card-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);

  width: 190px;
  height: 254px;
  background: var(--card-bg);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: var(--card-shadow);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
}

.more-recommended-card__shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0.8) 50%,
      rgba(255, 255, 255, 0) 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.more-recommended-card__glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle at 50% 0%,
      rgba(124, 58, 237, 0.3) 0%,
      rgba(124, 58, 237, 0) 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.more-recommended-card__content {
  padding: 1.25em;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75em;
  position: relative;
  z-index: 2;
}

.more-recommended-card__badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #10b981;
  color: white;
  padding: 0.25em 0.5em;
  border-radius: 999px;
  font-size: 0.7em;
  font-weight: 600;
  transform: scale(0.8);
  opacity: 0;
  transition: all 0.4s ease 0.1s;
}

.more-recommended-card__image {
  width: 100%;
  height: 100px;
  background: linear-gradient(45deg, #a78bfa, #8b5cf6);
  border-radius: 12px;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.more-recommended-card__image::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 30%),
    repeating-linear-gradient(45deg,
      rgba(139, 92, 246, 0.1) 0px,
      rgba(139, 92, 246, 0.1) 2px,
      transparent 2px,
      transparent 4px);
  opacity: 0.5;
}

.more-recommended-card__image .more-recommended-card__image-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.more-recommended-card__text {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
}

.more-recommended-card__title {
  color: var(--card-text);
  font-size: 1.1em;
  margin: 0;
  font-weight: 700;
  transition: all 0.3s ease;
}

.more-recommended-card__description {
  color: var(--card-text);
  font-size: 0.75em;
  margin: 0;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.more-recommended-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.more-recommended-card__price {
  color: var(--card-text);
  font-weight: 700;
  font-size: 1em;
  transition: all 0.3s ease;
}

.more-recommended-card__button {
  width: 28px;
  height: 28px;
  background: var(--card-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: scale(0.9);
}

/* Hover Effects */
.more-recommended-card:hover {
  transform: translateY(-10px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: rgba(124, 58, 237, 0.2);
}

.more-recommended-card:hover .more-recommended-card__shine {
  opacity: 1;
  animation: shine 3s infinite;
}

.more-recommended-card:hover .more-recommended-card__glow {
  opacity: 1;
}

.more-recommended-card:hover .more-recommended-card__badge {
  transform: scale(1);
  opacity: 1;
  z-index: 1;
}

.more-recommended-card:hover .more-recommended-card__image {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.more-recommended-card:hover .more-recommended-card__title {
  color: var(--card-accent);
  transform: translateX(2px);
}

.more-recommended-card:hover .more-recommended-card__description {
  opacity: 1;
  transform: translateX(2px);
}

.more-recommended-card:hover .more-recommended-card__price {
  color: var(--card-accent);
  transform: translateX(2px);
}

.more-recommended-card:hover .more-recommended-card__button {
  transform: scale(1);
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.2);
}

.more-recommended-card:hover .more-recommended-card__button svg {
  animation: pulse 1.5s infinite;
}

/* Active State */
.more-recommended-card:active {
  transform: translateY(-5px) scale(0.98);
}

/* Animations */
@keyframes shine {
  0% {
    background-position: -100% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

.dropdown-item_action-btn {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
}

.card_space-container {
  width: 100%;
  height: auto;
  display: grid;
  /* 启用Grid布局 */
  grid-template-columns: repeat(3, auto);
  /* 定义2列 */
  justify-content: center;
  /* 水平居中对齐 */
  gap: 20px;

}

.dropdown-item_action-btn input {
  width: 300px;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 8px 12px;
  border: none;
  background-color: #ffffff;
  border: 2px solid #ccc;
  cursor: pointer;
  border-radius: 10px;
}

.dropdown-item_action-btn input:hover {
  border: 2px solid #f8e340;
}

.more-recommend-button {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.more-recommend-button button {
  width: 100px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #ccc;
  background-color: #ffffff;
  color: #E50087;
  text-align: center;
  cursor: pointer;
}

.more-recommend-button button:hover {
  background-color: #E50087;
  color: #000;
}

/* 分页容器样式 */
.more-recommended-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
}

/* 分页按钮基础样式 */
.more-recommended-pagination button {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #333;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  border-radius: 50%;
}

/* 分页按钮悬停样式 */
.more-recommended-pagination button:hover {
  background-color: #e0e0e0;
  border-color: #ccc;
}

/* 当前激活页码的样式 */
.more-recommended-pagination button.active {
  background-color: #007bff;
  border-color: #007bff;
  color: #fff;
}

/* 激活页码悬停样式 */
.more-recommended-pagination button.active:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
</style>