<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="更多选项"
    width="420px"
    :before-close="handleClose"
    custom-class="more-options-dialog"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    align-center
  >
    <div class="dialog-content">
      <OptionsGrid @select="handleOptionSelect" />
    </div>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import OptionsGrid from './OptionsGrid.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select-option', 'update:visible'])

const handleClose = () => {
  emit('update:visible', false)
}

const handleOptionSelect = (optionType, data) => {
  if (optionType === 'emoji' && data) {
    // 表情选项，传递数据
    emit('select-option', optionType, data)
  } else {
    // 其他选项显示开发中提示
    ElMessage.info(`${getOptionLabel(optionType)}功能开发中`)
    emit('select-option', optionType)
  }
  handleClose()
}

const getOptionLabel = (optionType) => {
  const labels = {
    emoji: '图片表情',
    album: '相册',
    music: '音乐',
    file: '文件',
    location: '位置',
    card: '名片'
  }
  return labels[optionType] || optionType
}
</script>

<style scoped>
.more-options-dialog {
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.more-options-dialog .el-dialog__header {
  margin: 0;
  padding: 24px 24px 0;
  border-bottom: none;
}

.more-options-dialog .el-dialog__headerbtn {
  top: 30px;
  right: 24px;
}

.more-options-dialog .el-dialog__body {
  padding: 0;
}

.dialog-content {
  padding: 0 24px 24px;
}

/* 动画效果 */
.more-options-dialog {
  animation: dialogSlideIn 0.3s ease-out;
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

</style>