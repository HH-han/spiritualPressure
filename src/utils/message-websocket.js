import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

class MessageWebSocket {
  constructor() {
    this.client = null
    this.isConnected = false
    this.callbacks = {
      onMessageReceived: [],
      onMessageSent: [],
      onConnectionStatusChanged: []
    }
  }

  // 连接到消息WebSocket
  connect(token, onConnect, onError) {
    if (this.client && this.isConnected) {
      return
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const socketUrl = `${baseUrl}/ws`
    
    console.log('尝试连接到消息WebSocket:', socketUrl)
    
    try {
      const socket = new SockJS(socketUrl)
      
      // 监听SockJS连接事件
      socket.onopen = () => {
        console.log('消息SockJS连接已建立')
      }
      
      socket.onclose = (event) => {
        console.error('消息SockJS连接关闭:', event.code, event.reason)
        this.triggerCallbacks('onConnectionStatusChanged', { connected: false })
      }
      
      socket.onerror = (error) => {
        console.error('消息SockJS连接错误:', error)
        this.triggerCallbacks('onConnectionStatusChanged', { connected: false })
      }
      
      this.client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        debug: (str) => {
          console.log('消息STOMP Debug:', str)
        },
        reconnectDelay: 500,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
      })
    } catch (error) {
      console.error('创建消息WebSocket连接失败:', error)
      if (onError) onError(error)
      return
    }

    this.client.onConnect = (frame) => {
      console.log('消息WebSocket连接成功')
      this.isConnected = true
      
      // 订阅消息队列
      this.subscribeToMessageQueues()
      
      this.triggerCallbacks('onConnectionStatusChanged', { connected: true })
      if (onConnect) onConnect(frame)
    }

    this.client.onStompError = (frame) => {
      console.error('消息STOMP错误:', frame.headers['message'])
      this.isConnected = false
      this.triggerCallbacks('onConnectionStatusChanged', { connected: false })
      if (onError) onError(frame)
    }

    this.client.onWebSocketError = (error) => {
      console.error('消息WebSocket错误:', error)
      this.isConnected = false
      this.triggerCallbacks('onConnectionStatusChanged', { connected: false })
      if (onError) onError(error)
    }

    this.client.onDisconnect = () => {
      console.log('消息WebSocket连接断开')
      this.isConnected = false
      this.triggerCallbacks('onConnectionStatusChanged', { connected: false })
    }

    this.client.activate()
  }

  // 订阅消息队列
  subscribeToMessageQueues() {
    if (!this.client || !this.isConnected) return

    // 获取当前用户ID
    const userId = this.getCurrentUserId()
    if (!userId) {
      console.error('无法获取用户ID，无法订阅用户专属队列')
      return
    }

    // 订阅用户专属消息队列
    // 注意：Spring WebSocket会自动将/user/{userId}/queue/messages路由到正确的用户
    this.client.subscribe(`/user/queue/messages`, (message) => {
      this.handleMessageReceived(JSON.parse(message.body))
    })

    console.log(`已为用户 ${userId} 订阅专属消息队列`)
  }

  // 处理接收到的消息
  handleMessageReceived(message) {
    console.log('收到新消息:', message)
    this.triggerCallbacks('onMessageReceived', message)
  }

  // 发送消息到服务器
  send(destination, body) {
    // 基本连接检查
    if (!this.client || !this.isConnected) {
      console.error('消息WebSocket未连接')
      return false
    }
    
    // 增强连接检查 - 检查底层STOMP连接状态
    if (!this.client.connected) {
      console.error('底层STOMP连接未就绪')
      this.isConnected = false
      this.triggerCallbacks('onConnectionStatusChanged', { connected: false })
      return false
    }

    try {
      this.client.publish({
        destination: destination,
        body: JSON.stringify(body)
      })
      return true
    } catch (error) {
      console.error('发送消息失败:', error)
      
      // 处理特定的STOMP连接错误
      if (error.message && error.message.includes('underlying STOMP connection')) {
        this.isConnected = false
        this.triggerCallbacks('onConnectionStatusChanged', { connected: false })
      }
      
      return false
    }
  }

  // 发送单聊消息
  sendSingleMessage(message) {
    return this.send('/app/chat/single', message)
  }

  // 发送群聊消息
  sendGroupMessage(message) {
    return this.send('/app/chat/group', message)
  }

  // 发送图片消息
  sendImageMessage(message) {
    return this.send('/app/chat/image', message)
  }

  // 注册回调函数
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback)
    }
  }

  // 移除回调函数
  off(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback)
    }
  }

  // 触发回调函数
  triggerCallbacks(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`回调函数执行错误 (${event}):`, error)
        }
      })
    }
  }

  // 断开连接
  disconnect() {
    if (this.client) {
      this.client.deactivate()
      this.isConnected = false
      this.client = null
      this.triggerCallbacks('onConnectionStatusChanged', { connected: false })
    }
  }

  // 订阅特定主题
  subscribe(topic, callback) {
    if (!this.client || !this.isConnected) {
      console.error('WebSocket未连接，无法订阅主题:', topic)
      return false
    }

    try {
      const subscription = this.client.subscribe(topic, (message) => {
        if (callback) {
          callback(JSON.parse(message.body))
        }
      })
      console.log('已订阅主题:', topic)
      return subscription
    } catch (error) {
      console.error('订阅主题失败:', topic, error)
      return false
    }
  }

  // 获取连接状态
  getConnected() {
    return this.isConnected
  }

  // 获取当前用户ID（从localStorage或token中获取）
  getCurrentUserId() {
    try {
      // 尝试从localStorage获取用户信息
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo)
          return user.id || user.userId || null
        } catch (e) {
          console.warn('解析用户信息失败:', e)
        }
      }
      
      // 如果localStorage中没有，尝试从token中解析
      const token = localStorage.getItem('token')
      if (token && typeof token === 'string') {
        // 检查token格式是否为JWT格式（三部分用点分隔）
        const tokenParts = token.split('.')
        if (tokenParts.length === 3) {
          const payload = tokenParts[1]
          if (payload) {
            // 添加base64解码的健壮性处理
            try {
              // 处理base64 URL编码（JWT使用URL安全的base64）
              const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
              // 添加padding以确保正确的base64格式
              const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')
              const decodedStr = atob(paddedBase64)
              const decoded = JSON.parse(decodedStr)
              return decoded.userId || decoded.sub || decoded.id || null
            } catch (decodeError) {
              console.warn('解析token payload失败:', decodeError)
            }
          }
        } else {
          console.warn('token格式不正确，不是有效的JWT格式')
        }
      }
      
      console.warn('无法获取当前用户ID')
      return null
    } catch (error) {
      console.error('获取用户ID失败:', error)
      return null
    }
  }
}

// 创建单例实例
export const messageWebSocket = new MessageWebSocket()

export default MessageWebSocket