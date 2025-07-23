<template>
    <div class="test-project-home">
        <div class="hero-section">
            <h1 class="hero-title">测试项目平台</h1>
            <p class="hero-subtitle">高效、可靠的测试解决方案</p>
        </div>

        <div class="container-test-project-home">
            <section class="intro-section">
                <h2 class="section-title">项目简介</h2>
                <div class="section-content">
                    <p>欢迎使用测试项目平台，本平台提供了一系列专业测试工具和页面，旨在帮助开发者和测试人员更高效地进行软件质量保障工作。</p>
                    <p>通过左侧导航栏，您可以访问不同的测试功能模块，每个模块都针对特定的测试场景设计，满足从单元测试到集成测试的各种需求。</p>
                </div>
            </section>

            <section class="features-section">
                <h2 class="section-title">测试页面功能</h2>
                <div class="features-grid">
                    <div class="feature-card" v-for="(feature, index) in features" :key="index">
                        <div class="feature-icon">
                            <i :class="feature.icon"></i>
                        </div>
                        <h3 class="feature-title">{{ feature.title }}</h3>
                        <p class="feature-desc">{{ feature.description }}</p>
                    </div>
                </div>
            </section>

            <section class="importance-section">
                <h2 class="section-title">测试的重要性</h2>
                <div class="importance-content">
                    <div class="importance-item" v-for="(item, index) in importanceItems" :key="index">
                        <div class="importance-number">{{ index + 1 }}</div>
                        <div class="importance-text">
                            <h3>{{ item.title }}</h3>
                            <p>{{ item.description }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="getting-started">
                <h2 class="section-title">快速开始</h2>
                <div class="steps">
                    <div class="step" v-for="(step, index) in steps" :key="index">
                        <div class="step-number">步骤 {{ index + 1 }}</div>
                        <div class="step-content">{{ step }}</div>
                    </div>
                </div>
                <button class="start-button" @click="navigateToFirstTest">
                    开始测试 <i class="fas fa-arrow-right"></i>
                </button>
            </section>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const features = ref([
    {
        icon: 'fas fa-bug',
        title: '缺陷检测',
        description: '全面检测系统中的各类缺陷和异常情况，提高软件稳定性。'
    },
    {
        icon: 'fas fa-tachometer-alt',
        title: '性能测试',
        description: '评估系统在不同负载下的性能表现，确保系统响应速度。'
    },
    {
        icon: 'fas fa-shield-alt',
        title: '安全测试',
        description: '发现潜在安全漏洞，保护系统和用户数据安全。'
    },
    {
        icon: 'fas fa-mobile-alt',
        title: '兼容性测试',
        description: '确保应用在不同设备和浏览器上的兼容性和一致性。'
    },
    {
        icon: 'fas fa-user-check',
        title: '用户体验测试',
        description: '评估用户界面和交互设计，提升用户满意度。'
    },
    {
        icon: 'fas fa-code-branch',
        title: '集成测试',
        description: '验证不同模块间的交互和集成是否正常工作。'
    }
])

const importanceItems = ref([
    {
        title: '提高软件质量',
        description: '通过系统化测试发现并修复缺陷，显著提升软件产品质量。'
    },
    {
        title: '降低维护成本',
        description: '早期发现问题比后期修复成本低得多，有效控制项目预算。'
    },
    {
        title: '增强用户信心',
        description: '经过充分测试的产品能够建立用户信任，提升品牌形象。'
    },
    {
        title: '加速开发流程',
        description: '自动化测试可以快速反馈问题，缩短开发迭代周期。'
    }
])

const steps = ref([
    '从左侧导航栏选择需要的测试模块',
    '根据测试需求配置相关参数',
    '执行测试并查看详细报告',
    '分析结果并优化系统'
])

const navigateToFirstTest = () => {
    // 假设第一个测试页面是TestProject001
    router.push({ name: 'TestProject001' })
}
</script>

<style scoped>
.test-project-home {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
               Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #1a1a1a;
  line-height: 1.6;
  background-color: #f8fafc;
  border-radius: 25px;
}

.hero-section {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 6rem 2rem 5rem;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
  border-radius: 25px 25px 0px 0px;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  position: relative;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 400;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto;
  position: relative;
}

.container-test-project-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  color: #1e293b;
  position: relative;
  padding-bottom: 0.75rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 5px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 3px;
}

