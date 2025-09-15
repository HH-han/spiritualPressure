<template>
    <div class="collection-container">
        <div class="collection-container-center">
            <h1 class="collection-h1"><i class="fas fa-heart"></i> 我的收藏</h1>

            <div v-if="loading" class="collection-loading">
                <i class="fas fa-spinner"></i> 正在加载收藏数据...
            </div>

            <div v-else-if="error" class="collection-error">
                <i class="fas fa-exclamation-circle"></i> {{ error }}
            </div>
            <!-- 卡片展示 -->
            <div v-else class="collection-cards-container">
                <div v-for="item in collections" :key="item.id" class="collection-glass-card" @click="details(item.id)">
                    <div class="collection-classification">{{ item.classification }}</div>
                    <img :src="item.image" :alt="item.collectionname" class="collection-card-image">
                    <h2 class="collection-card-title">{{ item.collectionname }}</h2>
                    <div class="collection-card-location">
                        <i class="fas fa-map-marker-alt"></i> {{ item.location }}
                    </div>
                    <p class="collection-card-description">{{ item.profile }}</p>

                    <div class="collection-card-meta">
                        <div class="collection-meta-item">
                            <span class="collection-meta-value">{{ item.collection }}</span>
                            <span class="collection-meta-label">收藏</span>
                        </div>
                        <div class="collection-meta-item">
                            <span class="collection-meta-value">{{ item.sales }}</span>
                            <span class="collection-meta-label">销量</span>
                        </div>
                        <div class="collection-meta-item">
                            <span class="collection-meta-value">{{ item.characteristics }}</span>
                            <span class="collection-meta-label">特色</span>
                        </div>
                    </div>

                    <div class="collection-card-footer">
                        <div class="collection-price">¥{{ item.price.toFixed(2) }}</div>
                        <div class="collection-score">
                            <i class="fas fa-star"></i> {{ item.score }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 详情页面 -->
    <div class="collection-details" v-if="selectedItem">
        <main>
            <div class="collection-details-container">
                <div class="collection-details-close">
                    <button @click="closeDetails">关闭</button>
                </div>
                <h2 class="collection-details-title">收藏详情</h2>
                <div class="collection-details-content">
                    <p>这里是收藏的详细信息...</p>
                    <p>{{selectedItem.profile}}</p>
                    <p>名称: {{selectedItem.collectionname}}</p>
                    <p>地点:{{selectedItem.location}}</p>
                    <p>分类: {{selectedItem.classification}}</p>
                    <p>收藏: {{selectedItem.collection}}</p>
                    <p>销量: {{selectedItem.sales}}</p>
                </div>
                <div class="collection-details-delete">
                    <button class="delete-btn" onclick="showConfirmDialog()">删除收藏</button>
                </div>
            </div>
        </main>
    </div>
    <!-- 删除确认弹窗 -->
    <teleport to="body">
        <transition name="delete-modal">
            <div v-if="showDeleteConfirm" class="delete-modal-mask">
                <DeletePrompt @confirmDelete="confirmDelete" @closeDeleteModal="closeDeleteModal" />
            </div>
        </transition>
    </teleport>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getTravelCollections, deleteTravelCollections } from '@/api/travel';
import { ElMessage } from 'element-plus';
import DeletePrompt from '@/components/PromptComponent/DeletePrompt.vue'

