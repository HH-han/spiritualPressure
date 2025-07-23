<template>
    <div class="phone-settings-center">
        <div class="phone-header">
            <h1 class="phone-title">帮助中心</h1>
            <div class="phone-search-bar">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="搜索帮助内容..." v-model="searchQuery" @input="filterArticles">
            </div>
        </div>

        <div class="phone-settings-container">
            <!-- 常见问题卡片 -->
            <div class="phone-settings-card">
                <div class="phone-card-header">
                    <h2 class="phone-card-title">
                        <i class="fas fa-question-circle phone-title-icon"></i>
                        常见问题
                    </h2>
                </div>

                <div class="phone-settings-group">
                    <div class="phone-help-item" v-for="(item, index) in filteredFaqs" :key="'faq-' + index"
                        @click="toggleFaq(index)">
                        <div class="phone-help-question">
                            <i class="fas" :class="item.expanded ? 'fa-minus' : 'fa-plus'"></i>
                            {{ item.question }}
                        </div>
                        <div class="phone-help-answer" v-show="item.expanded">
                            {{ item.answer }}
                            <div class="phone-help-actions" v-if="item.link">
                                <a :href="item.link" target="_blank">了解更多</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 使用指南卡片 -->
            <div class="phone-settings-card">
                <div class="phone-card-header">
                    <h2 class="phone-card-title">
                        <i class="fas fa-book phone-title-icon"></i>
                        使用指南
                    </h2>
                </div>

                <div class="phone-settings-group">
                    <div class="phone-guide-category" v-for="(category, index) in filteredGuides" :key="'guide-' + index">
                        <h3 class="phone-guide-title">
                            <i :class="category.icon"></i>
                            {{ category.title }}
                        </h3>
                        <div class="phone-guide-list">
                            <div class="phone-guide-item" v-for="(guide, gIndex) in category.items"
                                :key="'guide-item-' + gIndex" @click="showGuideDetail(guide)">
                                <div class="phone-guide-name">
                                    <i class="fas fa-file-alt"></i>
                                    {{ guide.title }}
                                </div>
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 联系我们卡片 -->
            <div class="phone-settings-card">
                <div class="phone-card-header">
                    <h2 class="phone-card-title">
                        <i class="fas fa-headset phone-title-icon"></i>
                        联系我们
                    </h2>
                </div>

                <div class="phone-settings-group">
                    <div class="phone-contact-methods">
                        <div class="phone-contact-item">
                            <div class="phone-contact-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div class="phone-contact-info">
                                <div class="phone-contact-title">电子邮件</div>
                                <div class="phone-contact-value">support@example.com</div>
                                <button class="phone-contact-action" @click="sendEmail">
                                    发送邮件
                                </button>
                            </div>
                        </div>

                        <div class="phone-contact-item">
                            <div class="phone-contact-icon">
                                <i class="fas fa-phone-alt"></i>
                            </div>
                            <div class="phone-contact-info">
                                <div class="phone-contact-title">客服电话</div>
                                <div class="phone-contact-value">400-123-4567</div>
                                <button class="phone-contact-action" @click="makeCall">
                                    拨打电话
                                </button>
                            </div>
                        </div>

                        <div class="phone-contact-item">
                            <div class="phone-contact-icon">
                                <i class="fas fa-comment-dots"></i>
                            </div>
                            <div class="phone-contact-info">
                                <div class="phone-contact-title">在线客服</div>
                                <div class="phone-contact-value">周一至周日 9:00-18:00</div>
                                <button class="phone-contact-action" @click="startChat">
                                    开始聊天
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 反馈卡片 -->
            <div class="phone-settings-card">
                <div class="phone-card-header">
                    <h2 class="phone-card-title">
                        <i class="fas fa-comment-medical phone-title-icon"></i>
                        意见反馈
                    </h2>
                </div>

                <div class="phone-settings-group">
                    <div class="phone-feedback-form">
                        <div class="phone-form-group">
                            <label class="phone-form-label">反馈类型</label>
                            <select class="phone-select" v-model="feedback.type">
                                <option value="suggestion">功能建议</option>
                                <option value="bug">错误报告</option>
                                <option value="complaint">投诉</option>
                                <option value="other">其他</option>
                            </select>
                        </div>

                        <div class="phone-form-group">
                            <label class="phone-form-label">反馈内容</label>
                            <textarea class="phone-textarea" placeholder="请详细描述您的问题或建议..."
                                v-model="feedback.content"></textarea>
                        </div>

                        <div class="phone-form-group">
                            <label class="phone-form-label">联系方式(可选)</label>
                            <input type="text" class="phone-modal-input" placeholder="邮箱/电话" v-model="feedback.contact">
                        </div>

                        <button class="phone-action-btn phone-save-btn" @click="submitFeedback">
                            <i class="fas fa-paper-plane"></i> 提交反馈
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 指南详情模态框 -->
        <div class="phone-modal" v-if="showGuideModal">
            <div class="phone-modal-content phone-guide-modal">
                <div class="phone-modal-header">
                    <h3>{{ currentGuide.title }}</h3>
                    <button class="phone-close-btn" @click="closeGuideModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="phone-modal-body">
                    <div class="phone-guide-content" v-html="currentGuide.content"></div>
                </div>
                <div class="phone-modal-footer">
                    <button class="phone-modal-btn phone-cancel-btn" @click="closeGuideModal">
                        关闭
                    </button>
                    <button class="phone-modal-btn phone-confirm-btn" @click="rateGuide(currentGuide)"
                        v-if="!currentGuide.rated">
                        <i class="fas fa-thumbs-up"></i> 这篇有帮助
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const showGuideModal = ref(false);
const currentGuide = ref({});
const feedback = ref({
    type: 'suggestion',
    content: '',
    contact: ''
});

