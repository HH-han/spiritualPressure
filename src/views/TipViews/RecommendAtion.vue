<template>
  <div>
    <Home_2 />
  </div>
  <div class="recommendation-container">
    <div class="recommendation-content">
      <h1 class="recommendation-title">推荐内容</h1>
      <div class="items-container">
        <div class="item-card" v-for="(item, index) in items" :key="index"
          :style="index === 0 ? 'border-left: 4px solid #17a2b8;' : ''">
          <div class="card-header">
            <h2 class="item-title">{{ item.title }}</h2>
            <div class="type-badge">{{ item.type }}</div>
          </div>
          <p class="item-description">
            {{ item.description }}
          </p>
          <div class="card-footer">
            <button class="more-btn" @click="showDetails(index)">查看详情</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 模态框用于展示更多详情 -->
    <div v-if="selectedItem !== null" class="modal-backdrop" @click="closeModal">
      <div class="modal-content">
        <h2>{{ items[selectedItem].title }}</h2>
        <p><strong>类型:</strong> {{ items[selectedItem].type }}</p>
        <p><strong>简介:</strong> {{ items[selectedItem].description }}</p>
        <button class="close-btn" @click="closeModal">关闭</button>
      </div>
    </div>
  </div>
  <!-- 背景样式 -->
  <div>
    <BackgroundStyle />
  </div>
</template>

<script>
import Home_2 from '../../components/NavigationComponent/HomeHeader.vue'
import BackgroundStyle from '@/components/ThemeComponents/BackgroundStyle.vue';

export default {
  name: 'RecommendAtion',
  components: {
    Home_2,
    BackgroundStyle,
  },
  data() {
    return {
      items: [
        {
          title: '小王子',
          type: '书籍',
          description: '一部关于爱、孤独和孤独的寓言。这是一本适合所有年龄的经典书籍。',
        },
        {
          title: '黑客帝国',
          type: '电影',
          description: '一部充满哲学思考的科幻电影，探讨了现实与虚幻之间的界限。'
        },
        {
          title: '无极限',
          type: '电视剧',
          description: '一部关于经历奇幻冒险的青春剧，有着引人入胜的人物和故事情节。'
        },
        {
          title: '冥王星',
          type: '音乐专辑',
          description: '一张结合了电子和流行元素的专辑，旋律优美，富有深度。'
        },
        {
          title: '蜘蛛侠：平行宇宙',
          type: '动画电影',
          description: '一部创新的动画电影，展示了多个平行宇宙中的蜘蛛侠冒险。'
        }
      ],
      selectedItem: null
    };
  },
  methods: {
    showDetails(index) {
      this.selectedItem = index;
    },
    closeModal() {
      this.selectedItem = null;
    }
  }
};
</script>

<style scoped>
.recommendation-container {
  width: 100%;
  margin-top: 70px;
  position: absolute;
  z-index: 1000;
}
.recommendation-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  text-align: center;
}

.recommendation-title {
  color: #343a40;
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.5);
}

.items-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;
}

.item-card {
  background-color: #ffffff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
  width: calc(33.33% - 20px);
  min-width: 280px;
}

.item-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.item-title {
  color: #17a2b8;
  font-size: 1.2em;
  font-weight: bold;
  margin: 0;
}

.type-badge {
  background-color: #f0f0f0;
  color: #6c757d;
  padding: 4px 8px;
  border-radius: 15px;
  font-size: 0.8em;
  font-weight: bold;
  text-align: center;
}

.item-description {
  color: #6c757d;
  line-height: 1.6;
  font-size: 0.9em;
  text-align: justify;
  max-width: 90%;
  margin: 0 auto;
}

.card-footer {
  margin-top: 20px;
  text-align: right;
}

.more-btn {
  background-color: transparent;
  border: 1px solid #17a2b8;
  color: #17a2b8;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.more-btn:hover {
  background-color: #d1ecf1;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #ffffff;
  border-radius: 15px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.close-btn {
  background-color: transparent;
  border: none;
  color: #dc3545;
  font-size: 1em;
  font-weight: bold;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .item-card {
    width: calc(50% - 20px);
  }

  .recommendation-content {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .item-card {
    width: 100%;
  }
}
</style>