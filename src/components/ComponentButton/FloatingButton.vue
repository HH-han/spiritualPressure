<template>
    <div
        role="button"
        class="floating-button"
        :class="{ dragging: isDragging }"
        :style="buttonStyle"
        @mousedown.prevent="startDrag"
        @mouseenter="showTooltip = true"
    >
    <img src="@/assets/floatingbutton/大脑-01.png" class="icon-img">
    </div>
    
    <div
        class="floating-button-show"
        :class="snapEdge"
        v-show="showTooltip && !isDragging"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
        :style="tooltipStyle"
        >
    
        <router-link to="/WebsiteIntroduction">
            <button>
                <svg t="1745227818821" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5304" width="16" height="16">
                    <path d="M512 64c247.424 0 448 200.576 448 448s-200.576 448-448 448S64 759.424 64 512 264.576 64 512 64z m0 85.333333C311.701333 149.333333 149.333333 311.701333 149.333333 512s162.368 362.666667 362.666667 362.666667 362.666667-162.368 362.666667-362.666667S712.298667 149.333333 512 149.333333z m21.333333 277.333334a21.333333 21.333333 0 0 1 21.333334 21.333333v298.666667a21.333333 21.333333 0 0 1-21.333334 21.333333h-42.666666a21.333333 21.333333 0 0 1-21.333334-21.333333V448a21.333333 21.333333 0 0 1 21.333334-21.333333h42.666666z m0-170.666667a21.333333 21.333333 0 0 1 21.333334 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333334 21.333333h-42.666666a21.333333 21.333333 0 0 1-21.333334-21.333333v-42.666667a21.333333 21.333333 0 0 1 21.333334-21.333333h42.666666z" fill="#222429" p-id="5305"></path>
                </svg>
            </button>
        </router-link>
        <router-link to="/systemhomeView">
            <button>
                <svg t="1745227777759" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4227" width="16" height="16">
                    <path d="M512.022729 1024a512 512 0 1 1 512.090917-512 512.045459 512.045459 0 0 1-512.090917 512z m0.681879-932.264583a419.605434 419.605434 0 1 0 419.696351 419.582704 419.650892 419.650892 0 0 0-419.696351-419.582704zM624.328154 679.87854l-65.914943 65.914943-233.679836-233.634378 65.914942-65.801296 169.310486-169.287757 65.914943 65.914943-169.310486 169.265027z" fill="#2F3135" p-id="4228"></path>
                </svg>
            </button>
        </router-link>
        <router-link to="/aboutweb">
            <button>
                <svg t="1745227729358" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3182" width="16" height="16">
                    <path d="M853.312 128a128 128 0 0 1 127.808 120.448l0.192 7.552v341.312a128 128 0 0 1-120.448 127.808l-50.176-0.064V768a128 128 0 0 1-118.464 127.68l-9.6 0.32h-512a128 128 0 0 1-128-128V426.688a128 128 0 0 1 128-128l42.688-0.064V256a128 128 0 0 1 120.512-127.808L341.312 128h512z m-256 512h-384a42.688 42.688 0 1 0 0 85.312h384a42.688 42.688 0 1 0 0-85.312z m256-426.688h-512a42.688 42.688 0 0 0-42.368 37.76L298.688 256v42.624h384a128 128 0 0 1 127.616 118.464l0.384 9.6v213.056h28.288c10.368 0 19.84-0.064 20.736-0.192a42.688 42.688 0 0 0 36.032-37.248L896 597.312V256a42.688 42.688 0 0 0-37.696-42.368l-4.992-0.32z m-256 256h-384a42.688 42.688 0 0 0 0 85.376h384a42.688 42.688 0 0 0 0-85.376z" fill="#2c2c2c" p-id="3183"></path>
                </svg>
            </button>
        </router-link>
        <router-link to="/functionswitching">
            <button>
                <svg t="1745227919992" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10123" width="16" height="16">
                    <path d="M929.024 816.2816a452.9152 452.9152 0 0 0-240.2304-239.4112l-1.4336-0.5632a297.728 297.728 0 1 0-348.672 0c-0.512 0-0.9728 0.3584-1.4336 0.6144a449.3824 449.3824 0 0 0-275.712 404.48 9.5744 9.5744 0 0 0 9.6256 9.8304H143.36a9.6256 9.6256 0 0 0 9.6256-9.3184 359.7312 359.7312 0 0 1 360.192-349.5936 359.7312 359.7312 0 0 1 360.192 349.5936 9.472 9.472 0 0 0 9.6256 9.3184h71.9872a9.5744 9.5744 0 0 0 9.6256-9.8304 445.44 445.44 0 0 0-35.584-165.12z m-416-274.688A206.2848 206.2848 0 1 1 658.9952 481.28a205.4144 205.4144 0 0 1-145.9712 60.3136z" fill="#232632" p-id="10124"></path>
                </svg>
            </button>
        </router-link>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 控制是否显示提示框
