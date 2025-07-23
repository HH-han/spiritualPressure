<template>
    <div class="tc-container">
        <!-- 背景层 -->
        <div class="tc-background">
            <div class="tc-bubble tc-bubble-1"></div>
            <div class="tc-bubble tc-bubble-2"></div>
            <div class="tc-bubble tc-bubble-3"></div>
        </div>

        <!-- 主内容区 -->
        <main class="tc-main">
            <h1 class="tc-title">豪华邮轮之旅</h1>
            <p class="tc-subtitle">探索世界最美的海岸线</p>

            <!-- 邮轮列表 -->
            <div class="tc-cruise-list">
                <div v-for="(cruise, index) in cruises" :key="index" class="tc-cruise-card" @click="openModal(cruise)">
                    <div class="tc-cruise-image" :style="{ backgroundImage: `url(${cruise.image})` }">
                        <div class="tc-cruise-badge">{{ cruise.duration }}</div>
                    </div>
                    <div class="tc-cruise-content">
                        <h3 class="tc-cruise-name">{{ cruise.name }}</h3>
                        <div class="tc-cruise-meta">
                            <span class="tc-cruise-destination">
                                <i class="tc-icon tc-icon-location"></i>
                                {{ cruise.route.join(' → ') }}
                            </span>
                            <span class="tc-cruise-price">¥{{ cruise.price.toLocaleString() }}起</span>
                        </div>
                        <div class="tc-cruise-actions">
                            <button class="tc-button tc-button-secondary">收藏</button>
                            <button class="tc-button tc-button-primary">立即预订</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- 模态框 -->
        <div v-if="selectedCruise" class="tc-modal" @click.self="closeModal">
            <div class="tc-modal-content">
                <button class="tc-modal-close" @click="closeModal">
                    <i class="tc-icon tc-icon-close"></i>
                </button>

                <div class="tc-modal-header">
                    <div class="tc-modal-image" :style="{ backgroundImage: `url(${selectedCruise.image})` }"></div>
                    <h2 class="tc-modal-title">{{ selectedCruise.name }}</h2>
                    <div class="tc-modal-subtitle">{{ selectedCruise.subtitle }}</div>
                </div>

                <div class="tc-modal-body">
                    <div class="tc-modal-section">
                        <h3 class="tc-section-title">行程概览</h3>
                        <div class="tc-route">
                            <div v-for="(port, idx) in selectedCruise.route" :key="idx" class="tc-port"
                                :class="{ 'tc-port-active': idx === 0 }">
                                <div class="tc-port-marker"></div>
                                <div class="tc-port-name">{{ port }}</div>
                                <div v-if="idx < selectedCruise.route.length - 1" class="tc-port-connector"></div>
                            </div>
                        </div>
                    </div>

                    <div class="tc-modal-section">
                        <h3 class="tc-section-title">邮轮设施</h3>
                        <div class="tc-facilities">
                            <div v-for="(facility, idx) in selectedCruise.facilities" :key="idx" class="tc-facility">
                                <i :class="`tc-icon tc-icon-${facility.icon}`"></i>
                                <span>{{ facility.name }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="tc-modal-section">
                        <h3 class="tc-section-title">舱房选择</h3>
                        <div class="tc-cabins">
                            <div v-for="(cabin, idx) in selectedCruise.cabins" :key="idx" class="tc-cabin">
                                <div class="tc-cabin-image" :style="{ backgroundImage: `url(${cabin.image})` }"></div>
                                <div class="tc-cabin-info">
                                    <h4>{{ cabin.type }}</h4>
                                    <p>{{ cabin.description }}</p>
                                    <div class="tc-cabin-price">¥{{ cabin.price.toLocaleString() }}</div>
                                </div>
                                <button class="tc-button tc-button-primary tc-button-small">选择</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tc-modal-footer">
                    <button class="tc-button tc-button-primary tc-button-large">立即预订</button>
                </div>
            </div>
        </div>
    </div>
    <!-- 背景样式 -->
    <div class="background-style">
        <BackgroundStyle />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import BackgroundStyle from '@/components/ThemeComponents/BackgroundStyle.vue';

const cruises = ref([
    {
        id: 1,
        name: "海洋交响号",
        subtitle: "加勒比海豪华之旅",
        image: "https://source.unsplash.com/random/600x400/?cruise,ship,1",
        duration: "7天6晚",
        route: ["迈阿密", "巴哈马", "圣托马斯", "圣马丁", "迈阿密"],
        price: 8999,
        facilities: [
            { icon: "pool", name: "泳池" },
            { icon: "restaurant", name: "5家餐厅" },
            { icon: "spa", name: "水疗中心" },
            { icon: "theater", name: "剧院" },
            { icon: "gym", name: "健身房" }
        ],
        cabins: [
            {
                type: "内舱房",
                description: "舒适的内舱房，适合预算有限的旅客",
                price: 8999,
                image: "https://source.unsplash.com/random/300x200/?cabin,1"
            },
            {
                type: "海景房",
                description: "带舷窗的海景房，欣赏壮丽海景",
                price: 12999,
                image: "https://source.unsplash.com/random/300x200/?cabin,2"
            },
            {
                type: "阳台房",
                description: "私人阳台，享受私密海景空间",
                price: 15999,
                image: "https://source.unsplash.com/random/300x200/?cabin,3"
            }
        ]
    },
    {
        id: 2,
        name: "地中海荣耀号",
        subtitle: "地中海经典航线",
        image: "https://source.unsplash.com/random/600x400/?cruise,ship,2",
        duration: "10天9晚",
        route: ["巴塞罗那", "马赛", "热那亚", "那不勒斯", "帕尔马", "巴塞罗那"],
        price: 12999,
        facilities: [
            { icon: "pool", name: "4个泳池" },
            { icon: "restaurant", name: "8家餐厅" },
            { icon: "spa", name: "豪华水疗" },
            { icon: "casino", name: "赌场" },
            { icon: "shopping", name: "购物中心" }
        ],
        cabins: [
            {
                type: "内舱房",
                description: "舒适的内舱房，适合预算有限的旅客",
                price: 12999,
                image: "https://source.unsplash.com/random/300x200/?cabin,4"
            },
            {
                type: "海景房",
                description: "带舷窗的海景房，欣赏壮丽海景",
                price: 16999,
                image: "https://source.unsplash.com/random/300x200/?cabin,5"
            },
            {
                type: "套房",
                description: "豪华套房，享受尊贵服务",
                price: 25999,
                image: "https://source.unsplash.com/random/300x200/?cabin,6"
            }
        ]
    },
    {
        id: 3,
        name: "挪威极光号",
        subtitle: "北欧峡湾之旅",
        image: "https://source.unsplash.com/random/600x400/?cruise,ship,3",
        duration: "8天7晚",
        route: ["奥斯陆", "哥本哈根", "卑尔根", "盖朗厄尔", "奥勒松", "奥斯陆"],
        price: 14999,
        facilities: [
            { icon: "pool", name: "恒温泳池" },
            { icon: "restaurant", name: "6家餐厅" },
            { icon: "northern-lights", name: "极光观景台" },
            { icon: "sauna", name: "桑拿房" },
            { icon: "library", name: "图书馆" }
        ],
        cabins: [
            {
                type: "内舱房",
                description: "舒适的内舱房，适合预算有限的旅客",
                price: 14999,
                image: "https://source.unsplash.com/random/300x200/?cabin,7"
            },
            {
                type: "阳台房",
                description: "私人阳台，欣赏峡湾美景",
                price: 18999,
                image: "https://source.unsplash.com/random/300x200/?cabin,8"
            },
            {
                type: "全景套房",
                description: "270度全景落地窗，尽享壮丽景色",
                price: 29999,
                image: "https://source.unsplash.com/random/300x200/?cabin,9"
            }
        ]
    }
]);

const selectedCruise = ref(null);

const openModal = (cruise) => {
    selectedCruise.value = cruise;
    document.body.style.overflow = 'hidden';
};

const closeModal = () => {
    selectedCruise.value = null;
    document.body.style.overflow = '';
};
</script>

<style>
/* 基础样式重置 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 全局变量 */
:root {
    --tc-primary: #6a11cb;
    --tc-secondary: #2575fc;
    --tc-accent: #ff7e5f;
    --tc-light: rgba(255, 255, 255, 0.9);
    --tc-light-transparent: rgba(255, 255, 255, 0.7);
    --tc-dark: #1a1a2e;
    --tc-text: #333;
    --tc-text-light: #fff;
    --tc-blur: 12px;
    --tc-border-radius: 16px;
    --tc-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    --tc-transition: all 0.3s ease;
}

/* 背景和容器样式 */
.tc-container {
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    padding: 2rem;
    z-index: 1000;
}

.tc-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
}

