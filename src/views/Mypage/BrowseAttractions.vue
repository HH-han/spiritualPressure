<template>
  <div class="container-BH">
    <!-- 搜索区域 -->
    <div class="search_background">
      <div>
        <img src="@/assets/scenery/风景4.webp" alt="">
      </div>
      <div class="search_flex">
        <input type="text" placeholder="🔍搜索景点" class="search_input_Browse" v-model="searchTitle">
      </div>
    </div>

    <!-- 操作按钮区域 -->
    <!-- 景点推荐 -->
    <div>
      <BrowseRecommend />
    </div>
    <h1 class="action-H1-BH-title">景点推荐🏝️</h1>
    <!-- 景点推荐 -->
    <div class="attractions-section-BH">
      <div class="card-container-BH">
        <div v-for="card in filteredCards" :key="card.id" class="card-BH" @click="detailsCart(card.id)">
          <div class="card-image-BH">
            <img :src="card.image" :alt="card.title" />
          </div>
          <div class="card-content-BH">
            <h3>{{ card.title }}</h3>
            <p>{{ card.subtitle }}</p>
          </div>
          <div class="card-actions-xp">
            <p>
              <svg t="1745755200324" class="icon" viewBox="0 0 1331 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="5802" width="16" height="16">
                <path
                  d="M330.67008 602.84928V1024h198.4V602.84928l-99.20512-82.5856-99.19488 82.5856zM0 1024h198.4V701.93152L0 858.83904V1024z m992-520.25344V1024h198.4V338.5856L992 503.74656z m-330.65984 206.4384V1024h198.38976V611.10272L702.6688 743.2192l-41.32864-33.03424zM1322.67008 0H942.3872l157.07136 148.64384-405.07392 330.32192L429.8752 256 0 594.5856V743.2192l429.8752-338.5856L702.6688 627.6096l487.7312-396.3904 132.27008 123.87328V0z"
                  fill="#d81e06" p-id="5803"></path>
              </svg> 销量: {{ card.evaluation }}
            </p>
            <p>
              <svg t="1745755283144" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="6920" width="16" height="16">
                <path
                  d="M264.107 948.053a34.133 34.133 0 0 1-50.774-35.84l46.934-276.053L61.44 440.747A34.133 34.133 0 0 1 80.213 384l277.334-42.667 124.16-250.88a34.133 34.133 0 0 1 61.013 0l123.733 250.88L943.787 384a34.133 34.133 0 0 1 18.773 58.027L762.453 637.44l48.214 274.773a34.133 34.133 0 0 1-49.494 35.84l-247.893-128z"
                  fill="#d81e06" p-id="6921"></path>
              </svg> 评分: {{ card.sales }}
            </p>
          </div>
          <div class="card-actions-BH">
            <span>￥{{ card.price }}</span>
            <div class="btn-container-collection">
              <button @click="OrderDetails(card.id)" class="btn pay">前往购买</button>
            </div>
            <!-- <button @click="detailsCart(card.id)" class="details-button-GM">查看详情</button> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <!-- 自定义详情弹出框 -->
    <div v-if="dialogVisible" class="custom-dialog-overlay" @click.self="closeDialog">
      <div class="custom-dialog" @click.stop>
        <div class="dialog-header">
          <h2>景点详情</h2>
          <button @click="closeDialog" class="close-button">×</button>
        </div>
        <div class="dialog-content">
          <div v-if="selectedCard" class="detail-content-BH">
            <img :src="selectedCard.image" alt="景点图片" class="detail-image-BH" />
            <div class="detail-info-BH">
              <h2>{{ selectedCard.title }}</h2>
              <p class="subtitle-text">{{ selectedCard.subtitle }}</p>
              <div class="divider"></div>
              <p>
                <svg t="1742265297824" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="6446" width="16" height="16">
                  <path
                    d="M511.264243 70.25611c-244.22942 0-442.169585 197.940165-442.169585 442.169585s197.940165 442.169585 442.169585 442.169585c244.143463 0 442.169585-197.940165 442.169585-442.169585S755.407706 70.25611 511.264243 70.25611L511.264243 70.25611zM725.353203 474.945059l0 51.125401L571.975976 526.07046l0 102.337783 153.464207 0 0 51.125401L571.975976 679.533644l0 102.337783L469.638193 781.871427 469.638193 679.534667 316.173986 679.534667l0-51.125401 153.550165 0L469.724151 526.07046 316.173986 526.07046l0-51.125401 158.300352 0.604774L265.048585 270.355451l102.337783 0 153.464207 153.464207 153.464207-153.464207L776.652566 270.355451 584.930009 475.549833 725.353203 474.945059 725.353203 474.945059z"
                    fill="#e98f36" p-id="6447"></path>
                </svg>:
                价格：{{ selectedCard.price }} 元
              </p>
              <p>
                <svg t="1742265329058" class="icon" viewBox="0 0 1036 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="7582" width="16" height="16">
                  <path
                    d="M883.0464 76.8h-102.4V51.2c0-28.16-23.04-51.2-51.2-51.2s-51.2 23.04-51.2 51.2v25.6h-307.2V51.2c0-28.16-23.04-51.2-51.2-51.2s-51.2 23.04-51.2 51.2v25.6h-102.4c-84.48 0-153.6 69.12-153.6 153.6v640c0 84.48 69.12 153.6 153.6 153.6h716.8c84.48 0 153.6-69.12 153.6-153.6V230.4c0-84.48-69.12-153.6-153.6-153.6z m-716.8 102.4h102.4v25.6c0 28.16 23.04 51.2 51.2 51.2s51.2-23.04 51.2-51.2v-25.6h307.2v25.6c0 28.16 23.04 51.2 51.2 51.2s51.2-23.04 51.2-51.2v-25.6h102.4c28.16 0 51.2 23.04 51.2 51.2v76.8h-819.2v-76.8c0-28.16 23.04-51.2 51.2-51.2z m716.8 742.4h-716.8c-28.16 0-51.2-23.04-51.2-51.2V409.6h819.2v460.8c0 28.16-23.04 51.2-51.2 51.2z m-102.4-409.6h-512c-28.16 0-51.2 23.04-51.2 51.2s23.04 51.2 51.2 51.2h512c28.16 0 51.2-23.04 51.2-51.2s-23.04-51.2-51.2-51.2z m-204.8 204.8h-307.2c-28.16 0-51.2 23.04-51.2 51.2s23.04 51.2 51.2 51.2h307.2c28.16 0 51.2-23.04 51.2-51.2s-23.04-51.2-51.2-51.2z"
                    fill="#FF4A4A" p-id="7583"></path>
                </svg>:
                开放时间：{{ selectedCard.openTime || '暂无开放信息' }}
              </p>
              <p>
                <svg t="1742265399944" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="9998" width="16" height="16">
                  <path
                    d="M511.744 68.266667c-173.5168 0-314.026667 136.311467-314.7776 305.937066 0 60.910933 18.1248 118.903467 51.7632 168.465067l3.293867 4.693333 1.911466 3.1744 1.570134 2.389334c1.058133 1.553067 2.184533 3.037867 3.447466 4.5056l0.785067 0.853333 200.174933 232.823467a68.266667 68.266667 0 0 0 103.645867-0.170667L762.641067 558.08l-1.314134 1.450667a50.346667 50.346667 0 0 0 5.341867-6.621867l1.536-2.3552c0.631467-0.989867 1.860267-3.072 1.826133-3.003733 35.293867-49.322667 55.0912-109.431467 55.825067-172.782934C825.856 204.9536 684.970667 68.266667 511.744 68.266667z m0 68.266666c135.970133 0 245.845333 106.5984 245.845333 237.824a235.400533 235.400533 0 0 1-43.9808 134.775467l-2.952533 4.676267-198.997333 232.789333-200.192-232.823467-1.928534-3.191466-0.989866-1.450667a230.229333 230.229333 0 0 1-43.3152-134.775467C265.8304 242.858667 375.415467 136.533333 511.744 136.533333z"
                    fill="#444444" p-id="9999"></path>
                  <path
                    d="M783.803733 714.734933a34.133333 34.133333 0 0 1 45.243734 10.018134l1.4336 2.2528 73.386666 125.730133a68.266667 68.266667 0 0 1-54.784 102.5536l-4.5568 0.119467-666.043733-3.6352a68.266667 68.266667 0 0 1-60.654933-98.850134l2.133333-3.9424 69.9392-119.261866a34.133333 34.133333 0 0 1 60.16 32.170666l-1.262933 2.3552-69.9392 119.261867 666.043733 3.6352-73.386667-125.730133a34.133333 34.133333 0 0 1 12.288-46.677334z"
                    fill="#444444" p-id="10000"></path>
                  <path
                    d="M512 243.950933a136.533333 136.533333 0 1 0 0.034133 273.1008A136.533333 136.533333 0 0 0 512 243.950933z m0 68.266667a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 312.2176z"
                    fill="#00B386" p-id="10001"></path>
                </svg>:
                地址：{{ selectedCard.address || '暂无详细地址信息' }}
              </p>
              <p>
                <svg t="1744122405681" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="2704" width="16" height="16">
                  <path d="M376.832 463.872a170.496 124.928 0 1 0 340.992 0 170.496 124.928 0 1 0-340.992 0Z"
                    fill="#CAE4FF" p-id="2705"></path>
                  <path
                    d="M800.96768 570.50112c62.976-139.776 36.864-328.192 35.328-336.384-5.12-26.624-29.184-45.568-56.32-44.032-35.328 4.096-69.12 16.384-98.816 35.84-18.944-42.496-45.568-81.408-78.848-114.176-18.944-17.408-43.008-27.136-68.608-28.16-1.536 0-2.56 0.512-4.096 0.512-1.024-0.512-2.56-0.512-3.584-0.512-25.6 0.512-50.176 10.752-68.608 28.16-33.28 32.768-59.904 71.68-78.848 114.176-29.696-19.456-63.488-31.744-98.816-35.84-27.136-1.024-51.2 17.408-56.32 44.032-1.024 8.192-27.648 196.608 35.328 336.384 2.048 5.632 56.832 135.168 243.712 147.456v177.152c0 14.848 12.288 27.136 27.136 27.136s27.136-12.288 27.136-27.136v-177.152c187.392-12.8 242.176-141.312 244.224-147.456z m-491.52-20.992c-56.832-125.952-32.256-305.152-29.184-305.152 23.552 0 71.168 26.624 97.792 45.568l33.28 23.552 8.704-39.424c13.824-46.08 39.424-87.552 73.216-121.856 8.704-8.704 20.48-13.824 32.768-14.848 1.536 0 2.56 0 4.096 0.512v-0.512c1.024 0 2.56 0.512 3.584 0.512 12.288 0.512 24.064 5.632 32.768 14.336 34.304 33.792 59.392 75.776 73.216 121.856l8.704 39.424 33.28-23.552c26.624-18.944 74.752-45.568 97.792-45.568 3.072 0 27.648 179.2-29.184 305.152-2.048 5.632-50.176 114.688-221.184 115.712-169.472-1.024-217.088-110.08-219.648-115.712z"
                    fill="#0972E7" p-id="2706"></path>
                  <path
                    d="M245.95968 674.94912c-52.736-3.072-100.864 20.992-142.336 71.68-9.216 11.776-6.656 28.672 5.12 37.888 11.264 8.704 27.648 7.168 36.864-3.584 30.208-37.376 62.464-54.784 96.768-52.224 76.8 5.12 155.648 105.472 179.2 143.872 8.192 12.288 25.088 15.872 37.376 7.68 12.288-7.68 15.872-24.064 8.704-36.352-4.096-6.144-101.376-160.768-221.696-168.96zM956.10368 746.62912c-41.472-51.2-89.088-75.264-142.336-71.68-120.32 7.68-217.6 162.816-221.696 169.472-7.68 12.8-3.072 29.696 9.728 36.864 12.288 7.168 28.672 3.584 36.352-8.704 23.552-38.4 101.888-138.752 179.2-143.872 34.304-2.56 66.56 14.848 96.768 52.224 9.728 11.264 26.624 12.8 38.4 3.072 10.752-9.728 12.288-26.112 3.584-37.376z"
                    fill="#0972E7" p-id="2707"></path>
                </svg>:
                评价:{{ selectedCard.sales }}
              </p>
              <div class="divider"></div>
              <div class="description-BH">
                {{ selectedCard.description || '暂无详细描述' }}
              </div>
              <!-- 按钮 -->
              <div class="btn-container-collection">
                <TavoriteBtn :cardId="selectedCard.id" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <HomeFooter />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import request from '@/utils/request'
