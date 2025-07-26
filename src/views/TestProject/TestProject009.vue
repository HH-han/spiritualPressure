<template>
  <div class="user-detail-container">
    <!-- 背景装饰元素 -->
    <div class="decoration-circle circle-1"></div>
    <div class="decoration-circle circle-2"></div>
    <div class="decoration-circle circle-3"></div>
    
    <!-- 主卡片 -->
    <div class="user-detail-card">
      <!-- 关闭按钮 -->
      <button class="close-btn" @click="closeDetail">
        <i class="fas fa-times"></i>
      </button>
      
      <!-- 用户头像区 -->
      <div class="user-avatar-section">
        <div class="avatar-wrapper">
          <img :src="userDetail.image" alt="用户头像" class="user-avatar">
          <div class="avatar-border"></div>
        </div>
        <h2 class="user-name">{{ userDetail.username }}</h2>
        <p class="user-nickname">{{ userDetail.nickname }}</p>
        <div class="user-tags">
          <span class="tag">VIP</span>
          <span class="tag">活跃用户</span>
          <span class="tag">注册于 {{ formatDate(userDetail.createTime) }}</span>
        </div>
      </div>
      
      <!-- 用户详细信息 -->
      <div class="user-info-section">
        <div class="info-grid">
          <!-- 基本信息 -->
          <div class="info-card">
            <div class="info-header">
              <i class="fas fa-id-card"></i>
              <h3>基本信息</h3>
            </div>
            <div class="info-content">
              <div class="info-item">
                <span class="info-label">用户ID:</span>
                <span class="info-value">{{ userDetail.id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">用户名:</span>
                <span class="info-value">{{ userDetail.username }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">昵称:</span>
                <span class="info-value">{{ userDetail.nickname }}</span>
              </div>
            </div>
          </div>
          
          <!-- 联系信息 -->
          <div class="info-card">
            <div class="info-header">
              <i class="fas fa-envelope"></i>
              <h3>联系信息</h3>
            </div>
            <div class="info-content">
              <div class="info-item">
                <span class="info-label">电子邮箱:</span>
                <span class="info-value">{{ userDetail.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">联系电话:</span>
                <span class="info-value">{{ userDetail.phone }}</span>
              </div>
            </div>
          </div>
          
          <!-- 签名 -->
          <div class="info-card signature-card">
            <div class="info-header">
              <i class="fas fa-quote-left"></i>
              <h3>个性签名</h3>
            </div>
            <div class="info-content">
              <p class="signature-text">{{ userDetail.signature || '暂无签名' }}</p>
            </div>
          </div>
          
          <!-- 经历 -->
          <div class="info-card experience-card">
            <div class="info-header">
              <i class="fas fa-briefcase"></i>
              <h3>个人经历</h3>
            </div>
            <div class="info-content">
              <p class="experience-text">{{ userDetail.experience || '暂无经历信息' }}</p>
            </div>
          </div>
          
          <!-- 时间信息 -->
          <div class="info-card timeline-card">
            <div class="info-header">
              <i class="fas fa-clock"></i>
              <h3>时间信息</h3>
            </div>
            <div class="info-content">
              <div class="timeline">
                <div class="timeline-item">
                  <span class="timeline-label">注册时间:</span>
                  <span class="timeline-value">{{ formatDate(userDetail.createTime) }}</span>
                </div>
                <div class="timeline-item">
                  <span class="timeline-label">最后更新:</span>
                  <span class="timeline-value">{{ formatDate(userDetail.updateTime) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="action-btn edit-btn" @click="editUser">
          <i class="fas fa-edit"></i> 编辑信息
        </button>
        <button class="action-btn message-btn" @click="sendMessage">
          <i class="fas fa-paper-plane"></i> 发送消息
        </button>
        <button class="action-btn delete-btn" @click="confirmDelete">
          <i class="fas fa-trash-alt"></i> 删除用户
        </button>
      </div>
    </div>
    
    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirm" class="confirm-dialog">
      <div class="dialog-content">
        <h3>确认删除</h3>
        <p>确定要删除用户 {{ userDetail.username }} 吗？此操作不可撤销。</p>
        <div class="dialog-buttons">
          <button class="dialog-btn cancel-btn" @click="showDeleteConfirm = false">取消</button>
          <button class="dialog-btn confirm-btn" @click="deleteUser">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserDetail',
  props: {
    userDetail: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDeleteConfirm: false
    }
  },
  methods: {
    closeDetail() {
      this.$emit('close');
    },
    editUser() {
      this.$emit('edit', this.userDetail);
    },
    confirmDelete() {
      this.showDeleteConfirm = true;
    },
    deleteUser() {
      this.$emit('delete', this.userDetail.id);
      this.showDeleteConfirm = false;
    },
    sendMessage() {
      // 发送消息逻辑
      this.$toast.success(`消息已发送给 ${this.userDetail.username}`);
    },
    formatDate(date) {
      if (!date) return '未知';
      return new Date(date).toLocaleString();
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.user-detail-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-family: 'Poppins', sans-serif;
  backdrop-filter: blur(5px);
  overflow-y: auto;
  padding: 20px;
}

.decoration-circle {
  position: fixed;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
  z-index: -1;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -50px;
  left: -50px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: 20px;
  right: 20px;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 30%;
  right: 10%;
}

.user-detail-card {
  position: relative;
  width: 100%;
  max-width: 900px;
  background: linear-gradient(145deg, #2c3e50, #34495e);
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  color: #fff;
  padding: 30px;
  animation: fadeInUp 0.5s ease;
}

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

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #fff;
  transform: rotate(90deg);
}

.user-avatar-section {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 15px;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.avatar-wrapper:hover .user-avatar {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.avatar-border {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px dashed #3498db;
  border-radius: 50%;
  animation: rotate 20s linear infinite;
  opacity: 0.7;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.user-name {
  font-size: 28px;
  margin: 10px 0 5px;
  font-weight: 600;
  color: #fff;
}

.user-nickname {
  font-size: 16px;
  color: #bdc3c7;
  margin-bottom: 15px;
}

.user-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border-color: rgba(52, 152, 219, 0.5);
}

.info-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-header i {
  font-size: 20px;
  color: #3498db;
  margin-right: 10px;
}

.info-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.info-content {
  padding: 5px 0;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
  font-size: 14px;
}

.info-label {
  color: #bdc3c7;
  min-width: 80px;
  font-weight: 300;
}

.info-value {
  color: #fff;
  font-weight: 400;
}

.signature-card, .experience-card {
  grid-column: span 2;
}

.signature-text, .experience-text {
  font-style: italic;
  line-height: 1.6;
  color: #ecf0f1;
}

.timeline-item {
  display: flex;
  margin-bottom: 8px;
}

.timeline-label {
  color: #bdc3c7;
  min-width: 100px;
  font-weight: 300;
}

.timeline-value {
  color: #fff;
  font-weight: 400;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.action-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn i {
  font-size: 16px;
}

.edit-btn {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.edit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.message-btn {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
}

.message-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);
}

.delete-btn {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.delete-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
}

.confirm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.dialog-content {
  background: #2c3e50;
  padding: 30px;
  border-radius: 15px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.dialog-content h3 {
  margin-top: 0;
  color: #e74c3c;
  font-size: 22px;
}

.dialog-content p {
  margin-bottom: 25px;
  color: #ecf0f1;
}

.dialog-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.dialog-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #7f8c8d;
  color: white;
}

.cancel-btn:hover {
  background: #95a5a6;
}

.confirm-btn {
  background: #e74c3c;
  color: white;
}

.confirm-btn:hover {
  background: #c0392b;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-detail-card {
    padding: 20px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .signature-card, .experience-card {
    grid-column: span 1;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>