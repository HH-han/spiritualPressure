<template>
    <div>
        <!-- From Uiverse.io by terenceodonoghue -->
        <div class="container_404">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
    <div class="container_404_text">
        <h1>404</h1>
        <p>页面未找到...</p>
        <button @click="goHome">返回首页</button>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => {
    router.push({ name: 'systemhomeView' })
}

</script>
<style scoped>
.container_404_text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.container_404_text h1 {
    font-size: 100px;
    margin: 0;
    color: #9b59b6;
}

.container_404_text p {
    font-size: 20px;
    margin: 10px 0;
    color: #9b59b6;
}

/* From Uiverse.io by mrtqzbek11 */
.container_404_text button {
    width: 165px;
    height: 45px;
    cursor: pointer;
    color: #fff;
    font-size: 17px;
    border-radius: 1rem;
    border: none;
    position: relative;
    background: #100720;
    transition: 0.1s;
    margin: 20px 0;
}

.container_404_text button::after {
    content: '';
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle farthest-corner at 10% 20%, rgba(255, 94, 247, 1) 17.8%, rgba(2, 245, 255, 1) 100.2%);
    filter: blur(15px);
    z-index: -1;
    position: absolute;
    left: 0;
    top: 0;
}

.container_404_text button:active {
    transform: scale(0.9) rotate(3deg);
    background: radial-gradient(circle farthest-corner at 10% 20%, rgba(255, 94, 247, 1) 17.8%, rgba(2, 245, 255, 1) 100.2%);
    transition: 0.5s;
}

/* From Uiverse.io by terenceodonoghue */
.container_404 {
    position: absolute;
    top: 30%;
    left: 50%;
    border-radius: 50%;
    height: 96px;
    width: 96px;
    animation: rotate_3922 1.2s linear infinite;
    background-color: #9b59b6;
    background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
}

.container_404 span {
    position: absolute;
    border-radius: 50%;
    height: 100%;
    width: 100%;
    background-color: #9b59b6;
    background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
}

.container_404 span:nth-of-type(1) {
    filter: blur(5px);
}

.container_404 span:nth-of-type(2) {
    filter: blur(10px);
}

.container_404 span:nth-of-type(3) {
    filter: blur(25px);
}

.container_404 span:nth-of-type(4) {
    filter: blur(50px);
}

.container_404::after {
    content: "";
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    background-color: #fff;
    border: solid 5px #ffffff;
    border-radius: 50%;
}

@keyframes rotate_3922 {
    from {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    to {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
</style>