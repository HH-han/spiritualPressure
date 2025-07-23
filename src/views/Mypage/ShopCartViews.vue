<template>
  <div class="shop-cart">
    <ShopCart />
  </div>
  <!-- 背景样式 -->
  <BackgroundStyle />
</template>
<script setup>
import ShopCart from "@/components/DisplayBox/ShopCart.vue";
import BackgroundStyle from '@/components/ThemeComponents/BackgroundStyle.vue';
</script>
<style scoped>
.shop-cart {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  z-index: 1000;
}
</style>