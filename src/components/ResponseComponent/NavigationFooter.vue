<template>
    <footer class="bottom-nav">
        <div class="bottom-nav-container">
        <button 
            class="nav-item" 
            :class="{ active: activeTab === 'home' }"
            @click="home('home')"
        >
            <i class="fas fa-home"></i>
            <span>首页</span>
        </button>
        <button 
            class="nav-item" 
            :class="{ active: activeTab === 'discover' }"
            @click="discover('discover')"
        >
            <i class="fas fa-compass"></i>
            <span>发现</span>
        </button>
        <button 
            class="nav-item" 
            :class="{ active: activeTab === 'order' }"
            @click="toOrder('order')"
        >
            <i class="fas fa-ticket-alt"></i>
            <span>订单</span>
        </button>
        <button 
            class="nav-item" 
            :class="{ active: activeTab === 'profile' }"
            @click="toprofile('profile')"
        >
            <i class="fas fa-user"></i>
            <span>我的</span>
        </button>
        </div>

    </footer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref()


function setActiveTab(tab) {
    activeTab.value = tab
}
// 首页
function home() {
    setActiveTab('home')
    router.push('/systemhomeView')
}
// 发现
function discover() {
    setActiveTab('discover')
    router.push('/viewdiscover')
}
// 跳转到订单页面
function toOrder() {
    setActiveTab('order')
    router.push('/vieworderlist')
}
// 个人中心
 function toprofile() {
    setActiveTab('profile')
    router.push('/viewprofile')
}
</script>
<style scoped>
@import "@/css/Response/ResponseCss.css";
</style>