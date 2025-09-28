<template>
  <OptionItem 
    label="名片" 
    :icon="User" 
    option-type="card"
    @select="$emit('select', 'card')"
  >
    <template #icon>
      <el-icon><User /></el-icon>
    </template>
  </OptionItem>
</template>

<script setup>
import OptionItem from './OptionItem.vue'

defineEmits(['select'])
</script>