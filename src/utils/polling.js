import request from './request.js';

/**
 * 轮询工具函数
 * @param {Function} requestFn - 请求函数，返回Promise
 * @param {number} interval - 轮询间隔时间（毫秒），默认5000ms
 * @param {Function} onSuccess - 成功回调函数
 * @param {Function} onError - 错误回调函数
 * @returns {Object} 包含start和stop方法的对象
 */
function createPolling(requestFn, interval = 5000, onSuccess, onError) {
  let stopped = false;
  let timeoutId = null;

  async function polling() {
    if (stopped) return;

    try {
      const res = await requestFn();
      if (onSuccess) {
        onSuccess(res);
      }
    } catch (err) {
      console.error('轮询请求失败：', err);
      if (onError) {
        onError(err);
      }
    }

    // 等待指定间隔时间再继续下一次
    if (!stopped) {
      timeoutId = setTimeout(polling, interval);
    }
  }

  return {
    // 启动轮询
    start: () => {
      stopped = false;
      polling();
    },
    
    // 停止轮询
    stop: () => {
      stopped = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    },
    
    // 检查是否已停止
    isStopped: () => stopped,
    
    // 重新设置间隔时间
    setInterval: (newInterval) => {
      interval = newInterval;
    },
    
    // 获取当前间隔时间
    getInterval: () => interval
  };
}

/**
 * 创建基于URL的轮询
 * @param {string} url - 请求URL
 * @param {Object} config - 请求配置
 * @param {number} interval - 轮询间隔
 * @param {Function} onSuccess - 成功回调
 * @param {Function} onError - 错误回调
 */
function createUrlPolling(url, config = {}, interval = 5000, onSuccess, onError) {
  return createPolling(
    () => request.get(url, config),
    interval,
    onSuccess,
    onError
  );
}

/**
 * 创建带重试机制的轮询
 * @param {Function} requestFn - 请求函数
 * @param {number} interval - 轮询间隔
 * @param {number} maxRetries - 最大重试次数
 * @param {Function} onSuccess - 成功回调
 * @param {Function} onError - 错误回调
 */
function createPollingWithRetry(requestFn, interval = 5000, maxRetries = 3, onSuccess, onError) {
  let retryCount = 0;
  
  return createPolling(
    async () => {
      try {
        const res = await requestFn();
        retryCount = 0; // 重置重试计数
        return res;
      } catch (error) {
        retryCount++;
        if (retryCount >= maxRetries) {
          throw error; // 达到最大重试次数，抛出错误
        }
        console.warn(`请求失败，第${retryCount}次重试...`);
        // 可以在这里添加指数退避策略
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        return requestFn(); // 重试请求
      }
    },
    interval,
    onSuccess,
    onError
  );
}

/**
 * 创建条件轮询（满足条件时停止）
 * @param {Function} requestFn - 请求函数
 * @param {Function} stopCondition - 停止条件函数（接收响应数据，返回boolean）
 * @param {number} interval - 轮询间隔
 * @param {Function} onSuccess - 成功回调
 * @param {Function} onError - 错误回调
 */
function createConditionalPolling(requestFn, stopCondition, interval = 5000, onSuccess, onError) {
  const poller = createPolling(
    requestFn,
    interval,
    (res) => {
      if (onSuccess) {
        onSuccess(res);
      }
      
      // 检查停止条件
      if (stopCondition(res)) {
        console.log('满足停止条件，终止轮询');
        poller.stop();
      }
    },
    onError
  );
  
  return poller;
}

// 导出所有轮询工具
export {
  createPolling,
  createUrlPolling,
  createPollingWithRetry,
  createConditionalPolling
};

export default createPolling;