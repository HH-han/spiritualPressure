<template>
    <div class="bottom">
        <div class="header">  
            <h1>旅游网</h1>  
        </div>  
        <div class="container_bottom">  
            <div class="stats">
                <h2>推荐</h2> 
                <div>60 多个全球旅游的地点</div>  
                <div>60 个细分目的地的指导</div>  
                <div>0 次下载</div>  
                <div>0 家旅游产品供应商</div>  
            </div>  
            <div class="about">  
                <h2>关于我们</h2>
                <div>关于 | 联系我们</div>  
                <div>照片政策 | 商务协议</div>  
            </div>  
            <div class="services">  
                <h2>旅行服务</h2> 
                <div>
                    <a href="#">旅游攻略</a>
                </div>  
                <div>
                    <a href="#">酒店预订</a>
                </div>  
                <div>
                    <a href="#">旅游特价</a>
                </div>  
                <div>
                    <a href="#">旅游问答</a>
                </div>  
                <div>
                    <a href="#">APP下载</a>
                </div>  
            </div>
            <div class="qr-codes">  
                <div>  
                    <img src="@/assets/QRcode/wx.png" alt="APP">  
                    <p>APP<br>扫码立即下载</p>  
                </div>  
                <div>  
                <img src="@/assets/QRcode/wx.png" alt="微信订阅号">
                    <p>旅游<br>订阅号</p>  
                </div>  
                <div>  
                    <img src="@/assets/QRcode/wx.png" alt="商品官方服务号">  
                    <p>商品<br>官方服务号</p>  
                </div>  
            </div>   
        </div>
        <div class="footer">  
            <p>旅行之前，先上！</p>  
            <p>&copy; 2025 Mafengwo.cn 京ICP证11015476号 京公网安备11010502013401号</p>  
            <p>联系电话：010-83024977</p>  
            <p>热线：国内400-345-678 海外 +86-10-8302-4897</p>  
        </div>  
    </div>
</template>
<script>
export default {
  name: 'BottomPage'
}
</script>
<style scoped>
/* 底部菜单栏 */
.bottom {    
    background-color: #2c3e50;    
    border-bottom: 1px solid #000000; 
    color: #ffffff;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    z-index: 10; /* 设定更高的 z-index 值，确保在其他元素上方 */
  }  
.container_bottom {  
    max-width: 1200px; 
    height: 200px; 
    margin: 0 auto; 
    padding: 0 20px;  
    display: flex;
    display: flex;  
    justify-content: center; /* 可以使用 flex-start, center 或 flex-end */  
    gap: 40px;
    border-radius: 10px;  
    margin-top: 20px;

  }  
.container_bottom h2 {
    color: #ffffff;
}
.container_bottom a{
    color: #ffffff;
    text-decoration: none;
    line-height: 1.5;
}
.header, .footer {  
    text-align: center;  
    padding: 20px 0;  
}  
.header h1 {
    color: #ffffff;
}
.qr-codes {  
    display: flex;  
    justify-content: center;  
    gap: 40px;  
}  
.qr-codes img {  
    width: 100px;    
} 
.footer{
    margin-top:20px;
    box-shadow: 0 2px 4px rgba(237, 237, 237, 0.1);
} 
.footer p {  
    margin: 5px 0;  
} 
@media (max-width: 768px) {
    .container_bottom {
        flex-direction: column;
        align-items: center;
        height: auto;
    }
    .qr-codes {
        justify-content: center;
    }
} 
</style>