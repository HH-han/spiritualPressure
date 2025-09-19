import axios from "axios";
import { ElMessage } from "element-plus";

/**
 * Token验证工具
 * 通过后端API验证token有效性
 */

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2025";

/**
 * 检查token格式是否有效
 * @param {string} token
 * @returns {boolean}
 */
export function isValidTokenFormat(token) {
  if (!token) {
    return false;
  }

  try {
    const tokenParts = token.split(".");
    return tokenParts.length === 3;
  } catch (e) {
    console.error("Token格式检查失败:", e);
    return false;
  }
}

/**
 * 通过后端API验证token状态
 * @param {string} token
 * @returns {Promise<{valid: boolean, message?: string}>}
 */
export async function validateTokenWithBackend(token) {
  try {
    const response = await axios.get(`${baseURL}/api/auth/token-status`, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
      timeout: 3000 // 3秒超时
    });

    // 根据后端响应判断token是否有效
    if (response.data?.code === "0" && response.data?.data?.valid === true) {
      return { valid: true };
    } else {
      return {
        valid: false,
        message: response.data?.msg || "Token无效或已过期"
      };
    }
  } catch (error) {
    console.warn("Token状态检查API调用失败:", error);
    // 网络错误或服务器错误时，返回需要重试的状态
    return {
      valid: false,
      message: "Token验证服务暂时不可用，请稍后重试"
    };
  }
}

/**
 * 获取有效token方法
 * 通过后端API验证token有效性
 * @returns {Promise<string|null>}
 */
export async function getValidToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  // 检查token格式
  if (!isValidTokenFormat(token)) {
    ElMessage.warning("无效的token格式");
    return null;
  }

  // 通过后端API验证token状态
  const validationResult = await validateTokenWithBackend(token);
  
  if (validationResult.valid) {
    return token;
  } else {
    // token无效或过期
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    ElMessage.warning(validationResult.message || "登录已过期，请重新登录");
    return null;
  }
}

/**
 * 清除本地token和用户信息
 */
export function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

/**
 * 快速检查token是否有效（不显示提示信息）
 * @returns {Promise<boolean>}
 */
export async function isTokenValidSilent() {
  const token = localStorage.getItem("token");
  if (!token || !isValidTokenFormat(token)) {
    return false;
  }

  try {
    const validationResult = await validateTokenWithBackend(token);
    return validationResult.valid;
  } catch {
    return false;
  }
}

export default {
  isValidTokenFormat,
  validateTokenWithBackend,
  getValidToken,
  clearAuthData,
  isTokenValidSilent
};