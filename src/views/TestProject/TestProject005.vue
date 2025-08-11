<template>  
    <div style="margin-bottom: 100px;">  
        <TestPage />  
        
        <div class="MessageNotification005">  
            <h1>消息通知</h1>  
            <div class="input-container">  
                <input type="text" v-model="newMessage" placeholder="输入你的消息..." />  
                <button @click="addMessage">发送</button>  
            </div>  
            <ul>  
                <li v-for="(message, index) in messages" :key="index" class="message-item_005">  
                    {{ message.text }}  
                    <span class="reminder_005" @click="setReminder(message)">提醒</span>  
                </li>  
            </ul>  
        </div>  

          
    </div>
    <div>
        <notification-container />
    </div>  
    <div>
        <PayPage />
    </div>
    <div>
        <DataPage />
    </div>
    <div>
        <FavoriteContent />
    </div>
    <div>
        <LoaderBook />
    </div>
    <div>
        <DeletePrompt />
    </div>
    <div>
        <ErrorMessage />
    </div>
    <div>
        <LoginSucceeded />
    </div>
    <div>
        <FloatingButton />
    </div>
    <div id="div1">  
        div1  
    </div>  
    <div id="div2">  
        div2  
    </div>
    <div>
        <PictureScrolling />
    </div>  
</template>  

<script setup>  
import DataPage from '../../components/DisplayBox/DataPage.vue';
import LoaderBook from '../../components/TransitionalComponents/Loader-book.vue';
import PictureScrolling from '../../components/DisplayBox/PictureScrolling.vue';

</script>  

<style>  
.MessageNotification005 {  
    background-color: #ffffff;   
    border-bottom: 1px solid #ddd;   
    height: 100%;  
    display: flex;  
    flex-direction: column;  
    gap: 10px;   
    padding: 20px;  
}  

.input-container {  
    display: flex;  
    gap: 10px;  
}  

.MessageNotification005 input {  
    padding: 10px;  
    border: 1px solid #ddd;  
    border-radius: 5px;  
    width: 300px;  
}  

.MessageNotification005 button {  
    padding: 10px;  
    border: none;  
    background-color: #28a745;  
    color: white;  
    border-radius: 5px;  
    cursor: pointer;  
}  

.MessageNotification005 button:hover {  
    background-color: #218838;  
}  

.message-item_005 {  
    background: #f9f9f9;  
    border: 1px solid #ddd;  
    border-radius: 5px;  
    padding: 10px;  
    position: relative;  
    margin-bottom: 10px;  
}  

.reminder_005 {  
    color: #dc3545;  
    cursor: pointer;  
    margin-left: 10px;  
}  
/* 显示测试 */
#div1 {  
    width: 200px;
    height: 400px;
    display: inline-block; /* 使 div1 为内联块元素，便于悬停 */   

    padding: 10px;  
    background-color: #f0f0f0;  
    border: 1px solid #ccc;  
    cursor: pointer; /* 鼠标悬停时显示手型光标 */  
}  

#div2 {
    width: 200px;
    height: 100px;
    display: none; /* 默认隐藏 div2 */  
    margin-top: 10px;  
    padding: 10px;  
    border: 1px solid #ccc;  
    background-color: #e0e0e0; 
    
}  

/* 当 div1 被悬停时显示 div2 */  
#div1:hover , #div2 {  
    display: block; /* 显示 div2 */  
}  
</style>