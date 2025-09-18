// 导入 Pinia 的 defineStore 函数和项目封装的request工具
import { defineStore } from 'pinia'
import request from '@/utils/request'

// 定义一个名为 'auth' 的 Pinia store
export const useAuthStore = defineStore('auth', {
  // 定义 store 的状态
  state: () => ({
    // 当前用户信息，初始为 null
    user: null,
    // 错误信息，初始为 null
    error: null,
    // 当前组件路径，用于页面刷新后保持状态
    currentComponentPath: null,
    // 面包屑导航列表，用于页面刷新后保持面包屑状态
    breadcrumbList: null,
    // 侧边栏折叠状态，用于页面刷新后保持侧边栏状态
    isSidebarCollapsed: false,
    // 菜单分类折叠状态，用于页面刷新后保持分类展开状态
    systemCollapsed: true,
    contentCollapsed: true,
    travelCollapsed: true,
    userCollapsed: true,
    managementCollapsed: true,
    systemMonitoring: true
  }),
  
  // 配置持久化
  persist: true,
  // 定义 store 的动作
  actions: {
    // 管理员登录动作，接收用户名和密码作为参数
    async adminLogin(credentials) {
      try {
        // 发送 POST 请求到管理员登录 API
        const response = await request.post('/api/public/user/adminlogin', {
          username: credentials.username,
          password: credentials.password
        })
        
        // 登录成功，设置用户信息并清除错误信息
        if (response.code === '0') {
          this.user = response.data.user
          this.error = null
          
          // 存储到localStorage
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(this.user))
          
          // 返回响应数据
          return response
        } else {
          // 登录失败，设置错误信息
          this.error = response.msg || '管理员登录失败'
          throw new Error(this.error)
        }
      } catch (error) {
        // 登录失败，设置错误信息
        this.error = error.response?.data?.msg || error.message || '管理员登录失败'
        // 抛出错误
        throw error
      }
    },
    
    // 登录动作，接收用户名和密码作为参数
    async login(credentials) {
      try {
        // 发送 POST 请求到登录 API
        const response = await request.post('/api/public/user/login', {
          username: credentials.username,
          password: credentials.password
        })
        
        // 登录成功，设置用户信息并清除错误信息
        if (response.code === '0' || response.code === 0) {
          this.user = response.data.user
          this.error = null
          
          // 存储到localStorage
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          
          // 返回响应数据
          return response
        } else {
          // 登录失败，设置错误信息
          this.error = response.msg || '登录失败'
          throw new Error(this.error)
        }
      } catch (error) {
        // 登录失败，设置错误信息
        this.error = error.response?.data?.msg || error.message || '登录失败'
        // 抛出错误
        throw error
      }
    },
    
    // 获取用户信息
    async getUserInfo() {
      try {
        const response = await request.get('/api/public/user/info')
        if (response.code === '0' || response.code === 0) {
          this.user = response.data
          localStorage.setItem('user', JSON.stringify(response.data))
          return response
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    },
    
    // 退出登录
    logout() {
      this.user = null
      this.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    
    // 邮箱登录动作，接收邮箱和验证码作为参数
    async emailLogin(credentials) {
      try {
        // 发送 POST 请求到邮箱登录 API
        const response = await request.post('/api/auth/Emaillogin', {
          email: credentials.email,
          code: credentials.code
        })
        
        // 登录成功，设置用户信息并清除错误信息
        if (response.code === '0' || response.code === 0) {
          this.user = response.data.user
          this.error = null
          
          // 存储到localStorage
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          
          // 返回响应数据
          return response
        } else {
          // 登录失败，设置错误信息
          this.error = response.msg || '邮箱登录失败'
          throw new Error(this.error)
        }
      } catch (error) {
        // 登录失败，设置错误信息
        this.error = error.response?.data?.msg || error.message || '邮箱登录失败'
        // 抛出错误
        throw error
      }
    },
    
    // 手机登录动作，接收手机号和验证码作为参数
    async phoneLogin(credentials) {
      try {
        // 发送 POST 请求到手机登录 API
        const response = await request.post('/api/public/user/phone-login', {
          phone: credentials.phone,
          code: credentials.code
        })
        
        // 登录成功，设置用户信息并清除错误信息
        if (response.success) {
          this.user = response.data.user || { phone: credentials.phone }
          this.error = null
          
          // 存储到localStorage
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(this.user))
          
          // 返回响应数据
          return response
        } else {
          // 登录失败，设置错误信息
          this.error = response.message || '手机登录失败'
          throw new Error(this.error)
        }
      } catch (error) {
        // 登录失败，设置错误信息
        this.error = error.response?.data?.message || error.message || '手机登录失败'
        // 抛出错误
        throw error
      }
    },
  }
})
