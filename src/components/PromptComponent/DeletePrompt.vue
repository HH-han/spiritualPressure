<template>
  <div v-if="isDeletePromptVisible" class="delete-prompt">
    <div class="delete-prompt-title">提示</div>
    <div class="delete-prompt-content">确定要删除吗？</div>
    <div class="delete-prompt-btn">
      <div class="delete-prompt-btn-cancel-nt" @click="closeDeletePrompt">
        <button>取消</button>
      </div>
      <div class="delete-prompt-btn-confirm-nt" @click="deleteProduct">
        <button>确定</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isDeletePromptVisible: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'delete'],
  methods: {
    closeDeletePrompt() {
      this.$emit('close');
    },
    deleteProduct() {
      this.$emit('delete');
    }
  }
};
</script>
<style scoped>
/* 整体容器样式 */
.delete-prompt {
  width: 300px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  text-align: center;
}

/* 标题样式 */
.delete-prompt-title {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10px;
}

/* 内容样式 */
.delete-prompt-content {
  font-size: 16px;
  color: #666666;
  margin-bottom: 20px;
}

/* 按钮容器样式 */
.delete-prompt-btn {
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* 按钮通用样式 */
.delete-prompt-btn button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
}

/* 取消按钮样式 */
.delete-prompt-btn-cancel-nt button {
  background-color: #cccccc;
  color: #ffffff;
}

.delete-prompt-btn-cancel-nt button:hover {
  background-color: #aaaaaa;
}

/* 确定按钮样式 */
.delete-prompt-btn-confirm-nt button {
  background-color: #007bff;
  color: #ffffff;
}

.delete-prompt-btn-confirm-nt button:hover {
  background-color: #0056b3;
}
</style>