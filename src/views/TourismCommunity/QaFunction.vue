<template>
    <div class="questionanswer-container">
        <div class="questionanswer-header">
            <div class="questionanswer-search-box">
                <input class="questionanswer-search-input" type="text" placeholder="搜索旅游问题或目的地..." v-model="searchQuery"
                    @keyup.enter="searchQuestions">
            </div>
        </div>
        <div class="questionanswer-main-myqf">
            <!-- 新增的发布问题输入框 -->
            <div class="questionanswer-post-box">
                <div class="questionanswer-post-header">
                    <span>发布新问题</span>
                    <button class="questionanswer-post-btn" @click="togglePostBox">
                        {{ showPostBox ? '收起' : '我要提问' }}
                    </button>
                </div>

                <div class="questionanswer-post-form" v-if="showPostBox">
                    <input class="questionanswer-post-title" type="text" v-model="newQuestion.title"
                        placeholder="输入问题标题（必填）" maxlength="50">
                    <textarea class="questionanswer-post-content" v-model="newQuestion.content"
                        placeholder="详细描述您的问题（必填）" rows="4"></textarea>
                    <div class="questionanswer-post-options">
                        <select v-model="newQuestion.category" class="questionanswer-category-select">
                            <option value="">选择分类</option>
                            <option v-for="category in categories" :value="category.id" :key="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                        <div class="questionanswer-post-actions">
                            <button class="questionanswer-post-cancel" @click="cancelPost">
                                取消
                            </button>
                            <button class="questionanswer-post-submit" :disabled="!canSubmitQuestion"
                                @click="submitQuestion">
                                发布问题
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 提问列表 -->
            <div class="questionanswer-my-questions">
                <!-- 单个提问卡片 -->
                <div class="questionanswer-card" v-for="question in myQuestions" :key="question.id">
                    <!-- 提问标题和内容 -->
                    <div class="questionanswer-card-header">
                        <div class="questionanswer-card-title">{{ question.title }}</div>
                        <div class="questionanswer-card-time">发布于 {{ formatTime(question.time) }}</div>
                    </div>

                    <!-- 编辑状态/查看状态切换 -->
                    <div class="questionanswer-card-content" v-if="editingQuestion !== question.id">
                        {{ question.content }}
                    </div>
                    <textarea class="questionanswer-edit-input" v-else v-model="editedContent" rows="3"></textarea>

                    <!-- 操作按钮组 -->
                    <div class="questionanswer-card-actions">
                        <span class="questionanswer-action-btn" @click="toggleAnswers(question)">
                            {{ question.showAnswers ? '收起回答' : `查看回答 (${question.answers.length})` }}
                        </span>

                        <span class="questionanswer-action-btn" @click="startEdit(question)"
                            v-if="editingQuestion !== question.id">
                            编辑
                        </span>
                        <span class="questionanswer-action-btn" @click="cancelEdit(question)" v-else>
                            取消
                        </span>
                        <span class="questionanswer-action-btn" @click="saveEdit(question)">
                            保存
                        </span>

                        <span class="questionanswer-action-btn questionanswer-delete-btn"
                            @click="deleteQuestion(question.id)">
                            删除
                        </span>
                    </div>

                    <!-- 回答区域 -->
                    <div class="questionanswer-answers" v-show="question.showAnswers">
                        <!-- 无回答提示 -->
                        <div class="questionanswer-no-answers" v-if="question.answers.length === 0">
                            暂无回答，耐心等待...
                        </div>

                        <!-- 回答列表 -->
                        <div class="questionanswer-answer" v-for="answer in question.answers" :key="answer.id">
                            <div class="questionanswer-answer-header">
                                <span class="questionanswer-answer-author">{{ answer.author }}</span>
                                <span class="questionanswer-answer-time">{{ formatTime(answer.time) }}</span>
                            </div>
                            <div class="questionanswer-answer-content">{{ answer.content }}</div>

                            <!-- 回答操作 -->
                            <div class="questionanswer-answer-actions">
                                <span class="questionanswer-action-btn" :class="{ liked: answer.liked }"
                                    @click="toggleLike(answer)">
                                    👍 {{ answer.likes || 0 }}
                                </span>
                                <span class="questionanswer-action-btn" @click="replyToAnswer(answer)">
                                    回复
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 无提问提示 -->
                <div class="questionanswer-no-questions" v-if="myQuestions.length === 0">
                    <p>您还没有提问过！</p>
                    <button class="questionanswer-post-btn" @click="togglePostBox">
                        去提问
                    </button>
                </div>
            </div>
        </div>
        <div class="questionanswer-filter-container">
            <div class="questionanswer-sort-filter">
                <span class="questionanswer-label">排序：</span>
                <span v-for="sort in sortOptions" :key="sort.id"
                    class="questionanswer-filter-tag questionanswer-sort-tag"
                    :class="{ active: activeSort === sort.id }" @click="setActiveSort(sort.id)">
                    {{ sort.name }}
                </span>
            </div>

            <div class="questionanswer-category-filter">
                <span class="questionanswer-label">分类：</span>
                <span v-for="category in categories" :key="category.id"
                    class="questionanswer-filter-tag questionanswer-category-tag"
                    :class="{ active: activeCategory === category.id }" @click="setActiveCategory(category.id)">
                    {{ category.name }}
                </span>
            </div>
        </div>
        <div class="questionanswer-main-container">
            <div class="questionanswer-left-panel">
                <div class="questionanswer-section-title">我的提问与回答</div>

                <div class="questionanswer-card" v-for="question in myQuestions" :key="question.id">
                    <div class="questionanswer-card-title">我的提问：{{ question.title }}</div>
                    <div class="questionanswer-card-content">{{ question.content }}</div>

                    <div class="questionanswer-comment-section" v-if="question.answers.length > 0">
                        <div class="questionanswer-comment" v-for="answer in question.answers" :key="answer.id">
                            <div class="questionanswer-comment-author">{{ answer.author }}：</div>
                            <div class="questionanswer-comment-content">{{ answer.content }}</div>
                            <div class="questionanswer-action-buttons">
                                <span class="questionanswer-action-btn" @click="replyToAnswer(answer)">
                                    回复
                                </span>
                                <span class="questionanswer-action-btn" :class="{ liked: answer.liked }"
                                    @click="toggleLike(answer)">
                                    👍 {{ answer.likes }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="questionanswer-right-panel">
                <div class="questionanswer-section-title">其他用户提问</div>

                <div class="questionanswer-card questionanswer-user-card" v-for="question in otherQuestions"
                    :key="question.id">
                    <div class="questionanswer-card-title">{{ question.author }}</div>
                    <div class="questionanswer-card-content">{{ question.content }}</div>
                    <div class="questionanswer-action-buttons">
                        <span class="questionanswer-action-btn" :class="{ liked: question.liked }"
                            @click="toggleLike(question)">
                            👍 {{ question.likes }}
                        </span>
                        <span class="questionanswer-action-btn" @click="showCommentInput(question)">
                            💬 评论
                        </span>
                        <span class="questionanswer-action-btn" :class="{ saved: question.saved }"
                            @click="toggleSave(question)">
                            ⭐ {{ question.saved ? '已收藏' : '收藏' }}
                        </span>
                    </div>

                    <div class="questionanswer-comment-section"
                        v-if="question.showComments || question.comments.length > 0">
                        <div class="questionanswer-comment-title">评论：</div>

                        <div class="questionanswer-comment" v-for="comment in question.comments" :key="comment.id">
                            <div class="questionanswer-comment-author">{{ comment.author }}：</div>
                            <div class="questionanswer-comment-content">{{ comment.content }}</div>
                            <div class="questionanswer-action-buttons">
                                <span class="questionanswer-action-btn" @click="replyToComment(comment)">
                                    回复
                                </span>
                                <span class="questionanswer-action-btn" :class="{ liked: comment.liked }"
                                    @click="toggleLike(comment)">
                                    👍 {{ comment.likes }}
                                </span>
                            </div>
                        </div>

                        <div class="questionanswer-comment" v-if="question.showCommentInput">
                            <textarea class="questionanswer-comment-input" v-model="question.newComment"
                                placeholder="写下你的评论..." rows="2"></textarea>
                            <div class="questionanswer-action-buttons">
                                <span class="questionanswer-action-btn" @click="submitComment(question)">
                                    提交
                                </span>
                                <span class="questionanswer-action-btn" @click="cancelComment(question)">
                                    取消
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';

// 搜索相关
const searchQuery = ref('');

const searchQuestions = () => {
    console.log('搜索问题:', searchQuery.value);
    // 实际应用中这里会调用API搜索
};

// 排序和分类
const sortOptions = ref([
    { id: 'latest', name: '最新' },
    { id: 'popular', name: '热门' },
    { id: 'answered', name: '已解答' },
    { id: 'unanswered', name: '待解答' }
]);

const categories = ref([
    { id: 'destination', name: '按目的地' },
    { id: 'theme', name: '按旅游主题' },
    { id: 'season', name: '按季节' },
    { id: 'budget', name: '按预算' }
]);

const activeSort = ref('latest');
const activeCategory = ref('destination');

const setActiveSort = (sortId) => {
    activeSort.value = sortId;
    sortMyQuestions();
};

const setActiveCategory = (categoryId) => {
    activeCategory.value = categoryId;
    filterMyQuestions();
};

// 时间格式化函数
const formatTime = (timestamp) => {
    if (!timestamp) return '刚刚';
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 我的提问数据
const myQuestions = ref([
    {
        id: 1,
        title: "春季旅游推荐",
        content: "春天适合去哪里旅游？想要看花海和自然风光",
        category: 'season',
        time: Date.now() - 86400000, // 1天前
        showAnswers: true,
        answers: [
            {
                id: 101,
                author: "旅游达人小张",
                content: "推荐去云南罗平看油菜花海，非常壮观！",
                likes: 24,
                liked: false,
                time: Date.now() - 43200000 // 12小时前
            },
            {
                id: 102,
                author: "背包客小李",
                content: "江西婺源的油菜花也很美，而且人相对少一些",
                likes: 15,
                liked: true,
                time: Date.now() - 21600000 // 6小时前
            }
        ]
    },
    {
        id: 2,
        title: "夏季避暑胜地",
        content: "国内有哪些适合夏天避暑的旅游地点？",
        category: 'season',
        time: Date.now() - 259200000, // 3天前
        showAnswers: false,
        answers: []
    }
]);

// 其他用户提问数据
const otherQuestions = ref([
    {
        id: 3,
        author: "张小猫",
        content: "想要去吃美食可以去哪个城市？预算5000以内",
        likes: 45,
        liked: false,
        saved: true,
        showComments: false,
        showCommentInput: false,
        newComment: '',
        time: Date.now() - 172800000, // 2天前
        comments: [
            {
                id: 301,
                author: "爱吃薯条的懒猪",
                content: "可以去重庆，有火锅和小面，消费也不高",
                likes: 12,
                liked: false,
                time: Date.now() - 86400000 // 1天前
            }
        ]
    }
]);

// 发布问题相关状态
const showPostBox = ref(false);
const newQuestion = ref({
    title: '',
    content: '',
    category: ''
});

// 计算属性：检查是否可以提交问题
const canSubmitQuestion = computed(() => {
    return newQuestion.value.title.trim() &&
        newQuestion.value.content.trim() &&
        newQuestion.value.category;
});

// 切换发布问题框的显示状态
const togglePostBox = () => {
    showPostBox.value = !showPostBox.value;
    if (!showPostBox.value) {
        resetQuestionForm();
    }
};

// 提交新问题
const submitQuestion = () => {
    if (!canSubmitQuestion.value) return;

    const question = {
        id: Date.now(),
        title: newQuestion.value.title,
        content: newQuestion.value.content,
        category: newQuestion.value.category,
        time: Date.now(),
        showAnswers: false,
        answers: []
    };

    myQuestions.value.unshift(question);
    resetQuestionForm();
    showPostBox.value = false;

    console.log('发布新问题:', question);
};

// 取消发布
const cancelPost = () => {
    resetQuestionForm();
    showPostBox.value = false;
};

// 重置问题表单
const resetQuestionForm = () => {
    newQuestion.value = {
        title: '',
        content: '',
        category: ''
    };
};

// 编辑相关状态
const editingQuestion = ref(null);
const editedContent = ref('');

// 排序我的提问
const sortMyQuestions = () => {
    myQuestions.value.sort((a, b) => {
        if (activeSort.value === 'latest') {
            return b.time - a.time;
        } else if (activeSort.value === 'popular') {
            const aTotalLikes = a.answers.reduce((sum, ans) => sum + ans.likes, 0);
            const bTotalLikes = b.answers.reduce((sum, ans) => sum + ans.likes, 0);
            return bTotalLikes - aTotalLikes;
        } else if (activeSort.value === 'answered') {
            return b.answers.length - a.answers.length;
        } else { // unanswered
            return a.answers.length - b.answers.length;
        }
    });
};

// 筛选我的提问
const filterMyQuestions = () => {
    console.log('当前分类:', activeCategory.value);
};

// 删除问题
const deleteQuestion = (questionId) => {
    myQuestions.value = myQuestions.value.filter(q => q.id !== questionId);
};

// 开始编辑问题
const startEdit = (question) => {
    editingQuestion.value = question.id;
    editedContent.value = question.content;
};

// 保存编辑
const saveEdit = (question) => {
    const index = myQuestions.value.findIndex(q => q.id === question.id);
    if (index !== -1) {
        myQuestions.value[index].content = editedContent.value;
    }
    editingQuestion.value = null;
    editedContent.value = '';
};

// 取消编辑
const cancelEdit = () => {
    editingQuestion.value = null;
    editedContent.value = '';
};

// 展开/折叠回答
const toggleAnswers = (question) => {
    question.showAnswers = !question.showAnswers;
};

// 点赞功能
const toggleLike = (item) => {
    item.liked = !item.liked;
    item.likes += item.liked ? 1 : -1;
};

// 收藏功能
const toggleSave = (question) => {
    question.saved = !question.saved;
};

// 显示评论输入框
const showCommentInput = (question) => {
    question.showCommentInput = true;
    question.showComments = true;
};

// 提交评论
const submitComment = (question) => {
    if (question.newComment.trim()) {
        question.comments.push({
            id: Date.now(),
            author: "我",
            content: question.newComment,
            likes: 0,
            liked: false,
            time: Date.now()
        });
        question.newComment = '';
        question.showCommentInput = false;
    }
};

// 取消评论
const cancelComment = (question) => {
    question.newComment = '';
    question.showCommentInput = false;
};

// 回复评论
const replyToComment = (comment) => {
    console.log('回复评论:', comment.id);
};

// 回复答案
const replyToAnswer = (answer) => {
    console.log('回复答案:', answer.id);
};
// 初始化排序
sortMyQuestions();
</script>
<style scoped>
.questionanswer-container {
    max-width: 1200px;
    margin: 0 auto;
}

.questionanswer-header {
    background: linear-gradient(135deg, #7ed6ea 0%, #4facfe 100%);
    padding: 25px 0;
    text-align: center;
    margin-bottom: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.questionanswer-search-box {
    width: 500px;
    max-width: 90%;
    height: 50px;
    background-color: white;
    border-radius: 25px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.questionanswer-search-box:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.questionanswer-search-input {
    width: 90%;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    padding: 0 20px;
    font-size: 16px;
    color: #475569;
}

.questionanswer-filter-container {
    margin-bottom: 30px;
    text-align: center;
}

.questionanswer-sort-filter,
.questionanswer-category-filter {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}

.questionanswer-label {
    margin-right: 10px;
    font-size: 16px;
    font-weight: 500;
    color: #475569;
    display: flex;
    align-items: center;
}

.questionanswer-filter-tag {
    display: inline-block;
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.questionanswer-filter-tag:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.questionanswer-sort-tag {
    background-color: #f43f5e;
    color: white;
}

.questionanswer-sort-tag.active {
    background-color: #e11d48;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #f43f5e;
}

.questionanswer-category-tag {
    background-color: #8b5cf6;
    color: white;
}

.questionanswer-category-tag.active {
    background-color: #7c3aed;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #8b5cf6;
}

.questionanswer-main-container {
    display: flex;
    justify-content: space-between;
    gap: 25px;
    flex-wrap: wrap;
}

.questionanswer-main-myqf {
    width: 100%;
    background: linear-gradient(135deg, #6ac7f5 0%, #4facfe 100%);
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    flex: 1;
    min-width: 300px;
    margin-bottom: 30px;
}

/* 发布问题框样式 */
.questionanswer-post-box {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    overflow: hidden;
    border-left: 4px solid #3f81ea;
}

.questionanswer-post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    background: #f8f9fa;
    border-bottom: 1px solid #eee;
}

.questionanswer-post-btn {
    background: #3498db;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.questionanswer-post-btn:hover {
    background: #2980b9;
}

.questionanswer-post-form {
    padding: 15px;
}

.questionanswer-post-title {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.questionanswer-post-content {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    resize: vertical;
    min-height: 80px;
}

.questionanswer-post-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.questionanswer-category-select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    font-size: 14px;
}

.questionanswer-post-actions {
    display: flex;
    gap: 10px;
}

.questionanswer-post-cancel {
    padding: 8px 16px;
    background: #e91111;
    color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.questionanswer-post-cancel:hover {
    background: #e91111;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #4b92fd;
}

.questionanswer-post-submit {
    padding: 8px 16px;
    background: #27ae60;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.questionanswer-post-submit:hover:not(:disabled) {
    background: #219653;
}

.questionanswer-post-submit:disabled {
    background: #95a5a6;
    cursor: not-allowed;
    opacity: 0.7;
}

.questionanswer-left-panel,
.questionanswer-right-panel {
    background-color: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    flex: 1;
    min-width: 300px;
}

.questionanswer-section-title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 25px;
    text-align: center;
    color: #1e293b;
    position: relative;
    padding-bottom: 10px;
}

.questionanswer-section-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #7eead4, #4facfe);
    border-radius: 3px;
}

.questionanswer-card {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border-left: 4px solid #ac69f4;
}

.questionanswer-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.questionanswer-user-card {
    border-left-color: #4facfe;
}

.questionanswer-card-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #1e293b;
}

.questionanswer-card-content {
    font-size: 15px;
    line-height: 1.6;
    color: #475569;
    margin-bottom: 15px;
}

.questionanswer-comment-section {
    background-color: #f8fafc;
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
    border: 1px solid #e2e8f0;
}

.questionanswer-comment-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #334155;
}

.questionanswer-comment {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e2e8f0;
}

.questionanswer-comment:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}

.questionanswer-comment-author {
    font-weight: 600;
    margin-bottom: 8px;
    color: #1e293b;
    display: flex;
    align-items: center;
}

.questionanswer-comment-author::before {
    content: '👤';
    margin-right: 8px;
}

.questionanswer-comment-content {
    margin-bottom: 10px;
    padding-left: 25px;
    color: #475569;
    line-height: 1.6;
}

.questionanswer-action-buttons {
    margin-top: 15px;
    text-align: right;
}

.questionanswer-action-btn {
    display: inline-flex;
    align-items: center;
    padding: 6px 15px;
    background-color: white;
    border-radius: 18px;
    margin-left: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #e2e8f0;
    color: #475569;
}

.questionanswer-action-btn:hover {
    background-color: #f1f5f9;
    transform: translateY(-1px);
}

.questionanswer-action-btn.liked {
    color: #f43f5e;
    border-color: #fda4af;
    background-color: #fff1f2;
}

.questionanswer-action-btn.saved {
    color: #8b5cf6;
    border-color: #c4b5fd;
    background-color: #f5f3ff;
}

@media (max-width: 768px) {
    .questionanswer-main-container {
        flex-direction: column;
    }

    .questionanswer-left-panel,
    .questionanswer-right-panel {
        width: 100%;
    }

    .questionanswer-search-box {
        width: 90%;
    }
}
</style>