.tc-bubble {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    animation: float 15s infinite ease-in-out;
}

.tc-bubble-1 {
    width: 300px;
    height: 300px;
    top: -50px;
    left: -50px;
    animation-delay: 0s;
}

.tc-bubble-2 {
    width: 200px;
    height: 200px;
    bottom: 100px;
    right: 100px;
    animation-delay: 2s;
}

.tc-bubble-3 {
    width: 150px;
    height: 150px;
    top: 40%;
    right: -50px;
    animation-delay: 4s;
}

@keyframes float {

    0%,
    100% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(20px, 20px);
    }
}

/* 主内容区样式 */
.tc-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(var(--tc-blur));
    border-radius: var(--tc-border-radius);
    box-shadow: var(--tc-shadow);
    border: 1px solid rgba(255, 255, 255, 0.18);
}

.tc-title {
    color: var(--tc-text-light);
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tc-subtitle {
    color: var(--tc-light-transparent);
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 2rem;
}

/* 邮轮列表样式 */
.tc-cruise-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.tc-cruise-card {
    background: var(--tc-light-transparent);
    backdrop-filter: blur(var(--tc-blur));
    border-radius: var(--tc-border-radius);
    overflow: hidden;
    box-shadow: var(--tc-shadow);
    transition: var(--tc-transition);
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.tc-cruise-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.tc-cruise-image {
    height: 200px;
    background-size: cover;
    background-position: center;
    position: relative;
}

.tc-cruise-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: var(--tc-accent);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: bold;
}

.tc-cruise-content {
    padding: 1.5rem;
}

.tc-cruise-name {
    color: var(--tc-text);
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

.tc-cruise-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    color: var(--tc-text);
}

.tc-cruise-destination {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: var(--tc-text);
}

.tc-cruise-price {
    font-weight: bold;
    color: var(--tc-accent);
    font-size: 1.1rem;
}

.tc-cruise-actions {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

/* 按钮样式 */
.tc-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 50px;
    font-weight: bold;
    cursor: pointer;
    transition: var(--tc-transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.tc-button-primary {
    background: linear-gradient(to right, var(--tc-primary), var(--tc-secondary));
    color: white;
    box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
}

.tc-button-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
}

.tc-button-secondary {
    background: rgba(255, 255, 255, 0.7);
    color: var(--tc-text);
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.tc-button-secondary:hover {
    background: rgba(255, 255, 255, 0.9);
}

.tc-button-small {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
}

.tc-button-large {
    padding: 1rem 2rem;
    font-size: 1.1rem;
}

/* 图标样式 */
.tc-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 0.3em;
    vertical-align: middle;
}

.tc-icon-location {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' /%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' /%3E%3C/svg%3E");
}

.tc-icon-close {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12' /%3E%3C/svg%3E");
}

.tc-icon-pool {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' /%3E%3C/svg%3E");
}

.tc-icon-restaurant {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /%3E%3C/svg%3E");
}

.tc-icon-spa {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 10V3L4 14h7v7l9-11h-7z' /%3E%3C/svg%3E");
}

.tc-icon-theater {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' /%3E%3C/svg%3E");
}

.tc-icon-gym {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h16M4 16h16' /%3E%3C/svg%3E");
}

.tc-icon-casino {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' /%3E%3C/svg%3E");
}

.tc-icon-shopping {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' /%3E%3C/svg%3E");
}

.tc-icon-northern-lights {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' /%3E%3C/svg%3E");
}

.tc-icon-sauna {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 10V3L4 14h7v7l9-11h-7z' /%3E%3C/svg%3E");
}

.tc-icon-library {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' /%3E%3C/svg%3E");
}

/* 模态框样式 */
.tc-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 2rem;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.tc-modal-content {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(var(--tc-blur));
    border-radius: var(--tc-border-radius);
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--tc-shadow);
    border: 1px solid rgba(255, 255, 255, 0.3);
    animation: slideUp 0.3s ease;
    position: relative;
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.tc-modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--tc-text);
    cursor: pointer;
    z-index: 10;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: var(--tc-transition);
}

