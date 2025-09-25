<template>
  <div class="container">
    <header class="page-header">
      <h1>探索巴厘岛</h1>
      <p class="page-subtitle">沉浸在巴厘岛的自然美景与文化魅力中，发现隐藏的天堂和难忘的体验</p>
    </header>

    <div class="content-grid">
      <div class="main-content-tg">
        <!-- 景点推荐模块 -->
        <section class="glass-card">
          <div class="section-title">
            <i class="fas fa-map-marked-alt"></i>
            <h2>热门景点推荐</h2>
          </div>
          <div class="attractions-grid">
            <div class="glass-card attraction-card" v-for="(attraction, index) in attractions" :key="index">
              <img :src="attraction.image" :alt="attraction.name" class="attraction-img">
              <div class="attraction-content">
                <h3 class="attraction-title">{{ attraction.name }}</h3>
                <div class="attraction-location">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ attraction.location }}</span>
                </div>
                <p>{{ attraction.description }}</p>
                <div class="rating">
                  <div class="rating-stars">
                    <i v-for="n in 5" :key="n" class="fas fa-star" :class="{ 'filled': n <= attraction.rating }"></i>
                  </div>
                  <span class="rating-value">{{ attraction.rating.toFixed(1) }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 行程规划工具 -->
        <section class="glass-card itinerary-container">
          <div class="section-title">
            <i class="fas fa-calendar-alt"></i>
            <h2>行程规划</h2>
          </div>

          <div class="day-selector">
            <button v-for="day in days" :key="day" class="day-btn" :class="{ active: currentDay === day }"
              @click="currentDay = day">
              第{{ day }}天
            </button>
          </div>

          <div class="itinerary-list">
            <transition-group name="list">
              <div class="itinerary-item glass-card" v-for="(item, index) in filteredItinerary" :key="item.id"
                draggable="true" @dragstart="dragStart(index)" @dragover.prevent="dragOver(index)" @drop="drop(index)"
                @dragenter="dragEnter" @dragleave="dragLeave">
                <div class="item-drag">
                  <i class="fas fa-grip-lines"></i>
                </div>
                <div class="item-time">{{ item.time }}</div>
                <div class="item-content">
                  <div class="item-title">{{ item.title }}</div>
                  <div>{{ item.description }}</div>
                </div>
                <div class="item-actions">
                  <div class="item-btn" @click="removeItem(item.id)">
                    <i class="fas fa-trash-alt"></i>
                  </div>
                </div>
              </div>
            </transition-group>

            <div v-if="filteredItinerary.length === 0" class="empty-itinerary">
              <p>暂无行程安排，请添加景点到您的行程中</p>
            </div>
          </div>

          <div class="add-attraction">
            <input type="text" placeholder="添加新的景点或活动..." v-model="newItem" @keyup.enter="addItem">
            <button class="btn-hg" @click="addItem">
              <i class="fas fa-plus"></i> 添加
            </button>
          </div>
        </section>
      </div>

      <div class="side-content">
        <!-- 实用指南区 -->
        <section class="glass-card">
          <div class="section-title">
            <i class="fas fa-info-circle"></i>
            <h2>实用指南</h2>
          </div>
          <div class="guide-grid">
            <div class="glass-card guide-card" v-for="(guide, index) in guides" :key="index">
              <div class="guide-icon">
                <i :class="guide.icon"></i>
              </div>
              <h3 class="guide-title">{{ guide.title }}</h3>
              <div class="guide-content">
                {{ guide.content }}
              </div>
            </div>
          </div>
        </section>

        <!-- 用户评论区 -->
        <section class="glass-card comments-container">
          <div class="section-title">
            <i class="fas fa-comments"></i>
            <h2>旅行者评论</h2>
          </div>

          <div class="comment-list">
            <div class="glass-card comment-card" v-for="comment in comments" :key="comment.id">
              <img :src="comment.avatar" alt="User Avatar" class="comment-avatar">
              <div class="comment-content">
                <div class="comment-header">
                  <div class="comment-user">{{ comment.user }}</div>
                  <div class="comment-date">{{ comment.date }}</div>
                </div>
                <div class="rating-stars">
                  <i v-for="n in 5" :key="n" class="fas fa-star" :class="{ 'filled': n <= comment.rating }"></i>
                </div>
                <p class="comment-text">{{ comment.text }}</p>
                <div class="comment-actions">
                  <button class="like-btn" :class="{ 'liked': comment.liked }" @click="comment.liked = !comment.liked">
                    <i class="fas fa-thumbs-up"></i>
                    {{ comment.likes + (comment.liked ? 1 : 0) }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="add-comment">
            <textarea placeholder="分享您的旅行体验..." v-model="newComment"></textarea>
            <button class="btn-hg" @click="addComment">
              <i class="fas fa-paper-plane"></i> 发布评论
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
  <!-- 背景样式 -->
  <div class="background-style">
    <BackgroundStyle />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BackgroundStyle from '@/components/ThemeComponents/BackgroundStyle.vue';

// 景点数据
const attractions = ref([
  {
    name: "乌鲁瓦图寺",
    location: "巴厘岛南部",
    description: "坐落在悬崖边的古老寺庙，拥有壮丽的海景和迷人的日落景色。",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1564429091280-449c0c9d0e7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "德格拉朗梯田",
    location: "乌布地区",
    description: "巴厘岛最著名的梯田景观，绿意盎然的山谷与椰树构成绝美画面。",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "水神庙",
    location: "布拉坦湖",
    description: "巴厘岛最具特色的寺庙之一，漂浮在湖面上，被群山和森林环绕。",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1599594201378-2f5a5d5e3b1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "金巴兰海滩",
    location: "金巴兰湾",
    description: "巴厘岛最受欢迎的海滩之一，以壮观的日落和海鲜烧烤晚餐闻名。",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1558029062-a37889b87526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
])

// 行程规划数据
const days = ref([1, 2, 3, 4, 5])
const currentDay = ref(1)
const itinerary = ref([
  { id: 1, day: 1, time: "09:00 AM", title: "抵达登巴萨机场", description: "接机前往乌布酒店" },
  { id: 2, day: 1, time: "01:00 PM", title: "乌布皇宫", description: "参观传统巴厘岛建筑" },
  { id: 3, day: 1, time: "03:30 PM", title: "乌布市场", description: "购买当地手工艺品" },
  { id: 4, day: 2, time: "08:00 AM", title: "圣猴森林", description: "与巴厘岛长尾猴互动" },
  { id: 5, day: 2, time: "11:00 AM", title: "德格拉朗梯田", description: "欣赏壮观的梯田景色" },
  { id: 6, day: 3, time: "10:00 AM", title: "水神庙", description: "参观布拉坦湖上的寺庙" },
  { id: 7, day: 4, time: "09:00 AM", title: "乌鲁瓦图寺", description: "悬崖边的古老寺庙" },
  { id: 8, day: 4, time: "06:00 PM", title: "金巴兰日落晚餐", description: "海滩烧烤与日落美景" }
])
const newItem = ref("")
let draggedItemIndex = null

// 实用指南数据
const guides = ref([
  {
    icon: "fas fa-cloud-sun",
    title: "天气情况",
    content: "巴厘岛全年温暖，平均温度28°C。11月至3月为雨季，4月至10月为旱季，最佳旅游季节为5月至9月。"
  },
  {
    icon: "fas fa-subway",
    title: "交通方式",
    content: "岛上交通以出租车和摩托车为主。建议使用Grab或Gojek叫车服务，租用摩托车需持有国际驾照。"
  },
  {
    icon: "fas fa-language",
    title: "语言提示",
    content: "官方语言为印尼语和巴厘语，旅游区普遍使用英语。学习几句简单的印尼语会让当地人更友好。"
  },
  {
    icon: "fas fa-wallet",
    title: "货币兑换",
    content: "使用印尼盾(IDR)。1人民币≈2,200印尼盾。建议在正规兑换点换钱，避免街头兑换骗局。"
  }
])

// 用户评论数据
const comments = ref([
  {
    id: 1,
    user: "旅行爱好者",
    date: "2023年6月15日",
    text: "巴厘岛的文化和自然景观完美融合，水神庙的日出是我见过最美的景色！",
    rating: 5,
    likes: 24,
    liked: false,
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: 2,
    user: "探险家",
    date: "2023年5月28日",
    text: "德格拉朗梯田的徒步路线非常棒，建议早上前往避开人群，光线也最适合拍照。",
    rating: 4,
    likes: 18,
    liked: true,
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: 3,
    user: "文化探索者",
    date: "2023年5月10日",
    text: "乌布的艺术氛围令人着迷，当地的传统舞蹈表演不容错过。记得提前预订前排座位。",
    rating: 5,
    likes: 32,
    liked: false,
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600"
  }
])
const newComment = ref("")

// 计算属性
const filteredItinerary = computed(() => {
  return itinerary.value.filter(item => item.day === currentDay.value)
})

// 方法
const addItem = () => {
  if (newItem.value.trim() === "") return

  const newId = Math.max(...itinerary.value.map(item => item.id), 0) + 1

  itinerary.value.push({
    id: newId,
    day: currentDay.value,
    time: "10:00 AM",
    title: newItem.value,
    description: "新添加的活动"
  })

  newItem.value = ""
}

const removeItem = (id) => {
  itinerary.value = itinerary.value.filter(item => item.id !== id)
}

const dragStart = (index) => {
  draggedItemIndex = index
}

const dragOver = (index) => {
  const draggedItem = filteredItinerary.value[draggedItemIndex]
  if (!draggedItem) return

  // 找到原始数组中的索引
  const originalIndex = itinerary.value.findIndex(item => item.id === draggedItem.id)

  // 找到目标位置的原始索引
  const targetItem = filteredItinerary.value[index]
  const targetOriginalIndex = itinerary.value.findIndex(item => item.id === targetItem.id)

  if (originalIndex !== targetOriginalIndex) {
    // 交换位置
    const temp = itinerary.value[originalIndex]
    itinerary.value[originalIndex] = itinerary.value[targetOriginalIndex]
    itinerary.value[targetOriginalIndex] = temp

    // 更新拖动索引
    draggedItemIndex = index
  }
}

const drop = () => {
  draggedItemIndex = null
}

const dragEnter = (e) => {
  e.target.classList.add('drag-over')
}

const dragLeave = (e) => {
  e.target.classList.remove('drag-over')
}

const addComment = () => {
  if (newComment.value.trim() === "") return

  const newId = Math.max(...comments.value.map(comment => comment.id), 0) + 1

  comments.value.unshift({
    id: newId,
    user: "新用户",
    date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
    text: newComment.value,
    rating: 5,
    likes: 0,
    liked: false,
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600"
  })

  newComment.value = ""
}

// 初始化涟漪效果
const initRipple = () => {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn')
    if (btn) {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const ripple = document.createElement('span')
      ripple.classList.add('ripple')
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`

      btn.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    }
  })
}

onMounted(() => {
  initRipple()
})
</script>

<style scoped>
/* 样式htg */
@import "@/css/TravelServiceoptions/HometravelGuides.css";
</style>