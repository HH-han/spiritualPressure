<template>
  <div class="voice-call-control" :class="{ active: isCallActive }">
    <!-- 通话中界面 -->
    <div v-if="isCallActive" class="call-active">
      <div class="call-info">
        <div class="caller-avatar">
          <el-avatar :size="60" :src="callInfo.callerAvatar" />
        </div>
        <div class="call-details">
          <div class="caller-name">{{ callInfo.callerName }}</div>
          <div class="call-status">
            <span v-if="callInfo.status === 'CONNECTED'">通话中</span>
            <span v-else-if="callInfo.status === 'RINGING'">正在呼叫...</span>
            <span v-else-if="callInfo.status === 'CONNECTING'">正在连接...</span>
          </div>
          <div class="call-duration">{{ formatDuration(callDuration) }}</div>
        </div>
      </div>
      
      <div class="call-actions">
        <el-tooltip content="静音" placement="top">
          <el-button 
            :type="isMuted ? 'danger' : 'default'" 
            circle 
            @click="toggleMute"
          >
            <el-icon><Microphone /></el-icon>
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="扬声器" placement="top">
          <el-button 
            :type="isSpeakerOn ? 'primary' : 'default'" 
            circle 
            @click="toggleSpeaker"
          >
            <el-icon><VideoPlay /></el-icon>
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="结束通话" placement="top">
          <el-button type="danger" circle @click="endCall">
            <el-icon><Phone /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
      
      <div class="audio-indicators">
        <div class="volume-indicator" :style="{ height: volumeLevel + '%' }"></div>
      </div>
    </div>
    
    <!-- 来电界面 -->
    <div v-else-if="incomingCall" class="incoming-call">
      <div class="caller-info">
        <el-avatar :size="80" :src="incomingCall.callerAvatar" />
        <div class="caller-name">{{ incomingCall.callerName }}</div>
        <div class="call-type">语音通话</div>
      </div>
      
      <div class="incoming-actions">
        <el-button type="success" circle size="large" @click="acceptCall">
          <el-icon><Phone /></el-icon>
        </el-button>
        <el-button type="danger" circle size="large" @click="rejectCall">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      
      <div class="ringing-animation">
        <div class="ring ring-1"></div>
        <div class="ring ring-2"></div>
        <div class="ring ring-3"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Phone, Microphone, VideoPlay, Close } from '@element-plus/icons-vue'
import { voiceWebSocket } from '@/utils/voice-websocket'
import { AudioProcessor, audioUtils } from '@/utils/audio-processor'

