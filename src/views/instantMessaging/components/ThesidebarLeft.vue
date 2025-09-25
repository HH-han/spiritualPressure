<template>
    <div class="sidebar-left">
        <div class="sidebar-menu">
            <div>
                <!-- 消息图标 - 带未读消息气泡 -->
                <div class="menu-item" :class="{ active: activeIndex === '1' }" @click="setActive('1')">
                    <div class="menu-icon">
                        <el-icon><Message /></el-icon>
                        <span v-if="unreadCount > 0" class="message-badge">{{ unreadCount > 99 ? '99+' : unreadCount
                            }}</span>
                    </div>
                    <div class="menu-tooltip">消息</div>
                </div>

                <!-- 通讯录 -->
                <div class="menu-item" :class="{ active: activeIndex === '2' }" @click="setActive('2')">
                    <div class="menu-icon">
                        <el-icon><Phone /></el-icon>
                    </div>
                    <div class="menu-tooltip">通讯录</div>
                </div>

                <!-- 发现 -->
                <div class="menu-item" :class="{ active: activeIndex === '3' }" @click="setActive('3')">
                    <div class="menu-icon">
                        <el-icon><View /></el-icon>
                        <span v-if="hasNewDiscover" class="discover-dot"></span>
                    </div>
                    <div class="menu-tooltip">发现</div>
                </div>

                <!-- 朋友圈 -->
                <div class="menu-item" :class="{ active: activeIndex === '4' }" @click="setActive('4')">
                    <div class="menu-icon">
                        <el-icon><HelpFilled /></el-icon>
                    </div>
                    <div class="menu-tooltip">朋友圈</div>
                </div>

                <!-- 收藏 -->
                <div class="menu-item" :class="{ active: activeIndex === '5' }" @click="setActive('6')">
                    <div class="menu-icon">
                        <el-icon><StarFilled /></el-icon>
                    </div>
                    <div class="menu-tooltip">收藏</div>
                </div>

                <!-- 相册 -->
                <div class="menu-item" :class="{ active: activeIndex === '6' }" @click="setActive('7')">
                    <div class="menu-icon">
                        <el-icon><Picture /></el-icon>
                    </div>
                    <div class="menu-tooltip">相册</div>
                </div>
            </div>
            <div class="bottom-menu">
                <!-- 设置 -->
                <div class="menu-item" :class="{ active: activeIndex === '7' }" @click="setActive('8')">
                    <div class="menu-icon">
                        <el-icon><Tools /></el-icon>
                    </div>
                    <div class="menu-tooltip">设置</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['tab-change']);

const activeIndex = ref('1');
const unreadCount = ref(5); // 模拟未读消息数量
const hasNewDiscover = ref(true); // 模拟发现页面有新内容

// 菜单项配置映射
const menuConfig = {
  '1': { tabName: 'chats', clearEffect: () => unreadCount.value = 0 },
  '2': { tabName: 'contacts', clearEffect: null },
  '3': { tabName: 'discover', clearEffect: () => hasNewDiscover.value = false },
  '4': { tabName: 'moments', clearEffect: null },
  '5': { tabName: 'favorites', clearEffect: null },
  '6': { tabName: 'albums', clearEffect: null },
  '7': { tabName: 'settings', clearEffect: null }
};

const setActive = (index) => {
    activeIndex.value = index;
    
    // 获取菜单配置
    const config = menuConfig[index] || { tabName: 'chats', clearEffect: null };
    
    // 向父组件发送切换事件，包含索引和标签名
    emit('tab-change', {
      index: index,
      tabName: config.tabName,
      menuItem: getMenuItemByIndex(index)
    });

    // 执行清除效果（如果有）
    if (config.clearEffect) {
      config.clearEffect();
    }
}

// 根据索引获取菜单项信息
const getMenuItemByIndex = (index) => {
  const menuItems = {
    '1': { name: '消息', icon: 'el-icon-message' },
    '2': { name: '通讯录', icon: 'el-icon-s-home' },
    '3': { name: '发现', icon: 'el-icon-s-unfold' },
    '4': { name: '朋友圈', icon: 'el-icon-link' },
    '5': { name: '收藏', icon: 'el-icon-s-goods' },
    '6': { name: '相册', icon: 'el-icon-picture' },
    '7': { name: '设置', icon: 'el-icon-menu' }
  };
  return menuItems[index] || { name: '未知', icon: '' };
}
</script>

<style scoped>
.sidebar-left {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    color: #ffffff;
}

.sidebar-menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.menu-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px 0;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 8px;
    margin: 0 8px;
}

.menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
}

.menu-item.active {
    background: rgba(7, 193, 96, 0.2);
    border-left: 3px solid #07c160;
    margin-left: 5px;
}

.menu-item.active .menu-icon {
    color: #07c160;
}

.menu-icon {
    height: 20px;
    position: relative;
    font-size: 20px;
    color: #b0b0b0;
    transition: color 0.3s ease;
}

.menu-item:hover .menu-icon {
    color: #07c160;
}

.menu-tooltip {
    font-size: 10px;
    color: #828282;
    transform: translateY(5px);
    transition: all 0.3s ease;
    white-space: nowrap;
}

.menu-item:hover .menu-tooltip .menu-icon{
    opacity: 1;
    transform: translateY(0);
}

.menu-item.active .menu-tooltip {
    color: #07c160;
}

/* 消息气泡样式 */
.message-badge {
    position: absolute;
    top: -9px;
    right: -6px;
    background: #ff3b30;
    color: white;
    border-radius: 10px;
    padding: 2px;
    font-size: 10px;
    font-weight: bold;
    min-width: 15px;
    text-align: center;
    line-height: 1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    animation: pulse 2s infinite;
}

/* 发现红点样式 */
.discover-dot {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 8px;
    height: 8px;
    background: #ff3b30;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

/* 脉冲动画 */
@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}

/* 响应式设计 */
@media (max-height: 600px) {
    .sidebar-left {
        padding: 10px 0;
    }

    .menu-item {
        padding: 8px 0;
    }

    .menu-icon {
        font-size: 18px;
    }
}
</style>