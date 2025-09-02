<template>
    <!-- 按钮 -->
    <button @click="collection(selectedBlog.id)" class="btn collection">收藏</button>
</template>
<script setup>
import { ref } from 'vue';
import request from '@/utils/request';
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router';
const router = useRouter();

</script>
<style scoped>
@import "@/css/Btn/btn.css";
</style>