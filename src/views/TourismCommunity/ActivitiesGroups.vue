<template>
  <div class="activitygroup-container">
    <div class="activitygroup-header">
      <h2>我的模块</h2>
    </div>

    <div class="activitygroup-user-panel">
      <div class="activitygroup-user-info">用户：{{ username }}</div>

      <div class="activitygroup-activity-type">
        <div>输入活动类型：<input v-model="newActivity.type" type="text" placeholder="输入活动类型"></div>
        <div>或选择活动类型</div>
        <div class="activity-type-options">
          <span v-for="type in activityTypes" :key="type" :class="{ 'selected': newActivity.type === type }"
            @click="newActivity.type = type">
            {{ type }}
          </span>
        </div>
      </div>

      <div class="activitygroup-activity-description">
        输入活动简介：<br>
        <textarea v-model="newActivity.description" placeholder="请输入活动简介"></textarea>
      </div>

      <div class="activitygroup-upload-image">
        <label for="activity-image" class="upload-btn">
          <span v-if="!newActivity.image">上传图片</span>
          <img v-else :src="newActivity.image" alt="活动图片" class="preview-image">
          <input id="activity-image" type="file" accept="image/*" @change="handleImageUpload" style="display: none;">
        </label>
      </div>

      <div class="activitygroup-activity-data" v-if="editingActivity">
        活动数据：<br>
        <br>
        已报名：{{ editingActivity.participants }} 评论：{{ editingActivity.comments }}
      </div>

      <div class="activitygroup-buttons">
        <div>
          <button class="activitygroup-button" @click="showMyGroups = !showMyGroups">我的群组</button>
        </div>
        <div>
          <button class="activitygroup-button" @click="saveActivity">保存</button>
          <button class="activitygroup-button" @click="editActivity">修改</button>
          <button class="activitygroup-button" @click="submitActivity">提交</button>
          <button class="activitygroup-button" @click="endActivity">截至</button>
        </div>
      </div>
    </div>

    <div class="activitygroup-title">
      <h3>其他用户发布</h3>
    </div>

    <div class="activitygroup-cards">
      <div class="activitygroup-card" v-for="activity in otherActivities" :key="activity.id">
        <div class="activitygroup-card-header">{{ activity.type }}</div>
        <div class="activitygroup-card-image">
          <img :src="activity.image || 'https://via.placeholder.com/200x150'" alt="活动图片">
        </div>
        <div class="activitygroup-card-content">
          活动简介：<br>
          {{ activity.description }}
        </div>
        <div class="activitygroup-card-buttons">
          <button class="activitygroup-card-button" @click="toggleParticipation(activity.id)">
            {{ isParticipating(activity.id) ? '取消报名' : '报名' }}
          </button>
          <button class="activitygroup-card-button" @click="toggleDetails(activity.id)">
            查看详情
          </button>
        </div>
      </div>
    </div>

    <div v-for="activity in otherActivities" :key="'details-' + activity.id" class="activitygroup-details"
      :style="{ display: showDetails === activity.id ? 'block' : 'none' }">
      <div class="activitygroup-details-content">
        活动详情：<br>
        {{ activity.details }}<br><br>
        组织者：{{ activity.organizer }}
      </div>
      <div class="activitygroup-details-buttons">
        <button class="activitygroup-button" @click="toggleGroup(activity.id)">
          进入群组
        </button>
        <button class="activitygroup-button" @click="toggleParticipation(activity.id)">
          {{ isParticipating(activity.id) ? '取消报名' : '报名' }}
        </button>
      </div>
    </div>

    <div class="activitygroup-comments" v-for="activity in otherActivities" :key="'comments-' + activity.id"
      :style="{ display: showDetails === activity.id ? 'block' : 'none' }">
      <div class="activitygroup-comments-header">
        活动讨论与交流：
      </div>
      <div class="activitygroup-comment" v-for="comment in activity.comments" :key="comment.id">
        {{ comment.author }}：<br>
        {{ comment.content }}
        <div class="activitygroup-comment-actions">
          <button class="activitygroup-comment-button" @click="toggleLike(activity.id, comment.id)">
            点赞({{ comment.likes }})
          </button>
          <button class="activitygroup-comment-button">回复</button>
        </div>
      </div>
      <div class="activitygroup-stats">
        已报名：{{ activity.participants }}人 评论：{{ activity.comments.length }} 点赞：{{ totalLikes(activity.comments) }}
      </div>
      <div class="add-comment">
        <input v-model="newComments[activity.id]" type="text" placeholder="添加评论...">
        <button @click="addComment(activity.id)">发送</button>
      </div>
    </div>

    <div class="activitygroup-group" v-for="activity in otherActivities" :key="'group-' + activity.id"
      :style="{ display: showGroup === activity.id ? 'block' : 'none' }">
      <div class="activitygroup-group-members">
        <h4>群组成员</h4>
        <div v-for="member in activity.groupMembers" :key="member.id">
          {{ member.name }}：{{ member.status }}
        </div>
        <div>XXXXXXX：我</div>
        <div class="activitygroup-group-input">
          <button @click="showEmojiPicker = !showEmojiPicker">😊</button>
          <div class="emoji-picker" v-if="showEmojiPicker">
            <span v-for="emoji in emojis" :key="emoji" @click="addEmoji(emoji)">
              {{ emoji }}
            </span>
          </div>
          <input v-model="groupMessages[activity.id]" type="text" placeholder="输入..."
            @keyup.enter="sendMessage(activity.id)">
          <button>图片</button>
          <button @click="sendMessage(activity.id)">发送</button>
        </div>
        <div class="group-messages">
          <div v-for="(msg, index) in activity.messages" :key="index" class="message">
            <strong>{{ msg.sender }}:</strong> {{ msg.content }}
          </div>
        </div>
      </div>
    </div>

    <div class="my-groups" v-if="showMyGroups">
      <h3>我的群组</h3>
      <div v-for="group in myGroups" :key="group.id" class="group-item">
        <div>{{ group.name }}</div>
        <button @click="joinGroup(group.id)">进入</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, } from 'vue';

