<template>
    <div class="custom-alert-tips" v-if="show">
      <div class="alert-content-tips">
        {{ message }}
        <button class="close-button-tips" @click="closeAlert">关闭</button>
      </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue';

const show = ref(false);
const message = ref('');

const openAlert = (msg) => {
  message.value = msg;
  show.value = true;
  setTimeout(() => {
    show.value = false;
  }, 2000);
};

const closeAlert = () => {
  show.value = false;
};
</script>

<style scoped>
.custom-alert-tips {
  position: fixed;
  width: 250px;
  height: 100px;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.alert-content-tips {
  display: flex;
  width: 250px;
  height: 100px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.close-button-tips {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.close-button-tips:hover {
  background-color: #34495e;
}
</style>