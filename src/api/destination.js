import request from "@/utils/request";

// ==================== 基础目的地管理接口 ====================

/**
 * 查询目的地列表
 * @returns {Promise}
 */
export function getDestinations() {
  return request({
    url: `/api/public/destination/list`,
    method: 'get'
  })
}

/**
 * 新增目的地
 * @param {Object} data - 目的地数据
 * @returns {Promise}
 */
export function createDestination(data) {
  return request({
    url: `/api/public/destination`,
    method: 'post',
    data
  })
}

/**
 * 修改目的地
 * @param {string} id - 目的地ID
 * @param {Object} data - 目的地数据
 * @returns {Promise}
 */
export function updateDestination(id, data) {
  return request({
    url: `/api/public/destination/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除目的地
 * @param {string} id - 目的地ID
 * @returns {Promise}
 */
export function deleteDestination(id) {
  return request({
    url: `/api/public/destination/${id}`,
    method: 'delete'
  })
}

// ==================== RegionTab相关接口 ====================

/**
 * 根据ID查询地区标签
 * @param {string} id - 地区标签ID
 * @returns {Promise}
 */
export function getRegionTabById(id) {
  return request({
    url: `/api/public/destination/region-tab/${id}`,
    method: 'get'
  })
}

/**
 * 查询所有地区标签
 * @returns {Promise}
 */
export function getRegionTabs() {
  return request({
    url: `/api/public/destination/region-tabs`,
    method: 'get'
  })
}

/**
 * 根据名称查询地区标签
 * @param {string} name - 地区标签名称
 * @returns {Promise}
 */
export function getRegionTabByName(name) {
  return request({
    url: `/api/public/destination/region-tab/name/${name}`,
    method: 'get'
  })
}

/**
 * 新增地区标签
 * @param {Object} data - 地区标签数据
 * @returns {Promise}
 */
export function createRegionTab(data) {
  return request({
    url: `/api/public/destination/region-tab`,
    method: 'post',
    data
  })
}

/**
 * 更新地区标签
 * @param {Object} data - 地区标签数据
 * @returns {Promise}
 */
export function updateRegionTab(data) {
  return request({
    url: `/api/public/destination/region-tab`,
    method: 'put',
    data
  })
}

/**
 * 删除地区标签
 * @param {string} id - 地区标签ID
 * @returns {Promise}
 */
export function deleteRegionTab(id) {
  return request({
    url: `/api/public/destination/region-tab/${id}`,
    method: 'delete'
  })
}

/**
 * 统计地区标签总数
 * @returns {Promise}
 */
export function getRegionTabsCount() {
  return request({
    url: `/api/public/destination/region-tabs/count`,
    method: 'get'
  })
}

// ==================== TravelDestination相关接口 ====================

/**
 * 根据ID查询旅游目的地
 * @param {string} id - 旅游目的地ID
 * @returns {Promise}
 */
export function getTravelDestinationById(id) {
  return request({
    url: `/api/public/destination/travel-destination/${id}`,
    method: 'get'
  })
}

/**
 * 查询所有旅游目的地
 * @returns {Promise}
 */
export function getTravelDestinations() {
  return request({
    url: `/api/public/destination/travel-destinations-with-cities`,
    method: 'get'
  })
}

/**
 * 根据地区ID查询目的地
 * @param {string} regionId - 地区ID
 * @returns {Promise}
 */
export function getTravelDestinationsByRegion(regionId) {
  return request({
    url: `/api/public/destination/travel-destinations/region/${regionId}`,
    method: 'get'
  })
}

/**
 * 根据地区名称查询目的地
 * @param {string} regionName - 地区名称
 * @returns {Promise}
 */
export function getTravelDestinationsByRegionName(regionName) {
  return request({
    url: `/api/public/destination/travel-destinations/region-name/${regionName}`,
    method: 'get'
  })
}

/**
 * 新增旅游目的地
 * @param {Object} data - 旅游目的地数据
 * @returns {Promise}
 */
export function createTravelDestination(data) {
  return request({
    url: `/api/public/destination/travel-destination`,
    method: 'post',
    data
  })
}

/**
 * 更新旅游目的地
 * @param {Object} data - 旅游目的地数据
 * @returns {Promise}
 */
export function updateTravelDestination(data) {
  return request({
    url: `/api/public/destination/travel-destination`,
    method: 'put',
    data
  })
}

/**
 * 删除旅游目的地
 * @param {string} id - 旅游目的地ID
 * @returns {Promise}
 */
export function deleteTravelDestination(id) {
  return request({
    url: `/api/public/destination/travel-destination/${id}`,
    method: 'delete'
  })
}

/**
 * 统计旅游目的地总数
 * @returns {Promise}
 */
export function getTravelDestinationsCount() {
  return request({
    url: `/api/public/destination/travel-destinations/count`,
    method: 'get'
  })
}

/**
 * 根据地区统计目的地数
 * @param {string} regionName - 地区名称
 * @returns {Promise}
 */
export function getTravelDestinationsCountByRegion(regionName) {
  return request({
    url: `/api/public/destination/travel-destinations/count/region-name/${regionName}`,
    method: 'get'
  })
}

// ==================== City相关接口 ====================

/**
 * 根据ID查询城市
 * @param {string} id - 城市ID
 * @returns {Promise}
 */
export function getCityById(id) {
  return request({
    url: `/api/public/destination/city/${id}`,
    method: 'get'
  })
}

/**
 * 查询所有城市
 * @returns {Promise}
 */
export function getCities() {
  return request({
    url: `/api/public/destination/cities`,
    method: 'get'
  })
}

/**
 * 根据目的地查询城市
 * @param {string} destinationId - 目的地ID
 * @returns {Promise}
 */
export function getCitiesByDestination(destinationId) {
  return request({
    url: `/api/public/destination/cities/destination/${destinationId}`,
    method: 'get'
  })
}

/**
 * 根据地区查询城市
 * @param {string} regionName - 地区名称
 * @returns {Promise}
 */
export function getCitiesByRegionName(regionName) {
  return request({
    url: `/api/public/destination/cities/region-name/${regionName}`,
    method: 'get'
  })
}

/**
 * 新增城市
 * @param {Object} data - 城市数据
 * @returns {Promise}
 */
export function createCity(data) {
  return request({
    url: `/api/public/destination/city`,
    method: 'post',
    data
  })
}

/**
 * 更新城市
 * @param {Object} data - 城市数据
 * @returns {Promise}
 */
export function updateCity(data) {
  return request({
    url: `/api/public/destination/city`,
    method: 'put',
    data
  })
}

/**
 * 删除城市
 * @param {string} id - 城市ID
 * @returns {Promise}
 */
export function deleteCity(id) {
  return request({
    url: `/api/public/destination/city/${id}`,
    method: 'delete'
  })
}

/**
 * 统计城市总数
 * @returns {Promise}
 */
export function getCitiesCount() {
  return request({
    url: `/api/public/destination/cities/count`,
    method: 'get'
  })
}

/**
 * 根据目的地统计城市数
 * @param {string} destinationId - 目的地ID
 * @returns {Promise}
 */
export function getCitiesCountByDestination(destinationId) {
  return request({
    url: `/api/public/destination/cities/count/destination/${destinationId}`,
    method: 'get'
  })
}

/**
 * 批量新增城市
 * @param {Array} data - 城市数据数组
 * @returns {Promise}
 */
export function batchCreateCities(data) {
  return request({
    url: `/api/public/destination/cities/batch`,
    method: 'post',
    data
  })
}

// ==================== 综合查询接口 ====================

/**
 * 查询地区标签及目的地
 * @returns {Promise}
 */
export function getRegionTabsWithDestinations() {
  return request({
    url: `/api/public/destination/region-tabs-with-destinations`,
    method: 'get'
  })
}

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
 * 查询城市及关联信息
 * @returns {Promise}
 */
export function getCitiesWithDestinationAndRegion() {
  return request({
    url: `/api/public/destination/cities-with-destination-and-region`,
    method: 'get'
  })
}

// ==================== TravelRecommendation相关接口 ====================

/**
 * 根据ID查询旅游推荐
 * @param {string} id - 旅游推荐ID
 * @returns {Promise}
 */
export function getTravelRecommendationById(id) {
  return request({
    url: `/api/public/destination/travel-recommendation/${id}`,
    method: 'get'
  })
}

/**
 * 根据月份ID查询推荐
 * @param {string} monthId - 月份ID
 * @returns {Promise}
 */
export function getRecommendationsByMonthId(monthId) {
  return request({
    url: `/api/public/destination/travel-recommendations/month/${monthId}`,
    method: 'get'
  })
}

/**
 * 根据月份名称查询推荐
 * @param {string} monthName - 月份名称
 * @returns {Promise}
 */
export function getRecommendationsByMonthName(monthName) {
  return request({
    url: `/api/public/destination/travel-recommendations/month-name/${monthName}`,
    method: 'get'
  })
}

/**
 * 分页查询旅游推荐
 * @param {Object} params - 查询参数
 * @param {number} params.page - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise}
 */
export function getTravelRecommendations(params) {
  return request({
    url: `/api/public/destination/travel-recommendations`,
    method: 'get',
    params
  })
}

/**
 * 新增旅游推荐
 * @param {Object} data - 旅游推荐数据
 * @returns {Promise}
 */
export function createTravelRecommendation(data) {
  return request({
    url: `/api/public/destination/travel-recommendation`,
    method: 'post',
    data
  })
}

/**
 * 更新旅游推荐
 * @param {Object} data - 旅游推荐数据
 * @returns {Promise}
 */
export function updateTravelRecommendation(data) {
  return request({
    url: `/api/public/destination/travel-recommendation`,
    method: 'put',
    data
  })
}

/**
 * 删除旅游推荐
 * @param {string} id - 旅游推荐ID
 * @returns {Promise}
 */
export function deleteTravelRecommendation(id) {
  return request({
    url: `/api/public/destination/travel-recommendation/${id}`,
    method: 'delete'
  })
}

/**
 * 统计旅游推荐总数
 * @returns {Promise}
 */
export function getTravelRecommendationsCount() {
  return request({
    url: `/api/public/destination/travel-recommendations/count`,
    method: 'get'
  })
}

/**
 * 批量新增旅游推荐
 * @param {Array} data - 旅游推荐数据数组
 * @returns {Promise}
 */
export function batchCreateTravelRecommendations(data) {
  return request({
    url: `/api/public/destination/travel-recommendations/batch`,
    method: 'post',
    data
  })
}

/**
 * 按标签搜索旅游推荐
 * @param {Object} params - 查询参数
 * @param {string} params.tags - 标签关键词
 * @returns {Promise}
 */
export function searchTravelRecommendationsByTags(params) {
  return request({
    url: `/api/public/destination/travel-recommendations/search/tags`,
    method: 'get',
    params
  })
}

/**
 * 查询热门旅游推荐
 * @returns {Promise}
 */
export function getPopularTravelRecommendations() {
  return request({
    url: `/api/public/destination/travel-recommendations/popular`,
    method: 'get'
  })
}

/**
 * 根据月份统计推荐数
 * @param {string} monthId - 月份ID
 * @returns {Promise}
 */
export function getTravelRecommendationsCountByMonth(monthId) {
  return request({
    url: `/api/public/destination/travel-recommendations/count/month/${monthId}`,
    method: 'get'
  })
}

/**
 * 根据月份名称统计推荐数
 * @param {string} monthName - 月份名称
 * @returns {Promise}
 */
export function getTravelRecommendationsCountByMonthName(monthName) {
  return request({
    url: `/api/public/destination/travel-recommendations/count/month-name/${monthName}`,
    method: 'get'
  })
}

/**
 * 随机查询旅游推荐
 * @returns {Promise}
 */
export function getRandomTravelRecommendations() {
  return request({
    url: `/api/public/destination/travel-recommendations/random`,
    method: 'get'
  })
}

/**
 * 查询精选旅游推荐
 * @returns {Promise}
 */
export function getFeaturedTravelRecommendations() {
  return request({
    url: `/api/public/destination/travel-recommendations/featured`,
    method: 'get'
  })
}

/**
 * 根据季节查询推荐
 * @param {string} season - 季节
 * @returns {Promise}
 */
export function getTravelRecommendationsBySeason(season) {
  return request({
    url: `/api/public/destination/travel-recommendations/season/${season}`,
    method: 'get'
  })
}

/**
 * 根据预算查询推荐
 * @param {string} budgetRange - 预算范围
 * @returns {Promise}
 */
export function getTravelRecommendationsByBudget(budgetRange) {
  return request({
    url: `/api/public/destination/travel-recommendations/budget/${budgetRange}`,
    method: 'get'
  })
}

/**
 * 根据时长查询推荐
 * @param {string} duration - 旅游时长
 * @returns {Promise}
 */
export function getTravelRecommendationsByDuration(duration) {
  return request({
    url: `/api/public/destination/travel-recommendations/duration/${duration}`,
    method: 'get'
  })
}

// ==================== 原有接口（保持兼容性） ====================

/**
 * 获取目的地详情（兼容旧接口）
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
 * 获取月份推荐分页（兼容旧接口）
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
 * 根据月份获取推荐（兼容旧接口）
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