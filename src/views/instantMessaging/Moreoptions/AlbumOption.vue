<template>
  <OptionItem 
    label="相册" 
    :icon="Picture" 
    option-type="album"
    @select="$emit('select', 'album')"
  >
    <template #icon>
      <el-icon><Picture /></el-icon>
    </template>
  </OptionItem>
</template>

<script setup>
import OptionItem from './OptionItem.vue'

defineEmits(['select'])
</script>