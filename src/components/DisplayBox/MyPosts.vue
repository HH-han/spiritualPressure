<template>
  <div class="myposts-container">
    <div class="myposts-background">
      <div class="myposts-stars"></div>
      <div class="myposts-stars2"></div>
      <div class="myposts-stars3"></div>
    </div>

    <div class="myposts-card">
      <h1 class="myposts-title">分享你的旅行故事 ✈️</h1>
      <!-- 故事表单 -->
      <form @submit.prevent="submitPost" class="myposts-form">
        <div class="myposts-form-group-left">
          <div class="myposts-form-group">
            <label for="title" class="myposts-label">标题:</label>
            <input type="text" id="title" v-model="post.title" class="myposts-input" placeholder="为你的旅行起个吸引人的标题"
              required>
          </div>

          <div class="myposts-form-group">
            <label for="location" class="myposts-label">地点:</label>
            <div class="myposts-input-with-icon">
              <i class="myposts-icon fas fa-map-marker-alt"></i>
              <input type="text" id="location" v-model="post.location" class="myposts-input" placeholder="你去过哪里?"
                required>
            </div>
          </div>

          <div class="myposts-form-group">
            <label for="date" class="myposts-label">旅行日期:</label>
            <input type="date" id="date" v-model="post.date" class="myposts-input" required>
          </div>
          <div class="myposts-form-group">
            <label class="myposts-label">标签:</label>
            <div class="myposts-tags-container">
              <div v-for="(tag, index) in post.tags" :key="index" class="myposts-tag">
                {{ tag }}
                <button @click="removeTag(index)" class="myposts-tag-remove">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <input type="text" v-model="newTag" @keydown.enter.prevent="addTag" class="myposts-tag-input"
                placeholder="添加标签 (按Enter确认)">
            </div>
          </div>
        </div>

        <div class="myposts-form-group-right">
          <div class="myposts-form-group">
            <label for="content" class="myposts-label">你的故事:</label>
            <textarea id="content" v-model="post.content" class="myposts-textarea" placeholder="分享你的旅行经历、感受和建议..."
              rows="6" required></textarea>
          </div>

          <div class="myposts-form-group">
            <label class="myposts-label">上传照片:</label>
            <div class="myposts-upload-area" @click="triggerFileInput" @dragover.prevent @drop="handleDrop">
              <i class="myposts-upload-icon fas fa-cloud-upload-alt"></i>
              <p class="myposts-upload-text">拖放照片到这里或点击上传</p>
              <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" class="myposts-file-input">
            </div>
            <div class="myposts-preview-container" v-if="post.images.length > 0">
              <div v-for="(image, index) in post.images" :key="index" class="myposts-preview-item">
                <img :src="image.preview" class="myposts-preview-image">
                <button @click="removeImage(index)" class="myposts-remove-image">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <!-- 提交按钮 -->
      <div class="myposts-submit-container">
        <button @click="submitPost" class="myposts-submit-btn">
            <span v-if="!isSubmitting">发布分享</span>
            <span v-else class="myposts-spinner">
              <i class="fas fa-spinner fa-spin"></i> 发布中...
            </span>
        </button>
      </div>

    </div>

    <div v-if="showSuccess" class="myposts-success-modal">
      <div class="myposts-success-content">
        <i class="myposts-success-icon fas fa-check-circle"></i>
        <h2 class="myposts-success-title">发布成功!</h2>
        <p class="myposts-success-message">你的旅行故事已成功分享给全世界!</p>
        <button @click="resetForm" class="myposts-success-btn">继续分享</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

const userInfo = JSON.parse(localStorage.getItem('user'));

const post = ref({
  username: userInfo?.username || '',
  title: '',
  location: '',
  date: '',
  content: '',
  images: '',
  tags: ['旅行', '探险']
});

const newTag = ref('');
const isSubmitting = ref(false);
const showSuccess = ref(false);
const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (e) => {
  const files = e.target.files;
  handleFiles(files);
};

const handleDrop = (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  handleFiles(files);
};

const handleFiles = (files) => {
  if (files.length > 0) {
    const file = files[0];
    if (file.type.startsWith('image/')) {
      // 验证图片大小不超过5MB
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        ElMessage.error('图片大小不能超过5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        post.value.images = [{
          file,
          preview: e.target.result
        }];
      };
      reader.readAsDataURL(file);
    }
  }
};

const removeImage = (index) => {
  post.value.images.splice(index, 1);
};

const addTag = () => {
  if (newTag.value.trim() && !post.value.tags.includes(newTag.value.trim())) {
    post.value.tags.push(newTag.value.trim());
    newTag.value = '';
  }
};

const removeTag = (index) => {
  post.value.tags.splice(index, 1);
};