.tc-modal-close:hover {
    background: rgba(0, 0, 0, 0.05);
}

.tc-modal-header {
    position: relative;
}

.tc-modal-image {
    height: 250px;
    background-size: cover;
    background-position: center;
    border-radius: var(--tc-border-radius) var(--tc-border-radius) 0 0;
}

.tc-modal-title {
    position: absolute;
    bottom: 1rem;
    left: 1.5rem;
    color: white;
    font-size: 2rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.tc-modal-subtitle {
    position: absolute;
    bottom: 0.5rem;
    left: 1.5rem;
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.tc-modal-body {
    padding: 2rem;
}

.tc-modal-section {
    margin-bottom: 2rem;
}

.tc-section-title {
    color: var(--tc-primary);
    font-size: 1.3rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid rgba(106, 17, 203, 0.1);
}

/* 行程路线样式 */
.tc-route {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: var(--tc-border-radius);
}

.tc-port {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 2rem;
}

.tc-port-marker {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--tc-primary);
    position: absolute;
    left: 0;
    z-index: 2;
}

.tc-port-active .tc-port-marker {
    background: var(--tc-accent);
    box-shadow: 0 0 0 4px rgba(255, 126, 95, 0.3);
}

.tc-port-name {
    font-weight: 500;
    color: var(--tc-text);
}

.tc-port-connector {
    position: absolute;
    left: 7px;
    top: 16px;
    height: calc(100% + 1rem);
    width: 2px;
    background: var(--tc-primary);
    opacity: 0.3;
}

/* 设施样式 */
.tc-facilities {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
}

.tc-facility {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 8px;
    font-size: 0.9rem;
    color: var(--tc-text);
}

/* 舱房样式 */
.tc-cabins {
    display: grid;
    gap: 1.5rem;
}

.tc-cabin {
    display: grid;
    grid-template-columns: 120px 1fr auto;
    gap: 1.5rem;
    align-items: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: var(--tc-border-radius);
    transition: var(--tc-transition);
}

.tc-cabin:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tc-cabin-image {
    width: 120px;
    height: 80px;
    border-radius: 8px;
    background-size: cover;
    background-position: center;
}

.tc-cabin-info h4 {
    color: var(--tc-text);
    margin-bottom: 0.5rem;
}

.tc-cabin-info p {
    color: var(--tc-text);
    opacity: 0.8;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.tc-cabin-price {
    color: var(--tc-accent);
    font-weight: bold;
    font-size: 1.1rem;
}

.tc-modal-footer {
    padding: 1.5rem;
    text-align: center;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .tc-cruise-list {
        grid-template-columns: 1fr;
    }

    .tc-modal-content {
        max-height: 95vh;
    }

    .tc-cabin {
        grid-template-columns: 1fr;
    }

    .tc-cabin-image {
        width: 100%;
        height: 150px;
    }
}
</style>