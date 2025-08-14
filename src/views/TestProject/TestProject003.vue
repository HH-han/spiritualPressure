<template>
  <button @click="showModal = true">打开删除确认框</button>
  
  <DeleteModal v-model="showModal" @close="handleClose">
    <h2>确认删除吗？</h2>
    <p>此操作不可撤销，请谨慎操作</p>
    <div class="actions">
      <button @click="showModal = false">取消</button>
      <button @click="confirmDelete">确认删除</button>
    </div>
  </DeleteModal>
</template>

<script setup>
import { ref } from 'vue'
import DeleteModal from '@/views/TestProject/TestProject007.vue'

const showModal = ref(false)

function confirmDelete() {
  console.log('执行删除操作')
  showModal.value = false
}

function handleClose() {
  console.log('模态框已关闭')
}
</script>

<style scoped>
.actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>