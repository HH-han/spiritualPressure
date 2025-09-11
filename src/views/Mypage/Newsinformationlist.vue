<template>
    <div>
        <div class="news-container">
            <header>
                <h1>新闻资讯</h1>
                <p class="news-subtitle">发现最新、最有趣的新闻故事</p>
            </header>

            <div class="news-list">
                <div v-for="news in newsList" :key="news.id" class="news-card">
                    <img :src="news.coverImage" :alt="news.title" class="news-image">
                    <div class="news-content">
                        <h2 class="news-title">{{ news.title }}</h2>
                        <div class="news-meta">
                            <span class="news-location">
                                <i class="fas fa-map-marker-alt"></i>
                                {{ news.location }}
                            </span>
                            <span class="news-date">
                                <i class="far fa-calendar-alt"></i>
                                {{ formatDate(news.created_at) }}
                            </span>
                        </div>
                        <p class="news-description">{{ news.content }}</p>
                        <button @click="openModal(news)" class="news-read-more">阅读更多</button>
                    </div>
                </div>

                <div v-if="newsList.length === 0" class="news-empty-state">
                    <i class="far fa-newspaper"></i>
                    <h3>暂无新闻内容</h3>
                    <p>当前没有可显示的新闻信息</p>
                </div>
            </div>
            <!-- 阅读更多（弹窗） -->
            <div class="news-modal" :class="{ active: modalVisible }">
                <div class="news-modal-content">
                    <div class="news-modal-header">
                        <h2 class="news-modal-title">{{ selectedNews.title }}</h2>
                        <button class="news-modal-close" @click="closeModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="news-modal-body">
                        <img :src="selectedNews.coverImage" :alt="selectedNews.title" class="news-modal-image">
                        <div class="news-modal-meta">
                            <span class="news-modal-location">
                                <i class="fas fa-map-marker-alt"></i>
                                {{ selectedNews.location }}
                            </span>
                            <span class="news-modal-date">
                                <i class="far fa-calendar-alt"></i>
                                发布日期: {{ formatDate(selectedNews.created_at) }}
                            </span>
                        </div>
                        <p class="news-modal-text">{{ selectedNews.content }}</p>
                    </div>
                    <div class="news-modal-footer">
                        <span class="news-modal-updated">
                            <i class="fas fa-sync-alt"></i>
                            最后更新: {{ formatDateTime(selectedNews.updated_at) }}
                        </span>
                        <button class="read-more" @click="closeModal">关闭阅读</button>
                    </div>
                </div>
            </div>
            <!-- 分页 -->
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <!-- 关闭按钮 -->
        <div class="close-button-container">
            <button @click="closeNewslist" class="close-button">关闭</button>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { getNewsDetail } from '@/api/travel';

const emit = defineEmits(['close']);

const newsList = ref([]);
// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const searchKeyword = ref('');
const total = ref(0);
// 加载状态和错误处理
const loading = ref(false);
const error = ref(null);
// 模态框状态
const modalVisible = ref(false);
const selectedNews = ref({});

const openModal = (news) => {
    selectedNews.value = news;
    modalVisible.value = true;
};

const closeModal = () => {
    modalVisible.value = false;
    selectedNews.value = {};
};
const fetchNews = async () => {
    try {
        const params = {
            page: currentPage.value,
            pageSize: pageSize.value,
            keyword: searchKeyword.value
        };
        loading.value = true;
        error.value = null;
        const response = await getNewsDetail(params);

        if (response.code === "0") {
            console.log(response.data, "获取数据成功");
            // 根据API响应结构调整数据赋值
            newsList.value = response.data.list || response.data || [];
            // 设置总记录数，优先使用response.data.total，如果没有则使用response.data.length
            total.value = response.data.total || response.data.length || 0;
        } else {
            console.error('获取数据失败:', response.msg);
            error.value = response.msg || "获取数据失败";
        }
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// 关闭新闻列表
const closeNewslist = () => {
    emit('close');
};

// 分页处理函数
const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    currentPage.value = 1; // 重置到第一页
    fetchNews();
};

const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    fetchNews();
};

onMounted(() => {
    fetchNews();
});
</script>
<style scoped>
.news-container {
    width: 100%;
    max-height: 100vh;
    height: 100%;
    margin: 0 auto;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

header {
    text-align: center;
    margin-bottom: 20px;
    padding: 15px;
    background: linear-gradient(135deg, #cbf1f5 0%, #2575fc 100%);
    border-radius: 12px;
    color: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
}

.news-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
}

.news-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 25px;
    overflow-y: auto;
    max-height: 70vh;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.news-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.news-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.news-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
}

.news-content {
    padding: 20px;
}

.news-title {
    font-size: 1.4rem;
    margin-bottom: 12px;
    color: #2c3e50;
}

.news-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-size: 0.9rem;
    color: #7f8c8d;
}

.news-location {
    display: flex;
    align-items: center;
    gap: 5px;
}

.news-date {
    display: flex;
    align-items: center;
    gap: 5px;
}

.news-description {
    color: #34495e;
    line-height: 1.6;
    margin-bottom: 20px;
}

.news-read-more {
    display: inline-block;
    border: none;
    padding: 10px 20px;
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: white;
    text-decoration: none;
    border-radius: 30px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.news-read-more:hover {
    opacity: 0.9;
    transform: translateX(5px);
}

.news-empty-state {
    text-align: center;
    padding: 40px;
    grid-column: 1 / -1;
}

.news-empty-state i {
    font-size: 3rem;
    color: #bdc3c7;
    margin-bottom: 15px;
}

.close-button-container {
    position: fixed;
    top: 40px;
    right: 40px;
    z-index: 1000;
}

.close-button {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(255, 75, 43, 0.3);
    transition: all 0.3s ease;
}

.block {
    padding: 10px;
}

/* 模态框样式 */
.news-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.news-modal.active {
    opacity: 1;
    visibility: visible;
}

.news-modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
    transform: scale(0.9);
    transition: transform 0.3s ease;
    position: relative;
}

.news-modal.active .news-modal-content {
    transform: scale(1);
}

.news-modal-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.news-modal-title {
    font-size: 1.8rem;
    color: #2c3e50;
    margin: 0;
}

.news-modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #7f8c8d;
    transition: color 0.3s ease;
}

.news-modal-close:hover {
    color: #e74c3c;
}

.news-modal-body {
    padding: 25px;
}

.news-modal-image {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 20px;
}

.news-modal-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.news-modal-location {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #7f8c8d;
}

.news-modal-date {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #7f8c8d;
}

.news-modal-text {
    line-height: 1.8;
    color: #34495e;
    font-size: 1.1rem;
    margin-bottom: 25px;
}

.news-modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 25px;
    border-top: 1px solid #eee;
    background: #f9f9f9;
    border-radius: 0 0 12px 12px;
}

.news-modal-updated {
    color: #7f8c8d;
    font-size: 0.9rem;
}

.read-more {
    padding: 8px 20px;
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
}

.read-more:hover {
    opacity: 0.9;
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .news-list {
        grid-template-columns: 1fr;
    }

    h1 {
        font-size: 2rem;
    }

    .news-modal-content {
        width: 95%;
    }

    .news-modal-meta {
        flex-direction: column;
        gap: 10px;
    }
}
</style>