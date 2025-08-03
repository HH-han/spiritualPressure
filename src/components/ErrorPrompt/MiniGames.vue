<template>
    <div class="game-container">
        <div class="game-board-container">

            <div class="game-board" ref="gameBoard" :class="{ active: gameState.isGameStarted }">
                <div v-for="cell in boardCells" :key="cell.id" :id="cell.id" :class="cell.className"
                    :style="cell.style"></div>
            </div>
            <div class="game-over" v-show="gameState.isGameOver && gameState.hasStarted">
                <h2>游戏结束!</h2>
                <div class="final-score">得分: {{ gameState.score }}</div>
                <button class="btn again" @click="restartGame">
                    <i class="fas fa-redo"></i> 重新开始
                </button>
            </div>
        </div>

        <div class="game-info">
            <div class="info-panel">
                <h2><i class="fas fa-star"></i> 游戏信息</h2>
                <div class="score-display">得分: {{ gameState.score }}</div>
                <div class="score-display">等级: {{ gameState.level }}</div>
                <div class="score-display">消除行数: {{ gameState.lines }}</div>
            </div>

            <div class="info-panel">
                <h2><i class="fas fa-shapes"></i> 下一个方块</h2>
                <div class="next-piece" ref="nextPieceDisplay">
                    <div v-for="cell in nextPieceCells" :key="cell.id" :id="cell.id" :class="cell.className"
                        :style="cell.style">
                    </div>
                </div>
            </div>

            <div class="info-panel controls">
                <button class="btn start" @click="startGame" :disabled="!gameState.isGameOver">
                    <i class="fas fa-play"></i> 开始游戏
                </button>
                <button class="btn pause" @click="togglePause"
                    :disabled="gameState.isGameOver || !gameState.currentPiece">
                    <i class="fas" :class="gameState.isPaused ? 'fa-play' : 'fa-pause'"></i>
                    {{ gameState.isPaused ? '游戏继续' : '游戏暂停' }}
                </button>
                <button class="btn again" @click="restartGame">
                    <i class="fas fa-redo"></i> 重新开始
                </button>

            </div>
        </div>
        <div class="info-panel instructions">
            <h3><i class="fas fa-info-circle"></i> 操作指南</h3>
            <ul>
                <li><i class="fas fa-arrow-left"></i> ← 左移</li>
                <li><i class="fas fa-arrow-right"></i> → 右移</li>
                <li><i class="fas fa-arrow-up"></i> ↑ 旋转</li>
                <li><i class="fas fa-arrow-down"></i> ↓ 加速下落</li>
                <li><i class="fas fa-space-shuttle"></i> 空格键 直接落下</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { createApp, ref, reactive, computed, onMounted, onUnmounted } from 'vue'
// 游戏常量
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const SHAPES = [
    [],
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[2, 2], [2, 2]],
    [[0, 0, 0], [3, 3, 3], [0, 3, 0]],
    [[0, 4, 4], [4, 4, 0], [0, 0, 0]],
    [[5, 5, 0], [0, 5, 5], [0, 0, 0]],
    [[6, 0, 0], [6, 6, 6], [0, 0, 0]],
    [[0, 0, 7], [7, 7, 7], [0, 0, 0]]
];
const COLORS = [
    '',
    '#00f0f0', // I - 青色
    '#f0f000', // O - 黄色
    '#a000f0', // T - 紫色
    '#00f000', // S - 绿色
    '#f00000', // Z - 红色
    '#0000f0', // J - 蓝色
    '#f0a000'  // L - 橙色
];

// 游戏状态
const gameState = reactive({
    board: Array(ROWS).fill().map(() => Array(COLS).fill(0)),
    currentPiece: null,
    nextPiece: null,
    score: 0,
    level: 1,
    lines: 0,
    isPaused: false,
    isGameOver: false,
    hasStarted: false,
    dropSpeed: 1000,
    dropStart: Date.now(),
    gameInterval: null
});

// 引用DOM元素
const gameBoard = ref(null);
const nextPieceDisplay = ref(null);

