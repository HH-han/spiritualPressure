<template>
  <div class="world-liquid-glass-container">
    <header class="world-page-header">
      <h1>全球特色地点探索</h1>
      <p class="world-subtitle">穿越时空的文化与自然奇观</p>
    </header>

    <div class="world-filter-controls">
      <button v-for="category in categories" :key="category" @click="filterByCategory(category)"
        :class="{ 'world-active': activeCategory === category }">
        {{ category }}
      </button>
    </div>

    <div class="world-locations-grid">
      <div v-for="location in filteredLocations" :key="location.id" class="world-location-card"
        :style="{ '--card-accent': location.color }">
        <div class="world-card-image">
          <img :src="location.image" :alt="location.name" />
          <div class="world-image-overlay"></div>
        </div>
        <div class="world-card-content">
          <div class="world-card-header">
            <h2>{{ location.name }}</h2>
            <span class="world-location-country">{{ location.country }}</span>
          </div>
          <div class="world-card-tags">
            <span v-for="tag in location.tags" :key="tag" class="world-tag">{{ tag }}</span>
          </div>
          <p class="world-card-description">{{ location.description }}</p>
          <div class="world-card-details">
            <div class="world-detail-item">
              <span class="world-detail-label">特色</span>
              <p>{{ location.features }}</p>
            </div>
            <div class="world-detail-item">
              <span class="world-detail-label">历史</span>
              <p>{{ location.history }}</p>
            </div>
            <div class="world-detail-item">
              <span class="world-detail-label">人文</span>
              <p>{{ location.culture }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 地点数据
const locations = ref([
  {
    id: 1,
    name: '马丘比丘',
    country: '秘鲁',
    image: 'https://images.unsplash.com/photo-1526397751294-331021109fbd',
    description: '印加帝国的失落之城，坐落在安第斯山脉之巅',
    features: '古代印加建筑杰作，梯田系统，天文观测点',
    history: '建于15世纪，西班牙殖民时期被遗弃，1911年被重新发现',
    culture: '印加文明的精神象征，太阳崇拜的重要遗址',
    tags: ['世界遗产', '古代文明', '山脉'],
    category: '历史遗迹',
    color: '#8B5A2B'
  },
  {
    id: 2,
    name: '大堡礁',
    country: '澳大利亚',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
    description: '世界上最大的珊瑚礁系统，海洋生物的天堂',
    features: '2900多个独立珊瑚礁，1500种鱼类，400种珊瑚',
    history: '形成于约2000万年前，1770年由库克船长首次记录',
    culture: '原住民与托雷斯海峡岛民的精神家园',
    tags: ['自然奇观', '海洋生态', '潜水胜地'],
    category: '自然景观',
    color: '#1E90FF'
  },
  {
    id: 3,
    name: '威尼斯',
    country: '意大利',
    image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0',
    description: '建在118个小岛上的水上城市，浪漫之都',
    features: '运河网络，哥特式建筑，贡多拉船',
    history: '5世纪为躲避蛮族入侵而建，中世纪成为贸易强国',
    culture: '威尼斯画派发源地，狂欢节传统，玻璃工艺',
    tags: ['水上城市', '文艺复兴', '浪漫'],
    category: '城市风情',
    color: '#9370DB'
  },
  {
    id: 4,
    name: '塞伦盖蒂草原',
    country: '坦桑尼亚',
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa',
    description: '非洲最著名的野生动物保护区，动物大迁徙的舞台',
    features: '狮子、猎豹、大象等大型动物，壮观的迁徙景象',
    history: '形成于约100万年前，1951年成为国家公园',
    culture: '马赛人传统游牧文化，人与自然和谐共处',
    tags: ['野生动物', '草原', '生态'],
    category: '自然景观',
    color: '#228B22'
  },
  {
    id: 5,
    name: '吴哥窟',
    country: '柬埔寨',
    image: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be',
    description: '高棉帝国宏伟的寺庙城市，丛林中的神秘遗迹',
    features: '世界上最大的宗教建筑群，精美的浮雕艺术',
    history: '建于12世纪，15世纪被遗弃，19世纪被重新发现',
    culture: '印度教与佛教融合的艺术杰作，高棉文明的象征',
    tags: ['世界遗产', '古代文明', '宗教建筑'],
    category: '历史遗迹',
    color: '#CD853F'
  },
  {
    id: 6,
    name: '北极光',
    country: '北欧多国',
    image: 'https://images.unsplash.com/photo-1512273222628-4daea6e55abb',
    description: '夜空中舞动的彩色光带，自然界最壮观的灯光秀',
    features: '绿色、粉色、紫色光带在天空舞动',
    history: '古代各民族都有关于极光的神话传说',
    culture: '北欧萨米人的精神象征，现代极光旅游热点',
    tags: ['自然奇观', '天文现象', '极地'],
    category: '自然景观',
    color: '#20B2AA'
  }
]);

// 分类筛选
const categories = ref(['全部', '历史遗迹', '自然景观', '城市风情']);
const activeCategory = ref('全部');

const filterByCategory = (category) => {
  activeCategory.value = category;
};

const filteredLocations = computed(() => {
  if (activeCategory.value === '全部') {
    return locations.value;
  }
  return locations.value.filter(location => location.category === activeCategory.value);
});
</script>

<style scoped>
.world-liquid-glass-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.world-page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.world-page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #3a7bd5, #00d2ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.world-subtitle {
  font-size: 1.2rem;
  color: #666;
}

.world-filter-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.world-filter-controls button {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 2rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.world-filter-controls button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.world-filter-controls button.active {
  background: linear-gradient(90deg, #3a7bd5, #00d2ff);
  color: white;
}

.world-locations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.world-location-card {
  border-radius: 1rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.world-location-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.world-card-image {
  position: relative;
  height: 600px;
  overflow: hidden;
}

.world-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.world-location-card:hover .world-card-image img {
  transform: scale(1.05);
}

.world-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.7));
}

.world-card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  opacity: 1;
  transition: all 0.4s ease;
}

.world-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
}

.world-card-header::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--card-accent), transparent);
}

.world-card-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #222;
}

.world-location-country {
  background: var(--card-accent);
  color: white;
  padding: 0.2rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.world-card-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.world-tag {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  padding: 0.2rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  color: #343434;
}

.world-card-description {
  color: #343434;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.world-card-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
}

.world-detail-item {
  background: rgba(255, 255, 255, 0.3);
  padding: 0.8rem;
  border-radius: 0.5rem;
  backdrop-filter: blur(5px);
}

.world-detail-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: var(--card-accent);
}

.world-detail-item p {
  margin: 0;
  font-size: 0.9rem;
  color: #343434;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .world-locations-grid {
    grid-template-columns: 1fr;
  }

  .world-filter-controls {
    flex-wrap: wrap;
  }
}
</style>