const faqs = ref([
    {
        question: '如何重置密码？',
        answer: '您可以在登录页面点击"忘记密码"链接，按照提示操作即可重置密码。重置链接将发送到您的注册邮箱。',
        expanded: false,
        link: '/help/reset-password'
    },
    {
        question: '为什么我无法上传文件？',
        answer: '请检查文件大小是否超过限制(最大50MB)，以及文件格式是否符合要求(支持jpg,png,pdf,doc等常见格式)。如果问题依旧，请联系客服。',
        expanded: false
    },
    {
        question: '如何升级会员等级？',
        answer: '进入"账户设置"-"会员中心"，选择您想要的会员等级并完成支付即可立即升级。',
        expanded: false,
        link: '/pricing'
    },
    {
        question: '系统支持哪些支付方式？',
        answer: '我们支持支付宝、微信支付、银联卡和国际信用卡(Visa, MasterCard等)。',
        expanded: false
    }
]);

const guides = ref([
    {
        title: '入门指南',
        icon: 'fas fa-rocket',
        items: [
            {
                title: '新手指南',
                content: '<p>欢迎使用我们的服务！本指南将帮助您快速上手：</p><ol><li>注册并验证您的账户</li><li>完善个人资料</li><li>探索主要功能</li><li>自定义您的偏好设置</li></ol>'
            },
            {
                title: '账户安全设置',
                content: '<p>保护您的账户安全非常重要：</p><ul><li>设置强密码</li><li>启用双重验证</li><li>定期检查登录设备</li><li>警惕钓鱼邮件</li></ul>'
            }
        ]
    },
    {
        title: '高级功能',
        icon: 'fas fa-cogs',
        items: [
            {
                title: 'API集成指南',
                content: '<p>我们的API文档详细介绍了如何将服务集成到您的应用中：</p><p>1. 获取API密钥</p><p>2. 阅读接口文档</p><p>3. 测试调用</p><p>4. 正式部署</p>'
            },
            {
                title: '数据分析功能',
                content: '<p>利用我们的数据分析工具获取洞察：</p><ul><li>数据可视化</li><li>自定义报表</li><li>实时监控</li><li>导出数据</li></ul>'
            }
        ]
    }
]);

