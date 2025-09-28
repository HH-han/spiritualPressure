<template>
  <div class="user-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
      label-position="top"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="formData.username"
          placeholder="请输入用户名"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="formData.email"
          placeholder="请输入邮箱地址"
          type="email"
        />
      </el-form-item>
      
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="formData.phone"
          placeholder="请输入手机号"
          maxlength="11"
        />
      </el-form-item>
      
      <el-form-item label="用户状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="active">活跃</el-radio>
          <el-radio label="inactive">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="handleAvatarUpload"
        >
          <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref()
const loading = ref(false)

const formData = reactive({
  username: '',
  email: '',
  phone: '',
  status: 'active',
  avatar: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择用户状态', trigger: 'change' }
  ]
}

// 监听用户数据变化
watch(() => props.user, (newUser) => {
  if (newUser && props.isEdit) {
    Object.assign(formData, {
      username: newUser.username || '',
      email: newUser.email || '',
      phone: newUser.phone || '',
      status: newUser.status || 'active',
      avatar: newUser.avatar || ''
    })
  }
}, { immediate: true })

const beforeAvatarUpload = (file) => {
  const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPGOrPNG) {
    ElMessage.error('头像只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

const handleAvatarUpload = (options) => {
  const { file } = options
  
  // 模拟上传过程
  loading.value = true
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.avatar = e.target.result
    loading.value = false
    ElMessage.success('头像上传成功')
  }
  reader.readAsDataURL(file)
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (!valid) return
    
    loading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('submit', { ...formData })
    ElMessage.success(props.isEdit ? '用户更新成功' : '用户创建成功')
  } catch (error) {
    console.error('表单提交失败:', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

// 重置表单
onMounted(() => {
  if (!props.isEdit) {
    formRef.value?.resetFields()
  }
})
</script>

<style scoped>
.user-form {
  padding: 20px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  margin-top: 16px;
}

:deep(.el-form) {
  padding: 0 24px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

:deep(.el-form-item:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  border-color: rgba(59, 130, 246, 0.3);
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  margin-bottom: 8px;
  display: block;
  letter-spacing: 0.5px;
}

:deep(.el-input) {
  --el-input-border-radius: 8px;
  --el-input-bg-color: rgba(248, 250, 252, 0.8);
  --el-input-border-color: rgba(226, 232, 240, 0.8);
  --el-input-hover-border-color: rgba(59, 130, 246, 0.5);
  --el-input-focus-border-color: #3b82f6;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
}

:deep(.el-radio-group) {
  display: flex;
  gap: 20px;
}

:deep(.el-radio) {
  margin-right: 0;
}

:deep(.el-radio__label) {
  font-weight: 500;
  color: #475569;
}

.avatar-uploader {
  border: 2px dashed rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.avatar-uploader:hover {
  border-color: #3b82f6;
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

.avatar-uploader-icon {
  font-size: 32px;
  color: #94a3b8;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
  transition: color 0.3s ease;
}

.avatar-uploader:hover .avatar-uploader-icon {
  color: #3b82f6;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.el-form-item:last-child) {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 8px 16px;
  text-align: center;
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 600;
  padding: 12px 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

:deep(.el-button--default) {
  background: rgba(255, 255, 255, 0.9);
  color: #64748b;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

:deep(.el-button--default:hover) {
  background: rgba(248, 250, 252, 0.9);
  color: #475569;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .user-form {
    padding: 16px 0;
    border-radius: 12px;
  }
  
  :deep(.el-form) {
    padding: 0 16px;
  }
  
  :deep(.el-form-item) {
    padding: 12px;
    margin-bottom: 20px;
  }
  
  :deep(.el-radio-group) {
    flex-direction: column;
    gap: 12px;
  }
  
  .avatar-uploader {
    width: 100px;
    height: 100px;
  }
  
  .avatar-uploader-icon {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
  }
  
  :deep(.el-button) {
    width: 100%;
    margin-bottom: 8px;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-form {
  animation: fadeInUp 0.6s ease-out;
}

:deep(.el-form-item) {
  animation: fadeInUp 0.6s ease-out;
}

:deep(.el-form-item):nth-child(1) { animation-delay: 0.1s; }
:deep(.el-form-item):nth-child(2) { animation-delay: 0.2s; }
:deep(.el-form-item):nth-child(3) { animation-delay: 0.3s; }
:deep(.el-form-item):nth-child(4) { animation-delay: 0.4s; }
:deep(.el-form-item):nth-child(5) { animation-delay: 0.5s; }
:deep(.el-form-item):nth-child(6) { animation-delay: 0.6s; }
</style>