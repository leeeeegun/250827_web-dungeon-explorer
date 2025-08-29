const gameContainer = document.getElementById('game-container');

document.addEventListener('DOMContentLoaded', () => {
    fetchGameState();
});

document.addEventListener('keydown', (event) => {
    console.log(`Key pressed: ${event.code}`); // 키 입력 디버깅 로그

    const isGameOver = gameContainer.classList.contains('game-over');

    if (isGameOver) {
        if (event.code === 'Space') { // 재시작 키를 스페이스바로 변경
            restartGame();
        }
        return; // 게임 오버 시 스페이스바 외 모든 입력 무시
    }

    // 게임 진행 중일 때의 키 입력 처리
    let direction = null;
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            direction = 'UP';
            break;
        case 'ArrowDown':
        case 's':
            direction = 'DOWN';
            break;
        case 'ArrowLeft':
        case 'a':
            direction = 'LEFT';
            break;
        case 'ArrowRight':
        case 'd':
            direction = 'RIGHT';
            break;
        case ' ': // 공격 키는 스페이스바 그대로 유지 (단, 게임 진행 중에만)
            attack();
            return;
        case 'g': // 아이템 줍기
            pickupItem();
            return;
    }

    if (direction) {
        movePlayer(direction);
    }
});

async function fetchGameState() {
    try {
        const response = await fetch('/api/game/state');
        if (!response.ok) throw new Error('서버에서 게임 상태를 가져오는데 실패했습니다.');
        const gameState = await response.json();
        renderGame(gameState);
    } catch (error) {
        console.error(error);
        displayError(error.message);
    }
}

async function movePlayer(direction) {
    try {
        const response = await fetch('/api/game/move', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ direction: direction })
        });
        if (!response.ok) throw new Error('이동 처리 중 오류가 발생했습니다.');
        const gameState = await response.json();
        renderGame(gameState);
    } catch (error) {
        console.error(error);
        displayError(error.message);
    }
}

async function attack() {
    try {
        const response = await fetch('/api/game/attack', { method: 'POST' });
        if (!response.ok) throw new Error('공격 처리 중 오류가 발생했습니다.');
        const gameState = await response.json();
        renderGame(gameState);
    } catch (error) {
        console.error(error);
        displayError(error.message);
    }
}

async function pickupItem() {
    try {
        const response = await fetch('/api/game/pickup', { method: 'POST' });
        if (!response.ok) throw new Error('아이템 줍기 처리 중 오류가 발생했습니다.');
        const gameState = await response.json();
        renderGame(gameState);
    } catch (error) {
        console.error(error);
        displayError(error.message);
    }
}

async function restartGame() {
    try {
        const response = await fetch('/api/game/restart', { method: 'POST' });
        if (!response.ok) throw new Error('게임 재시작에 실패했습니다.');
        const gameState = await response.json();
        renderGame(gameState);
    } catch (error) {
        console.error(error);
        displayError(error.message);
    }
}

const TILE_SIZE = 32;
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const VIEWPORT_WIDTH = 15;
const VIEWPORT_HEIGHT = 15;
canvas.width = VIEWPORT_WIDTH * TILE_SIZE;
canvas.height = VIEWPORT_HEIGHT * TILE_SIZE;
ctx.imageSmoothingEnabled = false;

const hpValueEl = document.getElementById('hp-value');
const inventoryListEl = document.getElementById('inventory-list');
const messageEl = document.getElementById('message');

const SPRITES = {
    PLAYER: '🧑',
    MONSTER: '👹',
    BOSS: '👿',
    ITEM: '🔑',
    POTION: '🧪',
    WALL: '🧱',
    FLOOR: '⬛'
};

function renderGame(gameState) {
    const { map, player, monsters, items, message } = gameState;
    const mapHeight = map.length;
    const mapWidth = map[0].length;

    const startX = Math.max(0, Math.min(player.x - Math.floor(VIEWPORT_WIDTH / 2), mapWidth - VIEWPORT_WIDTH));
    const startY = Math.max(0, Math.min(player.y - Math.floor(VIEWPORT_HEIGHT / 2), mapHeight - VIEWPORT_HEIGHT));

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${TILE_SIZE * 0.8}px sans-serif`;
    for (let y = 0; y < VIEWPORT_HEIGHT; y++) {
        for (let x = 0; x < VIEWPORT_WIDTH; x++) {
            const mapX = startX + x;
            const mapY = startY + y;

            if (mapX >= 0 && mapX < mapWidth && mapY >= 0 && mapY < mapHeight) {
                const tileType = map[mapY][mapX];
                let sprite = SPRITES[tileType];
                
                if (tileType === 'MONSTER') {
                     const monster = monsters.find(m => m.x === mapX && m.y === mapY);
                     if (monster && monster.isBoss) {
                         sprite = SPRITES.BOSS;
                     } else {
                         sprite = SPRITES.MONSTER;
                     }
                } else if (tileType === 'POTION') {
                    sprite = SPRITES.POTION;
                } else if (tileType === 'ITEM') {
                    sprite = SPRITES.ITEM;
                }

                if (sprite) {
                    ctx.fillStyle = '#333';
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    
                    if(tileType !== 'FLOOR') {
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(sprite, x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2);
                    }
                }
            }
        }
    }

    hpValueEl.textContent = `${player.hp} / ${player.maxHp}`;
    inventoryListEl.innerHTML = '';
    if (player.inventory && player.inventory.length > 0) {
        player.inventory.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            inventoryListEl.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = '비어있음';
        inventoryListEl.appendChild(li);
    }
    messageEl.textContent = message || '던전에 오신 것을 환영합니다.';

    if (gameState.isGameOver) {
        gameContainer.classList.add('game-over');
        drawGameOverScreen();
    } else {
        gameContainer.classList.remove('game-over');
    }
}

function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = "48px 'Nanum Gothic Coding', monospace";
    ctx.textAlign = 'center';
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 30);

    ctx.font = "24px 'Nanum Gothic Coding', monospace";
    ctx.fillText("다시 시작하시겠습니까? (Spacebar)", canvas.width / 2, canvas.height / 2 + 20);
}

function displayError(errorMessage) {
    messageEl.textContent = errorMessage;
    messageEl.style.color = 'red';
}