const showTooltip = ref(false);
// 控制按钮是否处于拖动状态
const isDragging = ref(false);
// 按钮的位置
const position = ref({ x: 0, y: 0 });
// 按钮吸附的边缘，'left'或'right'
const snapEdge = ref('left');
// 拖动时的偏移量
const dragOffset = ref({ x: 0, y: 0 });
// 按钮的缩放比例
const scale = ref(1);

// 计算按钮的样式
const buttonStyle = computed(() => ({
    transform: `translate(${position.value.x}px, ${position.value.y}px) scale(${scale.value})`,
    borderRadius: isDragging.value ? '50%' : 
        snapEdge.value === 'left' ? '0 25px 25px 0' : '25px 0 0 25px',
}));

// 计算提示框的样式
const tooltipStyle = computed(() => ({
    transform: `translate(${position.value.x}px, ${position.value.y}px)`, // 与按钮位置一致
    top: '60px', // 可以根据需要调整
    left: '5px', // 可以根据需要调整

    
}));

// 组件挂载后初始化按钮位置
onMounted(() => {
    position.value = {
        x: 0,
        y: window.innerHeight / 2 - 300,
    };
});

// 开始拖动
const startDrag = (e) => {
    isDragging.value = true;
    document.body.classList.add('no-select');
    scale.value = 1.1; // 拖动时放大按钮

    dragOffset.value = {
        x: e.clientX - position.value.x,
        y: e.clientY - position.value.y,
    };

    // 鼠标移动事件处理函数
    const onMouseMove = (e) => {
        if (!isDragging.value) return;

        let newX = e.clientX - dragOffset.value.x;
        let newY = e.clientY - dragOffset.value.y;

        // 边界吸附效果
        if (newX < -15) newX = -15 + (newX + 15) * 0.2;
        if (newX > window.innerWidth - 35) 
            newX = window.innerWidth - 35 + (newX - (window.innerWidth - 35)) * 0.2;

        newX = Math.max(-15, Math.min(newX, window.innerWidth - 35));
        newY = Math.max(0, Math.min(newY, window.innerHeight - 50));

        position.value = { x: newX, y: newY };
    };

    // 鼠标松开事件处理函数
    const onMouseUp = () => {
        isDragging.value = false;
        scale.value = 1; // 重置按钮缩放比例
        document.body.classList.remove('no-select');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        snapToEdge();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
};

// 按钮吸附到边缘
const snapToEdge = () => {
    const buttonCenterX = position.value.x + 25;
    const screenCenter = window.innerWidth / 2;

    const targetX = buttonCenterX < screenCenter ? 
        { x: 0, edge: 'left' } : 
        { x: window.innerWidth  -65, edge: 'right' };

    // 弹性动画
    const startTime = Date.now();
    const animate = () => {
        const progress = (Date.now() - startTime) / 300;
        if (progress >= 1) {
            position.value.x = targetX.x;
            snapEdge.value = targetX.edge;
            return;
        }

        // 弹性曲线计算
        const elastic = Math.pow(2, -10 * progress) * Math.sin((progress - 0.1) * 5 * Math.PI) + 1;
        position.value.x = targetX.x + (position.value.x - targetX.x) * elastic;

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
};
</script>

<style scoped>
.floating-button {
    position: fixed;
    left: 0;
    top: 0;
    width: 50px;
    height: 50px;
    background: #2196F3;
    cursor: move;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    transition: 
        transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28),
        border-radius 0.3s ease,
        background 0.3s ease;
    z-index: 1000; 
}

.floating-button.dragging {
    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    background: #42A5F5;
}

.no-select {
    user-select: none;
    -webkit-user-select: none;
}

/* 点击涟漪效果 */
.floating-button::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s;
}

.floating-button:active::after {
    opacity: 1;
    transition: none;
}
/* .floating-button :hover {
    
} */

/* 按钮图标 */
.floating-button .icon-img {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
}
/* 新增提示框样式 */
.floating-button-show {
    cursor: default;
    position: fixed;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 5px;
    border-radius: 15px;
    white-space: nowrap;
    transition: opacity 0.3s;
    z-index: 1000;
    display: flex;               /* 使用 Flexbox 布局 */  
    flex-direction: column;      /* 设置主轴为垂直方向 */  
    gap: 10px;                  /* 设置项目之间的间隔 */    
}
.floating-button-show button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #fff;
    color: #000;
    font-size: 12px;
    cursor: pointer;
}
.floating-button-show button:hover {
    background-color: #e9e9e9;

}

/* 根据吸附位置调整提示位置 */
.floating-button-show.left {
    left: 10px;
    top: 160px;
    transform: translateY(-50%);
}

.floating-button-show.right {
    right: 50px;
    top: 160px;
    transform: translateY(-50%);
}
.floating-button-show.left::before {
    right: 100%;
    border-right-color: rgba(0,0,0,0.8);
}

.floating-button-show.right::before {
    left: 100%;
    border-left-color: rgba(0,0,0,0.8);
}
/* 跟随动画 */
.floating-button-show {
  transition: 
    opacity 0.3s,
    transform 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.floating-button:hover .floating-button-show {
  transform: translateY(-50%) scale(1.05);
}
</style>