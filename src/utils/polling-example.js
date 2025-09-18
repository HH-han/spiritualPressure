import { 
  createPolling, 
  createUrlPolling, 
  createPollingWithRetry, 
  createConditionalPolling 
} from './polling.js';
import request from './request.js';

// 示例1：基本使用方式
const pollingExample1 = () => {
  // 创建轮询实例
  const poller = createPolling(
    // 请求函数
    () => request.get('/api/messages/latest'),
    // 间隔时间（毫秒）
    5000,
    // 成功回调
    (res) => {
      console.log('收到新消息:', res.data);
      // 在这里处理接收到的数据
    },
    // 错误回调
    (err) => {
      console.error('获取消息失败:', err.message);
    }
  );

  // 启动轮询
  poller.start();

  // 在需要的时候停止轮询
  // poller.stop();
};

// 示例2：使用URL轮询
const pollingExample2 = () => {
  const poller = createUrlPolling(
    '/api/notifications',
    { params: { limit: 10 } },
    3000,
    (res) => {
      console.log('新通知:', res.data);
    },
    (err) => {
      console.error('获取通知失败:', err);
    }
  );

  poller.start();
};

// 示例3：带重试机制的轮询
const pollingExample3 = () => {
  const poller = createPollingWithRetry(
    () => request.get('/api/status'),
    2000,
    5, // 最大重试5次
    (res) => {
      console.log('系统状态:', res.data);
    },
    (err) => {
      console.error('获取状态失败:', err);
    }
  );

  poller.start();
};

// 示例4：条件轮询（满足条件时停止）
const pollingExample4 = () => {
  let processedCount = 0;
  
  const poller = createConditionalPolling(
    () => request.get('/api/tasks/status'),
    // 停止条件：当任务完成时停止轮询
    (res) => res.data.status === 'completed',
    1000,
    (res) => {
      processedCount++;
      console.log(`第${processedCount}次检查，任务状态:`, res.data.status);
      
      if (res.data.progress) {
        console.log(`进度: ${res.data.progress}%`);
      }
    },
    (err) => {
      console.error('检查任务状态失败:', err);
    }
  );

  poller.start();
};

// 示例5：在Vue组件中使用
/*
import { onMounted, onUnmounted, ref } from 'vue';
import { createUrlPolling } from '@/utils/polling';

export default {
  setup() {
    const notifications = ref([]);
    let poller = null;

    onMounted(() => {
      poller = createUrlPolling(
        '/api/notifications',
        { params: { limit: 20 } },
        5000,
        (res) => {
          notifications.value = res.data;
          console.log('更新通知列表');
        },
        (err) => {
          console.error('获取通知失败:', err);
        }
      );
      poller.start();
    });

    onUnmounted(() => {
      if (poller) {
        poller.stop();
      }
    });

    return {
      notifications
    };
  }
};
*/

// 导出示例函数
export { 
  pollingExample1, 
  pollingExample2, 
  pollingExample3, 
  pollingExample4 
};

// 使用说明：
/*
可用的轮询函数：
1. createPolling(requestFn, interval, onSuccess, onError) - 基础轮询
2. createUrlPolling(url, config, interval, onSuccess, onError) - URL轮询
3. createPollingWithRetry(requestFn, interval, maxRetries, onSuccess, onError) - 带重试轮询
4. createConditionalPolling(requestFn, stopCondition, interval, onSuccess, onError) - 条件轮询

使用方法：
1. 导入需要的轮询函数
2. 创建轮询实例
3. 启动轮询：poller.start()
4. 停止轮询：poller.stop()
5. 检查状态：poller.isStopped()

特点：
- 使用递归setTimeout，避免并发请求
- 确保上一次请求完成后再等待指定间隔
- 提供完整的生命周期控制
- 支持错误处理和自定义逻辑
- 模块化设计，代码结构清晰
*/