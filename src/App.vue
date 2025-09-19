<template>
  <!-- 设备检测组件（始终渲染但隐藏） -->
  <DeviceDetects ref="deviceDetectsRef" style="display: none;" />
  <div v-if="isMobile">
    <DeviceDetects />
  </div>
  <!-- PC设备正常显示 -->
  <div v-else>
    <!-- loading 加载中效果-->
    <div id="app">
      <RefreshLoad v-if="isLoading" />
      <router-view v-else />
    </div>
    <!-- 悬浮按钮 -->
    <div>
      <FloatingButton />
    </div>
    <!-- 流体仿真效果 -->
    <!-- <div>
      <FluidSimulation />
    </div> -->
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import RefreshLoad from '@/components/TransitionalComponents/RefreshLoad.vue';
import FloatingButton from '@/components/ComponentButton/FloatingButton.vue';
import FluidSimulation from '@/components/DisplayBox/FluidSimulation.vue';
import DeviceDetects from '@/components/ResponseComponents/DeviceDetects.vue';

const isLoading = ref(true)
const deviceDetectsRef = ref()
const isMobile = ref(false)

onMounted(() => {
  // 模拟加载过程
  setTimeout(() => {
    isLoading.value = false
    
    // 获取DeviceDetects组件中的isMobile状态
    if (deviceDetectsRef.value) {
      isMobile.value = deviceDetectsRef.value.isMobile
    }
  }, 1000)
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

/* 兼容各浏览器的滚动条样式 */
body{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow-y: auto;
}

body::-webkit-scrollbar {
  width: 2px;
  height: 150px;
}

body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

body::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
