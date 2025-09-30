import request from "@/utils/request";

/**
 * 热门目的地
 * @param {Object} params - 查询参数
 * @param {number} params.page - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise}
 */
export function getHotDestinations(params) {
  return request({
    url: `/api/public/destination/travel-destinations-with-cities`,
    method: 'get',
    params
  })
}

/**
 * 获取目的地详情
 * @param {Object} params - 查询参数
 * @param {string} params.id - 目的地ID
 * @returns {Promise}
 */
export function getDestinationDetail(params) {
  return request({
    url: `/api/public/destinations`,
    method: 'get',
    params
  })
}

/**
 * 获取月份推荐分页
 * @param {Object} params - 查询参数
 * @param {string} params.id - 目的地ID
 * @param {number} params.month - 月份
 * @param {number} params.page - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise}
 */

export function getRecommendByMonth(params) {
  return request({
    url: `/api/public/destination/travel-recommendations`,
    method: 'get',
    params
  })
}

/**
 * 根据月份获取推荐
 * @param {Object} params - 查询参数
 * @param {number} params.month - 月份
 * @returns {Promise}
 */
export function getRecommendByMonthName(params) {
  return request({
    url: `/api/public/destination/travel-recommendations/month-name/${params.month}`,
    method: 'get',
    params
  })
}