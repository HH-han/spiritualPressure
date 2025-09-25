<template>
  <div class="contacts-search">
    <el-input
      v-model="searchKeyword"
      placeholder="搜索"
      size="large"
      clearable
      @input="handleSearch"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const searchKeyword = ref('')

const emit = defineEmits(['search'])

const handleSearch = () => {
  emit('search', searchKeyword.value)
}
</script>

<style scoped>
.contacts-search {
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}
</style>