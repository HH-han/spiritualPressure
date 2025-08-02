<script setup>
import { ref, onMounted } from 'vue';

// 游戏状态
const gameStarted = ref(false);
const paused = ref(false);
const score = ref(0);
const highScore = ref(0);

// 恐龙GIF元素引用
const dinoRef = ref(null);
const canvasRef = ref(null);
let ctx;

// 游戏变量
let obstacles = [];
let gameSpeed = 5;
let gravity = 0.5;
let isJumping = false;
let jumpForce = 0;
let gameRunning = false;
let animationId;
let frameCount = 0;

// 初始化游戏
const initGame = () => {
    ctx = canvasRef.value.getContext('2d');
    obstacles = [];
    score.value = 0;
    gameSpeed = 5;
    frameCount = 0;
    
    // 重置恐龙位置
    dinoRef.value.style.left = '50px';
    dinoRef.value.style.bottom = '60px';
    dinoRef.value.style.transform = 'scaleX(1)';
};

// 绘制背景和地面
const drawBackground = () => {
    // 渐变天空
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasRef.value.height);
    gradient.addColorStop(0, '#64b3f4');
    gradient.addColorStop(1, '#c2e59c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    
    // 绘制地面
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(0, canvasRef.value.height - 15, canvasRef.value.width, 15);
    
    // 绘制草地
    ctx.fillStyle = '#7cb342';
    ctx.fillRect(0, canvasRef.value.height - 15, canvasRef.value.width, 5);
};

// 绘制仙人掌
const drawCactus = (x, height) => {
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(x, canvasRef.value.height - 15 - height, 20, height);
    
    // 添加仙人掌刺
    ctx.fillRect(x - 8, canvasRef.value.height - 15 - height + 20, 36, 8);
    ctx.fillRect(x - 5, canvasRef.value.height - 15 - height + 40, 30, 6);
};

// 游戏主循环
const gameLoop = () => {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    
    drawBackground();
    
    // 更新恐龙位置
    const dinoRect = dinoRef.value.getBoundingClientRect();
    const canvasRect = canvasRef.value.getBoundingClientRect();
    const dinoX = dinoRect.left - canvasRect.left;
    const dinoY = canvasRef.value.height - (dinoRect.bottom - canvasRect.top);
    const dinoWidth = dinoRect.width;
    const dinoHeight = dinoRect.height;
    
    if (isJumping) {
        const currentBottom = parseInt(dinoRef.value.style.bottom || '60');
        dinoRef.value.style.bottom = (currentBottom + jumpForce) + 'px';
        jumpForce -= gravity;
        
        if (parseInt(dinoRef.value.style.bottom) <= 60) {
            dinoRef.value.style.bottom = '60px';
            isJumping = false;
        }
    }
    
    // 生成障碍物
    if (frameCount % 100 === 0) {
        const height = Math.random() * 40 + 30;
        obstacles.push({
            x: canvasRef.value.width,
            height: height,
            width: 20,
            passed: false
        });
    }
    
    // 更新和绘制障碍物
    for (let i = 0; i < obstacles.length; i++) {
        const cactus = obstacles[i];
        cactus.x -= gameSpeed;
        
        drawCactus(cactus.x, cactus.height);
        
        // 碰撞检测
        if (
            dinoX + dinoWidth > cactus.x &&
            dinoX < cactus.x + cactus.width &&
            dinoY < cactus.height + 15
        ) {
            endGame();
            return;
        }
        
        // 计分
        if (!cactus.passed && cactus.x + cactus.width < dinoX) {
            cactus.passed = true;
            score.value += 1;
            
            // 每10分增加速度
            if (score.value % 10 === 0) {
                gameSpeed += 0.5;
            }
        }
        
        // 移除屏幕外的障碍物
        if (cactus.x + cactus.width < 0) {
            obstacles.splice(i, 1);
            i--;
        }
    }
    
    // 更新分数显示
    document.getElementById('score').textContent = score.value;
    
    frameCount++;
    if (gameRunning && !paused.value) {
        animationId = requestAnimationFrame(gameLoop);
    }
};

// 开始游戏
const startGame = () => {
    if (!gameStarted.value) {
        gameStarted.value = true;
    }
    
    if (!gameRunning) {
        gameRunning = true;
        paused.value = false;
        document.getElementById('gameOver').style.display = 'none';
        gameLoop();
    }
};

// 跳跃函数
const jump = () => {
    if (!gameRunning || paused.value || isJumping) return;
    
    isJumping = true;
    jumpForce = 15;
};

// 键盘事件监听
const handleKeyDown = (e) => {
    if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
    }
};

// 初始化
onMounted(() => {
    initGame();
    document.addEventListener('keydown', handleKeyDown);
    canvasRef.value.addEventListener('click', jump);
});
</script>

<template>
  <div class="game-container">
    <canvas ref="canvasRef" id="gameCanvas" width="800" height="300"></canvas>
    
    <!-- 恐龙GIF图片 -->
    <img ref="dinoRef" 
         src="https://testproject.blob.core.windows.net/testproject/animation/dino/dino.gif" 
         class="dino-gif"
         alt="恐龙角色">
    
    <!-- 游戏控制UI -->
    <div class="game-controls">
      <div class="score-board">
        <div>得分: <span id="score">0</span></div>
        <div>最高分: <span id="highScore">0</span></div>
      </div>
      
      <div class="controls">
        <button class="btn" @click="startGame" v-if="!gameStarted">
          <i class="fas fa-play"></i> 开始游戏
        </button>
        <button class="btn btn-restart" @click="initGame" v-else>
          <i class="fas fa-redo"></i> 重新开始
        </button>
      </div>
    </div>
    
    <div id="gameOver" class="game-over">
      <h3>游戏结束!</h3>
      <p>得分: <span id="finalScore">0</span></p>
      <button class="btn btn-restart pulse" @click="initGame">
        <i class="fas fa-redo"></i> 重新开始
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  position: relative;
  width: 800px;
  height: 300px;
  margin: 0 auto;
  overflow: hidden;
}

#gameCanvas {
  display: block;
  background: #f0f0f0;
}

.dino-gif {
  position: absolute;
  left: 50px;
  bottom: 60px;
  width: 60px;
  height: 80px;
  z-index: 10;
  image-rendering: pixelated; /* 保持像素风格 */
}

.game-over {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 20;
  color: white;
}

/* 其他样式保持不变... */
</style>