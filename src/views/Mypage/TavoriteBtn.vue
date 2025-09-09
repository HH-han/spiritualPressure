<template>
    <!-- 收藏按钮组件 -->
    <button 
        @click="handleCollection" 
        class="btn collection"
        :class="{ 'collected': isCollected }"
        :disabled="loading"
    >
        {{ isCollected ? '已收藏' : '收藏' }}
    </button>
</template>
<script setup>
import { ref, watch, onUnmounted } from 'vue';
import request from '@/utils/request';
import { ElMessage } from "element-plus";

const props = defineProps({
    // 收藏项ID
    itemId: {
        type: [String, Number],
        required: true
    },
    // 收藏项类型
    itemType: {
        type: String,
        default: 'travel'
    },
    // 初始收藏状态
    initialCollected: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:collected', 'collection-change']);

const loading = ref(false);
const isCollected = ref(props.initialCollected);

// 处理收藏操作
const handleCollection = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        ElMessage.error('请先登录');
        return;
    }

    loading.value = true;
    
    try {
        if (isCollected.value) {
            // 取消收藏
            await request({
                url: `/api/public/${props.itemType}-collections/${props.itemId}`,
                method: 'delete'
            });
            isCollected.value = false;
            ElMessage.success('取消收藏成功');
        } else {
            // 添加收藏
            await request({
                url: `/api/public/${props.itemType}-collections`,
                method: 'post',
                data: {
                    item_id: props.itemId,
                    item_type: props.itemType
                }
            });
            isCollected.value = true;
            ElMessage.success('收藏成功');
        }
        
        // 触发事件
        emit('update:collected', isCollected.value);
        emit('collection-change', {
            itemId: props.itemId,
            itemType: props.itemType,
            collected: isCollected.value
        });
        
    } catch (error) {
        console.error('收藏操作失败:', error);
        ElMessage.error(isCollected.value ? '取消收藏失败' : '收藏失败');
    } finally {
        loading.value = false;
    }
};

// 监听初始状态变化
const unwatch = watch(() => props.initialCollected, (newVal) => {
    isCollected.value = newVal;
});

// 组件卸载时取消监听
onUnmounted(() => {
    unwatch();
});     
</script>
<style scoped>
@import "@/css/Btn/btn.css";
</style>