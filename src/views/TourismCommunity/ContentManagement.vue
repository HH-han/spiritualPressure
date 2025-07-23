<template>
  <div class="managementreview-container">
    <h2>内容管理与审核功能</h2>

    <!-- 内容发布审核部分 -->
    <div class="managementreview-review">
      <div class="managementreview-section-title">内容发布审核</div>

      <form class="managementreview-form">
        <div class="managementreview-form-group">
          <label class="managementreview-label">内容类型</label>
          <select class="managementreview-select" v-model="newContent.type">
            <option value="">请选择内容类型</option>
            <option value="guide">旅游攻略</option>
            <option value="question">问答</option>
            <option value="comment">评论</option>
          </select>
        </div>

        <div class="managementreview-form-group">
          <label class="managementreview-label">发布者</label>
          <input type="text" class="managementreview-input" v-model="newContent.author" placeholder="请输入发布者">
        </div>

        <div class="managementreview-form-group">
          <label class="managementreview-label">标题</label>
          <input type="text" class="managementreview-input" v-model="newContent.title" placeholder="请输入标题">
        </div>

        <div class="managementreview-form-group">
          <label class="managementreview-label">发布日期</label>
          <input type="date" class="managementreview-input" v-model="newContent.date">
        </div>

        <div class="managementreview-form-group" style="grid-column: span 2;">
          <label class="managementreview-label">内容</label>
          <textarea class="managementreview-textarea" v-model="newContent.content" placeholder="请输入内容"></textarea>
        </div>

        <div class="managementreview-form-group" style="grid-column: span 2;">
          <label class="managementreview-label">审核意见</label>
          <textarea class="managementreview-textarea" v-model="newContent.reviewComment"
            placeholder="请输入审核意见"></textarea>
        </div>

        <div style="grid-column: span 2; text-align: center;">
          <button type="button" class="managementreview-button" @click="submitReview">提交审核</button>
        </div>
      </form>

      <div>
        <div class="managementreview-section-title">待审核内容</div>

        <div class="managementreview-pending" v-for="content in pendingContents" :key="content.id">
          <div class="managementreview-pending-title">{{ content.title }}</div>
          <div class="managementreview-pending-content">
            {{ content.content }}
          </div>
          <div class="managementreview-pending-meta">
            <span>类型: {{ content.type }}</span>
            <span>发布者: {{ content.author }}</span>
            <span>日期: {{ content.date }}</span>
          </div>
          <div class="managementreview-pending-actions">
            <button class="managementreview-btn-approve" @click="handleApproval(content.id, true)">通过</button>
            <button class="managementreview-btn-reject" @click="handleApproval(content.id, false)">拒绝</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 举报与投诉处理部分 -->
    <div class="managementreview-report">
      <div class="managementreview-section-title">举报与投诉处理</div>

      <form class="managementreview-report-form">
        <div class="managementreview-form-group">
          <label class="managementreview-label">举报类型</label>
          <select class="managementreview-select" v-model="newReport.type">
            <option value="">请选择举报类型</option>
            <option value="content">内容违规</option>
            <option value="user">用户行为</option>
            <option value="other">其他</option>
          </select>
        </div>

        <div class="managementreview-form-group">
          <label class="managementreview-label">举报对象</label>
          <input type="text" class="managementreview-input" v-model="newReport.target" placeholder="请输入举报对象">
        </div>

        <div class="managementreview-form-group" style="grid-column: span 2;">
          <label class="managementreview-label">举报内容</label>
          <textarea class="managementreview-textarea" v-model="newReport.content" placeholder="请详细描述举报内容"></textarea>
        </div>

        <div style="grid-column: span 2; text-align: center;">
          <button type="button" class="managementreview-button" @click="submitReport">提交举报</button>
        </div>
      </form>

      <div class="managementreview-report-list">
        <div class="managementreview-report-item" v-for="report in reports" :key="report.id">
          <div class="managementreview-report-title">{{ report.type }}举报 - {{ report.target }}</div>
          <div class="managementreview-report-content">
            {{ report.content }}
          </div>
          <div class="managementreview-report-status">状态：{{ report.status }}</div>
        </div>
      </div>
    </div>

    <!-- 社区规范与公告部分 -->
    <div class="managementreview-guidelines">
      <div class="managementreview-section-title">社区规范与公告</div>

      <div class="managementreview-guidelines-list">
        <div class="managementreview-item" v-for="(guideline, index) in guidelines" :key="'g' + index">
          <div class="managementreview-item-title">{{ guideline.title }}</div>
          <div class="managementreview-item-content">
            {{ guideline.content }}
          </div>
          <div class="managementreview-item-date">{{ guideline.date }}</div>
        </div>
      </div>

      <div class="managementreview-announcements-list">
        <div class="managementreview-item" v-for="(announcement, index) in announcements" :key="'a' + index">
          <div class="managementreview-item-title">{{ announcement.title }}</div>
          <div class="managementreview-item-content">
            {{ announcement.content }}
          </div>
          <div class="managementreview-item-date">{{ announcement.date }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'

// 内容审核数据
const pendingContents = ref([
  {
    id: 1,
    title: '杭州西湖一日游攻略',
    content: '本攻略详细介绍杭州西湖一日游的路线安排...',
    type: 'guide',
    author: '用户A',
    date: '2023-10-15'
  },
  {
    id: 2,
    title: '关于云南旅游的问答',
    content: '请问云南旅游的最佳季节是什么时候...',
    type: 'question',
    author: '用户B',
    date: '2023-10-14'
  }
])

const newContent = reactive({
  type: '',
  author: '',
  title: '',
  date: '',
  content: '',
  reviewComment: ''
})

const submitReview = () => {
  if (!newContent.type || !newContent.content) {
    alert('请填写必要字段')
    return
  }

  pendingContents.value.unshift({
    id: Date.now(),
    ...newContent
  })

  Object.keys(newContent).forEach(key => newContent[key] = '')
}

const handleApproval = (id, approved) => {
  pendingContents.value = pendingContents.value.filter(item => item.id !== id)
  alert(approved ? '内容已通过' : '内容已拒绝')
}

// 举报处理数据
const reports = ref([
  {
    id: 1,
    type: 'content',
    target: '用户123',
    content: '攻略中包含不实信息',
    status: '已处理'
  },
  {
    id: 2,
    type: 'user',
    target: '背包客',
    content: '发布攻击性言论',
    status: '处理中'
  }
])

const newReport = reactive({
  type: '',
  target: '',
  content: ''
})

const submitReport = () => {
  if (!newReport.type || !newReport.content) {
    alert('请填写必要字段')
    return
  }

  reports.value.unshift({
    id: Date.now(),
    status: '待处理',
    ...newReport
  })

  Object.keys(newReport).forEach(key => newReport[key] = '')
}

// 社区规范数据
const guidelines = ref([
  {
    title: '社区行为准则',
    content: '用户应遵守法律法规...',
    date: '2023-05-15'
  }
])

const announcements = ref([
  {
    title: '系统升级公告',
    content: '社区将于2023年10月1日进行系统升级...',
    date: '2023-09-20'
  }
])
</script>

<style scoped>
:root {
  --primary-color: #422c50;
  --secondary-color: #3498db;
  --success-color: #27ae60;
  --danger-color: #e74c3c;
  --warning-color: #f1c40f;
  --background-gradient: linear-gradient(135deg, #3498db 0%, #2c3e50 100%);
}

.managementreview-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.managementreview-section-title {
  font-size: 1.5rem;
  color: white;
  padding: 1rem 1.5rem;
  background: var(--background-gradient);
  border-radius: 8px;
  margin: 2rem 0 1.5rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.managementreview-section-title::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent);
  transition: 0.5s;
}

.managementreview-section-title:hover::after {
  left: 100%;
}

.managementreview-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.managementreview-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.managementreview-label {
  font-weight: 600;
  color: var(--primary-color);
}

.managementreview-input,
.managementreview-select,
.managementreview-textarea {
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.managementreview-input:focus,
.managementreview-select:focus,
.managementreview-textarea:focus {
  border-color: var(--secondary-color);
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.2);
  outline: none;
}

.managementreview-textarea {
  min-height: 120px;
  resize: vertical;
}

.managementreview-button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: var(--background-gradient);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.managementreview-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
}

