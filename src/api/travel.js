import request from "@/utils/request";

/**
 * 获取旅行推荐
 * @returns {Promise}
 */
export function getTravelRecommendations() {
  return request({
    url: '/api/public/travelrecommend',
    method: 'get'
  })
}
/**
 * 获取景点博客列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} [params.keyword] - 搜索关键词
 * @returns {Promise}
 */
export function getAttractionBlogs(params) {
  return request({
    url: '/api/public/blogs',
    method: 'get',
    params
  })
}
/**
 * 景点点赞
 * @param {String} id 景点ID
 * @returns {Promise}
 */
export function likeAttraction(id) {
  return request({
    url: `/api/public/blogs/${id}/like`,
    method: 'post'
  })
}
/**
 * 景点收藏
 * @param {String} id 景点ID
 * @returns {Promise}
 */
export function collectAttraction(id) {
  return request({
    url: `/api/public/blogs/${id}/favorite`,
    method: 'post'
  })
}
/**
 * 轮播列表
 * @param {String} id
 * @returns {Promise}
 * */
export function getSlideshow() {
  return request({
    url: `/api/public/travelcarousel`,
    method: 'get'
  })
}

/**
 * 获取世界历史详情
* @param {Object} params - 查询参数
 * @param {number} params.page - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} [params.keyword] - 搜索关键词
 * @returns {Promise}
 */
export function getWorldHistoryDetail(params) {
  return request({
    url: `/api/public/travelworld`,
    method: 'get',
    params
  })
}
/** * 获取旅游新闻
 * @param {Object} params - 查询参数
 * @param {number} params.page - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} [params.keyword] - 搜索关键词
 * @returns {Promise}
 */
export function getTravelNews(params) {
  return request({
    url: `/api/public/news`,
    method: 'get',
    params
  })
}
/** * 获取订单列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} [params.keyword] - 搜索关键词
 * @returns {Promise}
 */
export function getOrderList(params) {
  return request({
    url: `/api/public/order`,
    method: 'get',
    params
  })
}