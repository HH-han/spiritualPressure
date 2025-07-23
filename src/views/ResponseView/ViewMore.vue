<template>
  <div class="mobile-travel-app">
    <!-- 分类筛选栏 -->
    <div class="category-filter">
      <div class="filter-scroll">
        <button v-for="category in categories" :key="category.key" @click="changeCategory(category.key)"
          class="filter-btn" :class="{ 'active': activeCategory === category.key }">
          <i :class="category.icon"></i>
          <span>{{ category.name }}</span>
        </button>
      </div>
    </div>

    <!-- 主内容区 -->
    <main class="content-area">
      <!-- 搜索框 -->
      <div class="search-box">
        <input type="text" placeholder="搜索目的地、景点..." v-model="searchQuery" @input="handleSearch">
        <i class="fas fa-search"></i>
      </div>

      <!-- 景点列表 -->
      <div class="destination-list">
        <div v-for="item in filteredItems" :key="item.id" class="destination-card" @click="showDetail(item)">
          <div class="card-image-container">
            <img :src="item.imageUrl" :alt="item.name" class="card-image" @error="handleImageError" loading="lazy">
            <div class="card-badge" :class="item.category">
              {{ getCategoryName(item.category) }}
            </div>
          </div>

          <div class="card-content">
            <div class="card-header">
              <h3 class="card-title">{{ item.name }}</h3>
              <div class="card-rating">
                <i class="fas fa-star"></i>
                <span>{{ item.rating || getRandomRating() }}</span>
              </div>
            </div>

            <p class="card-description">{{ item.description }}</p>

            <div class="card-footer">
              <div class="card-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ item.location || '中国' }}</span>
              </div>
              <div class="card-price">
                ￥{{ item.price || getRandomPrice() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- 侧边菜单 (移动端抽屉) -->
    <transition name="slide">
      <div class="side-menu" v-if="menuOpen" @click.self="toggleMenu">
        <div class="menu-content">
          <div class="menu-header">
            <h3>菜单</h3>
            <button class="close-btn" @click="toggleMenu">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="menu-user">
            <div class="user-avatar">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="user-info">
              <p class="user-name">游客</p>
              <p class="user-account">点击登录</p>
            </div>
          </div>

          <div class="menu-items">
            <button class="menu-item">
              <i class="fas fa-history"></i>
              <span>浏览历史</span>
            </button>
            <button class="menu-item">
              <i class="fas fa-cog"></i>
              <span>设置</span>
            </button>
            <button class="menu-item">
              <i class="fas fa-question-circle"></i>
              <span>帮助中心</span>
            </button>
            <button class="menu-item">
              <i class="fas fa-info-circle"></i>
              <span>关于我们</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 景点详情弹窗 -->
    <transition name="fade">
      <div class="detail-modal" v-if="selectedItem" @click.self="closeDetail">
        <div class="modal-content">
          <button class="close-modal" @click="closeDetail">
            <i class="fas fa-times"></i>
          </button>

          <div class="modal-image-container">
            <img :src="selectedItem.imageUrl" :alt="selectedItem.name" class="modal-image">
            <div class="image-overlay"></div>
            <h2 class="modal-title">{{ selectedItem.name }}</h2>
          </div>

          <div class="modal-body">
            <div class="modal-meta">
              <div class="meta-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ selectedItem.location || '中国' }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-star"></i>
                <span>{{ selectedItem.rating || getRandomRating() }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-tag"></i>
                <span>{{ getCategoryName(selectedItem.category) }}</span>
              </div>
            </div>

            <p class="modal-description">{{ selectedItem.description }}</p>

            <div class="modal-features">
              <h3>特色亮点</h3>
              <ul>
                <li v-for="(feature, index) in getFeatures(selectedItem)" :key="index">
                  <i class="fas fa-check-circle"></i>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="modal-footer">
            <button class="book-btn">
              <i class="fas fa-calendar-alt"></i>
              立即预订
            </button>
            <button class="fav-btn">
              <i class="fas fa-heart"></i>
              收藏
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 分类数据
const categories = [
  { key: 'all', name: '全部', icon: 'fas fa-globe-americas' },
  { key: 'scenic', name: '自然', icon: 'fas fa-mountain' },
  { key: 'culture', name: '文化', icon: 'fas fa-landmark' },
  { key: 'city', name: '城市', icon: 'fas fa-city' },
  { key: 'adventure', name: '探险', icon: 'fas fa-hiking' },
  { key: 'food', name: '美食', icon: 'fas fa-utensils' }
]

// 景点数据
const travelData = [
  {
    id: 1,
    name: "万里长城",
    description: "世界文化遗产，中华民族的伟大象征，蜿蜒于群山之巅的古代军事防御工程。",
    imageUrl: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "culture",
    location: "北京",
    price: 120,
    features: [
      "世界新七大奇迹之一",
      "全长超过2万公里",
      "最佳游览季节：春秋季",
      "推荐游览时间：3-4小时"
    ]
  },
  {
    id: 2,
    name: "张家界国家公园",
    description: "以奇特的石英砂岩峰林地貌著称，是《阿凡达》电影中悬浮山的灵感来源。",
    imageUrl: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "scenic",
    location: "湖南张家界",
    price: 248,
    features: [
      "世界自然遗产",
      "拥有3000多座石峰",
      "最佳游览季节：4-10月",
      "推荐游览时间：2-3天"
    ]
  },
  {
    id: 3,
    name: "上海外滩",
    description: "黄浦江畔的历史建筑群与现代摩天大楼交相辉映，展现上海的过去与未来。",
    imageUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "city",
    location: "上海",
    price: 0,
    features: [
      "免费开放景点",
      "夜景尤为壮观",
      "最佳游览时间：傍晚",
      "推荐游览时间：1-2小时"
    ]
  },
  {
    id: 4,
    name: "黄山风景区",
    description: "以奇松、怪石、云海、温泉四绝著称，是中国最著名的山岳风景区之一。",
    imageUrl: "https://images.unsplash.com/photo-1518258726560-ed44d7d0b346?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "scenic",
    location: "安徽黄山",
    price: 190,
    features: [
      "世界文化与自然双重遗产",
      "五岳归来不看山，黄山归来不看岳",
      "最佳游览季节：四季皆宜",
      "推荐游览时间：2天"
    ]
  },
  {
    id: 5,
    name: "北京故宫",
    description: "明清两代的皇家宫殿，世界上现存规模最大、保存最完整的木质结构古建筑群。",
    imageUrl: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "culture",
    location: "北京",
    price: 60,
    features: [
      "世界文化遗产",
      "占地面积72万平方米",
      "最佳游览季节：春秋季",
      "推荐游览时间：4-6小时"
    ]
  },
  {
    id: 6,
    name: "成都宽窄巷子",
    description: "由宽巷子、窄巷子和井巷子组成，是成都遗留下来的较成规模的清朝古街道。",
    imageUrl: "https://images.unsplash.com/photo-1553826059-7a090c4bd362?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "city",
    location: "四川成都",
    price: 0,
    features: [
      "免费开放景点",
      "体验成都慢生活",
      "最佳游览时间：傍晚",
      "推荐品尝：成都小吃"
    ]
  },
  {
    id: 7,
    name: "稻城亚丁",
    description: "被誉为'蓝色星球上最后一片净土'，拥有雪山、冰川、湖泊、草原等壮丽景观。",
    imageUrl: "https://images.unsplash.com/photo-1513415277900-a62401e19be4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "scenic",
    location: "四川甘孜",
    price: 146,
    features: [
      "国家级自然保护区",
      "海拔2900-6032米",
      "最佳游览季节：5-10月",
      "注意高原反应"
    ]
  },
  {
    id: 8,
    name: "雨崩徒步路线",
    description: "穿越原始森林和高山牧场，挑战自我，感受梅里雪山脚下的自然之美。",
    imageUrl: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "adventure",
    location: "云南迪庆",
    price: 320,
    features: [
      "徒步爱好者的天堂",
      "全程约18公里",
      "最佳季节：5-11月",
      "需要一定体力"
    ]
  },
  {
    id: 9,
    name: "西安回民街",
    description: "西安著名的美食文化街区，汇聚了西北地区各种特色小吃和清真美食。",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "food",
    location: "陕西西安",
    price: 50,
    features: [
      "西安美食集中地",
      "推荐品尝：肉夹馍、羊肉泡馍",
      "最佳游览时间：晚上",
      "人均消费50-100元"
    ]
  },
  {
    id: 10,
    name: "九寨沟国家公园",
    description: "以翠海、叠瀑、彩林、雪峰和藏情'五绝'著称，被誉为'童话世界'。",
    imageUrl: "https://images.unsplash.com/photo-1518258726560-ed44d7d0b346?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "scenic",
    location: "四川阿坝",
    price: 169,
    features: [
      "世界自然遗产",
      "最佳游览季节：9-10月",
      "推荐游览时间：2天",
      "注意保护环境"
    ]
  }
]

// 响应式数据
const activeCategory = ref('all')
const searchQuery = ref('')
const menuOpen = ref(false)
const selectedItem = ref(null)

// 计算属性
const filteredItems = computed(() => {
  let items = travelData

  // 按分类筛选
  if (activeCategory.value !== 'all') {
    items = items.filter(item => item.category === activeCategory.value)
  }

  // 按搜索词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query)
    )
  }

  return items
})

// 方法
const changeCategory = (category) => {
  activeCategory.value = category
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  // 防止背景滚动
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}

const showDetail = (item) => {
  selectedItem.value = item
  document.body.style.overflow = 'hidden'
}

const closeDetail = () => {
  selectedItem.value = null
  document.body.style.overflow = ''
}

const handleImageError = (event) => {
  event.target.src = 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
}

const getCategoryName = (categoryKey) => {
  const category = categories.find(c => c.key === categoryKey)
  return category ? category.name : ''
}

const getRandomRating = () => {
  return (Math.random() * 2 + 3).toFixed(1)
}

const getRandomPrice = () => {
  return Math.floor(Math.random() * 300) + 50
}

const getFeatures = (item) => {
  return item.features || [
    "独特的自然景观",
    "丰富的文化底蕴",
    "适合拍照打卡",
    "当地特色美食"
  ]
}

// 初始化时给没有评分的项目添加随机评分
onMounted(() => {
  travelData.forEach(item => {
    if (!item.rating) {
      item.rating = getRandomRating()
    }
    if (!item.price) {
      item.price = getRandomPrice()
    }
  })
})
</script>

<style scoped>
/* 基础变量 */
:root {
  --primary-color: #4361ee;
  --secondary-color: #3f37c9;
  --accent-color: #4cc9f0;
  --text-color: #2b2d42;
  --light-text: #8d99ae;
  --bg-color: #f8f9fa;
  --card-bg: #ffffff;
  --border-radius: 12px;
  --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

/* 基础样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.5;
  color: var(--text-color);
  background-color: var(--bg-color);
}

.mobile-travel-app {
  display: flex;
  max-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

/* 分类筛选栏 */
.category-filter {
  position: fixed;
  left: 0;
  width: 110px;
  height: 90vh;
  background-color: rgb(255, 255, 255);
  z-index: 90;
  -webkit-overflow-scrolling: touch;
  border-right: 2px solid #f0f0f0;
}

.filter-scroll {
  display: flex;
  padding: 12px;
  align-items: center;
  flex-direction: column;
  gap: 12px;
}

.filter-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 100%;
  padding: 5px 16px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  border: none;
  color: var(--light-text);
  font-size: 12px;
  white-space: nowrap;
  transition: var(--transition);
  position: relative;
}
.filter-btn:hover {
  transform: translateX(-5%);
  border-bottom: 2px solid #4cc9f0;
}
.filter-btn i {
  font-size: 18px;
  margin-bottom: 4px;
}

.filter-btn.active {
  color: var(--primary-color);
  font-weight: 500;
}

.filter-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 3px;
}

