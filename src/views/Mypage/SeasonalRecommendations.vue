<template>
    <div class="seasonal-recommendations">
        <h2 class="section-title-conter">当季推荐</h2>
        <div class="month-tabs">
            <button v-for="month in months" :key="month" :class="{ active: currentMonth === month }"
                @click="handleMonthChange(month)" class="month-tab">
                {{ month }}
                <span class="tab-underline"></span>
            </button>
        </div>
        <div class="recommendation-grid">
            <div v-for="destination in getRecommendationsForMonth(currentMonth)" :key="destination.name"
                class="destination-card">
                <div class="image-wrapper">
                    <img :src="destination.image" :alt="destination.name + '图片'" class="destination-image" />
                    <div class="image-overlay"></div>
                </div>
                <div class="destination-info">
                    <h3 class="destination-name">{{ destination.name }}</h3>
                    <p class="destination-desc">{{ destination.description }}</p>
                    <div class="destination-tags">
                        <span v-for="tag in destination.tags" :key="tag" class="tag">{{ tag }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentMonth = ref('一月')

const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

const recommendations = {
    '一月': [
        {
            name: '哈尔滨冰雪大世界',
            image: 'https://example.com/harbin-ice.jpg',
            description: '体验世界最大的冰雪艺术景观',
            tags: ['冰雪', '节庆', '东北']
        },
        {
            name: '三亚亚龙湾',
            image: 'https://example.com/sanya-beach.jpg',
            description: '冬日避寒的绝佳选择',
            tags: ['海滩', '温暖', '海岛']
        }
    ],
    '二月': [
        {
            name: '丽江古城',
            image: 'https://example.com/lijiang.jpg',
            description: '春节期间的古城年味十足',
            tags: ['古城', '春节', '云南']
        },
        {
            name: '厦门鼓浪屿',
            image: 'https://example.com/gulangyu.jpg',
            description: '温暖的南方小岛，春节度假好去处',
            tags: ['海岛', '文艺', '福建']
        }
    ],
    // 其他月份数据...
    '三月': [
        {
            name: '婺源油菜花',
            image: 'https://example.com/wuyuan.jpg',
            description: '金色花海与徽派建筑的完美结合',
            tags: ['赏花', '摄影', '江西']
        }
    ]
}

const getRecommendationsForMonth = (month) => {
    return recommendations[month] || []
}

const handleMonthChange = (month) => {
    currentMonth.value = month
}
</script>

<style scoped>
.seasonal-recommendations {
    margin: 0 auto;
    padding: 40px 0px 40px 0px;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.section-title-conter {
    text-align: center;
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 40px;
    color: #333;
    position: relative;
    padding-bottom: 15px;
}

.section-title-conter::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #ff6b6b, #ff8e53);
}

.month-tabs {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 40px;
    flex-wrap: wrap;
}

.month-tab {
    position: relative;
    padding: 8px 20px;
    font-size: 16px;
    font-weight: 500;
    color: #666;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 20px;
}

.month-tab:hover {
    color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
}

.month-tab.active {
    color: #ff6b6b;
    font-weight: 600;
}

.tab-underline {
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 50%;
    height: 2px;
    background: linear-gradient(90deg, #ff6b6b, #ff8e53);
    transition: transform 0.3s ease;
}

.month-tab.active .tab-underline {
    transform: translateX(-50%) scaleX(1);
}

.recommendation-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    padding: 0 20px;
}

.destination-card {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background: white;
}

.destination-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.image-wrapper {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
}

.destination-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.destination-card:hover .destination-image {
    transform: scale(1.05);
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1));
}

.destination-info {
    padding: 20px;
}

.destination-name {
    margin: 0 0 10px;
    font-size: 20px;
    font-weight: 600;
    color: #333;
}

.destination-desc {
    margin: 0 0 15px;
    font-size: 14px;
    color: #666;
    line-height: 1.5;
}

.destination-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tag {
    padding: 4px 12px;
    font-size: 12px;
    background: #f3f3f3;
    border-radius: 20px;
    color: #666;
}

@media (max-width: 768px) {
    .section-title {
        font-size: 26px;
        margin-bottom: 30px;
    }

    .month-tabs {
        gap: 6px;
        margin-bottom: 30px;
    }

    .month-tab {
        padding: 6px 15px;
        font-size: 14px;
    }

    .recommendation-grid {
        grid-template-columns: 1fr;
        gap: 20px;
        padding: 0 10px;
    }

    .image-wrapper {
        height: 180px;
    }
}
</style>