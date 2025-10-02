import request from "@/utils/request";
// 轮播图

/**
 * 轮播列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} [params.keyword] - 搜索关键词
 * @param {string} [params.type] - 轮播图类型
 * @returns {Promise}
 * */
export function getCarouselList(params) {
  return request({
    url: `/api/public/travelcarousel`,
    method: 'get',
    params
  })
}
export function addCarousel(data) {
  return request({
    url: '/api/carousel',
    method: 'post',
    data
  })
}

export function updateCarousel(id, data) {
  return request({
    url: `/api/carousel/${id}`,
    method: 'put',
    data
  })
}

export function deleteCarousel(id) {
  return request({
    url: `/api/carousel/${id}`,
    method: 'delete'
  })
}