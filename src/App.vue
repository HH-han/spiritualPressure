<template>
  <!-- loading 加载中效果-->
  <div id="app">
    <RefreshLoad v-if="isLoading" />
    <router-view v-else />
  </div>
  <!-- 悬浮按钮 -->
  <div>
    <FloatingButton />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import RefreshLoad from '@/components/TransitionalComponents/RefreshLoad.vue'
import FloatingButton from '@/components/ComponentButton/FloatingButton.vue';

const isLoading = ref(true)
onMounted(() => {
  // 模拟加载过程
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Montserrat', 'Noto Sans SC', sans-serif;
}
</style>