// 创建新方块
const createPiece = () => {
    const shapeIdx = Math.floor(Math.random() * 7) + 1;
    const shape = JSON.parse(JSON.stringify(SHAPES[shapeIdx]));
    return {
        shape,
        color: COLORS[shapeIdx],
        x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
        y: 0
    };
};

// 碰撞检测
const collision = (x, y, piece) => {
    for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c]) {
                const newY = y + r;
                const newX = x + c;

                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }

                if (newY >= 0 && gameState.board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
};

// 旋转方块
const rotate = () => {
    if (!gameState.currentPiece || gameState.isPaused || gameState.isGameOver) return;

    const originalShape = gameState.currentPiece.shape;
    const originalX = gameState.currentPiece.x;

    // 转置矩阵
    const rows = gameState.currentPiece.shape.length;
    const cols = gameState.currentPiece.shape[0].length;
    const newShape = Array(cols).fill().map(() => Array(rows).fill(0));

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            newShape[c][rows - 1 - r] = gameState.currentPiece.shape[r][c];
        }
    }

    // 临时应用旋转
    gameState.currentPiece.shape = newShape;

    // 调整位置防止旋转后出界
    while (collision(gameState.currentPiece.x, gameState.currentPiece.y, gameState.currentPiece)) {
        gameState.currentPiece.x += (gameState.currentPiece.x < COLS / 2) ? 1 : -1;

        // 如果调整后仍然碰撞，恢复原始状态
        if (Math.abs(gameState.currentPiece.x - originalX) > 2) {
            gameState.currentPiece.shape = originalShape;
            gameState.currentPiece.x = originalX;
            return;
        }
    }
};

// 移动方块
const move = (direction) => {
    if (!gameState.currentPiece || gameState.isPaused || gameState.isGameOver) return;

    switch (direction) {
        case 'left':
            if (!collision(gameState.currentPiece.x - 1, gameState.currentPiece.y, gameState.currentPiece)) {
                gameState.currentPiece.x--;
            }
            break;
        case 'right':
            if (!collision(gameState.currentPiece.x + 1, gameState.currentPiece.y, gameState.currentPiece)) {
                gameState.currentPiece.x++;
            }
            break;
        case 'down':
            if (!collision(gameState.currentPiece.x, gameState.currentPiece.y + 1, gameState.currentPiece)) {
                gameState.currentPiece.y++;
                gameState.dropStart = Date.now();
            } else {
                lockPiece();
            }
            break;
        case 'drop':
            while (!collision(gameState.currentPiece.x, gameState.currentPiece.y + 1, gameState.currentPiece)) {
                gameState.currentPiece.y++;
            }
            lockPiece();
            break;
    }
};

// 锁定方块到游戏板
const lockPiece = () => {
    for (let r = 0; r < gameState.currentPiece.shape.length; r++) {
        for (let c = 0; c < gameState.currentPiece.shape[r].length; c++) {
            if (gameState.currentPiece.shape[r][c]) {
                const y = gameState.currentPiece.y + r;
                const x = gameState.currentPiece.x + c;
                if (y >= 0) {
                    gameState.board[y][x] = gameState.currentPiece.shape[r][c];
                }
            }
        }
    }

    // 检查是否有完整的行
    checkLines();

    // 生成新方块
    gameState.currentPiece = gameState.nextPiece;
    gameState.nextPiece = createPiece();

    // 检查游戏结束
    if (collision(gameState.currentPiece.x, gameState.currentPiece.y, gameState.currentPiece)) {
        gameOver();
    }
};

// 检查并清除完整的行
const checkLines = () => {
    let linesCleared = 0;

    for (let r = ROWS - 1; r >= 0; r--) {
        if (gameState.board[r].every(cell => cell !== 0)) {
            // 移动上面的行下来
            for (let y = r; y > 0; y--) {
                gameState.board[y] = [...gameState.board[y - 1]];
            }
            gameState.board[0] = Array(COLS).fill(0);

            linesCleared++;
            r++; // 再次检查同一行（现在是上一行）
        }
    }

    if (linesCleared > 0) {
        // 更新分数
        updateScore(linesCleared);
    }
};

