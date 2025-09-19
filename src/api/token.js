import request from "@/utils/request";

/**
 * Token相关API
 * 用于获取和管理JWT令牌状态
 */

export const tokenApi = {
  /**
   * 获取Token状态信息
   * @returns {Promise} 包含token状态信息的Promise
   */
  getTokenStatus() {
    return request.get("/api/auth/token-status");
  },

  /**
   * 刷新Token
   * @returns {Promise} 包含新token信息的Promise
   */
  refreshToken() {
    return request.post("/api/auth/refresh-token");
  },

  /**
   * 获取Token详细信息
   * 包括有效期、用户名、权限等
   * @returns {Promise} 包含token详细信息的Promise
   */
  getTokenDetails() {
    return request.get("/api/auth/token-details");
  },

  /**
   * 验证Token有效性
   * @param {string} token 要验证的token
   * @returns {Promise} 验证结果的Promise
   */
  validateToken(token) {
    return request.post("/api/auth/validate-token", { token });
  },

  /**
   * 获取用户权限信息
   * @returns {Promise} 包含用户权限信息的Promise
   */
  getUserPermissions() {
    return request.get("/api/auth/user-permissions");
  }
};

export default tokenApi;