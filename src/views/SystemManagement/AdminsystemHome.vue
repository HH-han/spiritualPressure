<template>
  <div class="systemhome-container">
    <header class="systemhome-header">
      <div class="systemhome-header-content">
        <h1 class="systemhome-title">博览业务管理系统</h1>
        <p class="systemhome-subtitle">高效 · 智能 · 安全</p>
      </div>
      <div class="systemhome-header-decoration"></div>
    </header>

    <main class="systemhome-main">
      <section class="systemhome-hero">
        <div class="systemhome-hero-content">
          <h2 class="systemhome-hero-title">欢迎使用新一代业务平台</h2>
          <p class="systemhome-hero-description">
            我们的系统集成了最先进的技术，为您提供全方位的业务支持，从数据分析到流程管理，一切尽在掌握。
          </p>
          <button class="systemhome-hero-button">立即体验</button>
        </div>
        <div class="systemhome-hero-image">
          <div class="systemhome-hero-image-placeholder"></div>
        </div>
      </section>

      <section class="systemhome-features">
        <h2 class="systemhome-features-title">核心特性</h2>
        <div class="systemhome-features-grid">
          <div class="systemhome-feature-card">
            <div class="systemhome-feature-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12,2L1,12H4V22H20V12H23M11,15V18H13V15M15,15V18H17V15M7,15V18H9V15Z" />
              </svg>
            </div>
            <h3 class="systemhome-feature-title">智能分析</h3>
            <p class="systemhome-feature-description">
              基于AI的数据分析，提供精准的业务洞察和预测。
            </p>
          </div>
          <div class="systemhome-feature-card">
            <div class="systemhome-feature-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12,3L2,12H5V20H19V12H22M12,7.7L16,11.2V18H13V14H11V18H8V11.2M12,8.8L9,11.4H15L12,8.8Z" />
              </svg>
            </div>
            <h3 class="systemhome-feature-title">流程自动化</h3>
            <p class="systemhome-feature-description">
              自动化业务流程，减少人工干预，提高工作效率。
            </p>
          </div>
          <div class="systemhome-feature-card">
            <div class="systemhome-feature-icon">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5M12,7C13.4,7 14.8,8.1 14.8,9.5V11C15.4,11 16,11.6 16,12.3V15.8C16,16.4 15.4,17 14.7,17H9.2C8.6,17 8,16.4 8,15.7V12.2C8,11.6 8.6,11 9.2,11V9.5C9.2,8.1 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z" />
              </svg>
            </div>
            <h3 class="systemhome-feature-title">安全保障</h3>
            <p class="systemhome-feature-description">
              多层次安全防护，确保您的数据和业务安全无忧。
            </p>
          </div>
        </div>
      </section>

      <section class="systemhome-stats">
        <div class="systemhome-stat-item">
          <div class="systemhome-stat-number">98.9%</div>
          <div class="systemhome-stat-label">系统可用性</div>
        </div>
        <div class="systemhome-stat-item">
          <div class="systemhome-stat-number">1500+</div>
          <div class="systemhome-stat-label">企业用户</div>
        </div>
        <div class="systemhome-stat-item">
          <div class="systemhome-stat-number">24/7</div>
          <div class="systemhome-stat-label">技术支持</div>
        </div>
      </section>

      <section class="systemhome-cta">
        <h2 class="systemhome-cta-title">准备好提升您的业务效率了吗？</h2>
        <p class="systemhome-cta-description">
          立即注册，体验智能业务管理系统带来的变革。
        </p>
        <div class="systemhome-cta-buttons">
          <button class="systemhome-cta-button systemhome-cta-button-primary">免费试用</button>
          <button class="systemhome-cta-button">联系我们</button>
        </div>
      </section>
    </main>

    <footer class="systemhome-footer">
      <div class="systemhome-footer-content">
        <div class="systemhome-footer-section">
          <h3 class="systemhome-footer-title">关于我们</h3>
          <p class="systemhome-footer-text">
            我们致力于为企业提供最优质的数字化解决方案，助力企业数字化转型。
          </p>
        </div>
        <div class="systemhome-footer-section">
          <h3 class="systemhome-footer-title">联系方式</h3>
          <p class="systemhome-footer-text">
            邮箱: contact@businesssystem.com<br>
            电话: 400-123-4567
          </p>
        </div>
      </div>
      <div class="systemhome-footer-copyright">
        © 2023 智能业务管理系统 版权所有
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 可以在这里添加一些简单的交互逻辑
const animateStats = ref(false)

onMounted(() => {
  // 当页面加载完成后，触发统计数字的动画
  setTimeout(() => {
    animateStats.value = true
  }, 500)
})
</script>

<style scoped>
/* 基础样式重置 */
.systemhome-container {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  line-height: 1.6;
  overflow-x: hidden;
}

