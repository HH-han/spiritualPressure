<template>
    <div class="raiders-app-container">
        <div class="raiders-header">
            <p>探索世界，分享旅程，与志同道合的旅行者一起出发</p>
            <div class="raiders-divider"></div>
        </div>

        <!-- 轮播图 -->
        <div class="raiders-carousel-container">
            <div v-for="(slide, index) in carouselSlides" :key="index" class="raiders-carousel-slide"
                :class="{ 'raiders-active': currentSlide === index }"
                :style="{ backgroundImage: `url(${slide.image})` }">
                <div class="raiders-carousel-caption">
                    <h2>{{ slide.title }}</h2>
                    <p>{{ slide.description }}</p>
                </div>
            </div>

            <div class="raiders-carousel-controls">
                <button class="raiders-carousel-btn" @click="prevSlide">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="raiders-carousel-btn" @click="nextSlide">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>

        <!-- 搜索区域 -->
        <div class="raiders-search-section">
            <div class="raiders-search-box">
                <input type="text" placeholder="搜索目的地，主题，游记...">
                <button><i class="fas fa-search"></i> 搜索</button>
            </div>

            <div class="raiders-search-tips">
                <span>巴厘岛攻略</span>
                <span>日本樱花季</span>
                <span>欧洲自驾游</span>
                <span>东南亚美食</span>
                <span>登山徒步</span>
                <span>亲子旅行</span>
            </div>
        </div>

        <!-- 地点切换 -->
        <div class="raiders-location-switch">
            <button class="raiders-location-btn" :class="{ 'raiders-active': currentLocation === 'domestic' }"
                @click="changeLocation('domestic')">
                <i class="fas fa-flag"></i> 国内游
            </button>
            <button class="raiders-location-btn" :class="{ 'raiders-active': currentLocation === 'abroad' }"
                @click="changeLocation('abroad')">
                <i class="fas fa-globe-asia"></i> 海外游
            </button>
        </div>

        <!-- 卡片内容展示 -->
        <div class="raiders-cards-container">
            <div v-for="(card, index) in filteredCards" :key="index" class="raiders-travel-card">
                <div class="raiders-card-image" :style="{ backgroundImage: `url(${card.image})` }">
                    <div class="raiders-card-tag">
                        <i :class="card.tagIcon"></i> {{ card.tag }}
                    </div>
                </div>

                <div class="raiders-card-content">
                    <h3 class="raiders-card-title">{{ card.title }}</h3>

                    <div class="raiders-card-info">
                        <div class="raiders-card-avatar" :style="{ backgroundImage: `url(${card.avatar})` }"></div>
                        <div class="raiders-card-stats">
                            已有 <strong>{{ card.members }}</strong> 人加入群组
                        </div>
                    </div>

                    <p class="raiders-card-description">{{ card.description }}</p>

                    <div class="raiders-card-actions">
                        <div class="raiders-card-price">
                            ¥{{ card.price }} <span>/人起</span>
                        </div>
                        <button class="raiders-join-btn" @click="showModal(card)">
                            立即入群 <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 分页器 -->
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="[20, 50, 100 ,200]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!-- 群组信息模态框 -->
        <div class="raiders-modal-overlay" :class="{ 'raiders-active': showGroupModal }">
            <div class="raiders-modal-container">
                <div class="raiders-modal-header" :style="{ backgroundImage: `url(${currentGroup.image})` }">
                    <h2 class="raiders-modal-title">{{ currentGroup.title }}</h2>
                    <div class="raiders-modal-close" @click="closeModal">
                        <i class="fas fa-times"></i>
                    </div>
                </div>

                <div class="raiders-modal-content">
                    <div class="raiders-group-details">
                        <div class="raiders-group-info">
                            <div class="raiders-info-item">
                                <div class="raiders-info-icon">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="raiders-info-content">
                                    <h3>群组名称</h3>
                                    <p>{{ currentGroup.groupName }}</p>
                                </div>
                            </div>

                            <div class="raiders-info-item">
                                <div class="raiders-info-icon">
                                    <i class="fas fa-info-circle"></i>
                                </div>
                                <div class="raiders-info-content">
                                    <h3>群组简介</h3>
                                    <p>{{ currentGroup.groupDescription }}</p>
                                </div>
                            </div>

                            <div class="raiders-info-item">
                                <div class="raiders-info-icon">
                                    <i class="fas fa-calendar-alt"></i>
                                </div>
                                <div class="raiders-info-content">
                                    <h3>行程日期</h3>
                                    <p>{{ currentGroup.dates }}</p>
                                </div>
                            </div>

                            <div class="raiders-info-item">
                                <div class="raiders-info-icon">
                                    <i class="fas fa-map-marked-alt"></i>
                                </div>
                                <div class="raiders-info-content">
                                    <h3>行程亮点</h3>
                                    <p>{{ currentGroup.highlights }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="raiders-members-section">
                        <h2>群组成员 ({{ currentGroup.members }})</h2>
                        <div class="raiders-members-grid">
                            <div v-for="(member, index) in groupMembers" :key="index" class="raiders-member-card">
                                <div class="raiders-member-avatar"
                                    :style="{ backgroundImage: `url(${member.avatar})` }"></div>
                                <div class="raiders-member-name">{{ member.name }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="raiders-action-section">
                    <button class="raiders-confirm-btn">
                        确认加入群组 <i class="fas fa-check"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Home_2 from '@/components/NavigationComponent/HomeHeader.vue';
import { getStrategyDetail } from '@/api/travel';

// 分页相关数据
const currentPage = ref(1);
const pageSize = ref(20);
const searchKeyword = ref('');
const total = ref(0);

// 轮播图数据
const carouselSlides = ref([
    {
        image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
        title: '探索未知的旅程',
        description: '加入我们的旅行社群，与全球旅行爱好者一起分享你的冒险故事'
    },
    {
        image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
        title: '发现绝美目的地',
        description: '从壮丽山川到碧海蓝天，寻找你心中的理想旅行地'
    },
    {
        image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
        title: '结交旅行伙伴',
        description: '在旅途中结识志同道合的朋友，共同创造难忘回忆'
    }
]);

const currentSlide = ref(0);

// 自动轮播逻辑
const startCarousel = () => {
    setInterval(() => {
        nextSlide();
    }, 5000);
};

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % carouselSlides.value.length;
};

const prevSlide = () => {
    currentSlide.value = (currentSlide.value - 1 + carouselSlides.value.length) % carouselSlides.value.length;
};

// 卡片数据
const travelCards = ref([]);
// 获取数据
const fetchCards = async () => {
    try {
        const params = {
            page: currentPage.value,
            pageSize: pageSize.value,
            keyword: searchKeyword.value
        };
        const response = await getStrategyDetail(params);
        travelCards.value = response.data.list;
        total.value = response.data.total;
    } catch (error) {
        console.error('获取数据失败:', error);
    }
};

// 当前地点类型
const currentLocation = ref('domestic');

// 切换地点时重置分页状态
const changeLocation = (location) => {
    currentLocation.value = location;
    currentPage.value = 1;
    fetchCards();
};

// 过滤卡片
const filteredCards = computed(() => {
    return travelCards.value.filter(card => card.type === currentLocation.value);
});

// 群组成员数据
const groupMembers = ref([
    { name: '张明', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: '李华', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    // 其他成员数据...
]);

// 模态框状态
const showGroupModal = ref(false);
const currentGroup = ref({});

// 显示模态框
const showModal = (group) => {
    currentGroup.value = group;
    showGroupModal.value = true;
    document.body.style.overflow = 'hidden';
};

// 关闭模态框
const closeModal = () => {
    showGroupModal.value = false;
    document.body.style.overflow = 'auto';
};

// 分页器事件处理
const handleSizeChange = (val) => {
    pageSize.value = val;
    fetchCards();
};

const handleCurrentChange = (val) => {
    currentPage.value = val;
    fetchCards();
};

// 初始化轮播
onMounted(
    startCarousel(),
    fetchCards()
);

</script>

<style scoped>
.raiders-app-container {
    font-family: 'Noto Sans SC', sans-serif;
    min-height: 100vh;
    color: #333;
    margin: 0 auto;
}

.raiders-header {
    text-align: center;
    margin: 70px 0 40px 0;
    position: relative;
}

.raiders-header p {
    font-size: 1.2rem;
    color: #7f8c8d;
    max-width: 600px;
    margin: 0 auto 30px;
    line-height: 1.6;
}

.raiders-divider {
    height: 3px;
    background: linear-gradient(to right, transparent, #3498db, transparent);
    width: 80%;
    margin: 20px auto 40px;
    border-radius: 50%;
}

/* 轮播图样式 */
.raiders-carousel-container {
    position: relative;
    width: 100%;
    height: 500px;
    overflow: hidden;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    margin-bottom: 40px;
}

.raiders-carousel-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 1.2s ease-in-out;
    background-size: cover;
    background-position: center;
}

.raiders-carousel-slide.raiders-active {
    opacity: 1;
}

.raiders-carousel-caption {
    position: absolute;
    bottom: 50px;
    left: 50px;
    color: white;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    max-width: 600px;
}

.raiders-carousel-caption h2 {
    font-size: 2.8rem;
    margin-bottom: 15px;
    font-weight: 700;
    letter-spacing: 1px;
}

.raiders-carousel-caption p {
    font-size: 1.3rem;
    line-height: 1.5;
}

.raiders-carousel-controls {
    position: absolute;
    bottom: 30px;
    right: 30px;
    display: flex;
    gap: 15px;
}

.raiders-carousel-btn {
    background: rgba(255, 255, 255, 0.25);
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
}

.raiders-carousel-btn:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: translateY(-3px);
}

/* 搜索区域样式 */
.raiders-search-section {
    max-width: 800px;
    margin: 0 auto 60px;
    position: relative;
}

.raiders-search-box {
    display: flex;
    height: 70px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    border-radius: 50px;
    overflow: hidden;
}

.raiders-search-box input {
    flex: 1;
    border: none;
    padding: 0 30px;
    font-size: 1.2rem;
    outline: none;
    background: rgba(255, 255, 255, 0.9);
}

.raiders-search-box input::placeholder {
    color: #95a5a6;
}

.raiders-search-box button {
    background: linear-gradient(45deg, #3498db, #2ecc71);
    border: none;
    padding: 0 40px;
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 1px;
}

.raiders-search-box button:hover {
    background: linear-gradient(45deg, #2980b9, #27ae60);
    transform: translateY(-2px);
}

.raiders-search-tips {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 20px;
    flex-wrap: wrap;
}

.raiders-search-tips span {
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    padding: 8px 20px;
    border-radius: 30px;
    font-size: 0.95rem;
    color: #2c3e50;
    cursor: pointer;
    transition: all 0.2s ease;
}

.raiders-search-tips span:hover {
    background: #3498db;
    color: white;
    transform: translateY(-2px);
}

/* 地点切换样式 */
.raiders-location-switch {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
    gap: 30px;
}

.raiders-location-btn {
    background: white;
    border: none;
    padding: 15px 40px;
    font-size: 1.2rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    z-index: 1;
}

.raiders-location-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background: linear-gradient(45deg, #3498db, #2ecc71);
    transition: width 0.5s ease;
    z-index: -1;
}

.raiders-location-btn:hover::before {
    width: 100%;
}

.raiders-location-btn:hover {
    color: white;
    box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
}

.raiders-location-btn.raiders-active {
    background: linear-gradient(45deg, #3498db, #2ecc71);
    color: white;
    box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
}

.raiders-location-btn.raiders-active::before {
    display: none;
}

/* 卡片容器样式 */
.raiders-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
    margin-bottom: 60px;
    padding: 20px;
}

.raiders-travel-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(64, 64, 64, 0.429);
    transition: all 0.4s ease;
    position: relative;
}

.raiders-travel-card:hover {
    transform: translateY(-15px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.raiders-card-image {
    height: 250px;
    width: 100%;
    background-size: cover;
    background-position: center;
    position: relative;
}

.raiders-card-tag {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(231, 76, 60, 0.9);
    color: white;
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
}

.raiders-card-content {
    padding: 25px;
}

.raiders-card-title {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 15px;
    color: #2c3e50;
}

.raiders-card-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.raiders-card-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-size: cover;
    margin-right: 15px;
    border: 3px solid #3498db;
}

.raiders-card-stats {
    color: #7f8c8d;
    font-size: 0.95rem;
}

.raiders-card-stats strong {
    color: #e74c3c;
    font-weight: 700;
}

.raiders-card-description {
    color: #7f8c8d;
    line-height: 1.6;
    margin-bottom: 25px;
    font-size: 1.05rem;
}

.raiders-card-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.raiders-card-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #e74c3c;
}

.raiders-card-price span {
    font-size: 1rem;
    color: #95a5a6;
    font-weight: normal;
}

.raiders-join-btn {
    background: linear-gradient(45deg, #3498db, #2ecc71);
    border: none;
    padding: 12px 30px;
    border-radius: 50px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1.1rem;
    letter-spacing: 1px;
}

.raiders-join-btn:hover {
    background: linear-gradient(45deg, #2980b9, #27ae60);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

/* 模态框样式 */
.raiders-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
}

.raiders-modal-overlay.raiders-active {
    opacity: 1;
    visibility: visible;
}

.raiders-modal-container {
    background: white;
    width: 90%;
    max-width: 900px;
    border-radius: 25px;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
    transform: translateY(50px);
    transition: transform 0.5s ease;
}

.raiders-modal-overlay.raiders-active .raiders-modal-container {
    transform: translateY(0);
}

.raiders-modal-header {
    height: 300px;
    background-size: cover;
    background-position: center;
    position: relative;
    padding: 30px;
    display: flex;
    align-items: flex-end;
}

.raiders-modal-title {
    color: white;
    font-size: 2.5rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    font-weight: 700;
}

.raiders-modal-close {
    position: absolute;
    top: 25px;
    right: 25px;
    background: rgba(255, 255, 255, 0.25);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
}

.raiders-modal-close:hover {
    background: rgba(231, 76, 60, 0.8);
    transform: rotate(90deg);
}

.raiders-modal-content {
    padding: 40px;
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 40px;
}

.raiders-group-info {
    margin-bottom: 30px;
}

.raiders-info-item {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
}

.raiders-info-icon {
    width: 60px;
    height: 60px;
    background: #f8f9fa;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    font-size: 1.5rem;
    color: #3498db;
}

.raiders-info-content h3 {
    font-size: 1.4rem;
    margin-bottom: 5px;
    color: #2c3e50;
}

.raiders-info-content p {
    color: #7f8c8d;
    line-height: 1.6;
    max-width: 350px;
}

.raiders-members-section h2 {
    font-size: 1.6rem;
    margin-bottom: 25px;
    color: #2c3e50;
    padding-bottom: 15px;
    border-bottom: 2px solid #f1f2f6;
}

.raiders-members-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 20px;
}

.raiders-member-card {
    text-align: center;
}

.raiders-member-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-size: cover;
    margin: 0 auto 15px;
    border: 3px solid #3498db;
}

.raiders-member-name {
    font-weight: 600;
    color: #2c3e50;
}

.raiders-action-section {
    background: #f8f9fa;
    padding: 30px;
    text-align: center;
    border-radius: 0 0 25px 25px;
}

.raiders-confirm-btn {
    background: linear-gradient(45deg, #e74c3c, #e67e22);
    border: none;
    padding: 16px 50px;
    border-radius: 50px;
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 1px;
    box-shadow: 0 5px 20px rgba(231, 76, 60, 0.3);
}

.raiders-confirm-btn:hover {
    background: linear-gradient(45deg, #c0392b, #d35400);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4);
}

/* 响应式设计 */
@media (max-width: 992px) {
    .raiders-modal-content {
        grid-template-columns: 1fr;
    }

    .raiders-cards-container {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }

    .raiders-header h1 {
        font-size: 2.8rem;
    }
}

@media (max-width: 768px) {
    .raiders-carousel-container {
        height: 400px;
    }

    .raiders-carousel-caption {
        left: 30px;
        bottom: 30px;
    }

    .raiders-carousel-caption h2 {
        font-size: 2rem;
    }

    .raiders-search-box {
        height: 60px;
    }

    .raiders-search-box button {
        padding: 0 30px;
    }

    .raiders-header h1 {
        font-size: 2.2rem;
    }

    .raiders-location-btn {
        padding: 12px 30px;
        font-size: 1rem;
    }
}

@media (max-width: 576px) {
    .raiders-carousel-container {
        height: 300px;
    }

    .raiders-carousel-caption {
        left: 20px;
        bottom: 20px;
    }

    .raiders-carousel-caption h2 {
        font-size: 1.5rem;
    }

    .raiders-carousel-caption p {
        font-size: 1rem;
    }

    .raiders-search-box {
        flex-direction: column;
        height: auto;
        border-radius: 15px;
    }

    .raiders-search-box input {
        padding: 20px;
        width: 100%;
    }

    .raiders-search-box button {
        padding: 20px;
        width: 100%;
    }

    .raiders-location-switch {
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }

    .raiders-cards-container {
        grid-template-columns: 1fr;
    }
}
</style>