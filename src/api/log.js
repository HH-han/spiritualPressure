import request from '@/utils/request'

/**
 * 获取操作日志列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getOperationLogs(params) {
  return request({
    url: 'api/public/system/log/operation/list',
    method: 'get',
    params
  })
}

/**
 * 获取操作日志详情
 * @param {Number} 
 * @returns {Promise}
 */
export function getOperationLogDetail() {
  return request({
    url: `api/public/system/log/operation/list`,
    method: 'get'
  })
}

/**
 * 封禁IP地址
 * @param {Number} id 日志ID
 * @returns {Promise}
 */
export function blockIPAddress() {
  return request({
    url: `api/public/system/log/operation/block/`,
    method: 'delete'
  })
}

/**
 * 获取登录日志详情
 * @param {Object} params
 * @returns {Promise}
 */
export function getLoginLogDetail(params) {
  return request({
    url: 'api/public/system/log/operation/list/',
    method: 'get',
    params
  })
}

/**
 * 获取登录日志
 * @param {Number}
 * @returns {Promise}
 */
export function getLoginLogs() {
  return request({
    url: `api/public/system/log/operation/list/`,
    method: 'get'
  })
}