<!-- CustomAlert.vue -->
<template>
    <div class="custom-alert-map" v-if="show_map">
      <div class="alert-content-map">
        {{ message }}
        <button class="close-button-map" @click="closeAlert">关闭</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        show_map: false, // 控制提示框的显示和隐藏
        message: '', // 提示内容
      };
    },
    methods: {
      openAlert(message) {
        this.message = message;
        this.show_map = true;
        // 2秒后自动关闭提示框
        setTimeout(() => {
          this.$router.push({ name: 'gaodemap' });
        }, 3000);
      },
      closeAlert() {
        this.show_map = false;
      },
    },
  };
  </script>
  
  <style scoped>
  .custom-alert-map {
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  .alert-content-map {
    display: flex;
    width: 250px;
    height: 100px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  
  .close-button-map {
    background-color: #54a4ff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .close-button-map:hover {
    background-color: #34495e;
  }
  </style>