.section-content {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.03), 
              0 4px 6px -4px rgba(0, 0, 0, 0.03);
  margin-bottom: 4rem;
  border: 1px solid #f1f5f9;
}

.section-content p {
  margin-bottom: 1.25rem;
  font-size: 1.1rem;
  color: #475569;
  line-height: 1.8;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
  margin-bottom: 4rem;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.03), 
              0 4px 6px -4px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #6366f1, #8b5cf6);
  transition: width 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 
              0 10px 10px -5px rgba(0, 0, 0, 0.02);
  border-color: #e2e8f0;
}

.feature-card:hover::before {
  width: 8px;
}

.feature-icon {
  font-size: 2.75rem;
  color: #6366f1;
  margin-bottom: 1.75rem;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.feature-title {
  font-size: 1.375rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: #1e293b;
}

.feature-desc {
  color: #64748b;
  font-size: 1.05rem;
  line-height: 1.7;
}

.importance-content {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.03), 
              0 4px 6px -4px rgba(0, 0, 0, 0.03);
  margin-bottom: 4rem;
  border: 1px solid #f1f5f9;
}

.importance-item {
  display: flex;
  margin-bottom: 2.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid #f1f5f9;
  align-items: flex-start;
}

.importance-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.importance-number {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-right: 2rem;
  flex-shrink: 0;
  font-size: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2), 
              0 2px 4px -2px rgba(99, 102, 241, 0.2);
}

.importance-text h3 {
  font-size: 1.375rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1e293b;
}

.importance-text p {
  color: #64748b;
  font-size: 1.05rem;
  line-height: 1.7;
}

.steps {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.03), 
              0 4px 6px -4px rgba(0, 0, 0, 0.03);
  margin-bottom: 3rem;
  border: 1px solid #f1f5f9;
}

.step {
  display: flex;
  margin-bottom: 2rem;
  align-items: flex-start;
}

.step:last-child {
  margin-bottom: 0;
}

.step-number {
  width: 100px;
  font-weight: 700;
  color: #6366f1;
  font-size: 1.1rem;
}

.step-content {
  flex: 1;
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.8;
}

.start-button {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  padding: 1.25rem 2.5rem;
  font-size: 1.15rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  margin: 0 auto;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3), 
              0 2px 4px -2px rgba(99, 102, 241, 0.3);
}

.start-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3), 
              0 4px 6px -4px rgba(99, 102, 241, 0.3);
}

.start-button:active {
  transform: translateY(0);
}

.start-button i {
  margin-left: 0.75rem;
  transition: transform 0.3s ease;
}

.start-button:hover i {
  transform: translateX(4px);
}

@media (max-width: 1024px) {
  .hero-title {
    font-size: 3rem;
  }
  
  .hero-subtitle {
    font-size: 1.3rem;
  }
  
  .features-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .importance-item {
    flex-direction: column;
  }
  
  .importance-number {
    margin-bottom: 1.5rem;
    margin-right: 0;
  }
  
  .step {
    flex-direction: column;
  }
  
  .step-number {
    margin-bottom: 0.75rem;
    width: auto;
  }
  
  .section-content,
  .importance-content,
  .steps {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 4rem 1.5rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .container {
    padding: 0 1.5rem;
  }
  
  .section-content,
  .importance-content,
  .steps {
    padding: 1.5rem;
  }
  
  .feature-card {
    padding: 2rem 1.5rem;
  }
  
  .start-button {
    width: 100%;
    justify-content: center;
  }
}
</style>