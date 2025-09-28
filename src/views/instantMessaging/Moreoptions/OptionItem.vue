<template>
  <div class="option-item" @click="handleClick">
    <div class="option-icon">
      <slot name="icon">
        <el-icon><component :is="icon" /></el-icon>
      </slot>
    </div>
    <div class="option-label">{{ label }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  icon: {
    type: [String, Object],
    default: null
  },
  optionType: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['select'])

const handleClick = () => {
  emit('select', props.optionType)
}
</script>

<style scoped>
.option-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-width: 80px;
}

.option-item:hover {
  background-color: #f5f5f5;
  transform: scale(1.05);
}

.option-icon {
  width: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.option-icon .el-icon {
  font-size: 24px;
  color: white;
}

.option-label {
  font-size: 12px;
  color: #666;
  text-align: center;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .option-item {
    padding: 10px;
    min-width: 70px;
  }
  
  .option-icon {
    width: 40px;
    height: 40px;
  }
  
  .option-icon .el-icon {
    font-size: 20px;
  }
}
</style>