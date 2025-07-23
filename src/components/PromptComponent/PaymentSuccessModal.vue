<template>
    <div v-if="isPaymentModalVisible" class="payment-modal">
      <div class="payment-content">
        <h3>支付成功！</h3>
        <p>感谢您的支持！</p>
        <p>支付方式：{{ selectedPaymentMethod }}</p>
        <button @click="closeModal">关闭</button>
      </div>
    </div>
</template>
  
<script setup>
import { defineProps, defineEmits, watch } from 'vue';

// 引入父组件传递的props
const props = defineProps({
  selectedPaymentMethod: {
    type: String,
    required: true
  },
  isPaymentModalVisible: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close-modal']);

const closeModal = () => {
  emit('close-modal');
};

// 监听isPaymentModalVisible，确保其值变化时能够正确显示或隐藏模态框
watch(() => props.isPaymentModalVisible, (newValue) => {
  if (!newValue) {
    closeModal();
  }
});
</script>

<style scoped>
.payment-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}

.payment-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  min-width: 300px;
}

button {
  background: #3FA05C;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}
</style>