/* 主内容区 */
.content-area {
  margin-left: 110px;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  width: 100%;
}

/* 搜索框 */
.search-box {
  position: relative;
  padding: 20px 5px 0px;
  margin-bottom: 20px;
}

.search-box input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: none;
  border-radius: 24px;
  background-color: white;
  box-shadow: var(--box-shadow);
  font-size: 14px;
}

.search-box i {
  position: absolute;
  left: 16px;
  top: 50%;
  color: var(--light-text);
}

/* 景点列表 */
.destination-list {
  display: grid;
  grid-template-columns: 1fr;
  padding: 0px 10px 0px 10px;
  margin-bottom: 10px;
  gap: 16px;
}

/* 目的地卡片 */
.destination-card {
  background-color: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
}

.destination-card:active {
  transform: scale(0.98);
}

.card-image-container {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  color: white;
  background-color: var(--primary-color);
}

.card-badge.scenic {
  background-color: #4cc9f0;
}

.card-badge.culture {
  background-color: #f72585;
}

.card-badge.city {
  background-color: #7209b7;
}

.card-badge.adventure {
  background-color: #3a0ca3;
}

.card-badge.food {
  background-color: #4361ee;
}

.card-content {
  padding: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
}

.card-rating {
  display: flex;
  align-items: center;
  color: #fbbf24;
  font-weight: 600;
  font-size: 12px;
}

