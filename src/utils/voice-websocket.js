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
      return
    }

    const voiceBaseUrl = import.meta.env.VITE_VOICE_BASE_URL || 'http://localhost:2025'
    // 尝试不同的WebSocket端点配置
    const endpoints = [
      `${voiceBaseUrl}/voice`,
    ]
    
    // 使用第一个可用的端点
    const socketUrl = endpoints[0]
    console.log('尝试连接到语音WebSocket:', socketUrl)
    console.log('链接端点:', endpoints.slice(1))
    
    try {
      const socket = new SockJS(socketUrl)
      
      // 监听SockJS连接事件
      socket.onopen = () => {
        console.log('SockJS连接已建立')
      }
      
      socket.onclose = (event) => {
        console.error('SockJS连接关闭:', event.code, event.reason)
      }
      
      socket.onerror = (error) => {
        console.error('SockJS连接错误:', error)
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
      this.isConnected = true
      
      // 订阅用户专属队列
      this.subscribeToUserQueues()
      
      if (onConnect) onConnect(frame)
    }

    this.client.onStompError = (frame) => {
      console.error('STOMP错误:', frame.headers['message'])
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
    if (!this.client || !this.isConnected) return

    // 订阅语音通话请求队列
    this.client.subscribe('/user/queue/voice/call', (message) => {
      this.handleCallMessage(JSON.parse(message.body))
    })

    // 订阅音频数据队列
    this.client.subscribe('/user/queue/voice/audio', (message) => {
      this.handleAudioMessage(JSON.parse(message.body))
    })

    // 订阅ICE候选队列
    this.client.subscribe('/user/queue/voice/ice', (message) => {
      this.handleIceMessage(JSON.parse(message.body))
    })

    // 订阅SDP信令队列
    this.client.subscribe('/user/queue/voice/sdp', (message) => {
      this.handleSdpMessage(JSON.parse(message.body))
    })
  }

  // 处理通话消息
  handleCallMessage(message) {
    switch (message.status) {
      case 'INITIATED':
        this.triggerCallbacks('onCallInitiated', message)
        break
      case 'RINGING':
        this.triggerCallbacks('onCallRequest', message)
        break
      case 'IN_PROGRESS':
        this.triggerCallbacks('onCallAccepted', message) // 后端返回IN_PROGRESS，对应前端的onCallAccepted
        break
      case 'REJECTED':
        this.triggerCallbacks('onCallRejected', message)
        break
      case 'ENDED':
        this.triggerCallbacks('onCallEnded', message)
        break
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
    return this.send('/app/voice/call/request', {
      receiver: receiverId,
      timestamp: Date.now()
    })
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
          return decoded.userId || decoded.sub || decoded.id || null
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
export const voiceWebSocket = new VoiceWebSocket()

export default VoiceWebSocket