const collections = ref([]);
const loading = ref(true);
const error = ref(null);
// 详情状态
const selectedItem = ref(false);
const showDeleteConfirm = ref(false);
const postToDelete = ref(null);
// 分页
const currentPage = ref(1);
const pageSize = ref(20);
const searchKeyword = ref('');
const total = ref(0);
// 点击事件
const details = (id) => {
    selectedItem.value = collections.value.find(item => item.id === id);
};
const closeDetails = () => {
    selectedItem.value = false;
};
// 新增的取消删除函数
const closeDeleteModal = () => {
    showDeleteConfirm.value = false
}
// 获取数据
const fetchCollections = async () => {
    try {
        const params = {
            page: currentPage.value,
            pageSize: pageSize.value,
            keyword: searchKeyword.value
        };
        loading.value = true;
        error.value = null;
        const response = await getTravelCollections(params);

        if (response.code === "0") {
            console.log(response.data, "获取收藏数据成功");
            collections.value = response.data;
        } else {
            console.error('获取收藏数据失败:', response.msg);
            error.value = response.data.msg || "获取数据失败";
        }
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

// 取消收藏
const deleteCollection = (item) => {
    postToDelete.value = item.id;
    showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
    if (postToDelete.value) {
        try {
            console.log(postToDelete.value, "待删除的收藏ID");
            await deleteTravelCollections(postToDelete.value);
            await fetchCollections();
            closeDeleteModal();
            closeDetails();
            ElMessage.success('取消收藏成功');
        } catch (err) {
            ElMessage.error('取消收藏失败');
            error.value = err.message;
        }
    }
};
onMounted(() => {
    fetchCollections();
});


</script>
<style scoped>
.collection-container {
    display: flex;
    flex-direction: column;
    padding: 40px 20px;
}

.collection-container-center {
    background-color: rgba(0, 0, 0, 0.2);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    padding: 20px;
    backdrop-filter: blur(10px);
}

.collection-h1 {
    color: white;
    font-size: 2.5rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.collection-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
    height: 80vh;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.collection-cards-container::-webkit-scrollbar {
    display: none;
}

.collection-glass-card {
    max-height: 500px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    padding: 20px;
    color: white;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
}

.collection-glass-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.collection-card-image {
    width: 100%;
    height: 180px;
    border-radius: 12px;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.collection-card-title {
    font-size: 1.4rem;
    font-weight: 600;
}

.collection-card-location {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
}

.collection-card-location i {
    margin-right: 8px;
    color: #ffce54;
}

.collection-card-description {
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.85);
}

.collection-card-meta {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.collection-meta-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    padding: 8px 12px;
    border-radius: 10px;
    flex: 1;
}

.collection-meta-value {
    font-weight: bold;
    font-size: 1.1rem;
}

.collection-meta-label {
    font-size: 0.8rem;
    opacity: 0.8;
}

.collection-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.collection-price {
    font-size: 1.4rem;
    font-weight: 700;
    color: #ffce54;
}

.collection-score {
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.2);
    padding: 5px 12px;
    border-radius: 20px;
}

.collection-score i {
    color: #ffce54;
    margin-right: 5px;
}

.collection-loading {
    text-align: center;
    color: white;
    font-size: 1.2rem;
    padding: 40px;
}

.collection-loading i {
    margin-right: 10px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.collection-error {
    text-align: center;
    color: #ff6b6b;
    background: rgba(255, 255, 255, 0.15);
    padding: 20px;
    border-radius: 16px;
    margin-top: 20px;
}

.collection-classification {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(0, 0, 0, 0.3);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    backdrop-filter: blur(5px);
}

/* 详情 */
.collection-details {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    z-index: 1000;
    align-items: center;
    justify-content: center;
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
}

.collection-details-close {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}

.collection-details-close button {
    background: none;
    border: none;
    color: #ff6b6b;
    font-size: 1rem;
    cursor: pointer;
}

.collection-details-container {
    width: 650px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.collection-details-title {
    color: white;
    padding: 0px 0px 25px 0px;
    font-size: 24px;
    font-weight: 600;
    position: relative;
}

.collection-details-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #2575fc 0%, #6a11cb 100%);
}

.collection-details-content {
    padding: 30px;
    line-height: 1.6;
    color: #333;
    border-bottom: 1px solid #eee;
    min-height: 200px;
}

.collection-details-content p {
    font-size: 16px;
    margin-bottom: 15px;
}

.collection-details-delete {
    padding: 25px 0px 0px 0px;
    text-align: right;
}

.delete-btn {
    background-color: rgba(255, 75, 43, 0.85);
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 75, 43, 0.3);
}

.delete-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 75, 43, 0.4);
}

.delete-btn:active {
    transform: translateY(0);
}
</style>