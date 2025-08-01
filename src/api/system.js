import request from '@/utils/request'

/**
 * 获取系统配置
 * @returns {Promise}
 */
export function getSystemConfig() {
  return request({
    url: '/api/public/system/config',
    method: 'get'
  })
}

/**
 * 更新系统配置
 * @param {Object} data 系统配置
 * @returns {Promise}
 */
export function updateSystemConfig(data) {
  return request({
    url: '/api/public/system/config',
    method: 'put',
    data
  })
}

/**
 * 获取系统状态
 * @returns {Promise}
 */
export function getSystemStatus() {
  return request({
    url: '/api/public/system/status',
    method: 'get'
  })
}