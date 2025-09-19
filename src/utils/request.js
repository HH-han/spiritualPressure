import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";
import { getValidToken, clearAuthData } from "./tokenValidator";
// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:2025",
  timeout: 5000,
});

// 请求拦截器
request.interceptors.request.use(
  async (config) => {
    // 设置Content-Type
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json;charset=utf-8";
    }

    // 添加认证token
    const token = await getValidToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 统一处理响应数据
    let res = response.data;

    // 处理字符串类型的响应
    if (typeof res === "string" && res.trim()) {
      try {
        res = JSON.parse(res);
      } catch (e) {
        console.error("JSON解析失败:", e);
        ElMessage.error("响应数据格式错误");
        return Promise.reject(new Error("响应数据格式错误"));
      }
    }

    // 根据您的后端API结构调整
    if (res?.code === 401) {
      handleUnauthorized();
      return Promise.reject(new Error("登录已过期"));
    }

    // 其他错误码处理
    if (res?.code && res.code !== "0") {
      ElMessage.error(res.msg || "操作失败");
      return Promise.reject(res);
    }

    return res;
  },
  (error) => {
    // HTTP状态码处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          handleUnauthorized();
          break;
        case 403:
          ElMessage.error("拒绝访问");
          break;
        case 404:
          ElMessage.error("资源不存在");
          break;
        case 500:
          if (error.response?.data?.message?.includes("token")) {
            handleUnauthorized();
          } else {
            ElMessage.error("服务器错误");
            router.push("/500");
          }
          break;
        default:
          ElMessage.error(`请求错误: ${error.message}`);
      }
    } else if (error.request) {
      router.push("/networkanomaly");
    } else {
      ElMessage.error(`请求错误: ${error.message}`);
    }

    return Promise.reject(error);
  }
);

/**
 * 处理未授权情况
 */
function handleUnauthorized() {
  ElMessage.warning("登录已过期，请重新登录");
  clearAuthData();
}

// 导出默认请求实例
export default request;
