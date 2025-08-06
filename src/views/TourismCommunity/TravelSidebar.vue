<template>
    <div class="personalcenter-container personalcenter-reset">
        <!-- 侧边栏 -->
        <div class="personalcenter-sidebar">
            <div class="personalcenter-sidebar-header">
                <div class="personalcenter-sidebar-title">旅游社区</div>
            </div>
            <div class="personalcenter-sidebar-menu-gap">
                <div v-for="item in menuItems" :key="item.id" class="personalcenter-menu-item"
                    :class="{ active: activeMenu === item.id }" @click="changeMenu(item)">
                    {{ item.title }}
                </div>
            </div>
        </div>
        <!-- 主内容区 -->
        <main class="personalcenter-main">
            <!-- 动态组件区域 -->
            <component :is="activeComponent" v-if="activeComponent" />
        </main>
    </div>
</template>

<script setup>
import { ref, reactive, shallowRef, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import UserInteraction from './UserInteraction.vue';
import TravelGuide from './TravelGuide.vue';
import QaFunction from './QaFunction.vue';
import ActivitiesGroups from './ActivitiesGroups.vue';
import TravelNews from './TravelNews.vue';
import TravelTools from './TravelTools.vue';
import ContentManagement from './ContentManagement.vue';

const router = useRouter();

// 从本地存储获取上次激活的菜单，默认为2（用户互动）
const activeMenu = ref(Number(localStorage.getItem('activeMenu')) || 2);
const menuItems = reactive([
    {
        id: 'home',
        title: '返回首页',
        component: null,
        ishome: true
    },
    {
        id: 2,
        title: '用户互动',
        component: UserInteraction
    },
    {
        id: 3,
        title: '旅游攻略',
        component: TravelGuide
    },
    {
        id: 4,
        title: '问答功能',
        component: QaFunction
    },
    {
        id: 5,
        title: '活动与群组',
        component: ActivitiesGroups
    },
    {
        id: 6,
        title: '旅游资讯',
        component: TravelNews
    },
    {
        id: 7,
        title: '旅游工具',
        component: TravelTools
    },
    {
        id: 8,
        title: '内容管理',
        component: ContentManagement
    },
]);

// 使用shallowRef优化性能
const activeComponent = shallowRef(null);

const changeMenu = (item) => {
    activeMenu.value = item.id;
    // 保存到本地存储
    localStorage.setItem('activeMenu', item.id);

    if (item.ishome) {
        router.push({ path: 'systemhomeView' });
        return;
    }

    // 设置当前激活的组件
    activeComponent.value = item.component;
};

// 初始化时设置组件
onMounted(() => {
    const savedMenuId = Number(localStorage.getItem('activeMenu')) || 2;
    const menuItem = menuItems.find(item => item.id === savedMenuId) || menuItems[1];
    activeComponent.value = menuItem.component;
    activeMenu.value = menuItem.id;
});
</script>

<style scoped>
/* 重置样式 */
.personalcenter-reset {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* 整体布局 */
.personalcenter-container {
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
    display: flex;
    min-height: 100vh;
}

/* 侧边栏样式 */
.personalcenter-sidebar {
    height: 100vh;
    position: fixed;
    width: 240px;
    background: linear-gradient(180deg, #2c3e50, #3498db);
    color: white;
    padding: 20px 20px 0 20px;
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
    z-index: 1;
}

.personalcenter-sidebar-header {
    padding: 0 20px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 20px;
}

.personalcenter-sidebar-title {
    font-size: 1.5em;
    font-weight: 500;
    text-align: center;
}

.personalcenter-sidebar-menu-gap {
    display: flex;
    flex-direction: column;
    gap: 12px
}

.personalcenter-menu-item {
    padding: 12px 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 12px;
}

.personalcenter-menu-item:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(4px);
}

.personalcenter-menu-item.active {
    background: #ffffff;
    color: #2c3e50;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 主内容区 */
.personalcenter-main {
    flex: 1;
    padding: 30px;
    margin-left: 240px;
    position: relative;
    background: #dbe2ef;
}

.personalcenter-content-card {
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    min-height: calc(100vh - 60px);
}

.personalcenter-content-title {
    font-size: 1.8em;
    color: #2c3e50;
    margin-bottom: 1em;
    font-weight: 600;
}

.personalcenter-content-text {
    color: #666;
    line-height: 1.6;
}
</style>