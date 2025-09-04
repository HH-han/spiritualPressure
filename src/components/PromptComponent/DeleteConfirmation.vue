<template>
    <!-- 删除提示框 -->
    <div class="delete-prompt-overlay">
        <div class="delete-prompt">
            <div class="delete-prompt-title">
                <span>删除确认</span>
                <svg t="1756948340246" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="4523">
                    <path
                        d="M1001.661867 796.544c48.896 84.906667 7.68 157.013333-87.552 157.013333H110.781867c-97.834667 0-139.050667-69.504-90.112-157.013333l401.664-666.88c48.896-87.552 128.725333-87.552 177.664 0l401.664 666.88zM479.165867 296.533333v341.333334a32 32 0 1 0 64 0v-341.333334a32 32 0 1 0-64 0z m0 469.333334v42.666666a32 32 0 1 0 64 0v-42.666666a32 32 0 1 0-64 0z"
                        fill="#d81e06" p-id="4524"></path>
                </svg>
            </div>
            <div class="delete-prompt-line"></div>
            <div class="delete-prompt-content">
              <span>确定要删除该条数据吗？删除后该条数据将被,</span>
              <span class="delete-prompt-content-highlight">永久删除</span>
              <span>无法恢复。</span>
            </div>
            <div class="delete-prompt-btn">
                <button class="delete-prompt-btn-cancel" @click="closeDeletePrompt">取消</button>
                <button class="delete-prompt-btn-confirm" @click="confirmDelete">确定</button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const props = defineProps({
  isDeletePromptVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'confirm']);

const closeDeletePrompt = () => {
  emit('close');
};

const confirmDelete = () => {
  emit('confirm');
};
</script>
<style scoped>
@import '@/css/Management/BackgroundManagement.css';
</style>
