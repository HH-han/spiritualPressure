<template>
  <OptionItem 
    label="位置" 
    :icon="Location" 
    option-type="location"
    @select="$emit('select', 'location')"
  >
    <template #icon>
      <el-icon><Location /></el-icon>
    </template>
  </OptionItem>
</template>

<script setup>
import OptionItem from './OptionItem.vue'

defineEmits(['select'])
</script>