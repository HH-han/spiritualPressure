<template>
  <!-- 博客文章容器，居中显示 -->
  <div class="blog-post-container-center">
    <!-- 左侧按钮组：热门/筛选/最新 -->
    <div class="blog-post-container-left">
      <div class="blog-post-container-left-button">
        <button>热门</button>
        <button>筛选</button>
      </div>
      <button>最新</button>
    </div>
    <!-- 右侧按钮：写游记 -->
    <div class="blog-post-container-right">
      <button>写游记</button>
    </div>
  </div>
</template>

<script setup>
// 这里可以添加组件的逻辑代码
</script>

<style scoped>
/* 主容器样式 */
.blog-post-container-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  margin: 1.5rem auto;
  max-width: 1200px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.blog-post-container-center:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

/* 左按钮组样式 */
.blog-post-container-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.blog-post-container-left-button {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  position: relative;
}

/* 基本按钮样式 */
.blog-post-container-left button,
.blog-post-container-right button {
  position: relative;
  padding: 0.75rem 1.75rem;
  border: none;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  z-index: 1;
}

/* 热门/新鲜按钮样式 */
.blog-post-container-left button,
.blog-post-container-left-button button {
  background: transparent;
  color: #4a5568;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.blog-post-container-left button:hover,
.blog-post-container-left-button button:hover {
  background: rgba(0, 0, 0, 0.02);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}


/* 写帖子按钮样式  */
.blog-post-container-right button {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: white;
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.2);
  padding: 0.85rem 2rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  position: relative;
}

.blog-post-container-right button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(239, 68, 68, 0.3);
  background: linear-gradient(135deg, #fbbf24, #f87171);
}

.blog-post-container-right button:active {
  transform: translateY(0);
}

/* 浮动动画 */
.blog-post-container-right button::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50px;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  z-index: -1;
  opacity: 0.4;
  filter: blur(8px);
  transition: all 0.3s ease;
}

.blog-post-container-right button:hover::before {
  opacity: 0.6;
  filter: blur(12px);
}

/* 按钮的波纹效果 */
.blog-post-container-left button::after,
.blog-post-container-right button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.6);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
  z-index: -1;
}

.blog-post-container-left button:hover::after,
.blog-post-container-right button:hover::after {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.6;
  }

  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .blog-post-container-center {
    flex-direction: column;
    gap: 1.2rem;
    padding: 1.2rem;
    border-radius: 12px;
  }

  .blog-post-container-left {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .blog-post-container-left-button {
    order: 1;
    width: 100%;
    justify-content: space-between;
  }

  .blog-post-container-left>button:not(.blog-post-container-left-button button) {
    order: 2;
  }

  .blog-post-container-right {
    width: 100%;
    order: 3;
  }

  .blog-post-container-right>button {
    width: 100%;
  }
}
</style>