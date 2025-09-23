import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

class VoiceWebSocket {
  constructor() {
    this.client = null
    this.isConnected = false
    this.callbacks = {
      onCallRequest: [],
      onCallAccepted: [],
      onCallRejected: [],
      onCallEnded: [],
      onCallInitiated: [],
      onAudioData: [],
      onIceCandidate: [],
      onSdpOffer: [],
      onSdpAnswer: []
    }
  }

  // 连接到语音WebSocket
  connect(token, onConnect, onError) {
    if (this.client && this.isConnected) {
      console.log('WebSocket已连接，无需重复连接')
      return
    }

    // 使用正确的WebSocket端点
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const socketUrl = `${baseUrl}/voice`
    console.log('尝试连接到语音WebSocket:', socketUrl)
    console.log('使用token:', token ? '已提供' : '未提供')
    
    try {
      const socket = new SockJS(socketUrl)
      
      // 监听SockJS连接事件
      socket.onopen = () => {
        console.log('SockJS连接已建立')
      }
      
      socket.onclose = (event) => {
        console.error('SockJS连接关闭:', event.code, event.reason)
        this.isConnected = false
      }
      
      socket.onerror = (error) => {
        console.error('SockJS连接错误:', error)
        this.isConnected = false
      }
      
      this.client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        debug: (str) => {
          console.log('STOMP Debug:', str)
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
      })
    } catch (error) {
      console.error('创建WebSocket连接失败:', error)
      if (onError) onError(error)
      return
    }

    this.client.onConnect = (frame) => {
      console.log('语音WebSocket连接成功')
      console.log('连接帧信息:', frame)
      this.isConnected = true
      
      // 订阅用户专属队列
      this.subscribeToUserQueues()
      
      if (onConnect) onConnect(frame)
    }

    this.client.onStompError = (frame) => {
      console.error('STOMP错误:', frame.headers['message'])
      console.error('STOMP错误帧:', frame)
      this.isConnected = false
      if (onError) onError(frame)
    }

    this.client.onWebSocketError = (error) => {
      console.error('WebSocket错误:', error)
      this.isConnected = false
      if (onError) onError(error)
    }

    this.client.onDisconnect = () => {
      console.log('语音WebSocket连接断开')
      this.isConnected = false
    }