const props = defineProps({
  currentChat: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['callStarted', 'callEnded'])

// 状态变量
const isCallActive = ref(false)
const incomingCall = ref(null)
const callInfo = ref({
  callId: '',
  callerId: '',
  callerName: '',
  callerAvatar: '',
  status: '',
  startTime: null
})
const isMuted = ref(false)
const isSpeakerOn = ref(true)
const volumeLevel = ref(50)
const callDuration = ref(0)
const callTimer = ref(null)
const audioProcessor = ref(new AudioProcessor())
const ringtoneAudio = ref(null)
const pendingOffer = ref(null) // 保存待发送的SDP Offer

// 计算属性
const formattedDuration = computed(() => {
  const minutes = Math.floor(callDuration.value / 60)
  const seconds = callDuration.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 生命周期钩子
onMounted(() => {
  setupWebSocketListeners()
  setupAudioCallbacks()
})

onUnmounted(() => {
  cleanupCall()
  removeWebSocketListeners()
  audioProcessor.value.stopAllStreams()
})

// WebSocket监听器设置
const setupWebSocketListeners = () => {
  voiceWebSocket.on('onCallRequest', handleIncomingCall)
  voiceWebSocket.on('onCallAccepted', handleCallAccepted)
  voiceWebSocket.on('onCallRejected', handleCallRejected)
  voiceWebSocket.on('onCallEnded', handleCallEnded)
  voiceWebSocket.on('onCallInitiated', handleCallInitiated)
  voiceWebSocket.on('onSdpOffer', handleSdpOffer)
  voiceWebSocket.on('onSdpAnswer', handleSdpAnswer)
  voiceWebSocket.on('onIceCandidate', handleIceCandidate)
}

const removeWebSocketListeners = () => {
  voiceWebSocket.off('onCallInitiated', handleCallInitiated)
  voiceWebSocket.off('onCallRequest', handleIncomingCall)
  voiceWebSocket.off('onCallAccepted', handleCallAccepted)
  voiceWebSocket.off('onCallRejected', handleCallRejected)
  voiceWebSocket.off('onCallEnded', handleCallEnded)
  voiceWebSocket.off('onSdpOffer', handleSdpOffer)
  voiceWebSocket.off('onSdpAnswer', handleSdpAnswer)
  voiceWebSocket.off('onIceCandidate', handleIceCandidate)
}

// 处理SDP Offer
const handleSdpOffer = async (data) => {
  if (data.callId === callInfo.value.callId) {
    try {
      const offer = AudioProcessor.deserializeSessionDescription(data.offer)
      await audioProcessor.value.handleOffer(offer)
    } catch (error) {
      console.error('处理SDP Offer失败:', error)
    }
  }
}

// 处理SDP Answer
const handleSdpAnswer = async (data) => {
  if (data.callId === callInfo.value.callId) {
    try {
      const answer = AudioProcessor.deserializeSessionDescription(data.answer)
      await audioProcessor.value.handleAnswer(answer)
    } catch (error) {
      console.error('处理SDP Answer失败:', error)
    }
  }
}

// 处理ICE候选
const handleIceCandidate = async (data) => {
  if (data.callId === callInfo.value.callId) {
    try {
      const candidate = AudioProcessor.deserializeIceCandidate(data.candidate)
      await audioProcessor.value.addIceCandidate(candidate)
    } catch (error) {
      console.error('处理ICE候选失败:', error)
    }
  }
}

// 设置音频回调
const setupAudioCallbacks = () => {
  audioProcessor.value.onRemoteStreamAvailable = (stream) => {
    console.log('远程音频流可用')
    // 在这里处理远程音频流，例如播放音频
    playRemoteAudio(stream)
  }

  audioProcessor.value.onIceCandidate = (candidate) => {
    console.log('本地ICE候选生成:', candidate)
    // 通过WebSocket发送ICE候选
    if (callInfo.value.callId) {
      voiceWebSocket.sendIceCandidate(
        callInfo.value.callId,
        AudioProcessor.serializeIceCandidate(candidate)
      )
    }
  }

  audioProcessor.value.onConnectionStateChange = (state) => {
    console.log('连接状态变化:', state)
    if (state === 'connected') {
      callInfo.value.status = 'CONNECTED'
      startCallTimer()
    } else if (state === 'disconnected' || state === 'failed') {
      endCall()
    }
  }

  audioProcessor.value.onIceConnectionStateChange = (state) => {
    console.log('ICE连接状态变化:', state)
  }
}

// 处理来电
const handleIncomingCall = (data) => {
  incomingCall.value = {
    callId: data.callId,
    callerId: data.callerId,
    callerName: data.callerName || '未知用户',
    callerAvatar: data.callerAvatar || '',
    timestamp: data.timestamp
  }
  
  // 播放铃声
  playRingtone()
}

// 处理通话接受
const handleCallAccepted = (data) => {
  if (data.callId === callInfo.value.callId) {
    callInfo.value.status = 'CONNECTED'
    startCallTimer()
    ElMessage.success('通话已连接')
  }
}

// 处理通话发起响应（服务器返回callId）
const handleCallInitiated = (data) => {
  if (pendingOffer.value && data.callId) {
    // 设置服务器返回的callId
    callInfo.value.callId = data.callId
    callInfo.value.status = 'RINGING'
    
    // 发送保存的SDP Offer
    voiceWebSocket.sendSdpOffer(data.callId, pendingOffer.value.offer)
    
    // 清除pending offer
    pendingOffer.value = null
  }
}

// 处理通话拒绝
const handleCallRejected = (data) => {
  if (incomingCall.value && data.callId === incomingCall.value.callId) {
    stopRingtone()
    incomingCall.value = null
    ElMessage.info('对方拒绝了通话')
  }
}

// 处理通话结束
const handleCallEnded = (data) => {
  if (data.callId === callInfo.value.callId || 
      (incomingCall.value && data.callId === incomingCall.value.callId)) {
    cleanupCall()
    ElMessage.info('通话已结束')
  }
}

// 发起通话
const initiateCall = async () => {
  if (!props.currentChat.id) {
    ElMessage.warning('请先选择聊天对象')
    return
  }

  try {
    // 初始化本地音频流
    await audioProcessor.value.initLocalStream()
    
    // 创建PeerConnection
    audioProcessor.value.createPeerConnection()
    
    // 创建Offer
    const offer = await audioProcessor.value.createOffer()
    
    // 发起通话请求，服务器会返回callId
    const success = voiceWebSocket.requestCall(props.currentChat.id)
    
    if (success) {
      // 先设置基本通话信息，callId将在服务器响应后设置
      callInfo.value = {
        callId: '', // 初始为空，等待服务器返回
        callerId: props.currentChat.id,
        callerName: props.currentChat.username || props.currentChat.name || '对方',
        callerAvatar: props.currentChat.image || props.currentChat.avatar || '',
        status: 'INITIATING', // 初始状态
        startTime: Date.now()
      }
      isCallActive.value = true
      
      // 保存offer，等待服务器返回callId后再发送
      pendingOffer.value = {
        offer: AudioProcessor.serializeSessionDescription(offer),
        receiverId: props.currentChat.id
      }
      
      emit('callStarted')
    }
  } catch (error) {
    console.error('发起通话失败:', error)
    ElMessage.error('发起通话失败: ' + error.message)
    audioProcessor.value.stopAllStreams()
  }
}

// 接受来电
const acceptCall = async () => {
  if (!incomingCall.value) return

  try {
    // 初始化本地音频流
    await audioProcessor.value.initLocalStream()
    
    // 创建PeerConnection
    audioProcessor.value.createPeerConnection()
    
    // 处理远程Offer
    if (incomingCall.value.offer) {
      const offer = AudioProcessor.deserializeSessionDescription(incomingCall.value.offer)
      const answer = await audioProcessor.value.handleOffer(offer)
      
      const success = voiceWebSocket.acceptCall(incomingCall.value.callId)
      
      if (success) {
        callInfo.value = {
          ...incomingCall.value,
          status: 'CONNECTING',
          startTime: Date.now()
        }
        isCallActive.value = true
        incomingCall.value = null
        stopRingtone()
        emit('callStarted')
      }
    }
  } catch (error) {
    console.error('接受通话失败:', error)
    ElMessage.error('接受通话失败: ' + error.message)
    audioProcessor.value.stopAllStreams()
  }
}

// 拒绝来电
const rejectCall = async () => {
  if (!incomingCall.value) return

  try {
    voiceWebSocket.rejectCall(incomingCall.value.callId)
    incomingCall.value = null
    stopRingtone()
  } catch (error) {
    console.error('拒绝通话失败:', error)
  }
}

// 结束通话
const endCall = async () => {
  if (!callInfo.value.callId) return

  try {
    voiceWebSocket.endCall(callInfo.value.callId)
    cleanupCall()
    emit('callEnded')
  } catch (error) {
    console.error('结束通话失败:', error)
  }
}

// 清理通话状态
const cleanupCall = () => {
  isCallActive.value = false
  incomingCall.value = null
  pendingOffer.value = null // 清理pending offer
  callInfo.value = {
    callId: '',
    callerId: '',
    callerName: '',
    callerAvatar: '',
    status: '',
    startTime: null
  }
  stopCallTimer()
  stopRingtone()
  audioProcessor.value.stopAllStreams()
}

// 通话计时器
const startCallTimer = () => {
  stopCallTimer()
  callTimer.value = setInterval(() => {
    callDuration.value++
  }, 1000)
}

const stopCallTimer = () => {
  if (callTimer.value) {
    clearInterval(callTimer.value)
    callTimer.value = null
  }
  callDuration.value = 0
}

// 播放远程音频
const playRemoteAudio = (stream) => {
  const audio = new Audio()
  audio.srcObject = stream
  audio.autoplay = true
  audio.muted = !isSpeakerOn.value
  
  audio.onloadedmetadata = () => {
    console.log('远程音频加载完成')
  }
  
  audio.onerror = (error) => {
    console.error('播放远程音频失败:', error)
  }
}

// 音频控制
const toggleMute = () => {
  isMuted.value = audioProcessor.value.toggleMute()
  ElMessage.info(isMuted.value ? '已静音' : '取消静音')
}

const toggleSpeaker = () => {
  isSpeakerOn.value = audioProcessor.value.toggleSpeaker()
  ElMessage.info(isSpeakerOn.value ? '扬声器已开启' : '扬声器已关闭')
}

// 铃声控制
const playRingtone = () => {
  stopRingtone()
  ringtoneAudio.value = audioUtils.playIncomingCallRing()
}

const stopRingtone = () => {
  if (ringtoneAudio.value) {
    ringtoneAudio.value.pause()
    ringtoneAudio.value.currentTime = 0
    ringtoneAudio.value = null
  }
  audioUtils.stopAllAudio()
}

// 格式化时间
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 暴露方法给父组件
defineExpose({
  initiateCall,
  endCall,
  isCallActive,
  callInfo
})
</script>

<style scoped>
@import './css/voice-call-control.css';
</style>