const submitPost = async () => {
  isSubmitting.value = true;
  try {
    const postData = {
      username: post.value.username,
      title: post.value.title,
      location: post.value.location,
      date: post.value.date ? new Date(post.value.date).toISOString() : null,
      content: post.value.content,
      tags: post.value.tags.join(','),
      images: post.value.images.length > 0 ? post.value.images[0].preview : null
    };

    await request.post('/api/public/posts', postData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    showSuccess.value = true;
  } catch (error) {
    console.error('发布失败:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  post.value = {
    username: '',
    title: '',
    location: '',
    date: '',
    content: '',
    images: '',
    tags: ['旅行', '探险']
  };
  showSuccess.value = false;
};
</script>

<style>
:root {
  --myposts-primary: #6a11cb;
  --myposts-secondary: #2575fc;
  --myposts-accent: #ff4d4d;
  --myposts-light: #ffffff;
  --myposts-dark: #1a1a2e;
  --myposts-gray: #e6e6e6;
  --myposts-text: #333333;
  --myposts-success: #4BB543;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.myposts-container {
  position: relative;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.myposts-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.myposts-stars,
.myposts-stars2,
.myposts-stars3 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}

@keyframes myposts-animate-background {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-100%);
  }
}

.myposts-card {
  position: fixed;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(197, 197, 197, 0.2) 100%);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transform-style: preserve-3d;
  transform: perspective(1000px);
  transition: all 0.5s ease;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.myposts-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.15);
}

.myposts-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--myposts-primary);
  text-align: center;
  background: linear-gradient(to right, var(--myposts-primary), var(--myposts-secondary));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  margin-bottom: 10px;
}


.myposts-title:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(to right, var(--myposts-primary), var(--myposts-secondary));
  border-radius: 2px;
}

.myposts-form {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  align-items: stretch;
  justify-content: space-between;
}

.myposts-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.myposts-form-group-left,
.myposts-form-group-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.516);
  border-radius: 15px;
  padding: 25px;
  flex: 1;
  transition: all 0.3s ease;
}
.myposts-form-group-left:hover,
.myposts-form-group-right:hover {
  transform: scale(1.02);
}
.myposts-label {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--myposts-text);
}

.myposts-input,
.myposts-textarea {
  padding: 0.8rem 1rem;
  border: 2px solid var(--myposts-gray);
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.8);
}

.myposts-input:focus,
.myposts-textarea:focus {
  outline: none;
  border-color: var(--myposts-primary);
  box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.2);
}

.myposts-textarea {
  resize: vertical;
  min-height: 120px;
}

.myposts-input-with-icon {
  position: relative;
}

.myposts-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--myposts-primary);
}

.myposts-input-with-icon .myposts-input {
  width: 100%;
  padding-left: 3rem;
}

.myposts-upload-area {
  border: 2px dashed var(--myposts-gray);
  border-radius: 10px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.5);
}

.myposts-upload-area:hover {
  border-color: var(--myposts-primary);
  background-color: rgba(106, 17, 203, 0.05);
}

.myposts-upload-icon {
  font-size: 2.5rem;
  color: var(--myposts-primary);
  margin-bottom: 1rem;
}

.myposts-upload-text {
  color: var(--myposts-text);
  font-weight: 500;
  text-align: center;
}

.myposts-file-input {
  display: none;
}

.myposts-preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.myposts-preview-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.myposts-preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.myposts-remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 25px;
  height: 25px;
  background: var(--myposts-accent);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.myposts-preview-item:hover .myposts-remove-image {
  opacity: 1;
}

.myposts-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.myposts-tag {
  background: linear-gradient(to right, var(--myposts-primary), var(--myposts-secondary));
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.myposts-tag-remove {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
}

.myposts-tag-input {
  flex: 1;
  min-width: 150px;
  padding: 0.5rem 1rem;
  border: 2px solid var(--myposts-gray);
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.myposts-tag-input:focus {
  outline: none;
  border-color: var(--myposts-primary);
}

.myposts-submit-container{
  width: 100%;
  display: flex;
  justify-content: flex-end;

}

.myposts-submit-btn {
  background: linear-gradient(to right, var(--myposts-primary), var(--myposts-secondary));
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
  position: relative;
  overflow: hidden;
}

.myposts-submit-btn:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.myposts-submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(106, 17, 203, 0.4);
}

.myposts-submit-btn:hover:before {
  left: 100%;
}

.myposts-submit-btn:active {
  transform: translateY(0);
}

.myposts-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.myposts-success-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(5px);
}

.myposts-success-content {
  background-color: rgba(255, 255, 255, 0.6);
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: myposts-modal-appear 0.5s ease;
}

@keyframes myposts-modal-appear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.myposts-success-icon {
  font-size: 5rem;
  color: var(--myposts-success);
  margin-bottom: 1.5rem;
}

.myposts-success-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--myposts-primary);
}

.myposts-success-message {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: var(--myposts-text);
}

.myposts-success-btn {
  background: linear-gradient(to right, var(--myposts-primary), var(--myposts-secondary));
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
}

.myposts-success-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(106, 17, 203, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .myposts-container {
    padding: 1rem;
  }

  .myposts-card {
    padding: 1.5rem;
  }

  .myposts-title {
    font-size: 2rem;
  }
}
</style>