    this.client.activate()
  }

  // 订阅用户专属队列
  subscribeToUserQueues() {
    if (!this.client || !this.isConnected) {
      console.error('无法订阅队列：client未连接或连接状态异常')
      return
    }

    const userId = this.getCurrentUserId()
    if (!userId) {
      console.error('无法获取用户ID，无法订阅语音队列')
      return
    }

    console.log(`开始为用户 ${userId} 订阅语音队列...`)

    // 订阅语音通话请求队列（使用正确的用户专属路径）
    // 注意：Spring WebSocket会自动将/user/{userId}/queue/voice/call路由到正确的用户
    const callSubscription = this.client.subscribe(`/user/queue/voice/call`, (message) => {
      console.log('收到通话消息:', message.body)
      this.handleCallMessage(JSON.parse(message.body))
    })
    console.log('已订阅通话队列，订阅ID:', callSubscription.id)

    // 订阅音频数据队列（使用正确的用户专属路径）
    const audioSubscription = this.client.subscribe(`/user/queue/voice/audio`, (message) => {
      console.log('收到音频消息:', message.body)
      this.handleAudioMessage(JSON.parse(message.body))
    })
    console.log('已订阅音频队列，订阅ID:', audioSubscription.id)

    // 订阅ICE候选队列（使用正确的用户专属路径）
    const iceSubscription = this.client.subscribe(`/user/queue/voice/ice`, (message) => {
      console.log('收到ICE候选消息:', message.body)
      this.handleIceMessage(JSON.parse(message.body))
    })
    console.log('已订阅ICE候选队列，订阅ID:', iceSubscription.id)

    // 订阅SDP信令队列（使用正确的用户专属路径）
    const sdpSubscription = this.client.subscribe(`/user/queue/voice/sdp`, (message) => {
      console.log('收到SDP消息:', message.body)
      this.handleSdpMessage(JSON.parse(message.body))
    })
    console.log('已订阅SDP队列，订阅ID:', sdpSubscription.id)

    console.log(`已为用户 ${userId} 订阅所有语音队列`)
  }

  // 处理通话消息
  handleCallMessage(message) {
    console.log('收到通话消息:', message)
    
    // 根据消息类型和状态进行处理
    if (message.type === 'CALL_REQUEST' && message.status === 'RINGING') {
      this.triggerCallbacks('onCallRequest', message)
    } else if (message.type === 'CALL_REQUEST' && message.status === 'REJECTED') {
      this.triggerCallbacks('onCallRejected', message)
    } else if (message.type === 'CALL_ACCEPT' && message.status === 'IN_PROGRESS') {
      this.triggerCallbacks('onCallAccepted', message)
    } else if (message.type === 'CALL_REJECT' && message.status === 'REJECTED') {
      this.triggerCallbacks('onCallRejected', message)
    } else if (message.type === 'CALL_END' && message.status === 'ENDED') {
      this.triggerCallbacks('onCallEnded', message)
    } else if (message.status === 'INITIATED') {
      this.triggerCallbacks('onCallInitiated', message)
    } else if (message.status === 'RINGING') {
      this.triggerCallbacks('onCallRequest', message)
    } else if (message.status === 'IN_PROGRESS') {
      this.triggerCallbacks('onCallAccepted', message)
    } else if (message.status === 'REJECTED') {
      this.triggerCallbacks('onCallRejected', message)
    } else if (message.status === 'ENDED') {
      this.triggerCallbacks('onCallEnded', message)
    }
  }

  // 处理音频消息
  handleAudioMessage(message) {
    this.triggerCallbacks('onAudioData', message)
  }

  // 处理ICE候选消息
  handleIceMessage(message) {
    this.triggerCallbacks('onIceCandidate', message)
  }

  // 处理SDP信令消息
  handleSdpMessage(message) {
    if (message.type === 'offer') {
      this.triggerCallbacks('onSdpOffer', message)
    } else if (message.type === 'answer') {
      this.triggerCallbacks('onSdpAnswer', message)
    }
  }

  // 发送消息到服务器
  send(destination, body) {
    if (!this.client || !this.isConnected) {
      console.error('WebSocket未连接')
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
      return false
    }
  }

  // 发起语音通话
  requestCall(receiverId) {
    if (!this.client || !this.isConnected) {
      console.error('WebSocket未连接，无法发送通话请求')
      return false
    }

    // 验证用户标识
    console.log('=== 发送通话请求前验证 ===')
    this.validateUserIdentity()

    const currentUserId = this.getCurrentUserId()
    if (!currentUserId) {
      console.error('无法获取当前用户ID')
      return false
    }

    console.log(`用户 ${currentUserId} 准备发送通话请求给 ${receiverId}`)

    // 检查订阅状态
    console.log('当前订阅状态:')
    if (this.client && this.client.subscriptions) {
      Object.keys(this.client.subscriptions).forEach(id => {
        const sub = this.client.subscriptions[id]
        console.log(`- ${sub.destination} (ID: ${id})`)
      })
    }

    // 确保receiver是字符串类型，与后端期望一致
    const message = {
      receiver: String(receiverId),
      timestamp: Date.now()
    }

    console.log('发送通话请求消息体JSON:', JSON.stringify(message))
    
    const result = this.send('/app/voice/call/request', message)
    
    if (result) {
      console.log(`已发送通话请求: ${currentUserId} -> ${receiverId}`)
    } else {
      console.error('发送通话请求失败')
    }
    
    return result
  }

  // 接受语音通话
  acceptCall(callId) {
    return this.send('/app/voice/call/accept', {
      callId: callId,
      timestamp: Date.now()
    })
  }

  // 拒绝语音通话
  rejectCall(callId) {
    return this.send('/app/voice/call/reject', {
      callId: callId,
      timestamp: Date.now()
    })
  }

  // 结束语音通话
  endCall(callId) {
    return this.send('/app/voice/call/end', {
      callId: callId,
      timestamp: Date.now()
    })
  }

  // 发送音频数据
  sendAudioData(callId, audioData) {
    return this.send('/app/voice/audio/send', {
      callId: callId,
      audioData: audioData,
      timestamp: Date.now()
    })
  }

  // 发送ICE候选
  sendIceCandidate(callId, candidate) {
    return this.send('/app/voice/ice/send', {
      callId: callId,
      audioData: candidate, // 后端使用audioData字段接收ICE候选
      timestamp: Date.now()
    })
  }

  // 发送SDP Offer
  sendSdpOffer(callId, offer) {
    return this.send('/app/voice/sdp/offer', {
      callId: callId,
      audioData: offer, // 后端使用audioData字段接收SDP
      timestamp: Date.now()
    })
  }

  // 发送SDP Answer
  sendSdpAnswer(callId, answer) {
    return this.send('/app/voice/sdp/answer', {
      callId: callId,
      audioData: answer, // 后端使用audioData字段接收SDP
      timestamp: Date.now()
    })
  }

  // 注册回调函数
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback)
    }
  }

  // 取消注册回调函数
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
        const user = JSON.parse(userInfo)
        return user.id || user.userId || null
      }
      
      // 如果localStorage中没有，尝试从token中解析
      const token = localStorage.getItem('token')
      if (token) {
        // 简单的token解析（实际项目中应该使用JWT解析库）
        const payload = token.split('.')[1]
        if (payload) {
          const decoded = JSON.parse(atob(payload))
          const userId = decoded.userId || decoded.sub || decoded.id || null
          console.log('从token解析的用户ID:', userId)
          console.log('完整token payload:', decoded)
          return userId
        }
      }
      
      console.warn('无法获取当前用户ID')
      return null
    } catch (error) {
      console.error('获取用户ID失败:', error)
      return null
    }
  }

  // 调试连接状态
  debugConnectionStatus() {
    console.log('=== WebSocket连接状态调试 ===')
    console.log('连接状态:', this.isConnected)
    console.log('客户端实例:', this.client ? '已创建' : '未创建')
    console.log('当前用户ID:', this.getCurrentUserId())
    
    if (this.client) {
      console.log('客户端状态:', this.client.connected ? '已连接' : '未连接')
      console.log('活跃订阅数:', this.client.subscriptions ? Object.keys(this.client.subscriptions).length : 0)
      
      // 检查订阅详情
      if (this.client.subscriptions) {
        Object.keys(this.client.subscriptions).forEach(id => {
          console.log(`订阅 ${id}:`, this.client.subscriptions[id].destination)
        })
      }
    }
    
    console.log('=== 结束调试 ===')
  }

  // 验证用户标识
  validateUserIdentity() {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('未找到token')
      return false
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      console.log('Token解析成功:')
      console.log('- 用户名:', payload.sub || payload.username)
      console.log('- 用户ID:', payload.userId || payload.id)
      console.log('- 过期时间:', new Date(payload.exp * 1000))
      console.log('- 完整payload:', payload)
      return true
    } catch (error) {
      console.error('Token解析失败:', error)
      return false
    }
  }
}


// 创建单例实例
export const voiceWebSocket = new VoiceWebSocket()

export default VoiceWebSocket