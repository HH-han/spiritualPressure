<template>
  <div class="websocket-test">
    <h2>WebSocket消息转发测试</h2>
    
    <div class="test-controls">
      <div class="user-section">
        <h3>用户1 (发送者)</h3>
        <div class="input-group">
          <label>用户ID:</label>
          <input v-model="user1.id" type="number" placeholder="发送者用户ID" />
        </div>
        <div class="input-group">
          <label>Token:</label>
          <input v-model="user1.token" type="text" placeholder="用户1的token" />
        </div>
        <button @click="connectUser1" :disabled="user1.connected">
          {{ user1.connected ? '已连接' : '连接用户1' }}
        </button>
        <button @click="disconnectUser1" :disabled="!user1.connected">断开连接</button>
      </div>

      <div class="user-section">
        <h3>用户2 (接收者)</h3>
        <div class="input-group">
          <label>用户ID:</label>
          <input v-model="user2.id" type="number" placeholder="接收者用户ID" />
        </div>
        <div class="input-group">
          <label>Token:</label>
          <input v-model="user2.token" type="text" placeholder="用户2的token" />
        </div>
        <button @click="connectUser2" :disabled="user2.connected">
          {{ user2.connected ? '已连接' : '连接用户2' }}
        </button>
        <button @click="disconnectUser2" :disabled="!user2.connected">断开连接</button>
      </div>
    </div>

    <div class="message-section">
      <h3>发送消息</h3>
      <div class="input-group">
        <label>消息内容:</label>
        <input v-model="messageContent" type="text" placeholder="输入测试消息内容" />
      </div>
      <button @click="sendTestMessage" :disabled="!user1.connected">
        发送消息到用户{{ user2.id }}
      </button>
    </div>

    <div class="logs-section">
      <h3>连接状态和消息日志</h3>
      <div class="log-container">
        <div v-for="(log, index) in logs" :key="index" class="log-item">
          [{{ log.timestamp }}] {{ log.message }}
        </div>
      </div>
    </div>

    <div class="status-section">
      <h3>连接状态</h3>
      <p>用户1: {{ user1.connected ? '已连接' : '未连接' }}</p>
      <p>用户2: {{ user2.connected ? '已连接' : '未连接' }}</p>
      <p>用户1订阅: {{ user1.subscribed ? '已订阅' : '未订阅' }}</p>
      <p>用户2订阅: {{ user2.subscribed ? '已订阅' : '未订阅' }}</p>
    </div>
  </div>
</template>

<script>
import { messageWebSocket } from '@/utils/message-websocket'

export default {
  name: 'WebSocketTest',
  data() {
    return {
      user1: {
        id: 1,
        token: '',
        connected: false,
        subscribed: false,
        websocket: null
      },
      user2: {
        id: 2,
        token: '',
        connected: false,
        subscribed: false,
        websocket: null
      },
      messageContent: '测试消息 - ' + new Date().toLocaleTimeString(),
      logs: []
    }
  },
  methods: {
    addLog(message) {
      this.logs.unshift({
        timestamp: new Date().toLocaleTimeString(),
        message: message
      })
      // 限制日志数量
      if (this.logs.length > 50) {
        this.logs = this.logs.slice(0, 50)
      }
    },

    // 用户1连接
    connectUser1() {
      if (!this.user1.token) {
        this.addLog('用户1: 请先输入token')
        return
      }

      // 创建用户1的WebSocket实例
      this.user1.websocket = new messageWebSocket.constructor()
      
      this.user1.websocket.connect(this.user1.token, 
        (frame) => {
          this.user1.connected = true
          this.user1.subscribed = true
          this.addLog(`用户1: 连接成功 - ${frame.command}`)
          
          // 监听消息接收
          this.user1.websocket.on('onMessageReceived', (message) => {
            this.addLog(`用户1收到消息: ${JSON.stringify(message)}`)
          })
          
          this.user1.websocket.on('onConnectionStatusChanged', (status) => {
            this.addLog(`用户1连接状态: ${status.connected ? '已连接' : '已断开'}`)
            this.user1.connected = status.connected
          })
        },
        (error) => {
          this.addLog(`用户1: 连接失败 - ${error.message || error}`)
          this.user1.connected = false
        }
      )
    },

    // 用户2连接
    connectUser2() {
      if (!this.user2.token) {
        this.addLog('用户2: 请先输入token')
        return
      }

      // 创建用户2的WebSocket实例
      this.user2.websocket = new messageWebSocket.constructor()
      
      this.user2.websocket.connect(this.user2.token, 
        (frame) => {
          this.user2.connected = true
          this.user2.subscribed = true
          this.addLog(`用户2: 连接成功 - ${frame.command}`)
          
          // 监听消息接收
          this.user2.websocket.on('onMessageReceived', (message) => {
            this.addLog(`用户2收到消息: ${JSON.stringify(message)}`)
          })
          
          this.user2.websocket.on('onConnectionStatusChanged', (status) => {
            this.addLog(`用户2连接状态: ${status.connected ? '已连接' : '已断开'}`)
            this.user2.connected = status.connected
          })
        },
        (error) => {
          this.addLog(`用户2: 连接失败 - ${error.message || error}`)
          this.user2.connected = false
        }
      )
    },

    // 断开用户1连接
    disconnectUser1() {
      if (this.user1.websocket) {
        this.user1.websocket.disconnect()
        this.user1.connected = false
        this.user1.subscribed = false
        this.addLog('用户1: 已断开连接')
      }
    },

    // 断开用户2连接
    disconnectUser2() {
      if (this.user2.websocket) {
        this.user2.websocket.disconnect()
        this.user2.connected = false
        this.user2.subscribed = false
        this.addLog('用户2: 已断开连接')
      }
    },

    // 发送测试消息
    async sendTestMessage() {
      if (!this.user1.connected) {
        this.addLog('请先连接用户1')
        return
      }

      if (!this.messageContent.trim()) {
        this.addLog('消息内容不能为空')
        return
      }

      const message = {
        senderId: this.user1.id,
        receiverId: this.user2.id,
        content: this.messageContent,
        messageType: 'TEXT',
        timestamp: new Date().toISOString()
      }

      try {
        const success = this.user1.websocket.sendSingleMessage(message)
        if (success) {
          this.addLog(`用户1发送消息到用户${this.user2.id}: ${this.messageContent}`)
          this.messageContent = '测试消息 - ' + new Date().toLocaleTimeString()
        } else {
          this.addLog('发送失败: WebSocket连接可能已断开')
        }
      } catch (error) {
        this.addLog(`发送错误: ${error.message}`)
      }
    }
  },
  beforeUnmount() {
    // 组件销毁时断开所有连接
    if (this.user1.websocket) {
      this.user1.websocket.disconnect()
    }
    if (this.user2.websocket) {
      this.user2.websocket.disconnect()
    }
  }
}
</script>

<style scoped>
.websocket-test {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.test-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.user-section {
  flex: 1;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.user-section h3 {
  margin-top: 0;
  color: #333;
}

.input-group {
  margin-bottom: 10px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

.message-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.logs-section {
  margin-bottom: 20px;
}

.log-container {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  background-color: #f8f9fa;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.log-item {
  margin-bottom: 5px;
  padding: 3px;
  border-bottom: 1px solid #eee;
}

.status-section {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.status-section h3 {
  margin-top: 0;
}

.status-section p {
  margin: 5px 0;
  font-weight: bold;
}

@media (max-width: 768px) {
  .test-controls {
    flex-direction: column;
  }
}
</style>