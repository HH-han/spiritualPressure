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
 * @param {Number} id 日志ID
 * @returns {Promise}
 */
export function getOperationLogDetail(id) {
  return request({
    url: `api/public/system/log/operation/${id}`,
    method: 'get'
  })
}

/**
 * 封禁IP地址
 * @param {String} ip 需要封禁的IP地址
 * @returns {Promise}
 */
export function blockIPAddress(ip) {
  return request({
    url: `api/public/system/log/operation/block/${ip}`,
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
 * @param {Object} params 查询参数，包含分页信息
 * @returns {Promise}
 */
export function getLoginLogs(params) {
  return request({
    url: `/api/public/user/logininfo`,
    method: 'get',
    params
  })
}