<template>
    <div class="background_UserManagement">
        <div class="background_UserManagement_1">
            <div class="logo" style="display: flex; align-items: center; gap: 10px;">
                <img src="@/assets/scenery/风景6.webp" alt="" style="width: 50px;height: 50px;border-radius: 10px;">
                <span>小猫</span>
             </div>
            <router-link to="/usergoodsmanagement">
                <button class="button_1">返回管理页面</button>
            </router-link>
            <router-link to="/home_5">
                <button class="button_1">返回主页</button>
            </router-link>
        </div>
        <div>
            <router-view />
        </div>
        <div class="background_UserManagement_1_bottom">
            <a href="#">首页</a>
        </div>
    </div>
</template>
<script>

</script>
<style scoped>  
@import '@/css/Management/UserManagement_1.css'; /* 局部引入自定义 CSS 文件 */  
</style>  