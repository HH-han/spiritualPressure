<template>
  <div class="container">
    <header>
      <h1>用户搜索系统</h1>
      <p class="description">根据ID、用户名、昵称、邮箱或手机号搜索用户信息</p>
    </header>

    <div class="search-container">
      <div class="search-title">
        <i class="fas fa-search"></i>
        <h2>搜索条件</h2>
      </div>

      <form class="search-form" @submit.prevent="searchUsers">
        <div class="form-group">
          <label for="id">ID</label>
          <input type="number" id="id" v-model="searchParams.id" placeholder="输入用户ID">
        </div>

        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="searchParams.username" placeholder="输入用户名">
        </div>

        <div class="form-group">
          <label for="nickname">昵称</label>
          <input type="text" id="nickname" v-model="searchParams.nickname" placeholder="输入昵称">
        </div>

        <div class="form-group">
          <label for="email">邮箱</label>
          <input type="email" id="email" v-model="searchParams.email" placeholder="输入邮箱地址">
        </div>

        <div class="form-group">
          <label for="phone">手机号</label>
          <input type="tel" id="phone" v-model="searchParams.phone" placeholder="输入手机号码">
        </div>

        <div class="form-group">
          <label for="userID">用户ID</label>
          <input type="number" id="userID" v-model="searchParams.userID" placeholder="输入用户ID">
        </div>

        <div class="buttons">
          <button type="button" class="reset-btn" @click="resetForm">
            <i class="fas fa-redo"></i> 重置
          </button>
          <button type="submit" class="search-btn">
            <i class="fas fa-search"></i> 搜索
          </button>
        </div>
      </form>
    </div>

    <div class="results-container">
      <div class="results-header">
        <h2>搜索结果</h2>
        <div class="results-count" v-if="!loading && !error">
          共找到 {{ users.length }} 个用户
        </div>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>正在搜索用户，请稍候...</p>
      </div>

      <div v-else-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <span>{{ error }}</span>
      </div>

      <div v-else-if="users.length === 0" class="no-results">
        <i class="fas fa-users"></i>
        <h3>未找到用户</h3>
        <p>请尝试调整搜索条件后重新搜索</p>
      </div>

      <div v-else class="user-cards">
        <div class="user-card" v-for="user in users" :key="user.id">
          <div class="user-id">ID: {{ user.id }}</div>
          <h3 class="user-name">{{ user.nickname || user.username }}</h3>
          <ul class="user-details">
            <li v-if="user.username">
              <i class="fas fa-user"></i>
              <span>{{ user.username }}</span>
            </li>
            <li v-if="user.email">
              <i class="fas fa-envelope"></i>
              <span>{{ user.email }}</span>
            </li>
            <li v-if="user.phone">
              <i class="fas fa-phone"></i>
              <span>{{ user.phone }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { createApp, ref, reactive } from 'vue'
import request from '@/utils/request';

const searchParams = reactive({
  id: null,
  username: '',
  nickname: '',
  email: '',
  phone: '',
  userID: null
})

const users = ref([])
const loading = ref(false)
const error = ref(null)

// 模拟API调用
const mockSearchUsers = (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟一些用户数据
      const mockUsers = [
      ]

      // 简单模拟过滤逻辑
      const filteredUsers = mockUsers.filter(user => {
        if (params.id && user.id !== params.id) return false
        if (params.username && !user.username.includes(params.username)) return false
        if (params.nickname && !user.nickname.includes(params.nickname)) return false
        if (params.email && !user.email.includes(params.email)) return false
        if (params.phone && !user.phone.includes(params.phone)) return false
        if (params.userID && user.id !== params.userID) return false
        return true
      })

      resolve(filteredUsers)
    }, 1000) // 模拟网络延迟
  })
}

const searchUsers = async () => {
  loading.value = true
  error.value = null

  try {
    // 替换为实际的API调用
    const { data } = await request.get('/api/public/user/search', { params: searchParams })
    users.value = data // 根据您的API响应结构调整
  } catch (err) {
    error.value = '搜索用户时发生错误: ' + err.message
    console.error('搜索错误:', err)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  searchParams.id = null
  searchParams.username = ''
  searchParams.nickname = ''
  searchParams.email = ''
  searchParams.phone = ''
  searchParams.userID = null
  users.value = []
  error.value = null
}



</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.description {
  font-size: 1.1rem;
  opacity: 0.9;
}

.search-container {
  background-color: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.search-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.search-title i {
  margin-right: 10px;
  font-size: 1.5rem;
}

.search-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.buttons {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 10px;
}

button {
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.search-btn {
  background-color: #3498db;
  color: white;
}

.search-btn:hover {
  background-color: #2980b9;
}

.reset-btn {
  background-color: #e74c3c;
  color: white;
}

.reset-btn:hover {
  background-color: #c0392b;
}

.results-container {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.results-header {
  padding: 20px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-count {
  font-weight: 600;
}

.user-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.user-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.user-id {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 10px;
}

.user-name {
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 600;
}

.user-details {
  list-style: none;
}

.user-details li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}

.user-details li:last-child {
  border-bottom: none;
}

.user-details i {
  margin-right: 10px;
  color: #3498db;
  width: 20px;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

.no-results i {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #ddd;
}

.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  background-color: #ffecec;
  color: #e74c3c;
  padding: 15px;
  border-radius: 6px;
  margin: 20px;
  display: flex;
  align-items: center;
}

.error-message i {
  margin-right: 10px;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .search-form {
    grid-template-columns: 1fr;
  }

  .user-cards {
    grid-template-columns: 1fr;
  }
}
</style>