/* 头部样式 */
.systemhome-header {
  position: relative;
  height: 80vh;
  border-radius: 25px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.systemhome-header-content {
  text-align: center;
  z-index: 2;
  padding: 0 20px;
}

.systemhome-title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.systemhome-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.systemhome-header-decoration {
  position: absolute;
  bottom: -150px;
  left: -50px;
  width: 120%;
  height: 300px;
  background: white;
  transform: rotate(-5deg);
}

/* 主要内容区域 */
.systemhome-main {
  max-width: 1200px;
  margin: -100px auto 0;
  padding: 0 20px;
  position: relative;
}

/* 英雄区域 */
.systemhome-hero {
  display: flex;
  background: white;
  border-radius: 10px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 80px;
}

.systemhome-hero-content {
  flex: 1;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.systemhome-hero-title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.systemhome-hero-description {
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  color: #7f8c8d;
  line-height: 1.8;
}

.systemhome-hero-button {
  align-self: flex-start;
  padding: 12px 30px;
  background: linear-gradient(to right, #6e8efb, #a777e3);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(106, 120, 251, 0.4);
}

.systemhome-hero-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(106, 120, 251, 0.6);
}

.systemhome-hero-image {
  flex: 1;
  position: relative;
  min-height: 400px;
}

.systemhome-hero-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #f5f7fa, #e4e8eb);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 特性区域 */
.systemhome-features {
  margin-bottom: 100px;
  text-align: center;
}

.systemhome-features-title {
  font-size: 2.2rem;
  margin-bottom: 60px;
  color: #2c3e50;
  position: relative;
  display: inline-block;
}

.systemhome-features-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #6e8efb, #a777e3);
  border-radius: 2px;
}

.systemhome-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 50px;
}

.systemhome-feature-card {
  background: white;
  border-radius: 10px;
  padding: 40px 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.systemhome-feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.systemhome-feature-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.systemhome-feature-icon svg {
  width: 40px;
  height: 40px;
  fill: white;
}

.systemhome-feature-title {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #2c3e50;
}

.systemhome-feature-description {
  color: #7f8c8d;
  font-size: 1rem;
  line-height: 1.7;
}

/* 统计区域 */
.systemhome-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 100px;
  flex-wrap: wrap;
  background-color: #ffffff;
  border-radius: 25px;
}

.systemhome-stat-item {
  text-align: center;
  padding: 30px;
  min-width: 200px;
}

.systemhome-stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: #6e8efb;
  margin-bottom: 10px;
  transition: all 1s ease-out;
  transform: translateY(20px);
}

.systemhome-stats .systemhome-stat-item:nth-child(1) .systemhome-stat-number {
  transition-delay: 0.1s;
}

.systemhome-stats .systemhome-stat-item:nth-child(2) .systemhome-stat-number {
  transition-delay: 0.3s;
}

.systemhome-stats .systemhome-stat-item:nth-child(3) .systemhome-stat-number {
  transition-delay: 0.5s;
}

.systemhome-stat-number.animated {
  opacity: 1;
  transform: translateY(0);
}

.systemhome-stat-label {
  font-size: 1.2rem;
  color: #7f8c8d;
}

/* CTA区域 */
.systemhome-cta {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  border-radius: 10px;
  padding: 60px;
  text-align: center;
  color: white;
  margin-bottom: 80px;
}

.systemhome-cta-title {
  font-size: 2.2rem;
  margin-bottom: 20px;
}

.systemhome-cta-description {
  font-size: 1.1rem;
  margin-bottom: 40px;
  opacity: 0.9;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.systemhome-cta-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.systemhome-cta-button {
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.systemhome-cta-button-primary {
  background: white;
  color: #6e8efb;
  border: none;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
}

.systemhome-cta-button-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
}

.systemhome-cta-button {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.systemhome-cta-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

/* 页脚 */
.systemhome-footer {
  background: #2c3e50;
  color: white;
  padding: 60px 0 0;
  border-radius: 25px;
}

.systemhome-footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 40px;
}

.systemhome-footer-section {
  flex: 1;
  min-width: 250px;
}

.systemhome-footer-title {
  font-size: 1.3rem;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 10px;
}

.systemhome-footer-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: #6e8efb;
}

.systemhome-footer-text {
  opacity: 0.8;
  line-height: 1.8;
}

.systemhome-footer-copyright {
  text-align: center;
  padding: 20px;
  margin-top: 60px;
  background: rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
  opacity: 0.7;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .systemhome-hero {
    flex-direction: column;
  }

  .systemhome-hero-image {
    min-height: 300px;
    order: -1;
  }

  .systemhome-hero-content {
    padding: 40px;
  }

  .systemhome-title {
    font-size: 2.8rem;
  }
}

@media (max-width: 768px) {
  .systemhome-header {
    height: 70vh;
  }

  .systemhome-title {
    font-size: 2.2rem;
  }

  .systemhome-subtitle {
    font-size: 1.2rem;
  }

  .systemhome-hero-title {
    font-size: 2rem;
  }

  .systemhome-features-title,
  .systemhome-cta-title {
    font-size: 1.8rem;
  }

  .systemhome-cta {
    padding: 40px 20px;
  }
}
</style>
