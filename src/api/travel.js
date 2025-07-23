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
 * 获取景点详情
 * @returns {Promise}
 */
export function getAttractionBlogs() {
  return request({
    url: `/api/public/blogs`,
    method: 'get'
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