<template>
  <div class="app">
    <ModernCarousel 
      :items="slides" 
      :interval="5000" 
      :transitionDuration="700"
      aspectRatio="16/9"
    />
  </div>
</template>

<script setup>
import ModernCarousel from '@/views/TestProject/TestProject010.vue'

const slides = [
  {
    image: 'https://picsum.photos/1200/400?random=1',
    title: '第一张幻灯片',
    description: '这是第一张幻灯片的描述内容'
  },
  {
    image: 'https://picsum.photos/1200/400?random=2',
    title: '第二张幻灯片',
    description: '这是第二张幻灯片的描述内容'
  },
  {
    image: 'https://picsum.photos/1200/400?random=3',
    title: '第三张幻灯片',
    description: '这是第三张幻灯片的描述内容'
  }
]
</script>

<style>

</style>