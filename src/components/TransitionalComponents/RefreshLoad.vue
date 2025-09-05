<template>
    <div class="loader">
        <div class="loader_overlay"></div>
        <div class="loader_cogs">
            <div class="loader_cogs__top">
                <div class="top_part"></div>
                <div class="top_part"></div>
                <div class="top_part"></div>
                <div class="top_hole"></div>
            </div>
            <div class="loader_cogs__left">
                <div class="left_part"></div>
                <div class="left_part"></div>
                <div class="left_part"></div>
                <div class="left_hole"></div>
            </div>
            <div class="loader_cogs__bottom">
                <div class="bottom_part"></div>
                <div class="bottom_part"></div>
                <div class="bottom_part"></div>
                <div class="bottom_hole"></div>
            </div>
            <p>loading...</p>
        </div>
        <div class="loader_cogs__text">
            <h1>博览旅行</h1>
            <h2>探索世界，发现美好</h2>
        </div>
    </div>
    <!-- 动态粒子 -->
    <!-- <div class="dynamic-particle">
        <DynamicParticle />
    </div> -->
</template>

<script setup>
import { ref } from 'vue'
import DynamicParticle from '@/components/ThemeComponents/DynamicParticle.vue'
</script>

<style scoped>
/* 混合函数替代 */
.center {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}

.hole {
    border-radius: 100%;
    background: white;
    position: absolute;
}

/* 加载器样式 */
.loader {
    height: 100vh;
    position: relative;
    margin: auto;
    width:400px;;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.loader_overlay {
    width: 150px;
    height: 150px;
    background: transparent;
    box-shadow: 0px 0px 0px 1000px rgba(255, 255, 255, 0.3), 0px 0px 19px 0px rgba(0, 0, 0, 0.16) inset;
    border-radius: 100%;
    z-index: -1;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}

.loader_cogs {
    z-index: -2;
    width: 100px;
    position: absolute;
}

.loader_cogs__top {
    position: relative;
    width: 100px;
    height: 100px;
    transform-origin: 50px 50px;
    animation: rotate 10s infinite linear;
}

.top_part {
    width: 100px;
    border-radius: 10px;
    position: absolute;
    height: 100px;
    background: #f98db9;
}

.top_part:nth-child(1) {
    transform: rotate(30deg);
}

.top_part:nth-child(2) {
    transform: rotate(60deg);
}

.top_part:nth-child(3) {
    transform: rotate(90deg);
}

.top_hole {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.loader_cogs__left {
    position: relative;
    width: 80px;
    transform: rotate(16deg);
    top: 28px;
    transform-origin: 40px 40px;
    animation: rotate_left 10s 0.1s infinite reverse linear;
    left: -24px;
    height: 80px;
}

.left_part {
    width: 80px;
    border-radius: 6px;
    position: absolute;
    height: 80px;
    background: #97ddff;
}

.left_part:nth-child(1) {
    transform: rotate(30deg);
}

.left_part:nth-child(2) {
    transform: rotate(60deg);
}

.left_part:nth-child(3) {
    transform: rotate(90deg);
}

.left_hole {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.loader_cogs__bottom {
    position: relative;
    width: 60px;
    top: -65px;
    transform-origin: 30px 30px;
    animation: rotate_left 10.2s 0.4s infinite linear;
    transform: rotate(4deg);
    left: 79px;
    height: 60px;
}

.bottom_part {
    width: 60px;
    border-radius: 5px;
    position: absolute;
    height: 60px;
    background: #ffcd66;
}

.bottom_part:nth-child(1) {
    transform: rotate(30deg);
}

.bottom_part:nth-child(2) {
    transform: rotate(60deg);
}

.bottom_part:nth-child(3) {
    transform: rotate(90deg);
}

.bottom_hole {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    background: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.loader_cogs p {
    position: absolute;
    width: 100%;
    text-align: center;
    font-weight: 700;
    color: rgb(87, 110, 129);
}

.loader_cogs__text {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 10%;
    gap: 10px;
}

h1 {
    text-transform: uppercase;
    font-size: 30px;
    color: rgb(87, 110, 129);
}

h2 {
    font-weight: normal;
    font-size: 18px;
    color: #f98db9;
}

/* 动画 */
@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@keyframes rotate_left {
    from {
        transform: rotate(16deg);
    }

    to {
        transform: rotate(376deg);
    }
}

@keyframes rotate_right {
    from {
        transform: rotate(4deg);
    }

    to {
        transform: rotate(364deg);
    }
}
.dynamic-particle {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}
</style>