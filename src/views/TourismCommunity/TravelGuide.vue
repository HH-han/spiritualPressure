<template>
  <div class="travelguide-content">
    <!-- 搜索栏 -->
    <div class="travelguide-search-bar">
      <input type="text" placeholder="搜索目的地、攻略或用户..." v-model="searchQuery" @keyup.enter="handleSearch">
    </div>

    <!-- 分类标签 -->
    <div class="travelguide-categories">
      <div v-for="category in categories" :key="category.id" class="travelguide-category"
        :class="{ active: activeCategory === category.id }" @click="selectCategory(category.id)">
        {{ category.name }}
      </div>
    </div>

    <!-- 排序选项 -->
    <div class="travelguide-sort-options">
      <div v-for="option in sortOptions" :key="option.id" class="travelguide-sort-option"
        :class="{ active: activeSort === option.id }" @click="selectSort(option.id)">
        {{ option.name }}
      </div>
    </div>

    <!-- 内容卡片 -->
    <div class="travelguide-content-cards">
      <div v-for="card in filteredCards" :key="card.id" class="travelguide-content-card">
        <span v-if="card.badge" class="travelguide-badge" :class="`badge-${card.badge.type}`">
          {{ card.badge.text }}
        </span>
        <img :src="card.image" :alt="card.title">
        <div class="travelguide-card-body">
          <h3 class="travelguide-card-title">{{ card.title }}</h3>
          <p class="travelguide-card-description">{{ card.description }}</p>
        </div>
        <div class="travelguide-card-footer">
          <button class="travelguide-like-button" @click="toggleLike(card.id)">
            ❤️ {{ formatCount(card.likes) }}
          </button>
          <button class="travelguide-save-button" @click="toggleSave(card.id)">
            ⭐ {{ card.saved ? '已收藏' : '收藏' }}
          </button>
        </div>
      </div>
    </div>
    <!-- 加载状态和错误提示 -->
    <div class="travelguide-loading-error">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import request from '@/utils/request';

// 搜索相关
const searchQuery = ref('');
// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const handleSearch = () => {
  console.log('搜索:', searchQuery.value);
  // 这里可以添加搜索逻辑
};

// 分类相关
const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'island', name: '海岛游' },
  { id: 'family', name: '亲子游' },
  { id: 'culture', name: '文化游' },
  { id: 'roadtrip', name: '自驾游' },
  { id: 'hiking', name: '徒步游' },
  { id: 'food', name: '美食游' }
]);
const activeCategory = ref('all');
const selectCategory = (id) => {
  activeCategory.value = id;
};

// 排序相关
const sortOptions = ref([
  { id: 'newest', name: '最新' },
  { id: 'hottest', name: '最热' },
  { id: 'recommended', name: '推荐' },
  { id: 'saved', name: '收藏' }
]);
const activeSort = ref('recommended');
const selectSort = (id) => {
  activeSort.value = id;
};

// 卡片数据
const cards = ref([]);
const loading = ref(false); // 加载状态
const error = ref(null); // 错误信息

// 获取卡片数据的方法
const fetchCards = async () => {
  try {
    loading.value = true;
    const response = await request.get('/api/public/travelcard', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value
      }
    })
    cards.value = response.data.list
    total.value = response.data.total
    // 确保返回的数据是数组
    if (response.data && response.data.list && Array.isArray(response.data.list)) {
      cards.value = response.data.list;
    } else {
      throw new Error('返回的数据格式不正确');
    }
  } catch (err) {
    error.value = '获取卡片数据失败：' + err.toString();
    console.error('获取卡片数据失败:', err);
  } finally {
    loading.value = false;
  }
};
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
// 在组件挂载时获取数据
onMounted(fetchCards);

// 卡片交互
const toggleLike = (id) => {
  const card = cards.value.find(c => c.id === id);
  if (card) {
    card.likes += card.liked ? -1 : 1;
    card.liked = !card.liked;
  }
};

const toggleSave = (id) => {
  const card = cards.value.find(c => c.id === id);
  if (card) {
    card.saved = !card.saved;
  }
};

// 格式化数字显示
const formatCount = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num;
};

// 过滤和排序卡片
const filteredCards = computed(() => {
  if (!Array.isArray(cards.value)) {
    return [];
  }

  let result = [...cards.value];

  // 按分类过滤
  if (activeCategory.value !== 'all') {
    result = result.filter(card => card.category === activeCategory.value);
  }

  // 按搜索词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(card =>
      card.title.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query)
    );
  }

  // 排序
  switch (activeSort.value) {
    case 'newest':
      // 假设有createdAt字段
      // result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'hottest':
      result.sort((a, b) => b.likes - a.likes);
      break;
    case 'recommended':
      // 推荐算法可以更复杂
      result.sort((a, b) => (b.likes * 0.7 + (b.saved ? 100 : 0)) - (a.likes * 0.7 + (a.saved ? 100 : 0)));
      break;
    case 'saved':
      result = result.filter(card => card.saved);
      break;
  }

  return result;
});
</script>
<style scoped>
.travelguide-content {
  flex: 1;
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.travelguide-search-bar {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.travelguide-search-bar input {
  width: 70%;
  padding: 12px 20px;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.travelguide-search-bar input:focus {
  outline: none;
  width: 75%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.travelguide-categories,
.travelguide-sort-options {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 10px;
}

.travelguide-category,
.travelguide-sort-option {
  margin: 0 8px;
  padding: 8px 16px;
  background-color: #fff;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  border: 1px solid #e0e6ed;
}

.travelguide-category:hover,
.travelguide-sort-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 0 2px white, 0 0 0 4px #ff6b6b;
}

.travelguide-sort-option.active {
  background-color: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
}

.travelguide-category.active {
  background-color: #4facfe;
  color: white;
  border-color: #4facfe;
}

.travelguide-content-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

.travelguide-content-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.travelguide-content-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.travelguide-content-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
}

.travelguide-card-body {
  padding: 15px;
}

.travelguide-card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
}

.travelguide-card-description {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 15px;
  line-height: 1.5;
}

.travelguide-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-top: 1px solid #f1f1f1;
}

.travelguide-like-button,
.travelguide-save-button {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
}

.travelguide-like-button {
  background-color: #ff9ff3;
  color: #fff;
}

.travelguide-like-button:hover {
  background-color: #f368e0;
}

.travelguide-save-button {
  background-color: #1dd1a1;
  color: #fff;
}

.travelguide-save-button:hover {
  background-color: #10ac84;
}

.travelguide-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: #ff9f43;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.travelguide-loading-error {
  width: 100%;
  font-size: 20px;
  color: #ff6b6b;
}

.error,
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>