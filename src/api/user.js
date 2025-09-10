import request from '@/utils/request'


/**
 * 邮箱验证码
 * @param {Object} data
 * @returns {Promise}
 */
export function EmailCaptcha(data) {
  return request({
    url: '/api/auth/send-code',
    method: 'post',
    data
  })
}

/**
 * 邮箱登录
 * @param {Object} data 登录参数
 * @returns {Promise}
 */
export function Emaillogin(data) {
  return request({
    url: '/api/auth/Emaillogin',
    method: 'post',
    data
  })
}

/**
 * 用户名登录
 * @param {Object} data 登录参数
 * @returns {Promise}
 */
export function loginname(data) {
  return request({
    url: '/api/public/user/login',
    method: 'post',
    data
  })
}
/**
 * 获取用户信息
 * @returns {Promise}
 */
export function getUserInfo() {
  return request({
    url: '/api/public/user/info',
    method: 'get'
  })
}

/**
 * 获取用户列表
 * @param {Object} data 查询参数
 * @returns {Promise}
 */
export function getUserList(data) {
  return request({
    url: '/api/public/user',
    method: 'get',
    params: data
  })
}

/**
 * 更新用户信息
 * @param {Object} data 用户信息
 * @returns {Promise}
 */
export function updateUserInfo(data) {
  return request({
    url: '/api/public/user/update',
    method: 'put',
    data
  })
}

/**
 * 头像上传
 * @param {Object} data 上传的文件
 * @returns {Promise}
 */
export function uploadAvatar(username, data) {
  return request({
    url: `/api/public/user/avatar/${username}`,
    method: 'put',
    data
  })
}
/**
 * 修改密码
 * @param {Object} data
 * @returns {Promise}
 */
export function changePassword(data) {
  return request({
    url: '/api/public/user/update',
    method: 'put',
    data
  })
}
