<template>
  <OptionItem 
    label="音乐" 
    :icon="Headset" 
    option-type="music"
    @select="$emit('select', 'music')"
  >
    <template #icon>
      <el-icon><Headset /></el-icon>
    </template>
  </OptionItem>
</template>

<script setup>
import { Headset } from '@element-plus/icons-vue'
import OptionItem from './OptionItem.vue'

defineEmits(['select'])
</script>