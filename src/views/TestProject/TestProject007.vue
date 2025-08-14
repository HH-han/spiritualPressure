<template>
  <transition name="modal-fade">
    <div 
      v-if="visible"
      class="delete-modal-mask"
      @click.self="handleMaskClick"
    >
      <div class="delete-modal-content">
        <slot></slot>
        <button @click="close" class="close-btn">×</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  closeOnClickMask: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const visible = ref(false)
const isClosing = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      open()
    } else {
      close()
    }
  }
)

function open() {
  visible.value = true
  isClosing.value = false
  document.body.style.overflow = 'hidden' // 防止背景滚动
}

function close() {
  if (!visible.value) return
  
  isClosing.value = true
  setTimeout(() => {
    visible.value = false
    isClosing.value = false
    emit('update:modelValue', false)
    emit('close')
    document.body.style.overflow = '' // 恢复滚动
  }, 300) // 匹配动画时间
}

function handleMaskClick() {
  if (props.closeOnClickMask) {
    close()
  }
}
</script>

<style scoped>
.delete-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* 模糊背景效果 */
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  
  /* 动画设置 */
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.delete-modal-content {
  position: relative;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 80%;
  max-height: 80vh;
  overflow-y: auto;
  
  /* 内容动画 */
  transform: scale(0.9);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: transform 0.2s;
}

.close-btn:hover {
  transform: scale(1.2);
  color: #333;
}

/* 进入动画 */
.modal-fade-enter-active .delete-modal-content,
.modal-fade-enter-to .delete-modal-content {
  transform: scale(1);
  opacity: 1;
}

/* 离开动画 */
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-leave-active .delete-modal-content {
  transition: all 0.2s cubic-bezier(0.6, -0.28, 0.735, 0.045);
}
.modal-fade-leave-to .delete-modal-content {
  transform: scale(0.9);
  opacity: 0;
}
</style>