const username = ref('但兰州');
const showDetails = ref(null);
const showGroup = ref(null);
const showMyGroups = ref(false);
const showEmojiPicker = ref(false);
const newComments = reactive({});
const groupMessages = reactive({});
const editingActivity = ref(null);

const activityTypes = ['旅行团', '户外徒步', '摄影比赛', '美食聚会', '读书会', '健身训练', '更多'];

const newActivity = reactive({
  type: '',
  description: '',
  image: null,
  participants: 0,
  comments: 0
});

const myGroups = ref([
  { id: 1, name: '摄影爱好者' },
  { id: 2, name: '徒步旅行' },
  { id: 3, name: '美食探索' }
]);

const otherActivities = ref([
  {
    id: 1,
    type: '旅行团',
    description: '探索美丽的自然风光，享受愉快的周末时光',
    image: 'https://via.placeholder.com/200x150/FF5733/FFFFFF?text=旅行团',
    details: '本次活动将前往著名的山区景点，包含交通、住宿和导游服务。适合所有年龄段参加。',
    organizer: '无敌风火轮',
    participants: 20,
    comments: [
      { id: 1, author: '宇宙小条', content: '这个活动不错呀！', likes: 3 },
      { id: 2, author: '旅行达人', content: '我已经参加过三次了，每次都很棒！', likes: 5 }
    ],
    groupMembers: [
      { id: 1, name: '用户1', status: '活跃' },
      { id: 2, name: '用户2', status: '新加入' }
    ],
    messages: [],
    participantsList: []
  },
  {
    id: 2,
    type: '户外徒步',
    description: '挑战自我，感受大自然的魅力',
    image: 'https://via.placeholder.com/200x150/33FF57/FFFFFF?text=户外徒步',
    details: '中等难度徒步路线，全程约15公里，需要一定体力。提供专业向导和基础装备。',
    organizer: '无敌风火轮',
    participants: 15,
    comments: [
      { id: 1, author: '登山爱好者', content: '路线设计得很好，不会太累又能看到美景', likes: 2 }
    ],
    groupMembers: [
      { id: 1, name: '用户3', status: '组织者' },
      { id: 2, name: '用户4', status: '活跃' }
    ],
    messages: [],
    participantsList: []
  },
  {
    id: 3,
    type: '摄影比赛',
    description: '捕捉美好瞬间，展示你的摄影才华',
    image: 'https://via.placeholder.com/200x150/3357FF/FFFFFF?text=摄影比赛',
    details: '主题为"城市之光"，提交作品截止日期为下月底。一等奖将获得专业相机一台。',
    organizer: '无敌风火轮',
    participants: 30,
    comments: [
      { id: 1, author: '摄影新手', content: '有什么设备要求吗？', likes: 1 },
      { id: 2, author: '专业摄影师', content: '欢迎大家交流摄影技巧！', likes: 8 }
    ],
    groupMembers: [
      { id: 1, name: '用户5', status: '评委' },
      { id: 2, name: '用户6', status: '参赛者' }
    ],
    messages: [],
    participantsList: []
  }
]);