.card-rating i {
  margin-right: 2px;
  font-size: 12px;
}

.card-description {
  font-size: 12px;
  color: var(--light-text);
  margin-bottom: 12px;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-location {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--light-text);
}

.card-location i {
  margin-right: 4px;
  font-size: 12px;
}

.card-price {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
}

/* 侧边菜单 */
.side-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
}

.menu-content {
  width: 80%;
  max-width: 300px;
  background-color: white;
  height: 100%;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;
}

.menu-header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
}

.menu-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-color);
}

.menu-user {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  border-bottom: 1px solid #eee;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: var(--light-text);
  font-size: 30px;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
}

.user-account {
  font-size: 12px;
  color: var(--light-text);
}

.menu-items {
  padding: 16px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  text-align: left;
  color: var(--text-color);
  transition: var(--transition);
}

.menu-item:active {
  background-color: rgba(0, 0, 0, 0.05);
}

.menu-item i {
  font-size: 18px;
  margin-right: 12px;
  color: var(--light-text);
  width: 24px;
  text-align: center;
}

.menu-item span {
  font-size: 14px;
}

/* 详情弹窗 */
.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 300;
  display: flex;
  align-items: flex-end;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.modal-content {
  width: 100%;
  max-height: 90vh;
  background-color: white;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  position: relative;
  animation: slideUp 0.3s ease-out;
}

