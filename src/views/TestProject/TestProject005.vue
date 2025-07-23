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

<script>  
import DataPage from '../../components/DisplayBox/DataPage.vue';
import LoaderBook from '../../components/TransitionalComponents/Loader-book.vue';
import PayPage from '../../components/DisplayBox/PayPage.vue';
import NotificationContainer from '../../components/DisplayBox/NotificationContainer.vue';
import DeletePrompt from '../../components/PromptComponent/DeletePrompt.vue';
import ErrorMessage from '../../components/PromptComponent/ErrorMessage.vue';
import LoginSucceeded from '../../components/PromptComponent/LoginSucceeded.vue';
import FloatingButton from '../../components/ComponentButton/FloatingButton.vue';
import PictureScrolling from '../../components/DisplayBox/PictureScrolling.vue';

export default {  
    name: 'MessageNotification',  
    components: {  
        DataPage,
        LoaderBook,
        PayPage,
        NotificationContainer,
        DeletePrompt,
        ErrorMessage,
        LoginSucceeded,
        FloatingButton,
        PictureScrolling
    },  
    mounted() {  
        // 模拟延迟加载消息
    },  
    data() {  
        return {  
            newMessage: '',  
            messages: [],  
            notifications: [  
                {  
                    message: '您有一条新的消息',  
                    time: '5分钟前',  
                    icon: '✍️',  
                },  
                {  
                    message: '您的邮件已发送',  
                    time: '10分钟前',  
                    icon: '📧',  
                },  
                {  
                    message: '系统更新可用',  
                    time: '1小时前',  
                    icon: '🌍',  
                },  
            ] ,
        };  
    },  
    methods: {  
        addMessage() {  
            if (this.newMessage.trim() === '') {  
                alert('请输入消息内容!');  
                return;  
            }  
            this.messages.push({ text: this.newMessage, reminded: false });  
            this.newMessage = ''; // 清空输入框  
        },  
        setReminder(message) {  
            if (message.reminded) {  
                alert('提醒已设置过！');  
                return;  
            }  
            message.reminded = true;  
            alert(`提醒设置成功: "${message.text}"`);  
        },  
        showDetails(notification) {  
            alert(`通知详情: ${notification.message}`);  
        },  
        deleteNotification(index) {  
            this.notifications.splice(index, 1);  
            alert('通知已删除');  
        }  
    }  
};  
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