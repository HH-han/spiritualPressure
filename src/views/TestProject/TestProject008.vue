<template>
  <div class="login-container">
    <button @click="cancelModal">取消</button>
    <button @click="closeModal">删除</button>
  </div>
</template>

<script setup>

</script>

<style scoped>
.login-container {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 420px;
  padding: 2.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2),
    0 5px 15px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

</style>