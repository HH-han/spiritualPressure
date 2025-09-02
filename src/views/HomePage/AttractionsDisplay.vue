<template>
  <div class="gallery-container">
    <div class="image-card" v-for="(item, index) in imageItems" :key="index" @mouseenter="hoveredCard = index"
      @mouseleave="hoveredCard = null">
      <div class="image-wrapper">
        <img :src="item.imageUrl" :alt="item.name" class="card-image" loading="lazy" />
        <div class="card-info" :class="{ 'show-info': hoveredCard === index }">
          <div class="info-content">
            <h3 class="image-title">{{ item.name }}</h3>
            <p class="image-description">{{ item.description }}</p>
            <div class="card-actions">
              <button class="card-button" @click="showModal(index)">查看详情</button>
              <TavoriteBtn />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="gallery-detail-modal-box" v-if="showModalBox" @click.self="closeModal">
      <div class="modal-content" @click.stop>
        <span class="close-button" @click="closeModal">关闭</span>
        <div class="gallery-detail-modal-box-modal-content">
          <img :src="selectedImage.imageUrl" alt="Modal Image" class="modal-image">
          <div>
            <h2 class="modal-title">{{ selectedImage.name }}</h2>
            <p>{{ selectedImage.details }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getTravelRecommendations } from '@/api/travel';
import TavoriteBtn from '@/views/Mypage/TavoriteBtn.vue'


const hoveredCard = ref(null);
const showModalBox = ref(false);
const selectedImage = ref({});
const selectedImageIndex = ref(0);

// 图片数据
const imageItems = ref([]);

// 获取数据
const fetchData = async () => {
  try {
    const response = await getTravelRecommendations();
    imageItems.value = response.data.list.map(item => ({
      imageUrl: item.image,
      name: item.name,
      description: item.description,
      details: item.details
    }));
  } catch (error) {
    console.error('获取景点数据失败:', error);
  }
};

// 初始化时获取数据
onMounted(() => {
  fetchData();
});



// 获取图片URL
const getImageUrl = (path) => {
  if (!path) {
    console.error('图片路径未定义');
    return '';
  }
  return path;
};

// 显示模态框
const showModal = (index) => {
  selectedImage.value = imageItems.value[index];
  selectedImageIndex.value = index;
  showModalBox.value = true;
};

// 关闭模态框
const closeModal = () => {
  showModalBox.value = false;
};
</script>

<style scoped>
.gallery-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1rem;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  animation: fadeInUp 1s ease-out;
}

.image-card {
  position: relative;
  height: 250px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  aspect-ratio: 4/3;
}

.image-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: filter 0.3s ease;
}

.image-card:hover .card-image {
  filter: brightness(0.8);
}

.card-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.card-info.show-info {
  transform: translateY(0);
  opacity: 1;
}

.info-content {
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.card-info.show-info .info-content {
  transform: translateY(0);
}

.image-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.image-description {
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
  color: #ffffff;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.card-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.card-button:hover {
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gallery-container {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .gallery-container {
    grid-template-columns: 1fr;
  }

  .image-title {
    font-size: 1.1rem;
  }

  .image-description {
    font-size: 0.85rem;
  }
}

.gallery-detail-modal-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  /* 确保模态框在最上层 */
}
.modal-content {
  position: relative;
  width: 80%;
  max-width: 900px;
  max-height: 90vh;
  margin: 5vh auto;
  padding: 30px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 
              0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow-y: auto;
  animation: fadeInUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transform: translateY(20px);
  opacity: 0;
  color: #333;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

@keyframes fadeInUp {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 300;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.close-button:hover {
  color: #ff0000;
  transform: translateY(-3px);
}

.gallery-detail-modal-box-modal-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: center;
}

.modal-image {
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;
}

.modal-image:hover {
  transform: scale(1.02);
}

.modal-title {
  margin: 0 0 15px 0;
  font-size: 28px;
  font-weight: 600;
  color: #222;
  line-height: 1.3;
}

.gallery-detail-modal-box-modal-content p {
  margin: 0;
  font-size: 16px;
  line-height: 1.7;
  color: #555;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    width: 90%;
    padding: 20px;
  }
  
  .gallery-detail-modal-box-modal-content {
    grid-template-columns: 1fr;
  }
  
  .modal-image {
    max-height: 50vh;
  }
  
  .modal-title {
    font-size: 24px;
    margin-top: 20px;
  }
}

</style>