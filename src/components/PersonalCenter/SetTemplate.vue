<template>
    <div class="background_SetTemplate">
      <div class="footer_1">
        <p>旅行之前，先上！</p>  
        <p>&copy; 2025 Mafengwo.cn 京ICP证11015476号 京公网安备11010502013401号</p>  
        <p>联系电话：010-83024977</p>  
        <p>热线：国内400-345-678 海外 +86-10-8302-4897</p>  
      </div>
      <div class="Bottombar">  
          <router-link to="/Home_5">
            <button>首页Home_5</button>
          </router-link>
          <router-link to="/Home_5">
            <button>消息</button>
          </router-link>
          <router-link to="/Home_5">
            <button>个人资料</button>
          </router-link>
          <router-link to="/Home_5">
            <button>设置</button>
          </router-link>
      </div>  
  </div>
</template>
<script>
export default {
  name: 'SetTemplate',
  data() {
    return {
      // 模板列表
      templates:{

      }
    }
  }
}
</script>
<style scoped>
.header_1 {
  display: flex;  
  align-items: center;  
  background-color: #f5f5f5;  
  padding: 0px 20px;  
  border-bottom: 1px solid #ddd; 
  height: 100px;
  width: 100%;
  left: 0px;
  right: 0px;
  gap: 10px;
  position: fixed;
  z-index: 1000;
  
}
.header_1 button {
  background-color: #a0c2da;  
  border: none;  
  color: white;  
  padding: 10px 20px;  
  text-align: center;  
  text-decoration: none;  
  display: inline-block;  
  font-size: 16px;
  margin-right: 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease; 
}
.header_1 button:hover {
  background-color: #f8e074;
}
.footer_1 {
  position: fixed;
  bottom: 0; /* 固定在窗口底部 */
  width: 100%;
  height: 100px;
  background-color: #2c3e50; /* 深蓝色背景 */
  color: white;
  text-align: center;
  padding: 0 20px;
  box-sizing: border-box; /* 包含边距在宽度内 */
  z-index: 1000;
}

/* 响应式设计 */
@media (max-width: 768px) {
.header_1 {
  height: auto;
  padding: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
}
.header_button {
  gap: 10px;
  display: none;
}
.sider_1 {
  width: 100%;
  position: relative;
  top: 0;
}
.content_1 {
  left: 0;
}
.footer_1 {
  display: none;
}
.input {
  width: 100%;
  padding: 0px;
}
}

</style>