<template>
  <div id="app">
    <RefreshLoad v-if="isLoading" />
    <router-view v-else />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import RefreshLoad from '@/components/TransitionalComponents/RefreshLoad.vue'
const isLoading = ref(true)

onMounted(() => {
  // 模拟加载过程
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>
<style scoped>
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

