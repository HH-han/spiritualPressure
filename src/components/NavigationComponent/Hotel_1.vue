<template>
    <div>
        <div class="background_hotel_1">
            <div class="logo" style="display: flex; align-items: center; gap: 10px;">
                <img src="@/assets/scenery/风景 (1).jpg" alt="" style="width: 50px;height: 50px;">
                <span>小猫</span>
            </div> 
            <div>
                
                <router-link to="/Home_3">
                    <button>返回首页</button>
                </router-link>
            </div>
        </div>
        <div>
            <router-view />
        </div>
        <div class="background_hotel_1_bottom">
            <a href="baidu.com">百度</a>
        </div>
    </div>
</template>
<script>

</script>
<style scoped>
.background_hotel_1{  
    display: flex;  
    align-items: center;  
    background-color: #f5f5f5;  
    padding: 10px 20px;  
    border-bottom: 1px solid #ddd; 
    height: 100px; 
}
.background_hotel_1 button{
    width: 100px;
    height: 30px;
    background-color: brown;
    border: 0;
    margin-right: 20px;
    margin-left: 20px;
    color: #ffffff;
    font-size: 15px;
    cursor: pointer;
    border-radius: 5px;
    outline: none;
}
.background_hotel_1_bottom{
    position: fixed;    
    background-color: #f5f5f5;    
    border-bottom: 1px solid #000000; 
    height: 50px; 
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
}
</style>