const emojis = ['😀', '😂', '😍', '👍', '❤️', '🎉', '🙏', '🤔', '😎', '🥳'];

function toggleDetails(id) {
  showDetails.value = showDetails.value === id ? null : id;
  if (showDetails.value !== id) {
    showGroup.value = null;
  }
}

function toggleGroup(id) {
  showGroup.value = showGroup.value === id ? null : id;
}

function toggleParticipation(id) {
  const activity = otherActivities.value.find(a => a.id === id);
  const isParticipant = activity.participantsList.includes(username.value);

  if (isParticipant) {
    activity.participantsList = activity.participantsList.filter(name => name !== username.value);
    activity.participants--;
  } else {
    activity.participantsList.push(username.value);
    activity.participants++;
  }
}

function isParticipating(id) {
  const activity = otherActivities.value.find(a => a.id === id);
  return activity.participantsList.includes(username.value);
}

function toggleLike(activityId, commentId) {
  const activity = otherActivities.value.find(a => a.id === activityId);
  const comment = activity.comments.find(c => c.id === commentId);
  comment.likes += comment.liked ? -1 : 1;
  comment.liked = !comment.liked;
}

function addComment(activityId) {
  if (!newComments[activityId] || !newComments[activityId].trim()) return;

  const activity = otherActivities.value.find(a => a.id === activityId);
  activity.comments.push({
    id: Date.now(),
    author: username.value,
    content: newComments[activityId],
    likes: 0
  });

  newComments[activityId] = '';
}

function sendMessage(activityId) {
  if (!groupMessages[activityId] || !groupMessages[activityId].trim()) return;

  const activity = otherActivities.value.find(a => a.id === activityId);
  activity.messages.push({
    sender: username.value,
    content: groupMessages[activityId],
    time: new Date().toLocaleTimeString()
  });

  groupMessages[activityId] = '';
  showEmojiPicker.value = false;
}

