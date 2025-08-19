<template>
    <div class="close-btn-container">
        <button class="close-btn close-btn-red" @click="closethePage">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M5.1716 8.00003L1.08582 3.91424L3.91424 1.08582L8.00003 5.1716L12.0858 1.08582L14.9142 3.91424L10.8285 8.00003L14.9142 12.0858L12.0858 14.9142L8.00003 10.8285L3.91424 14.9142L1.08582 12.0858L5.1716 8.00003Z"
                    fill="#FFFFFF"></path>
            </svg>
        </button>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
const router = useRouter()
const closethePage = () => {
    router.go(-1);
}
</script>
<style scoped>
.close-btn-container {
    position: relative;
    display: flex;
    gap: 10px;
}

.close-btn {
    font-size: 2.4rem;
    text-align: center;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    color: #ffffff;
    border: 5px solid #fff;
    transition: all 0.3s ease;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2);
}

.close-btn:active {
    transform: scale(0.95);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
}

.close-btn:hover {
    transform: scale(0.95);
    box-shadow: 0 0 15px rgb(255, 0, 0);
}

.close-btn-red {
    background-color: #f73a45;
    box-shadow: 0px 0px 5px #f73a45;
}

.close-btn-red svg {
    width: 15px;
    height: 15px;
}
</style>