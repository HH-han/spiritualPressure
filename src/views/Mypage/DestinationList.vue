<template>
    <div class="destination-list-container">
        <h1 class="destination-list-title">热门目的地</h1>
        <div class="tabs">
            <button v-for="tab in tabs" :key="tab" :class="{ active: currentTab === tab }" @click="currentTab = tab"
                class="tab-button">
                {{ tab }}
                <span class="tab-indicator"></span>
            </button>
        </div>

        <div class="destinations-container">
            <transition name="fade" mode="out-in">
                <div v-if="currentTab === '国内'" class="destinations-grid-container">
                    <div v-for="region in destinations" :key="region.name" class="region-card">
                        <h3 class="region-title">{{ region.name }}</h3>
                        <ul class="city-list">
                            <li v-for="destination in region.cities" :key="destination" class="city-item">
                                {{ destination }}
                                <span class="city-hover-effect"></span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div v-else class="empty-state">
                    <div class="empty-icon">🌎</div>
                    <h3>更多目的地即将上线</h3>
                    <p>我们正在努力添加更多精彩旅行目的地</p>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const tabs = ref(['国内', '港澳台', '日本', '东南亚', '南亚西亚', '欧洲美洲', '澳洲非洲']);
const currentTab = ref('国内');
const destinations = ref([
    {
        name: '直辖市',
        cities: ['北京', '上海', '重庆', '天津']
    },
    {
        name: '云南',
        cities: ['丽江', '大理', '昆明', '香格里拉', '泸沽湖', '双廊', '西双版纳', '束河', '腾冲', '雨崩']
    },
    {
        name: '四川',
        cities: ['成都', '九寨沟', '稻城', '色达', '若尔盖', '都江堰', '亚丁', '阿坝', '峨眉山', '牛背山']
    },
    {
        name: '浙江',
        cities: ['杭州', '乌镇', '西塘', '千岛湖', '普陀山', '东极岛', '南浔']
    },
    {
        name: '海南 福建',
        cities: ['三亚', '蜈支洲岛', '海口', '厦门', '鼓浪屿', '武夷山', '泉州']
    },
    {
        name: '江苏',
        cities: ['南京', '苏州', '无锡', '扬州', '周庄', '常州', '连云港', '同里']
    },
    {
        name: '广东 广西',
        cities: ['广州', '深圳', '珠海', '汕头', '桂林', '阳朔', '北海', '黄姚古镇', '涠洲岛', '龙脊梯田']
    },
    {
        name: '西藏 贵州',
        cities: ['拉萨', '林芝', '阿里', '黔东南', '荔波', '镇远', '西江', '黄果树']
    },
    {
        name: '西北',
        cities: ['西安', '青海湖', '西宁', '祁连', '敦煌', '兰州', '甘南', '张掖', '嘉峪关', '新疆']
    },
    {
        name: '山东 山西',
        cities: ['青岛', '泰山', '日照', '威海', '烟台', '长岛', '蓬莱', '平遥', '大同', '五台山', '壶口瀑布']
    },
    {
        name: '湖南 湖北',
        cities: ['张家界', '凤凰', '郴州', '武汉', '恩施', '神农架']
    },
    {
        name: '安徽 江西',
        cities: ['黄山', '宏村', '婺源', '景德镇', '庐山', '三清山', '南昌']
    },
    {
        name: '河北 河南',
        cities: ['北戴河', '秦皇岛', '承德', '张北', '少林寺', '洛阳', '龙门石窟']
    },
    {
        name: '内蒙古 东北',
        cities: ['呼伦贝尔', '阿尔山', '海拉尔', '哈尔滨', '漠河', '雪乡', '大连', '丹东', '盘锦']
    }
]);
</script>

<style scoped>
/* 基础样式 */
.destination-list-container {
    padding: 1rem;
    color: #2d3436;
}

.destination-list-title {
    font-size: 40px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold;
}

/* 标签页样式 */
.tabs {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 32px;
    position: relative;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.tab-button {
    position: relative;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    color: #636e72;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 12px 12px 0 0;
}

.tab-button:hover {
    color: #4a6bff;
    background: rgba(74, 107, 255, 0.05);
}

.tab-button.active {
    color: #4a6bff;
}

.tab-indicator {
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #4a6bff, #6c5ce7);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    border-radius: 3px;
}

.tab-button.active .tab-indicator {
    transform: scaleX(1);
}

/* 目的地内容区域 */
.destinations-container {
    min-height: 400px;
}

.destinations-grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
}

.region-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.region-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.region-title {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 20px;
    color: #4a6bff;
    position: relative;
    padding-bottom: 12px;
}

.region-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #4a6bff, #6c5ce7);
    border-radius: 3px;
}

.city-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
}

.city-item {
    position: relative;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.3s ease;
    cursor: pointer;
    overflow: hidden;
}

.city-hover-effect {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(74, 107, 255, 0.1), rgba(108, 94, 231, 0.1));
    transform: translateX(-100%);
    transition: all 0.3s ease;
    z-index: -1;
}

.city-item:hover {
    color: #4a6bff;
    transform: translateX(5px);
}

.city-item:hover .city-hover-effect {
    transform: translateY(0);
}

/* 空状态样式 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 48px 0;
}

.empty-icon {
    font-size: 64px;
    margin-bottom: 24px;
    opacity: 0.7;
}

.empty-state h3 {
    margin: 0 0 8px;
    color: #2d3436;
}

.empty-state p {
    margin: 0;
    color: #636e72;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .tabs {
        flex-wrap: wrap;
    }

    .destinations-grid {
        grid-template-columns: 1fr;
    }

    .city-list {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
}
</style>