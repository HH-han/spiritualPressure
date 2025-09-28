<template>
    <!-- 表情选择器 -->
    <div v-if="showEmojiPicker" class="emoji-picker">
        <div class="emoji-header">
            <span class="emoji-title">表情</span>
            <el-icon class="emoji-close" @click="closeEmojiPicker">
                <Close />
            </el-icon>
        </div>
        <!-- 表情网格 -->
        <div class="emoji-grid">
            <div v-for="(emoji, index) in filteredEmojis" :key="index" class="emoji-item" @click="selectEmoji(emoji)"
                :title="emoji.description">
                {{ emoji.emojiChar }}
            </div>
        </div>

        <!-- 表情分类标签 -->
        <div class="emoji-switching">
            <!-- 左侧按钮 -->
            <div>
                <el-button type="text" size="small" @click="scrollCategories(-1)">
                    <el-icon>
                        <ArrowLeft />
                    </el-icon>
                </el-button>
            </div>
            <!-- 分类标签 -->
            <div class="emoji-categories">
                <div v-for="category in categories" :key="category.type"
                    :class="['category-tab', { active: activeCategory === category.type }]"
                    @click="activeCategory = category.type">
                    {{ category.name }}
                </div>
            </div>
            <!-- 右侧按钮 -->
            <div>
                <el-button type="text" size="small" @click="scrollCategories(1)">
                    <el-icon>
                        <ArrowRight />
                    </el-icon>
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits, defineProps, computed, nextTick } from 'vue'
import { getEmojiList } from '@/api/im.js'
import { ElIcon, ElButton } from 'element-plus'
import { Close, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

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

// 滚动分类标签
const scrollCategories = (direction) => {
    const currentIndex = categories.findIndex(cat => cat.type === activeCategory.value)
    let newIndex = currentIndex + direction
    
    // 边界检查
    if (newIndex < 0) {
        newIndex = categories.length - 1
    } else if (newIndex >= categories.length) {
        newIndex = 0
    }
    
    activeCategory.value = categories[newIndex].type
    
    // 确保选中的分类标签在视窗范围内
    nextTick(() => {
        const categoriesContainer = document.querySelector('.emoji-categories')
        const activeTab = document.querySelector('.category-tab.active')
        
        if (categoriesContainer && activeTab) {
            const containerRect = categoriesContainer.getBoundingClientRect()
            const tabRect = activeTab.getBoundingClientRect()
            
            // 检查标签是否在容器视窗内
            if (tabRect.left < containerRect.left) {
                // 标签在左侧不可见，向左滚动
                activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
            } else if (tabRect.right > containerRect.right) {
                // 标签在右侧不可见，向右滚动
                activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' })
            }
        }
    })
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
@import './css/emoji-list.css';
</style>