function addEmoji(emoji) {
  const currentActivity = otherActivities.value.find(a => a.id === showGroup.value);
  if (currentActivity) {
    groupMessages[currentActivity.id] = (groupMessages[currentActivity.id] || '') + emoji;
  }
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      newActivity.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function saveActivity() {
  alert('活动已保存为草稿');
}

function editActivity() {
  // 这里应该是编辑已有活动，简化为编辑第一个活动
  editingActivity.value = otherActivities.value[0];
  newActivity.type = editingActivity.value.type;
  newActivity.description = editingActivity.value.description;
  newActivity.image = editingActivity.value.image;
}

function submitActivity() {
  if (!newActivity.type || !newActivity.description) {
    alert('请填写活动类型和简介');
    return;
  }

  const newId = Math.max(...otherActivities.value.map(a => a.id)) + 1;
  otherActivities.value.push({
    id: newId,
    type: newActivity.type,
    description: newActivity.description,
    image: newActivity.image || 'https://via.placeholder.com/200x150',
    details: '这是新创建的活动详情',
    organizer: username.value,
    participants: 0,
    comments: [],
    groupMembers: [],
    messages: [],
    participantsList: []
  });

  // 重置表单
  newActivity.type = '';
  newActivity.description = '';
  newActivity.image = null;

  alert('活动已提交');
}

function endActivity() {
  if (editingActivity.value) {
    const index = otherActivities.value.findIndex(a => a.id === editingActivity.value.id);
    if (index !== -1) {
      otherActivities.value.splice(index, 1);
      editingActivity.value = null;
      alert('活动已截至');
    }
  } else {
    alert('请先选择要截至的活动');
  }
}

function joinGroup(groupId) {
  alert(`加入群组 ${groupId}`);
  showMyGroups.value = false;
}

function totalLikes(comments) {
  return comments.reduce((sum, comment) => sum + comment.likes, 0);
}
</script>

<style scoped>
/* 基础重置与变量定义 */
:root {
  /* 颜色系统 */
  --primary-color: #53ccfc;
  --secondary-color: #ff6b6b;
  --accent-color: #764ba2;
  --text-dark: #2d3748;
  --text-medium: #4a5568;
  --text-light: #f7fafc;
  --bg-light: #f8f9fa;

  /* 渐变系统 */
  --primary-gradient: linear-gradient(135deg, #66c2ea 0%, #2e9ff5 100%);
  --secondary-gradient: linear-gradient(45deg, #ff6b6b, #ff9f43);
  --glass-gradient: linear-gradient(135deg,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.1) 100%);

  /* 阴影系统 */
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  /* 过渡效果 */
  --transition-default: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);

  /* 圆角系统 */
  --radius-sm: 0.5rem;
  --radius-md: 1rem;
  --radius-lg: 1.5rem;
  --radius-full: 9999px;
}

/* 基础样式 */


/* 容器样式 */
.activitygroup-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--primary-gradient);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  border-radius: 15px;
}

.activitygroup-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('https://images.unsplash.com/photo-1519125323398-675f0ddb6308?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') center/cover;
  opacity: 0.1;
  z-index: -1;
}

/* 头部样式 */
.activitygroup-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.activitygroup-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.025em;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
}

.activitygroup-header h2::after {
  content: '';
  position: absolute;
  bottom: -0.75rem;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: var(--secondary-gradient);
  border-radius: var(--radius-full);
}

/* 用户面板 */
.activitygroup-user-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-lg);
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: var(--shadow-xl);
  transition: var(--transition-default);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.activitygroup-user-panel:hover {
  box-shadow: var(--shadow-2xl);
}

.activitygroup-user-info {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: var(--radius-sm);
  display: inline-block;
  border-left: 4px solid var(--primary-color);
}

/* 表单元素 */
.activitygroup-activity-type {
  margin-bottom: 1.5rem;
}

.activitygroup-activity-type>div:first-child {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-dark);
}

.activity-type-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.activitygroup-activity-type input {
  width: 250px;
  height: 30px;
  border: none;
  outline: none;
  background: transparent;
  padding: 0 20px;
  font-size: 16px;
  color: #000000;
  border-radius: 15px;
  border: 2px solid #3aa3e4;
}

.activitygroup-activity-type input:hover {
  border: 2px solid #ff6b6b;
}

.activity-type-options span {
  padding: 0.5rem 1.25rem;
  background: rgba(118, 75, 162, 0.1);
  border: 1px solid rgba(118, 75, 162, 0.2);
  color: var(--accent-color);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-default);
}

.activity-type-options span:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  box-shadow: 0 0 0 2px white, 0 0 0 4px #ff6b6b;
}