/* 待审核内容样式 */
.managementreview-pending {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.managementreview-pending:hover {
  transform: translateY(-3px);
}

.managementreview-pending-title {
  font-size: 1.2rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.managementreview-pending-content {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.managementreview-pending-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.managementreview-btn-approve,
.managementreview-btn-reject {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.managementreview-btn-approve {
  background: var(--success-color);
  color: white;
}

.managementreview-btn-reject {
  background: var(--danger-color);
  color: white;
}

.managementreview-btn-approve:hover,
.managementreview-btn-reject:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* 举报处理样式 */
.managementreview-report-item {
  background: white;
  padding: 1.5rem;
  border-left: 4px solid var(--secondary-color);
  margin-bottom: 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.managementreview-report-title {
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.managementreview-report-status {
  margin-top: 0.8rem;
  font-size: 0.9rem;
  color: #666;
}

/* 社区规范样式 */
.managementreview-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.managementreview-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: var(--secondary-color);
  transition: width 0.3s ease;
}

.managementreview-item:hover::before {
  width: 6px;
}

.managementreview-item-title {
  font-size: 1.1rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.managementreview-item-content {
  color: #666;
  line-height: 1.6;
}

.managementreview-item-date {
  margin-top: 0.8rem;
  font-size: 0.9rem;
  color: #999;
}

@media (max-width: 768px) {
  .managementreview-form {
    grid-template-columns: 1fr;
  }

  .managementreview-form-group[style*="grid-column: span 2"] {
    grid-column: span 1;
  }
}
</style>