<template>
    <!-- 按钮 -->
    <button @click="collection(selectedBlog.id)" class="btn collection">收藏</button>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import request from '@/utils/request';
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router';
const router = useRouter();
// 新增
const collection = async (blogId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        ElMessage.error('请先登录');
        return;
    }
    await fetchData();
    const blog = blogs.value.find((c) => c.id === blogId);
    if (blog) {
        router.push({
            name: 'collection',
            query: {
                item: JSON.stringify({
                    id: blog.id,
                    name: blog.title,
                    price: blog.price,
                    image: blog.image,
                    rating: blog.sales,
                    details: blog.description
                }),
            },
        });
    }
};
const blogs = ref([]);
const fetchData = async () => {
    try {
        const response = await request({
            url: '/api/public/travel-collections',
            method: 'post',
        });
        blogs.value = response.data;
    } catch (error) {
        console.error('获取景点数据失败:', error);
    }
};     
</script>
<style scoped>
@import "@/css/Btn/btn.css";
</style>