.activity-type-options .selected {
  background: var(--secondary-gradient);
  color: white;
  border-color: transparent;
  box-shadow: var(--shadow-md);
}

.activitygroup-activity-description {
  margin-bottom: 1.5rem;
}

.activitygroup-activity-description textarea {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: var(--radius-sm);
  resize: vertical;
  margin-top: 0.5rem;
  font-family: inherit;
  transition: var(--transition-default);
}

.activitygroup-activity-description textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

/* 图片上传 */
.activitygroup-upload-image {
  margin: 1.5rem 0;
}

.upload-btn {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 2px dashed rgba(102, 126, 234, 0.3);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition-default);
  width: 100%;
  text-align: center;
}

.upload-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: var(--primary-color);
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  margin-top: 1rem;
  border-radius: var(--radius-sm);
  object-fit: cover;
  box-shadow: var(--shadow-md);
}

/* 活动数据 */
.activitygroup-activity-data {
  margin: 1.5rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-sm);
  color: var(--text-medium);
}

/* 按钮组 */
.activitygroup-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.activitygroup-button {
  background: var(--secondary-gradient);
  border: none;
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius-sm);
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition-default);
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  margin: 10px;
}

.activitygroup-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent);
  transition: var(--transition-slow);
}

.activitygroup-button:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.activitygroup-button:hover::before {
  left: 100%;
}

/* 活动卡片 */
.activitygroup-title {
  margin: 2rem 0 1.5rem;
}

.activitygroup-title h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
}

.activitygroup-title h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 3px;
  background: var(--secondary-gradient);
  border-radius: var(--radius-full);
}

.activitygroup-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.activitygroup-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-md);
  overflow: hidden;
  transform: translateY(0);
  transition: var(--transition-default);
  position: relative;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.activitygroup-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--glass-gradient);
  z-index: 0;
  opacity: 0;
  transition: var(--transition-default);
}

.activitygroup-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-2xl);
}

.activitygroup-card:hover::before {
  opacity: 1;
}

.activitygroup-card-header {
  background: var(--secondary-gradient);
  padding: 1rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  position: relative;
  z-index: 1;
}

.activitygroup-card-image {
  height: 200px;
  overflow: hidden;
}

.activitygroup-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-slow);
}

.activitygroup-card:hover .activitygroup-card-image img {
  transform: scale(1.1);
}

.activitygroup-card-content {
  padding: 1.5rem;
  color: var(--text-medium);
  position: relative;
  z-index: 1;
}

.activitygroup-card-buttons {
  display: flex;
  justify-content: space-between;
  padding: 0 1.5rem 1.5rem;
  position: relative;
  z-index: 1;
}

.activitygroup-card-button {
  background: var(--primary-gradient);
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-sm);
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition-default);
  flex: 1;
  max-width: 48%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activitygroup-card-button:hover {
  box-shadow: 0 8px 15px -5px rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

/* 详情区域 */
.activitygroup-details {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-md);
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: var(--shadow-xl);
  transition: var(--transition-default);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.activitygroup-details-content {
  margin-bottom: 1.5rem;
  color: var(--text-medium);
  line-height: 1.7;
}

.activitygroup-details-buttons {
  display: flex;
  gap: 1rem;
}

/* 评论区域 */
.activitygroup-comments {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-md);
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: var(--shadow-lg);
  transition: var(--transition-default);
}

.activitygroup-comments-header {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.75rem;
}

.activitygroup-comments-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: var(--primary-gradient);
  border-radius: var(--radius-full);
}

.activitygroup-comment {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  border-radius: var(--radius-sm);
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: var(--transition-default);
  border-left: 4px solid transparent;
}

.activitygroup-comment:hover {
  border-left-color: var(--secondary-color);
  transform: translateX(5px);
}

.activitygroup-comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;
  gap: 0.5rem;
}

