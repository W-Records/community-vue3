<template>
    <div>
        测试啦哈哈哈哈哈哈哈！222
      <!-- 示例按钮触发发送消息 -->
      <button @click="sendMessage">发送消息</button>
      <!-- 显示当前WebSocket连接状态 -->
      <p>连接状态: {{ connectionStatus }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
  
  // WebSocket连接的URL，确保包含用户的ID
  const wsUrl = `ws://localhost:10010/ws-comment-service/${localStorage.getItem('userId')}`;
  
  // WebSocket实例
  const socketRef = ref(null);
  
  // 连接状态
  const connectionStatus = ref('Disconnected');
  
  // 心跳检测定时器
  let pingInterval = null;
  
  // 建立WebSocket连接
  const connectWebSocket = () => {
    // 初始化WebSocket连接
    socketRef.value = new WebSocket(wsUrl);
  
    // 连接打开事件处理
    socketRef.value.addEventListener('open', () => {
      console.log('WebSocket连接已打开');
      connectionStatus.value = 'Connected';
      
      // 启动心跳检测
      pingInterval = setInterval(() => {
        // 发送心跳包，这里以"ping"为例
        if (socketRef.value.readyState === WebSocket.OPEN) {
          socketRef.value.send(JSON.stringify({ type: 'ping' }));
        } else {
          console.warn('WebSocket未就绪，无法发送心跳');
        }
      }, 30000); // 每30秒发送一次心跳
    });
  
    // 消息接收事件处理
    socketRef.value.addEventListener('message', (event) => {
      console.log('接收到服务器消息:', event.data);
      // 根据需要处理消息内容，例如更新UI
    });
  
    // 错误处理
    socketRef.value.addEventListener('error', (error) => {
      console.error('WebSocket发生错误:', error);
    });
  
    // 连接关闭事件处理
    socketRef.value.addEventListener('close', (event) => {
      console.log('WebSocket连接已关闭', event);
      connectionStatus.value = 'Disconnected';
      // 清理心跳检测定时器
      clearInterval(pingInterval);
      pingInterval = null;
    });
  };
  
  // 发送消息到服务器
  const sendMessage = (messageContent) => {
    if (socketRef.value && socketRef.value.readyState === WebSocket.OPEN) {
      socketRef.value.send(JSON.stringify({
        content: messageContent, // 实际消息内容
        type: 'message' // 消息类型，可以根据需求自定义
      }));
    } else {
      console.error('WebSocket连接未就绪，无法发送消息');
    }
  };
  
  // 组件生命周期钩子
  onMounted(() => {
    // 页面加载完成时尝试连接WebSocket
    connectWebSocket();
  });
  
  // 组件卸载时关闭WebSocket连接
  onUnmounted(() => {
    if (socketRef.value) {
      socketRef.value.close();
    }
    // 清理心跳检测定时器
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
  });
  
  // 在组件卸载前的阶段，也可以用来做一些清理工作，这里作为额外的安全措施
  onBeforeUnmount(() => {
    // 确保WebSocket连接关闭
    if (socketRef.value) {
      socketRef.value.close();
    }
  });
  </script>