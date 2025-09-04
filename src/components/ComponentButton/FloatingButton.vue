<template>
    <div role="button" class="floating-button" :class="{ dragging: isDragging }" :style="buttonStyle"
        @mousedown.prevent="startDrag" @mouseenter="showTooltip = true">
        <img src="@/assets/floatingbutton/大脑-01.png" class="icon-img">
    </div>

    <div class="floating-button-show" :class="snapEdge" v-show="showTooltip && !isDragging" :style="{ transform: `translate(${position.x}px, ${position.y}px)` }"
         @mouseenter="showTooltip = true" @mouseleave="showTooltip = false; activeTooltip = ''" v-click-outside="closeTooltip">
        <div class="button-container">
            <button @click="navigation('/WebsiteIntroduction')" @mouseenter="activeTooltip = '关于网站'" @mouseleave="activeTooltip = ''">
            <svg t="1754486868450" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="6299" width="16" height="16">
                <path
                    d="M512 1011.2a496.384 496.384 0 0 0 448.3072-279.296 38.4 38.4 0 0 0-68.9664-33.8944A420.0448 420.0448 0 0 1 512 934.4c-232.9088 0-422.4-189.4912-422.4-422.4S279.0912 89.6 512 89.6s422.4 189.4912 422.4 422.4a38.4 38.4 0 0 0 76.8 0c0-275.2512-223.9488-499.2-499.2-499.2S12.8 236.7488 12.8 512s223.9488 499.2 499.2 499.2z"
                    fill="#438CFF" p-id="6300"></path>
                <path
                    d="M760.4224 537.6a38.4 38.4 0 0 0-38.4-38.4h-460.8a38.4 38.4 0 0 0 0 76.8h460.8a38.4 38.4 0 0 0 38.4-38.4zM261.2224 378.8288h307.2a38.4 38.4 0 0 0 0-76.8h-307.2a38.4 38.4 0 0 0 0 76.8zM261.2224 696.3712a38.4 38.4 0 0 0 0 76.8h204.8a38.4 38.4 0 0 0 0-76.8h-204.8z"
                    fill="#438CFF" p-id="6301"></path>
                <path d="M711.5776 340.4288m-51.2 0a51.2 51.2 0 1 0 102.4 0 51.2 51.2 0 1 0-102.4 0Z" fill="#438CFF"
                    p-id="6302"></path>
            </svg>
            </button>
            <div class="floating-button-prompt" v-show="activeTooltip === '关于网站'">
                <span>关于网站</span>
            </div>
        </div>
        <div class="button-container">
            <button @click="navigation('/systemhomeView')" @mouseenter="activeTooltip = '系统首页'" @mouseleave="activeTooltip = ''">
            <svg t="1754486914478" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="8282" width="16" height="16">
                <path
                    d="M512 64C264.576 64 64 264.576 64 512s200.576 448 448 448 448-200.576 448-448S759.424 64 512 64z"
                    fill="#FF934A" p-id="8283"></path>
                <path
                    d="M498.56 519.666a10.668 10.668 0 0 1 0-15.332c21.718-21.126 84.97-82.904 148.374-147.128 14.336-14.516 19.86-35.152 7.744-51.408-4.972-6.654-11.584-14.192-20.352-22.284-11.926-11.014-23.296-18.38-32.768-23.28-15.51-8.02-33.686-3.928-47.766 6.24-110.25 79.572-185.43 165.484-221.802 211.612-15.98 20.29-15.98 47.538 0 67.828 36.372 46.128 111.552 132.04 221.802 211.614 14.08 10.166 32.256 14.256 47.766 6.238 9.472-4.9 20.842-12.266 32.768-23.28 8.768-8.092 15.38-15.63 20.352-22.284 12.116-16.256 6.592-36.892-7.744-51.406-63.404-64.226-126.656-126.004-148.374-147.13z"
                    fill="#FFFFFF" p-id="8284"></path>
            </svg>
            </button>
            <div class="floating-button-prompt" v-show="activeTooltip === '系统首页'">
                <span>返回首页</span>
            </div>
        </div>
        <div class="button-container">
            <button @click="navigation('/aboutweb')" @mouseenter="activeTooltip = '关于我们'" @mouseleave="activeTooltip = ''">
            <svg t="1754487109629" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="25221" width="16" height="16">
                <path
                    d="M840.433125 0H183.566875C82.605677 0 0 82.605677 0 183.566875v656.86625c0 100.961198 82.605677 183.566875 183.566875 183.566875h656.86625c100.961198 0 183.566875-82.605677 183.566875-183.566875V183.566875C1024.011669 82.605677 941.394323 0 840.433125 0zM609.653003 453.263501a56.910282 56.910282 0 0 1-5.251102 15.963352l0.081684 0.478433S480.254168 717.475642 461.910316 750.825977c-14.434697 26.255513-2.800588 91.929302 105.232095-16.185064 0 0-122.770777 185.678985-211.316035 102.688227 0 0-13.011065-12.836028-14.458035-35.345755a48.636879 48.636879 0 0 1 3.232345-25.263638 97.285426 97.285426 0 0 1 8.693492-19.837498c6.137955-10.712249 129.958953-222.775107 137.753923-257.88748 1.925404-8.670154 33.245314-113.447153-118.196483-34.190512 0 0 118.021447-123.961027 206.146616-71.403325a57.003635 57.003635 0 0 1 14.376351 10.373845c0.245051 0.210044 0.490103 0.373412 0.735155 0.583456v0.303397a57.237018 57.237018 0 0 1 15.543263 48.601871z m-15.519925-109.864734a89.04703 89.04703 0 1 1 89.035361-89.04703 89.04703 89.04703 0 0 1-89.035361 89.04703z"
                    fill="#06A3AD" p-id="25222"></path>
            </svg>
            </button>
            <div class="floating-button-prompt" v-show="activeTooltip === '关于我们'">
                <span>关于我们</span>
            </div>
        </div>
        <div class="button-container">
            <button @click="navigation('/functionswitching')" @mouseenter="activeTooltip = '个人中心'" @mouseleave="activeTooltip = ''">
            <svg t="1754487048002" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="20411" width="16" height="16">
                <path
                    d="M512 0a512 512 0 1 0 512 512A512 512 0 0 0 512 0zM455.214545 427.287273h113.57091a12.567273 12.567273 0 0 1 8.843636 21.410909 93.090909 93.090909 0 0 1-131.258182 0 12.567273 12.567273 0 0 1 8.843636-21.410909z m272.756364 369.570909H296.029091a46.545455 46.545455 0 0 1-34.443636-82.850909 348.625455 348.625455 0 0 1 500.82909 0 46.545455 46.545455 0 0 1-34.443636 82.850909z"
                    fill="#F55E55" p-id="20412"></path>
                <path
                    d="M512 210.850909A162.909091 162.909091 0 1 0 674.909091 372.363636 162.909091 162.909091 0 0 0 512 210.850909z m65.629091 237.847273a93.090909 93.090909 0 0 1-131.258182 0 12.567273 12.567273 0 0 1 8.843636-21.410909h113.57091a12.567273 12.567273 0 0 1 8.843636 21.410909z"
                    fill="#F9BBB8" p-id="20413"></path>
            </svg>
            </button>
            <div class="floating-button-prompt" v-show="activeTooltip === '个人中心'">
                <span>个人中心</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// 点击外部关闭指令
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!el.contains(event.target)) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el._clickOutside);
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside);
  }
};

