<template>
    <div>
        <!-- 背景样式 -->
        <BackgroundStyle />
        <div class="website-intro-web">
            <div class="back-button-web">
                <button @click="back">
                    <svg t="1739694592918" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4167" width="32" height="32">
                        <path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#F55300" p-id="4168"></path><path d="M258.56 358.912l434.432 434.432a51.2 51.2 0 0 0 72.3968-72.3968L330.9568 286.5152A51.2 51.2 0 1 0 258.56 358.912z" fill="#F9F9F9" p-id="4169"></path>
                        <path d="M258.56 712.192l434.432-434.432a51.2 51.2 0 0 1 72.448 72.3968l-434.4832 434.432A51.2 51.2 0 1 1 258.56 712.192z" fill="#F9F9F9" p-id="4170"></path>
                    </svg>
                </button>
            </div>
            <header class="header-web">
                <h1>{{ websiteName }}</h1>
                <p>{{ tagline }}</p>
            </header>
            <nav class="navigation-web">
                <ul>
                    <li><a href="#about">关于</a></li>
                    <li><a href="#features">功能</a></li>
                    <li><a href="#contact">联系我们</a></li>
                </ul>
            </nav>
            <main class="main-content-web">
                <section id="about">
                <h2>关于本网站</h2>
                <p>{{ aboutContent }}</p>
                </section>
                <section id="features-web">
                <h2>主要功能</h2>
                <ul>
                    <li v-for="feature in features" :key="feature.id">
                    {{ feature.title }}:
                    <span>{{ feature.description }}</span>
                    </li>
                </ul>
                </section>
                <section id="contact">
                <h2>联系我们</h2>
                <p>{{ contactContent }}</p>
                <a :href="contactEmail" class="contact-btn-web">发送邮件</a>
                </section>
            </main>
            <footer class="footer-web">
                <p>&copy; {{ currentYear }} {{ websiteName }}</p>
            </footer>
        </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue';
import BackgroundStyle from '@/components/ThemeComponents/BackgroundStyle.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
// 返回
const back = () => {
    router.push({ name: 'systemhomeView' });
};

// 数据
const websiteName = ref('我的网站');
const tagline = ref('');
const aboutContent = ref('本网站是本人学习使用，后端使用Springboot+mybatis，前端使用Vue3搭建的。开发人员：为本人独立开发。');
const features = ref([
{ id: 1, title: '资讯中心', description: '提供实时的旅游资讯和攻略' },
{ id: 2, title: '娱乐天地', description: '汇聚各地美食、景点和旅游资源' },
{ id: 3, title: '用户互动', description: '用户可以在论坛、评论和私信中进行交流' },
]);
const contactContent = ref('如果您有任何问题或建议，请随时与我们联系。');
const contactEmail = ref('https://wx.mail.qq.com/login/loginpage?auth_type=3&login_exception=true');
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.website-intro-web {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 800px;
    margin: 0 auto;
    padding: 50px;
    font-family: Arial, sans-serif;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 15px;
    box-shadow: 0 20px 10px rgba(0, 0, 0, 0.1);
    
}
.back-button-web button {
    position: absolute;
    top: 50px;
    left: 20px;
    background-color: transparent;
    border: none;
    cursor: pointer;
}
.header-web {
    text-align: center;
    margin-bottom: 30px;
}

.navigation-web ul {
    list-style: none;
    padding: 0;
    text-align: center;
}

.navigation-web li {
    display: inline-block;
    margin: 0 10px;
}

.navigation-web a {
    text-decoration: none;
    color: #333;
    padding: 5px 10px;
    border-radius: 4px;
}

/* .navigation-web a:hover {
    background-color: #f0f0f0;
} */

main-content-web {
    margin-top: 20px;
}

section {
    margin-bottom: 40px;
}

section h2 {
    margin-bottom: 15px;
}

.contact-btn-web {
    display: inline-block;
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
    text-decoration: none;
}

.contact-btn-web:hover {
    background-color: #0056b3;
}

.footer-web {
    margin-top: 40px;
    text-align: center;
    color: #777;
    font-size: 0.9em;
}
</style>