.activitygroup-comment-button {
  padding: 0.375rem 0.75rem;
  background: rgba(102, 126, 234, 0.1);
  border: none;
  border-radius: var(--radius-sm);
  color: var(--primary-color);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-default);
}

.activitygroup-comment-button:hover {
  background: rgba(102, 126, 234, 0.2);
}

.activitygroup-stats {
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-medium);
  display: flex;
  gap: 1.5rem;
}

.add-comment {
  display: flex;
  margin-top: 1.5rem;
  gap: 0.5rem;
}

.add-comment input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: var(--radius-sm);
  transition: var(--transition-default);
}

.add-comment input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.add-comment button {
  padding: 0 1.5rem;
  background: var(--primary-gradient);
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-default);
}

.add-comment button:hover {
  box-shadow: 0 8px 15px -5px rgba(102, 126, 234, 0.3);
}

/* 群组样式 */
.activitygroup-group {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-md);
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: var(--shadow-xl);
  transition: var(--transition-default);
}

.activitygroup-group-members {
  color: var(--text-medium);
}

.activitygroup-group-members h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.activitygroup-group-members h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: var(--secondary-gradient);
  border-radius: var(--radius-full);
}

.activitygroup-group-input {
  display: flex;
  margin-top: 1.5rem;
  gap: 0.5rem;
  position: relative;
}

.activitygroup-group-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: var(--radius-sm);
  transition: var(--transition-default);
}

.activitygroup-group-input input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.activitygroup-group-input button {
  padding: 0 1.25rem;
  background: var(--primary-gradient);
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-default);
}

.activitygroup-group-input button:hover {
  box-shadow: 0 8px 15px -5px rgba(102, 126, 234, 0.3);
}

.emoji-picker {
  position: absolute;
  bottom: 100%;
  left: 0;
  background: white;
  border-radius: var(--radius-md);
  padding: 1rem;
  box-shadow: var(--shadow-xl);
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  z-index: 10;
  width: 300px;
  margin-bottom: 0.5rem;
}

.emoji-picker span {
  font-size: 1.25rem;
  cursor: pointer;
  transition: var(--transition-default);
  text-align: center;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
}

.emoji-picker span:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: scale(1.2);
}

.group-messages {
  margin-top: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.message {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.message:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

/* 我的群组 */
.my-groups {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-md);
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: var(--shadow-xl);
}

.my-groups h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.my-groups h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: var(--secondary-gradient);
  border-radius: var(--radius-full);
}

.group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  transition: var(--transition-default);
}

.group-item:hover {
  background: rgba(102, 126, 234, 0.05);
}

.group-item button {
  padding: 0.5rem 1rem;
  background: var(--primary-gradient);
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  font-weight: 500;
  font-size: 0.75rem;
  cursor: pointer;
  transition: var(--transition-default);
}

.group-item button:hover {
  box-shadow: 0 8px 15px -5px rgba(102, 126, 234, 0.3);
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.activitygroup-card {
  animation: fadeIn 0.6s ease forwards;
  opacity: 0;
}

.activitygroup-card:nth-child(1) {
  animation-delay: 0.1s;
}

.activitygroup-card:nth-child(2) {
  animation-delay: 0.2s;
}

.activitygroup-card:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

.activitygroup-button:active {
  animation: pulse 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .activitygroup-cards {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .activitygroup-container {
    padding: 1.5rem;
  }

  .activitygroup-header h2 {
    font-size: 2rem;
  }

  .activitygroup-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .activitygroup-button {
    width: 100%;
  }

  .activitygroup-card-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }

  .activitygroup-card-button {
    max-width: 100%;
  }

  .activitygroup-details-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .activitygroup-container {
    padding: 1rem;
  }

  .activitygroup-header h2 {
    font-size: 1.75rem;
  }

  .activitygroup-user-panel {
    padding: 1.5rem;
  }

  .activitygroup-cards {
    grid-template-columns: 1fr;
  }

  .emoji-picker {
    grid-template-columns: repeat(5, 1fr);
    width: 100%;
  }
}
</style>