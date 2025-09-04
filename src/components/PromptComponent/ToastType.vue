<template>
    <div class="custom-toast" :class="toastType">
        <span class="toast-icon">{{ toastType === 'success' ? '✓' : '✕' }}</span>
        {{ toastMessage }}
    </div>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  toastMessage: {
    type: String,
    default: ''
  },
  toastType: {
    type: String,
    default: 'success'
  }
})
</script>
<style scoped>
@import '@/css/Management/BackgroundManagement.css';
</style>