import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";
// 创建axios实例
const request = axios.create({
  // 根据环境变量动态设置baseURL
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:2025",
  timeout: 5000,
});

/**
 * 获取token的增强方法
 * 添加了token有效性检查
 */
function getValidToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  // 检查token是否过期
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      ElMessage.warning("无效的token格式");
      return null;
    }
    
    // 确保中间部分可以正确解码
    const base64Url = tokenParts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // 使用更安全的方式解码Base64
    const rawPayload = atob(base64);
    // 将原始字符串转换为UTF-8字符
    const payload = JSON.parse(
      decodeURIComponent(
        Array.from(rawPayload).map(c => 
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
      )
    );
    
    if (payload.exp && payload.exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      ElMessage.warning("登录已过期，请重新登录");
      return null;
    }
  } catch (e) {
    console.error("Token解析失败:", e);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    ElMessage.warning("无效的token，请重新登录");
    return null;
  }

  return token;
}

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 设置Content-Type
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json;charset=utf-8";
    }

    // 添加认证token
    const token = getValidToken();
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
          // 检查是否是token过期导致的500错误
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
      ElMessage.error("网络异常，请检查您的连接");
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
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export default request;