const router = useRouter();

const navigation = (path) => {
    router.push(path);
};

// 控制是否显示提示框
const showTooltip = ref(false);
// 控制当前激活的提示框
const activeTooltip = ref('');

// 点击外部关闭提示框
const closeTooltip = () => {
    if (showTooltip.value) {
        showTooltip.value = false;
        activeTooltip.value = '';
    }
};
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
        { x: window.innerWidth - 65, edge: 'right' };

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
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    transition:
        transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28),
        border-radius 0.3s ease,
        background 0.3s ease;
    z-index: 1000;
}

.floating-button.dragging {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
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
    left: 5px;
    top: 55px;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    color: white;
    padding: 10px 5px;
    border-radius: 20px;
    white-space: nowrap;
    transition: opacity 0.3s, transform 0.2s ease;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 5px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.button-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.floating-button-show button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: none;
    background-color: #fff;
    color: #000;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.floating-button-show button:hover {
    background-color: #f5f5f5;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.floating-button-show.left::before {
    right: 100%;
    border-right-color: rgba(0, 0, 0, 0.8);
}

.floating-button-show.right::before {
    left: 100%;
    border-left-color: rgba(0, 0, 0, 0.8);
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
/* 提示框样式 */
.floating-button-prompt {
    width: 100%;
    min-width: 100px;
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    position: absolute;
    transition: all 0.3s ease;
    white-space: nowrap;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1001;
    left: 50px;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 箭头共用样式 */
.floating-button-prompt::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border: 8px solid transparent;
}

/* 左侧吸附时的箭头 */
.floating-button-show.left .floating-button-prompt::after {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: rgba(0, 0, 0, 0.3);
  border-left: none;
}

/* 右侧吸附时的箭头 */
.floating-button-show.right .floating-button-prompt::after {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: rgba(0, 0, 0, 0.3);
  border-right: none;
}

/* 右侧吸附时的提示框位置 */
.floating-button-show.right .floating-button-prompt {
    left: -125px;
    margin-left: 8px;
}

/* 左侧吸附时的提示框位置 */
.floating-button-show.left .floating-button-prompt {
    right: 45px;
    margin-right: 8px;
}
</style>