import Home_2 from '../../components/NavigationComponent/HomeHeader.vue';
import HomeFooter from '@/components/DisplayBox/HomeFooter.vue';
import BrowseRecommend from '@/views/Mypage/BrowseRecommend.vue';
import FoodRecommend from '@/views/Mypage/FoodRecommend.vue';
import TavoriteBtn from '@/views/Mypage/TavoriteBtn.vue'
import { useRouter } from 'vue-router';
import { ElMessage } from "element-plus";

//跳转支付页面
const router = useRouter();
// 跳转购物车页面
const OrderDetails = (cardId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    ElMessage.error('请先登录');
    return;
  }
  const card = filteredCards.value.find((c) => c.id === cardId);
  if (card) {
    router.push({
      name: 'orderdetails',
      query: {
        item: JSON.stringify({
          id: card.id,
          name: card.title,
          price: card.price,
          image: card.image,
          description: card.description,
          address: card.address,
          rating: card.sales,
          sales: card.evaluation,
          details: card.subtitle
        }),
      },
    });
  }
};
// 卡片数据
const cards = ref([])
// 搜索关键词
const searchTitle = ref('')
// 分页相关
const currentPage = ref(1)
const pageSize = ref(14)
const total = ref(0)

// 弹出框控制
const dialogVisible = ref(false)
const selectedCard = ref(null)

// 获取卡片数据
const fetchCards = async () => {
  try {
    const res = await request.get('/api/public/scenic', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value
      }
    })
    cards.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

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

// 查看详情
const detailsCart = (id) => {
  selectedCard.value = cards.value.find(card => card.id === id)
  dialogVisible.value = true
}

// 关闭弹出框
const closeDialog = () => {
  dialogVisible.value = false
}

// 初始化加载数据
onMounted(() => {
  fetchCards()
})

// 搜索功能
const filteredCards = computed(() => {
  return cards.value.filter(card =>
    card.title.toLowerCase().includes(searchTitle.value.toLowerCase())
  )
})
</script>

<style scoped>
@import '@/css/Mypage/BrowseHotel.css';
@import "@/css/Btn/btn.css";
</style>