// 更新分数
const updateScore = (linesCleared) => {
    const points = [0, 100, 300, 500, 800][linesCleared] * gameState.level;
    gameState.score += points;
    gameState.lines += linesCleared;
    gameState.level = Math.floor(gameState.lines / 10) + 1;

    // 每1000分速度提高30%
    const speedMultiplier = Math.pow(0.7, Math.floor(gameState.score / 1000));
    gameState.dropSpeed = Math.max(100, (1000 - (gameState.level - 1) * 100) * speedMultiplier);
};

// 游戏主循环
const gameLoop = () => {
    if (gameState.isPaused || gameState.isGameOver) return;

    const now = Date.now();
    const delta = now - gameState.dropStart;

    if (delta > gameState.dropSpeed) {
        move('down');
        gameState.dropStart = now;
    }

    requestAnimationFrame(gameLoop);
};

// 开始游戏
const startGame = () => {
    if (gameState.gameInterval) return;

    // 重置游戏状态
    gameState.board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    gameState.score = 0;
    gameState.level = 1;
    gameState.lines = 0;
    gameState.isGameOver = false;
    gameState.isPaused = false;
    gameState.hasStarted = true;
    gameState.dropSpeed = 1000;

    // 创建初始方块
    gameState.currentPiece = createPiece();
    gameState.nextPiece = createPiece();

    // 开始游戏循环
    gameState.dropStart = Date.now();
    gameLoop();

    // 更新游戏状态
    gameState.isGameOver = false;
    console.log('游戏开始');
};

// 暂停游戏
const togglePause = () => {
    gameState.isPaused = !gameState.isPaused;

    if (!gameState.isPaused) {
        gameState.dropStart = Date.now();
        gameLoop();
        console.log('游戏继续');
    } else {
        console.log('游戏暂停');
    }
};

// 游戏结束
const gameOver = () => {
    gameState.isGameOver = true;
    console.log('游戏结束');
};

// 重新开始游戏
const restartGame = () => {
    startGame();
    console.log('游戏重新开始');
};

// 键盘控制
const keyDownHandler = (e) => {
    if (gameState.isGameOver) return;

    switch (e.keyCode) {
        case 37: // 左箭头
            move('left');
            break;
        case 39: // 右箭头
            move('right');
            break;
        case 40: // 下箭头
            move('down');
            break;
        case 38: // 上箭头
            rotate();
            break;
        case 32: // 空格键
            move('drop');
            break;
        case 80: // P键
            togglePause();
            break;
    }
};

// 初始化游戏
onMounted(() => {
    // 添加键盘事件监听
    document.addEventListener('keydown', keyDownHandler);

    // 初始化游戏状态但不自动开始
    gameState.board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    gameState.isGameOver = true; // 初始状态为游戏结束，等待点击开始
});

onUnmounted(() => {
    // 移除事件监听
    document.removeEventListener('keydown', keyDownHandler);
});

// 计算游戏板渲染
const boardCells = computed(() => {
    const cells = [];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cellValue = gameState.board[r][c];
            const isCurrentPiece = gameState.currentPiece &&
                r >= gameState.currentPiece.y &&
                r < gameState.currentPiece.y + gameState.currentPiece.shape.length &&
                c >= gameState.currentPiece.x &&
                c < gameState.currentPiece.x + gameState.currentPiece.shape[0].length &&
                gameState.currentPiece.shape[r - gameState.currentPiece.y][c - gameState.currentPiece.x];

            let className = 'cell';
            let bgColor = '';

            if (isCurrentPiece) {
                className += ' filled';
                bgColor = gameState.currentPiece.color;
            } else if (cellValue) {
                className += ' filled';
                // 根据方块类型添加类名
                switch (cellValue) {
                    case 1: className += ' I'; break;
                    case 2: className += ' O'; break;
                    case 3: className += ' T'; break;
                    case 4: className += ' S'; break;
                    case 5: className += ' Z'; break;
                    case 6: className += ' J'; break;
                    case 7: className += ' L'; break;
                }
            }

            cells.push({
                id: `${r}-${c}`,
                className,
                style: bgColor ? { backgroundColor: bgColor } : {}
            });
        }
    }
    return cells;
});