.close-modal {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 16px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.modal-title {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  font-size: 24px;
  font-weight: 600;
  z-index: 5;
}

.modal-body {
  padding: 20px;
}

.modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--light-text);
}

.meta-item i {
  margin-right: 4px;
  font-size: 12px;
}

.modal-description {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  color: var(--text-color);
}

.modal-features {
  margin-bottom: 20px;
}

.modal-features h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-color);
}

.modal-features ul {
  list-style: none;
}

.modal-features li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-color);
}

.modal-features li i {
  color: var(--primary-color);
  margin-right: 8px;
  font-size: 14px;
  margin-top: 2px;
}

.modal-footer {
  display: flex;
  padding: 16px 20px;
  border-top: 1px solid #eee;
}

.book-btn,
.fav-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: var(--transition);
}

.book-btn {
  background-color: var(--primary-color);
  color: white;
  margin-right: 12px;
}

.book-btn:active {
  background-color: var(--secondary-color);
}

.fav-btn {
  background-color: white;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.fav-btn:active {
  background-color: rgba(67, 97, 238, 0.1);
}

.book-btn i,
.fav-btn i {
  margin-right: 6px;
  font-size: 14px;
}

/* 动画 */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (min-width: 640px) {
  .destination-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .modal-content {
    max-width: 500px;
    max-height: 80vh;
    margin: auto;
    border-radius: 16px;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }
}
</style>