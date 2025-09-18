// WebRTC音频处理器
export class AudioProcessor {
  constructor() {
    this.localStream = null
    this.remoteStream = null
    this.peerConnection = null
    this.isMuted = false
    this.isSpeakerOn = true
    this.iceCandidates = []
    this.configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    }
  }

  // 初始化音频流
  async initLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      })
      
      return this.localStream
    } catch (error) {
      console.error('获取音频设备失败:', error)
      throw new Error('无法访问麦克风，请检查权限设置')
    }
  }

  // 创建PeerConnection
  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.configuration)
    
    // 添加本地流
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream)
      })
    }

    // 处理远程流
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0]
      this.onRemoteStreamAvailable(this.remoteStream)
    }

    // 处理ICE候选
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.onIceCandidate(event.candidate)
      }
    }

    // 处理连接状态变化
    this.peerConnection.onconnectionstatechange = () => {
      console.log('连接状态:', this.peerConnection.connectionState)
      this.onConnectionStateChange(this.peerConnection.connectionState)
    }

    // 处理ICE连接状态变化
    this.peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE连接状态:', this.peerConnection.iceConnectionState)
      this.onIceConnectionStateChange(this.peerConnection.iceConnectionState)
    }

    return this.peerConnection
  }

  // 创建Offer
  async createOffer() {
    if (!this.peerConnection) {
      throw new Error('PeerConnection未初始化')
    }

    try {
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      })
      
      await this.peerConnection.setLocalDescription(offer)
      return offer
    } catch (error) {
      console.error('创建Offer失败:', error)
      throw error
    }
  }

  // 处理远程Offer
  async handleOffer(offer) {
    if (!this.peerConnection) {
      throw new Error('PeerConnection未初始化')
    }

    try {
      await this.peerConnection.setRemoteDescription(offer)
      const answer = await this.peerConnection.createAnswer()
      await this.peerConnection.setLocalDescription(answer)
      return answer
    } catch (error) {
      console.error('处理Offer失败:', error)
      throw error
    }
  }

  // 处理远程Answer
  async handleAnswer(answer) {
    if (!this.peerConnection) {
      throw new Error('PeerConnection未初始化')
    }

    try {
      await this.peerConnection.setRemoteDescription(answer)
    } catch (error) {
      console.error('处理Answer失败:', error)
      throw error
    }
  }

  // 添加ICE候选
  async addIceCandidate(candidate) {
    if (!this.peerConnection) {
      throw new Error('PeerConnection未初始化')
    }

    try {
      await this.peerConnection.addIceCandidate(candidate)
    } catch (error) {
      console.error('添加ICE候选失败:', error)
      throw error
    }
  }

  // 静音/取消静音
  toggleMute() {
    if (!this.localStream) return
    
    const audioTracks = this.localStream.getAudioTracks()
    audioTracks.forEach(track => {
      track.enabled = !track.enabled
    })
    
    this.isMuted = !this.isMuted
    return this.isMuted
  }

  // 切换扬声器
  toggleSpeaker() {
    this.isSpeakerOn = !this.isSpeakerOn
    
    if (this.remoteStream) {
      // 安全地操作音频元素，检查元素是否存在
      const audioElements = document.querySelectorAll('audio')
      audioElements.forEach(audio => {
        if (audio && audio.parentNode) { // 确保元素仍在DOM中
          audio.muted = !this.isSpeakerOn
        }
      })
    }
    
    return this.isSpeakerOn
  }

  // 停止所有流
  stopAllStreams() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
      this.localStream = null
    }
    
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop())
      this.remoteStream = null
    }
    
    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }
    
    this.iceCandidates = []
  }

  // 获取音频电平
  getAudioLevel() {
    if (!this.localStream) return 0
    
    const audioTracks = this.localStream.getAudioTracks()
    if (audioTracks.length === 0) return 0
    
    // 这里需要实际的音频分析实现
    // 简化版本返回随机值用于UI显示
    return Math.random() * 100
  }

  // 检查音频设备权限
  async checkAudioPermissions() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const audioInputs = devices.filter(device => device.kind === 'audioinput')
      return audioInputs.length > 0
    } catch (error) {
      console.error('检查音频设备失败:', error)
      return false
    }
  }

  // 回调函数占位（由使用者实现）
  onRemoteStreamAvailable(stream) {}
  onIceCandidate(candidate) {}
  onConnectionStateChange(state) {}
  onIceConnectionStateChange(state) {}

  // 工具方法：将RTCSessionDescription转换为可序列化对象
  static serializeSessionDescription(description) {
    return {
      type: description.type,
      sdp: description.sdp
    }
  }

  // 工具方法：将可序列化对象转换为RTCSessionDescription
  static deserializeSessionDescription(description) {
    return new RTCSessionDescription(description)
  }

  // 工具方法：将RTCIceCandidate转换为可序列化对象
  static serializeIceCandidate(candidate) {
    return {
      candidate: candidate.candidate,
      sdpMid: candidate.sdpMid,
      sdpMLineIndex: candidate.sdpMLineIndex,
      usernameFragment: candidate.usernameFragment
    }
  }

  // 工具方法：将可序列化对象转换为RTCIceCandidate
  static deserializeIceCandidate(candidate) {
    return new RTCIceCandidate(candidate)
  }
}

// 音频工具函数
export const audioUtils = {
  // 播放铃声
  playRingtone() {
    const audio = new Audio('/sounds/ringtone.mp3')
    audio.loop = true
    audio.play().catch(() => {
      console.warn('自动播放被阻止，需要用户交互')
    })
    return audio
  },

  // 播放通话结束音
  playEndTone() {
    const audio = new Audio('/sounds/end-tone.mp3')
    audio.play().catch(() => {
      console.warn('自动播放被阻止')
    })
    return audio
  },

  // 播放来电铃声
  playIncomingCallRing() {
    const audio = new Audio('/sounds/incoming-call.mp3')
    audio.loop = true
    audio.play().catch(() => {
      console.warn('自动播放被阻止，需要用户交互')
    })
    return audio
  },

  // 停止所有音频
  stopAllAudio() {
    const audioElements = document.querySelectorAll('audio')
    audioElements.forEach(audio => {
      if (audio && audio.parentNode) { // 确保元素仍在DOM中
        audio.pause()
        audio.currentTime = 0
      }
    })
  },

  // 检查浏览器支持
  checkBrowserSupport() {
    const supported = {
      webRTC: !!window.RTCPeerConnection,
      getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      audioContext: !!window.AudioContext
    }
    
    return supported
  },

  // 创建音频上下文（用于音频分析）
  createAudioContext() {
    if (!window.AudioContext) return null
    
    try {
      return new AudioContext()
    } catch (error) {
      console.error('创建AudioContext失败:', error)
      return null
    }
  }
}

// 默认导出
export default AudioProcessor