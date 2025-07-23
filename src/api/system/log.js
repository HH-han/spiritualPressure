import request from '@/utils/request'

/**
 * 获取操作日志列表
 * @param {Object} params 查询参数
 * @returns Promise
 */
export function getOperationLogs(params) {
  return request({
    url: '/system/log/operation/list',
    method: 'get',
    params
  })
}

/**
 * 获取操作日志详情
 * @param {number} id 日志ID
 * @returns Promise
 */
export function getOperationLogDetail(id) {
  return request({
    url: `/system/log/operation/${id}`,
    method: 'get'
  })
}