<template>
    <header class="navigationbar">
        <div class="navigationbar-logo">
            <i class="fas fa-plane"></i>
            博览旅行
        </div>
        <div class="navigationbar-search">
            <input type="text" placeholder="搜索目的地/景点/酒店">
            <i class="fas fa-search"></i>
        </div>
        <div class="navigationbar-user">
            <img v-if="!userInfo.image" :src="defaultAvatar" alt="默认头像" class="navigationbar-user fa-user">
            <img v-else :src="userInfo.image" alt="用户头像" class="navigationbar-user fa-user">
        </div>
    </header>
</template>
<script setup>
import { ref,onMounted } from 'vue'
import { ElMessage } from 'element-plus';

const defaultAvatar = new URL('@/assets/defaultimage/mrtx.png', import.meta.url).href
// 获取用户数据
const fetchUserInfo = async () => {
  try {
    loading.value = true;
    const localUser = JSON.parse(localStorage.getItem('user') || {});
    userInfo.value = { ...localUser };
    

  } finally {
     loading.value = false;
  }
};
const loading = ref(false);
// 用户信息
const userInfo = ref({
  image: ''
});

// 生命周期钩子
onMounted(
    fetchUserInfo
);
</script>
<style scoped>
@import "@/css/Response/ResponseCss.css";
</style>