const filteredFaqs = computed(() => {
    if (!searchQuery.value) return faqs.value;
    return faqs.value.filter(item =>
        item.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const filteredGuides = computed(() => {
    if (!searchQuery.value) return guides.value;

    return guides.value.map(category => ({
        ...category,
        items: category.items.filter(item =>
            item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.content.toLowerCase().includes(searchQuery.value.toLowerCase()))
    })).filter(category => category.items.length > 0);
});

function toggleFaq(index) {
    faqs.value[index].expanded = !faqs.value[index].expanded;
}

function showGuideDetail(guide) {
    currentGuide.value = { ...guide, rated: false };
    showGuideModal.value = true;
}

function closeGuideModal() {
    showGuideModal.value = false;
}

function rateGuide(guide) {
    guide.rated = true;
    // 这里可以添加实际评价提交逻辑
}

function submitFeedback() {
    if (!feedback.value.content) {
        alert('请填写反馈内容');
        return;
    }

    // 这里添加提交反馈的逻辑
    alert('感谢您的反馈！我们会尽快处理。');
    feedback.value = {
        type: 'suggestion',
        content: '',
        contact: ''
    };
}

function sendEmail() {
    window.location.href = 'mailto:support@example.com';
}

function makeCall() {
    // 在实际应用中可以使用 tel: 协议
    alert('拨打客服电话: 400-123-4567');
}

function startChat() {
    alert('正在连接在线客服...');
}

function filterArticles() {
    // 搜索功能已经在计算属性中实现
}
</script>

<style scoped>
.phone-settings-center {
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
    max-width: 100%;
    background-color: #f5f7fa;
    color: #333;
    padding: 20px;
    box-sizing: border-box;
}

.phone-header {
    margin-bottom: 25px;
}

.phone-title {
    color: #2c3e50;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 20px;
    text-align: center;
}

.phone-search-bar {
    position: relative;
    margin: 0 auto;
    max-width: 600px;
}

.phone-search-bar i {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #7f8c8d;
}

.phone-search-bar input {
    width: 100%;
    padding: 12px 20px 12px 45px;
    border: 1px solid #e0e0e0;
    border-radius: 30px;
    font-size: 16px;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.phone-search-bar input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 2px 15px rgba(52, 152, 219, 0.2);
}

.phone-settings-container {
    display: flex;
    flex-direction: column;
    gap: 25px;
    max-width: 800px;
    margin: 0 auto;
}

.phone-settings-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.phone-settings-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.phone-card-header {
    padding: 18px 20px;
    border-bottom: 1px solid #f0f0f0;
    background: linear-gradient(135deg, #118dcb 0%, #2575fc 100%);
    color: #ffffff;
}

.phone-card-title {
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    display: flex;
    align-items: center;
    margin: 0;
}

.phone-title-icon {
    margin-right: 10px;
    color: #ffffff;
}

.phone-settings-group {
    padding: 15px 20px;
}

/* 常见问题样式 */
.phone-help-item {
    margin-bottom: 12px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #eaeaea;
    transition: all 0.2s ease;
}

.phone-help-item:hover {
    border-color: #d0e3ff;
}

.phone-help-question {
    padding: 15px;
    background-color: #f8fafc;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #34495e;
}

.phone-help-question i {
    margin-right: 10px;
    font-size: 14px;
    color: #3498db;
}

.phone-help-answer {
    padding: 15px;
    background-color: white;
    color: #555;
    line-height: 1.6;
    border-top: 1px solid #f0f0f0;
    animation: fadeIn 0.3s ease;
}

.phone-help-actions {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px dashed #eee;
}

.phone-help-actions a {
    color: #3498db;
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
}

.phone-help-actions a:hover {
    text-decoration: underline;
}

/* 使用指南样式 */
.phone-guide-category {
    margin-bottom: 20px;
}

.phone-guide-title {
    font-size: 16px;
    color: #2c3e50;
    margin: 15px 0 10px;
    display: flex;
    align-items: center;
}

.phone-guide-title i {
    margin-right: 10px;
    color: #3498db;
    width: 20px;
    text-align: center;
}

.phone-guide-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.phone-guide-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    background-color: #f9f9f9;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.phone-guide-item:hover {
    background-color: #f0f7ff;
    transform: translateX(5px);
}

.phone-guide-name {
    display: flex;
    align-items: center;
    color: #34495e;
}

.phone-guide-name i {
    margin-right: 10px;
    color: #7f8c8d;
    font-size: 14px;
}

.phone-guide-item .fa-chevron-right {
    color: #bdc3c7;
    font-size: 12px;
}

/* 联系我们样式 */
.phone-contact-methods {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.phone-contact-item {
    display: flex;
    padding: 15px;
    background-color: #f8fafc;
    border-radius: 10px;
    align-items: center;
    transition: all 0.2s ease;
}

.phone-contact-item:hover {
    background-color: #f0f7ff;
}

.phone-contact-icon {
    width: 50px;
    height: 50px;
    background-color: #e3f2fd;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    color: #3498db;
    font-size: 20px;
}

.phone-contact-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex: 1;
}

.phone-contact-title {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 3px;
}

.phone-contact-value {
    color: #7f8c8d;
    font-size: 14px;
    margin-bottom: 8px;
}

.phone-contact-action {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.phone-contact-action:hover {
    background-color: #2980b9;
    transform: translateY(-1px);
}

/* 反馈表单样式 */
.phone-feedback-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.phone-form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.phone-form-label {
    font-weight: 500;
    color: #2c3e50;
    font-size: 14px;
}

.phone-select,
.phone-modal-input,
.phone-textarea {
    padding: 12px 15px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 15px;
    background-color: white;
    transition: all 0.2s ease;
}

.phone-select:focus,
.phone-modal-input:focus,
.phone-textarea:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.phone-textarea {
    min-height: 120px;
    resize: vertical;
}

.phone-action-btn {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 15px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
}

.phone-save-btn {
    background-color: #3498db;
    color: white;
}

.phone-save-btn:hover {
    background-color: #2980b9;
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(52, 152, 219, 0.3);
}

/* 模态框样式 */
.phone-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

.phone-modal-content {
    background-color: white;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.3s ease;
}

.phone-guide-modal {
    max-height: 85vh;
}

.phone-modal-header {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.phone-modal-header h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 18px;
}

.phone-close-btn {
    background: none;
    border: none;
    color: #7f8c8d;
    font-size: 18px;
    cursor: pointer;
    padding: 5px;
    transition: all 0.2s ease;
}

.phone-close-btn:hover {
    color: #e74c3c;
    transform: rotate(90deg);
}

.phone-modal-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
}

.phone-guide-content {
    line-height: 1.7;
    color: #555;
}

.phone-guide-content p {
    margin-bottom: 15px;
}

.phone-modal-footer {
    padding: 15px 20px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.phone-modal-btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #e0e0e0;
    background-color: white;
}

.phone-confirm-btn {
    background-color: #3498db;
    color: white;
    border-color: #3498db;
}

.phone-confirm-btn:hover {
    background-color: #2980b9;
    border-color: #2980b9;
}

.phone-cancel-btn:hover {
    background-color: #f5f5f5;
}

/* 动画 */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .phone-settings-center {
        padding: 15px;
    }

    .phone-title {
        font-size: 24px;
    }

    .phone-card-header {
        padding: 15px;
    }

    .phone-settings-group {
        padding: 15px;
    }

    .phone-contact-item {
        flex-direction: row;
        align-items: center;
        gap: 5px;
    }

    .phone-contact-icon {
        margin-right: 0;
        margin-bottom: 10px;
    }
}
</style>