<template>
    <!-- 表情选择器 -->
    <div v-if="showEmojiPicker" class="emoji-picker">
        <div class="emoji-header">
            <span class="emoji-title">表情</span>
            <el-icon class="emoji-close" @click="closeEmojiPicker">
                <Close />
            </el-icon>
        </div>

        <!-- 表情分类标签 -->
        <div class="emoji-categories">
            <div v-for="category in categories" :key="category.type"
                :class="['category-tab', { active: activeCategory === category.type }]"
                @click="activeCategory = category.type">
                {{ category.name }}
            </div>
        </div>

        <!-- 表情网格 -->
        <div class="emoji-grid">
            <div v-for="(emoji, index) in filteredEmojis" :key="index" class="emoji-item" @click="selectEmoji(emoji)"
                :title="emoji.description">
                {{ emoji.emojiChar }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits, defineProps, computed } from 'vue'
import { getEmojiList } from '@/api/im.js'
import { ElIcon } from 'element-plus'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
    showEmojiPicker: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['select-emoji', 'close-picker'])

const emojiList = ref([])
const activeCategory = ref('all')

// 表情分类定义
const categories = [
    { type: 'all', name: '全部' },
    { type: 'smile', name: '笑脸' },
    { type: 'heart', name: '爱心' },
    { type: 'animal', name: '动物' },
    { type: 'gesture', name: '手势' },
    { type: 'food', name: '食物' },
    { type: 'object', name: '物品' },
    { type: 'symbol', name: '符号' },
    { type: 'emotion', name: '情绪' }
]

// 计算属性：根据当前分类过滤表情
const filteredEmojis = computed(() => {
    if (activeCategory.value === 'all') {
        return emojiList.value
    }
    return emojiList.value.filter(emoji => emoji.type === activeCategory.value)
})

const fetchEmojiList = async () => {
    try {
        console.log('开始获取表情列表...')
        const response = await getEmojiList()
        console.log('表情API响应:', response)

        // 修复判断逻辑：API返回正确格式时使用API数据
        if (response && response.code === '0' && response.data && response.data.length > 0) {
            console.log('成功获取表情列表，数量:', response.data.length)
            emojiList.value = response.data
        } else {
            console.warn('API返回数据格式异常，使用默认表情', response)
            // 如果API没有返回数据，使用默认表情作为后备
            emojiList.value = getDefaultEmojis()
        }
    } catch (error) {
        console.error('获取表情列表失败:', error)
        console.warn('使用默认表情作为后备')
        emojiList.value = getDefaultEmojis()
    }
}

// 默认表情数据（API失败时的后备）
const getDefaultEmojis = () => {
    return [
        { id: 1, emojiCode: 'grinning_face', emojiChar: '😀', type: 'smile', description: '咧嘴笑' },
        { id: 2, emojiCode: 'smiling_face', emojiChar: '😊', type: 'smile', description: '微笑' },
        { id: 3, emojiCode: 'laughing_face', emojiChar: '😆', type: 'smile', description: '大笑' },
        { id: 4, emojiCode: 'winking_face', emojiChar: '😉', type: 'smile', description: '眨眼' },
        { id: 5, emojiCode: 'smiling_face_hearts', emojiChar: '🥰', type: 'smile', description: '带爱心的笑' },
        { id: 6, emojiCode: 'red_heart', emojiChar: '❤️', type: 'heart', description: '红心' },
        { id: 7, emojiCode: 'sparkling_heart', emojiChar: '💖', type: 'heart', description: '闪烁的心' },
        { id: 8, emojiCode: 'dog_face', emojiChar: '🐶', type: 'animal', description: '狗脸' },
        { id: 9, emojiCode: 'cat_face', emojiChar: '🐱', type: 'animal', description: '猫脸' },
        { id: 10, emojiCode: 'thumbs_up', emojiChar: '👍', type: 'gesture', description: '点赞' },
        { id: 11, emojiCode: 'clapping_hands', emojiChar: '👏', type: 'gesture', description: '鼓掌' },
        { id: 12, emojiCode: 'pizza', emojiChar: '🍕', type: 'food', description: '披萨' },
        { id: 13, emojiCode: 'hamburger', emojiChar: '🍔', type: 'food', description: '汉堡' },
        { id: 14, emojiCode: 'balloon', emojiChar: '🎈', type: 'object', description: '气球' },
        { id: 15, emojiCode: 'check_mark', emojiChar: '✅', type: 'symbol', description: '对勾' },
        { id: 16, emojiCode: 'crying_face', emojiChar: '😢', type: 'emotion', description: '哭泣' },
        { id: 17, emojiCode: 'angry_face', emojiChar: '😠', type: 'emotion', description: '生气' }
    ]
}


// 选择表情
const selectEmoji = (emoji) => {
    emit('select-emoji', emoji.emojiChar)
}

// 关闭表情选择器
const closeEmojiPicker = () => {
    emit('close-picker')
}

onMounted(() => {
    fetchEmojiList()
})
</script>

<style scoped>
/* 表情选择器样式 */
.emoji-picker {
    width: 350px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    overflow: hidden;
}

.emoji-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;
}

.emoji-title {
    font-weight: 600;
    color: #333;
    font-size: 16px;
}

.emoji-close {
    cursor: pointer;
    color: #999;
    font-size: 18px;
    transition: color 0.2s;
}

.emoji-close:hover {
    color: #666;
}

/* 表情分类标签样式 */
.emoji-categories {
    display: flex;
    flex-direction: row;
    gap: 8px;
    overflow-x: auto;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    background: #f8f8f8;
}





.category-tab {
    flex-shrink: 0;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    background: #fff;
    border: 1px solid #e0e0e0;
    color: #666;
}

.category-tab:hover {
    border-color: #07c160;
    color: #07c160;
}

.category-tab.active {
    background: #07c160;
    border-color: #07c160;
    color: #fff;
}

.emoji-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 6px;
    padding: 16px;
    max-height: 250px;
    overflow-y: auto;
    background: #fff;
}

.emoji-item {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    transition: all 0.2s;
    background: transparent;
}

.emoji-item:hover {
    background: #f0f0f0;
    transform: scale(1.1);
}

/* 滚动条样式 */
.emoji-grid::-webkit-scrollbar {
    width: 2px;
}

.emoji-grid::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.emoji-grid::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.emoji-grid::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>