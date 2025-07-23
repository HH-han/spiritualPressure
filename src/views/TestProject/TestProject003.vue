<template>
    <div class="raiders-app-container">
        <div class="raiders-header">
            <h1><i class="fas fa-compass"></i> 旅行家</h1>
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
                @click="currentLocation = 'domestic'">
                <i class="fas fa-flag"></i> 国内游
            </button>
            <button class="raiders-location-btn" :class="{ 'raiders-active': currentLocation === 'abroad' }"
                @click="currentLocation = 'abroad'">
                <i class="fas fa-globe-asia"></i> 出境游
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
const travelCards = ref([
    {
        id: 1,
        title: '云南大理洱海之旅',
        image: 'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        tag: '自然风光',
        tagIcon: 'fas fa-mountain',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        members: 128,
        description: '漫步在洱海边，感受苍山洱海的浪漫，体验白族文化，品尝地道美食。',
        price: 2680,
        type: 'domestic',
        groupName: '大理自由行交流群',
        groupDescription: '专为热爱云南大理的旅行者创建的社群，分享旅行攻略、住宿推荐和摄影技巧。',
        dates: '2023年10月15日 - 10月22日',
        highlights: '洱海骑行、崇圣寺三塔、双廊古镇、白族三道茶体验'
    },
    {
        id: 2,
        title: '日本京都樱花季',
        image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        tag: '樱花限定',
        tagIcon: 'fas fa-snowflake',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        members: 245,
        description: '在最美的樱花季节，漫步京都古寺，体验传统和服，感受日式庭院美学。',
        price: 8990,
        type: 'abroad',
        groupName: '日本樱花之旅',
        groupDescription: '专为樱花季设计的旅行计划，包含最佳赏樱地点、摄影技巧和文化体验。',
        dates: '2024年3月25日 - 4月5日',
        highlights: '哲学之道、岚山竹林、伏见稻荷大社、清水寺夜樱'
    },
    {
        id: 3,
        title: '泰国清迈文化体验',
        image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        tag: '美食之旅',
        tagIcon: 'fas fa-utensils',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        members: 187,
        description: '探索清迈古城，学习泰式烹饪，体验大象保护营，感受泰北独特风情。',
        price: 4580,
        type: 'abroad',
        groupName: '清迈慢生活',
        groupDescription: '专注于清迈深度游的社群，分享当地小众景点和特色体验。',
        dates: '2023年11月10日 - 11月17日',
        highlights: '素贴山双龙寺、周日夜市、泰式烹饪课、丛林飞跃'
    },
    {
        id: 4,
        title: '西藏朝圣之旅',
        image: 'https://images.unsplash.com/photo-1588419105597-8f0a0d5a5e3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        tag: '高原探险',
        tagIcon: 'fas fa-hiking',
        avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0e160de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        members: 92,
        description: '走进世界屋脊，探访布达拉宫，感受藏传佛教文化，欣赏绝美高原风光。',
        price: 5980,
        type: 'domestic',
        groupName: '西藏朝圣者',
        groupDescription: '为西藏旅行爱好者创建的社群，分享高原旅行经验和注意事项。',
        dates: '2023年9月5日 - 9月15日',
        highlights: '布达拉宫、纳木错、羊卓雍措、珠峰大本营'
    },
    {
        id: 5,
        title: '马尔代夫海岛度假',
        image: 'https://images.unsplash.com/photo-1580545778570-6bffdd725e09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        tag: '蜜月首选',
        tagIcon: 'fas fa-heart',
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        members: 156,
        description: '入住水上别墅，享受私人沙滩，体验浮潜和日落巡航，度过完美假期。',
        price: 12980,
        type: 'abroad',
        groupName: '马尔代夫度假群',
        groupDescription: '为计划前往马尔代夫的旅行者提供选岛建议和度假攻略。',
        dates: '2023年12月1日 - 12月8日',
        highlights: '水上别墅、私人沙滩、浮潜、日落巡航、水上飞机'
    },
    {
        id: 6,
        title: '新疆天山环线',
        image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        tag: '自驾之旅',
        tagIcon: 'fas fa-car',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        members: 78,
        description: '自驾穿越天山南北，探访喀纳斯湖，体验维吾尔族风情，品尝地道美食。',
        price: 4280,
        type: 'domestic',
        groupName: '新疆自驾游联盟',
        groupDescription: '专注于新疆自驾游的社群，分享路线规划、路况信息和美食推荐。',
        dates: '2023年8月20日 - 8月30日',
        highlights: '喀纳斯湖、那拉提草原、赛里木湖、独库公路、大巴扎'
    }
    // 其他卡片数据...
]);

// 当前地点类型
const currentLocation = ref('domestic');

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

// 初始化轮播
onMounted(() => {
    startCarousel();
});
</script>

<style scoped>
.raiders-app-container {
    font-family: 'Noto Sans SC', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
    min-height: 100vh;
    padding: 20px;
    color: #333;
    max-width: 1400px;
    margin: 0 auto;
}

.raiders-header {
    text-align: center;
    margin-bottom: 40px;
    position: relative;
}

.raiders-header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    color: #2c3e50;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    letter-spacing: 2px;
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
    border-radius: 20px;
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
}

.raiders-travel-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
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