// 计算下一个方块预览
const nextPieceCells = computed(() => {
    const cells = [];
    if (!gameState.nextPiece) return cells;

    // 清空预览
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            cells.push({
                id: `next-${r}-${c}`,
                className: 'cell',
                style: {}
            });
        }
    }

    // 计算居中位置
    const offsetX = Math.floor((4 - gameState.nextPiece.shape[0].length) / 2);
    const offsetY = Math.floor((4 - gameState.nextPiece.shape.length) / 2);

    // 绘制下一个方块
    for (let r = 0; r < gameState.nextPiece.shape.length; r++) {
        for (let c = 0; c < gameState.nextPiece.shape[r].length; c++) {
            if (gameState.nextPiece.shape[r][c]) {
                const y = offsetY + r;
                const x = offsetX + c;
                const idx = y * 4 + x;
                if (idx < cells.length) {
                    cells[idx].className = 'cell filled';
                    cells[idx].style = { backgroundColor: gameState.nextPiece.color };
                }
            }
        }
    }

    return cells;
});

</script>

<style scoped>
.game-container {
    display: flex;
    gap: 30px;
    max-width: 1200px;
    justify-content: center;

    width: 100%;
}

.game-board-container {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    padding: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.game-board {
    background-color: rgba(255, 255, 255, 0.05);
    border: 2px solid #6a5acd;
    display: grid;
    grid-template-rows: repeat(20, 30px);
    grid-template-columns: repeat(10, 30px);
    gap: 1px;
}

.cell {
    background-color: rgba(255, 255, 255, 0.05);
    transition: all 0.2s ease;
}

.cell.filled {
    background-color: #6a5acd;
    box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.3);
}

.cell.I {
    background-color: #00f0f0;
}

.cell.O {
    background-color: #f0f000;
}

.cell.T {
    background-color: #a000f0;
}

.cell.S {
    background-color: #00f000;
}

.cell.Z {
    background-color: #f00000;
}

.cell.J {
    background-color: #0000f0;
}

.cell.L {
    background-color: #f0a000;
}

.game-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
    width: 250px;
}

.info-panel {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.info-panel h2 {
    color: #7b68ee;
    margin-bottom: 15px;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 10px;
}

.info-panel h2 i {
    font-size: 1.2rem;
}

.score-display {
    display: flex;
    font-weight: bold;
    text-align: center;
    margin: 10px 0;
}

.next-piece {
    display: grid;
    grid-template-rows: repeat(4, 30px);
    grid-template-columns: repeat(4, 30px);
    gap: 1px;
    margin: 0 auto;
    width: fit-content;
}

.controls {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.btn {
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.btn:active {
    transform: translateY(1px);
}

.btn i {
    font-size: 1rem;
}

.start {
    background-color: green;
}

.pause {
    background-color: #9370db;
}

.again {
    background-color: #6a5acd;
}

.game-over {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    opacity: 1;
    pointer-events: all;
}

.game-over h2 {
    color: #7b68ee;
    font-size: 2rem;
    margin-bottom: 10px;
}

.game-over .final-score {
    font-size: 1.5rem;
    margin-bottom: 20px;
}

.instructions {
    width: 250px;
}

.instructions h3 {
    margin-bottom: 10px;
    color: #7b68ee;
}

.instructions ul {
    list-style-type: none;
    padding-left: 5px;
}

.instructions li {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.instructions i {
    color: #7b68ee;
    width: 20px;
    text-align: center;
}

@keyframes clearLine {
    0% {
        background-color: white;
    }

    100% {
        background-color: transparent;
    }
}

.clearing {
    animation: clearLine 0.3s ease-out;
}

@media (max-width: 768px) {
    .game-container {
        flex-direction: column;
        align-items: center;
    }

    .game-info {
        width: 100%;
        max-width: 400px;
    }

    .game-board {
        grid-template-rows: repeat(20, 25px);
        grid-template-columns: repeat(10, 25px);
    }

    .next-piece {
        grid-template-rows: repeat(4, 25px);
        grid-template-columns: repeat(4, 25px);
    }
}
</style>