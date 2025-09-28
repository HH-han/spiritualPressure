<template>
  <OptionItem 
    label="文件" 
    :icon="Document" 
    option-type="file"
    @select="$emit('select', 'file')"
  >
    <template #icon>
      <el-icon><Document /></el-icon>
    </template>
  </OptionItem>
</template>

<script setup>
import OptionItem from './OptionItem.vue'

defineEmits(['select'])
</script>