import request from '../utils/request.js'

// 语音通话API - 根据最新接口文档实现

// 发起语音通话请求
export const initiateVoiceCall = (callerId, receiverId) => {
  return request({
    url: `/voice/call/initiate`,
    method: 'POST',
    data: {
      callerId,
      receiverId
    }
  })
}

// 接受语音通话
export const acceptVoiceCall = (callId, userId) => {
  return request({
    url: `/voice/call/accept`,
    method: 'POST',
    data: {
      callId,
      userId
    }
  })
}

// 拒绝语音通话
export const rejectVoiceCall = (callId, userId) => {
  return request({
    url: `/voice/call/reject`,
    method: 'POST',
    data: {
      callId,
      userId
    }
  })
}

// 结束语音通话
export const endVoiceCall = (callId, userId) => {
  return request({
    url: `/voice/call/end`,
    method: 'POST',
    data: {
      callId,
      userId
    }
  })
}

// 发送SDP Offer
export const sendSdpOffer = (callId, sdp) => {
  return request({
    url: `/voice/call/sdp-offer`,
    method: 'POST',
    data: {
      callId,
      sdp
    }
  })
}

// 发送SDP Answer
export const sendSdpAnswer = (callId, sdp) => {
  return request({
    url: `/voice/call/sdp-answer`,
    method: 'POST',
    data: {
      callId,
      sdp
    }
  })
}

// 发送ICE Candidate
export const sendIceCandidate = (callId, candidate) => {
  return request({
    url: `/voice/call/ice-candidate`,
    method: 'POST',
    data: {
      callId,
      candidate
    }
  })
}

// 发送音频数据
export const sendAudioData = (callId, audioData) => {
  return request({
    url: `/voice/call/audio-data`,
    method: 'POST',
    data: {
      callId,
      audioData
    }
  })
}

// 获取通话状态
export const getCallStatus = (callId) => {
  return request({
    url: `/voice/call/status`,
    method: 'GET',
    params: { callId }
  })
}

// 获取用户通话历史（保留原有接口，但需要后端支持）
export const getCallHistory = (params) => {
  return request({
    url: `/api/public/im/voice/call/history`,
    method: 'GET',
    params
  })
}