<template>
  <TestPage />
  <div>
    <h1>DynamicEmoji</h1>
    <RecommendAtion />
    <DynamicEmoji />
    <SafetyTips />
  </div>
  <div>
    <button @click="shoppinCart(card.id)" class="edit-button-BH">加入购物车</button>
  </div>
</template>
<script setup>
import DynamicEmoji from '../../components/PromptComponent/DynamicEmoji.vue';
</script>