<template>
  <div class="contacts-section">
    <div class="section-header" @click="toggleSection">
      <div class="section-title">
        <el-icon><Document /></el-icon>
        <span>公众号</span>
      </div>
      <el-icon :class="{ 'rotate-180': expanded }">
        <ArrowDown />
      </el-icon>
    </div>
    <div v-show="expanded" class="section-content">
      <div class="official-account-item" v-for="account in officialAccounts" :key="account.id">
        <el-avatar :size="40" :src="account.avatar" />
        <div class="account-info">
          <div class="account-name">{{ account.name }}</div>
          <div class="account-desc">{{ account.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  officialAccounts: {
    type: Array,
    default: () => []
  }
})

const expanded = ref(false)

const toggleSection = () => {
  expanded.value = !expanded.value
}
</script>

<style scoped>
.contacts-section {
  background: white;
  margin-bottom: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.section-header:hover {
  background: #f8f8f8;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.section-content {
  padding: 8px 0;
}

.official-account-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f8f8f8;
}

.official-account-item:hover {
  background: #f8f8f8;
}

.account-info {
  flex: 1;
  margin-left: 12px;
}

.account-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.account-desc {
  font-size: 12px;
  color: #999;
}
</style>