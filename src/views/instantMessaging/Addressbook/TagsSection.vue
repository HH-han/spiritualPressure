<template>
  <div class="contacts-section">
    <div class="section-header" @click="toggleSection">
      <div class="section-title">
        <el-icon><PriceTag /></el-icon>
        <span>标签</span>
      </div>
      <el-icon :class="{ 'rotate-180': expanded }">
        <ArrowDown />
      </el-icon>
    </div>
    <div v-show="expanded" class="section-content">
      <div class="tag-item" v-for="tag in tags" :key="tag.id">
        <span class="tag-name">{{ tag.name }}</span>
        <span class="tag-count">{{ tag.count }}</span>
      </div>
      <div class="create-tag-btn" @click="showCreateTagDialog = true">
        <el-icon><Plus /></el-icon>
        <span>新建标签</span>
      </div>
    </div>
  </div>

  <!-- 新建标签对话框 -->
  <el-dialog
    v-model="showCreateTagDialog"
    title="新建标签"
    width="350px"
    :before-close="handleCloseCreateTagDialog"
  >
    <el-form :model="tagForm" label-width="60px">
      <el-form-item label="标签名">
        <el-input 
          v-model="tagForm.name" 
          placeholder="请输入标签名称"
          size="large"
          maxlength="10"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showCreateTagDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreateTag">
          创建标签
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { PriceTag, ArrowDown, Plus } from '@element-plus/icons-vue'

const props = defineProps({
  tags: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['refresh-tags'])

const expanded = ref(false)
const showCreateTagDialog = ref(false)
const tagForm = ref({
  name: ''
})

const toggleSection = () => {
  expanded.value = !expanded.value
}

const handleCreateTag = async () => {
  try {
    if (!tagForm.value.name) {
      ElMessage.warning('请输入标签名称')
      return
    }
    
    // 这里需要调用创建标签的API
    ElMessage.success('标签创建成功')
    showCreateTagDialog.value = false
    tagForm.value = { name: '' }
    emit('refresh-tags')
  } catch (error) {
    ElMessage.error('创建标签失败')
    console.error('创建标签失败:', error)
  }
}

const handleCloseCreateTagDialog = () => {
  showCreateTagDialog.value = false
  tagForm.value = { name: '' }
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

.tag-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f8f8f8;
}

.tag-name {
  font-size: 14px;
  color: #333;
}

.tag-count {
  font-size: 12px;
  color: #999;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 10px;
}

.create-tag-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  cursor: pointer;
  color: #07c160;
  font-size: 14px;
  transition: background-color 0.2s;
}

.create-tag-btn:hover {
  background: #f8f8f8;
}
</style>