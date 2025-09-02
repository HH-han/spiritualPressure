// 导入 Pinia 的 defineStore 函数和 axios 库
import { defineStore } from 'pinia'
import axios from 'axios'

// 定义一个名为 'auth' 的 Pinia store
export const useAuthStore = defineStore('auth', {
  // 定义 store 的状态
  state: () => ({
    // 当前用户信息，初始为 null
    user: null,
    // 错误信息，初始为 null
    error: null
  }),
  // 定义 store 的动作
  actions: {
    // 登录动作，接收用户名和密码作为参数
    async login(username, password) {
      try {
        // 发送 POST 请求到登录 API
        const response = await axios.post('/api/public/user/login', null, {
          // 将用户名和密码作为请求参数
          params: { username, password }
        })
        // 登录成功，设置用户信息并清除错误信息
        this.user = username
        this.error = null
        // 返回响应数据
        return response.data
      } catch (error) {
        // 登录失败，设置错误信息
        this.error = error.response?.data || '登录失败'
        // 抛出错误
        throw error
      }
    },
    
  }
})
