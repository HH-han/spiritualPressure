<template>
    <div>
        <header class="header_ClearingHouse">  
            <h1>欢迎来到社区讨论交流中心</h1>  
            <nav class="nav_ClearingHouse">
                <a @click.prevent="scrollToSection('home')">首页</a>  
                <a @click.prevent="scrollToSection('forum')">讨论区</a>  
                <a @click.prevent="scrollToSection('profile')">用户资料</a>  
                <a @click.prevent="scrollToSection('rules')">社区规则</a>  
                <a @click.prevent="scrollToSection('team')">管理团队</a>  
                <a @click.prevent="scrollToSection('notifications')">消息通知</a>  
                <a @click.prevent="scrollToSection('faq')">常见问题</a>  
            </nav>  
        </header>  
    </div>
    <div>
        <router-view></router-view>
    </div>
    <div>
        <footer class="footer_ClearingHouse">  
            <p>&copy; 2025 社区讨论交流中心. 保留所有权利.</p>  
        </footer>  
    </div>
</template>
<script>
export default {  
  name: 'ClearingHouse',  
  methods: {  
    scrollToSection(sectionId) {  
      const section = document.getElementById(sectionId);  
      if (section) {  
        section.scrollIntoView({ behavior: 'smooth' });  
      }  
    }  
  }  
}  

</script>
<style scoped>
.header_ClearingHouse {  
    background: #007BFF;  
    color: white;  
    padding: 10px 0;  
    text-align: center;  
}
.footer_ClearingHouse {   
    position: fixed;    
    background-color: #f5f5f5;    
    border-bottom: 1px solid #000000; 
    height: 50px; 
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    text-align: center;
    
} 

.nav_ClearingHouse {  
    margin: 10px 0;  
}  
.nav_ClearingHouse button {  
    margin: 0 15px;  
    color: white;  
    background:none; 
    border: 0;
    font-size: 15px;
    font-weight: bold;
    transition: transform 0.2s; /* 添加平滑过渡 */
}  
.nav_ClearingHouse a {
    margin: 0 15px;  
    color: white;  
    background:none; 
    border: 0;
    font-size: 15px;
    font-weight: bold;
    transition: transform 0.2s; /* 添加平滑过渡 */
}
.nav_ClearingHouse button:hover {
    transform: scale(1.2); /* 放大1.5倍 */  
    cursor: pointer;
}
.nav_ClearingHouse a:hover {
    transform: scale(1.2); /* 放大1.5倍 */  
    cursor: pointer;
}
</style>