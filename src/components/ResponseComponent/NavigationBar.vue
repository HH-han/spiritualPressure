<template>
  <!-- 导航栏 -->
  <div>
    <Header />
  </div>
  <div class="navigationbar-container">
    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 轮播图 -->
      <div class="swiper-container">
        <div class="swiper-slide" :style="{ backgroundImage: 'url(' + currentSlide.image + ')' }">
          <div>
            <div class="swiper-title">{{ currentSlide.title }}</div>
            <div class="swiper-subtitle">{{ currentSlide.subtitle }}</div>
          </div>
          <div class="swiper-indicators">
            <div v-for="(slide, index) in slides" :key="index" class="swiper-indicator"
              :class="{ active: currentIndex === index }" @click="currentIndex = index"></div>
          </div>
        </div>
      </div>

      <!-- 快捷入口 -->
      <div class="quick-entries">
        <div v-for="(entry, index) in entries" :key="entry.title" class="entry-item fade-in" :class="'delay-' + index">
          <div class="entry-icon">
            <i :class="entry.icon"></i>
          </div>
          <div class="entry-title">{{ entry.title }}</div>
        </div>
      </div>

      <!-- 热门推荐 -->
      <div class="section-title fade-in delay-3">
        <h2>热门推荐</h2>
        <button @click="viewmore">查看更多</button>
      </div>

      <div class="hot-recommend">
        <div v-for="(item, index) in hotItems" :key="item.id" class="hot-item fade-in" :class="'delay-' + (index + 4)"
          @click="OrderDetails(item.id)">
          <div class="hot-img" :style="{ backgroundImage: 'url(' + item.coverImage + ')' }">
            <div class="hot-tag">点赞{{ item.likes }}</div>
          </div>
          <div class="hot-content">
            <div class="hot-title">{{ item.title }}</div>
            <div class="hot-desc">{{ item.content }}</div>
            <div class="hot-price">¥{{ item.price }} <span>¥{{ item.oldPrice }}</span></div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部导航 -->
    <footer>
      <Footer />
    </footer>

  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'
import Header from '@/components/ResponseComponent/NavigationHeader.vue'
import Footer from '@/components/ResponseComponent/NavigationFooter.vue'

// 轮播图数据
const slides = ref([
  {
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    title: '探索自然奇观',
    subtitle: '精选全球20个自然奇观之旅'
  },
  {
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    title: '城市文化之旅',
    subtitle: '感受不同城市的历史与文化'
  },
  {
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    title: '海岛度假胜地',
    subtitle: '享受阳光、沙滩和海洋'
  }
])
// 页面跳转
const router = useRouter()

const viewmore = () => {
  console.log('查看更多')
}
// 跳转购物车页面
const OrderDetails = (blogsId) => {
  const selectedBlog = hotItems.value.find((b) => b.id === blogsId)
  if (selectedBlog) {
    router.push({
      name: 'orderdetails',
      query: {
        item: JSON.stringify({
          id: selectedBlog.id,
          name: selectedBlog.title,
          price: selectedBlog.price,
          image: selectedBlog.coverImage,
          details: selectedBlog.content
        })
      }
    })
  }
}
const currentIndex = ref(0)

// 计算当前轮播图
const currentSlide = computed(() => {
  return slides.value[currentIndex.value]
})

let timer = null
onMounted(() => {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % slides.value.length
  }, 4000)
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
// 新增分页相关变量
const pageSize = ref(4)
// 热门推荐数据
const hotItems = ref([])
// 获取数据
const fetchBlogs = async () => {
  try {
    const res = await request.get('/api/public/blogs', {
      params: {
        pageSize: pageSize.value,
      }
    })
    if (res.code === "0") {
      hotItems.value = res.data.list
    } else {
      console.error('Failed to fetch blogs:', res.msg)
    }
  } catch (error) {
    console.error('Error fetching blogs:', error)
  }
}
// 快捷入口数据
const entries = ref([
  { icon: 'fas fa-hotel', title: '酒店' },
  { icon: 'fas fa-plane', title: '机票' },
  { icon: 'fas fa-train', title: '火车票' },
  { icon: 'fas fa-ship', title: '船票' },
  { icon: 'fas fa-bus', title: '汽车票' },
  { icon: 'fas fa-ticket-alt', title: '景点门票' },
  { icon: 'fas fa-umbrella-beach', title: '度假' },
  { icon: 'fas fa-passport', title: '签证' },
  { icon: 'fas fa-car', title: '租车' },
  { icon: 'fas fa-utensils', title: '美食' }
])



// 生命周期钩子
onMounted(() => {
  fetchBlogs()
})
</script>
<style scoped>
@import "@/css/Response/ResponseCss.css";
</style>