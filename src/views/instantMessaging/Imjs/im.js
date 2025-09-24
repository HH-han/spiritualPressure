import { ElMessage } from 'element-plus'
import { messageWebSocket } from '@/utils/message-websocket'

/**
 * 初始化消息WebSocket连接
 * @param {Function} onMessageReceived - 消息接收回调函数
 * @param {Ref} isConnectedRef - 连接状态引用
 * @returns {Object} 包含连接和断开连接方法的对象
 */
export const initMessageWebSocket = (onMessageReceived, isConnectedRef) => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    ElMessage.error('未找到用户token，无法初始化消息推送')
    return {
      connect: () => {},
      disconnect: () => {}
    }
  }

  // 连接WebSocket
  const connect = () => {
    messageWebSocket.connect(token, 
      () => {
        console.log('消息WebSocket连接成功')
        if (isConnectedRef) {
          isConnectedRef.value = true
        }
        
        // 注册消息接收回调
        if (onMessageReceived) {
          messageWebSocket.on('onMessageReceived', onMessageReceived)
        }
        
        console.log('已自动订阅所有必要的消息队列')
        
        // 注册连接状态变化回调
        messageWebSocket.on('onConnectionStatusChanged', (status) => {
          if (isConnectedRef) {
            isConnectedRef.value = status.connected
          }
          if (!status.connected) {
            ElMessage.warning('消息推送连接已断开，正在尝试重连...')
          }
        })
      }, 
      (error) => {
        console.error('消息WebSocket连接失败:', error)
        if (isConnectedRef) {
          isConnectedRef.value = false
        }
        ElMessage.error('实时消息推送功能初始化失败')
      }
    )
  }

  // 断开连接并清理
  const disconnect = () => {
    if (onMessageReceived) {
      messageWebSocket.off('onMessageReceived', onMessageReceived)
    }
    messageWebSocket.off('onConnectionStatusChanged')
    messageWebSocket.disconnect()
    
    if (isConnectedRef) {
      isConnectedRef.value = false
    }
  }

  return {
    connect,
    disconnect
  }
}

/**
 * 通过WebSocket发送消息
 * @param {Object} messageData - 消息数据
 * @param {Object} chat - 聊天对象
 * @param {Number} currentUserId - 当前用户ID
 * @returns {Promise<boolean>} 是否发送成功
 */
export const sendMessageViaWebSocket = async (messageData, chat, currentUserId) => {
  // 初始连接检查
  if (!messageWebSocket.getConnected()) {
    console.warn('消息WebSocket未连接，使用HTTP API发送')
    return false
  }
  
  // 构建基础消息对象
  const baseMessage = {
    senderId: currentUserId,
    content: messageData.content,
    messageType: messageData.messageType || 'TEXT',
    image: messageData.image,
    timestamp: Date.now()
  }
  
  // 如果是图片消息，使用专门的图片消息发送方法
  if (messageData.messageType === 'IMAGE') {
    try {
      let success = false
      
      if (chat.type === 'friend') {
        success = messageWebSocket.sendImageMessage({
          ...baseMessage,
          receiverId: chat.id
        })
      } else if (chat.type === 'group') {
        success = messageWebSocket.sendImageMessage({
          ...baseMessage,
          groupId: chat.id
        })
      }
      
      if (success) {
        console.log('图片消息已通过WebSocket发送')
        return true
      }
    } catch (error) {
      console.error('WebSocket发送图片消息错误:', error)
      return false
    }
  }
  
  try {
    let success = false
    
    if (chat.type === 'friend') {
      success = messageWebSocket.sendSingleMessage({
        ...baseMessage,
        receiverId: chat.id
      })
    } else if (chat.type === 'group') {
      success = messageWebSocket.sendGroupMessage({
        ...baseMessage,
        groupId: chat.id
      })
    }
    
    if (success) {
      console.log('消息已通过WebSocket发送')
      return true
    } else {
      console.warn('WebSocket发送失败，回退到HTTP API')
      return false
    }
  } catch (error) {
    console.error('WebSocket发送消息错误:', error)
    
    // 处理STOMP连接错误
    if (error.message && error.message.includes('underlying STOMP connection')) {
      console.warn('STOMP连接已断开，尝试重新连接...')
      
      // 尝试重新连接（带超时）
      const reconnectPromise = new Promise((resolve) => {
        const token = localStorage.getItem('token')
        if (!token) {
          resolve(false)
          return
        }
        
        messageWebSocket.connect(token, 
          () => {
            console.log('重连成功，重新发送消息')
            resolve(true)
          },
          (reconnectError) => {
            console.error('重连失败:', reconnectError)
            resolve(false)
          }
        )
      })
      
      // 设置5秒超时
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve(false), 5000)
      })
      
      // 等待重连结果或超时
      const reconnected = await Promise.race([reconnectPromise, timeoutPromise])
      
      if (reconnected) {
        // 重连成功，重新发送消息
        if (chat.type === 'friend') {
          return messageWebSocket.sendSingleMessage({
            ...baseMessage,
            receiverId: chat.id
          })
        } else if (chat.type === 'group') {
          return messageWebSocket.sendGroupMessage({
            ...baseMessage,
            groupId: chat.id
          })
        }
      }
      
      return false
    }
    
    return false
  }
}

/**
 * 处理WebSocket接收到的消息
 * @param {Object} message - 接收到的消息
 * @param {Object} chat - 当前聊天对象
 * @param {Number} currentUserId - 当前用户ID
 * @param {Array} messages - 消息列表引用
 * @param {Function} scrollToBottom - 滚动到底部函数
 * @param {Function} playMessageSound - 播放提示音函数
 */
export const handleWebSocketMessage = (message, chat, currentUserId, messages, scrollToBottom, playMessageSound) => {
  console.log('通过WebSocket收到新消息:', message)
  
  // 将消息添加到当前聊天列表
  const newMessage = {
    id: message.id || Date.now(),
    content: message.content,
    timestamp: message.sendTime || Date.now(),
    isSelf: message.senderId === currentUserId,
    contentImage: message.image,
    image: message.senderAvatar || message.avatar || chat.image ,
    messageType: message.messageType || 'TEXT'
  }
  
  // 判断messages是否为响应式ref对象
  if (messages && typeof messages === 'object' && 'value' in messages) {
    messages.value.push(newMessage)
    // 强制更新响应式数组，确保UI更新
    messages.value = [...messages.value]
  } else if (Array.isArray(messages)) {
    messages.push(newMessage)
  }
  scrollToBottom()
  
  // 播放消息提示音（可选）
  if (!newMessage.isSelf && playMessageSound) {
    playMessageSound()
  }
  
  // 处理测试消息（来自/topic/greetings）
  if (typeof message === 'string' && message.startsWith('Hello,')) {
    console.log('收到测试消息响应:', message)
    // 可以在这里添加测试消息的处理逻辑，比如显示通知
    ElMessage.info(`收到测试响应: ${message}`)
  }
}