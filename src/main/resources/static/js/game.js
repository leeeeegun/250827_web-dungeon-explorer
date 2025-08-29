document.addEventListener('DOMContentLoaded', () => {
    fetchGameState();
});

document.addEventListener('keydown', (event) => {
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
        case ' ': // 스페이스바로 공격
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

const TILE_SIZE = 32; // 타일 크기를 32x32로 키움
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// 캔버스 크기를 뷰포트 크기로 설정
const VIEWPORT_WIDTH = 15; // 뷰포트 타일 가로 개수
const VIEWPORT_HEIGHT = 15; // 뷰포트 타일 세로 개수
canvas.width = VIEWPORT_WIDTH * TILE_SIZE;
canvas.height = VIEWPORT_HEIGHT * TILE_SIZE;
ctx.imageSmoothingEnabled = false; // 픽셀 아트가 흐려지지 않도록 설정

// UI 요소
const hpValueEl = document.getElementById('hp-value');
const inventoryListEl = document.getElementById('inventory-list');
const messageEl = document.getElementById('message');

// 이미지 스프라이트 로드 (간단한 아이콘 사용)
const SPRITES = {
    PLAYER: '🧑',
    MONSTER: '👹',
    BOSS: '👿',
    ITEM: '🔑',
    POTION: '🧪', // 물약 아이콘 추가
    WALL: '🧱',
    FLOOR: '⬛'
};

function renderGame(gameState) {
    const { map, player, monsters, items, message } = gameState;
    const mapHeight = map.length;
    const mapWidth = map[0].length;

    // 플레이어 중심의 뷰포트 시작점 계산
    const startX = Math.max(0, Math.min(player.x - Math.floor(VIEWPORT_WIDTH / 2), mapWidth - VIEWPORT_WIDTH));
    const startY = Math.max(0, Math.min(player.y - Math.floor(VIEWPORT_HEIGHT / 2), mapHeight - VIEWPORT_HEIGHT));

    // 캔버스 클리어
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
                
                // 몬스터, 보스 예외 처리
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
                    // 바닥을 먼저 그림
                    ctx.fillStyle = '#333'; // 어두운 바닥 색
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    
                    if(tileType !== 'FLOOR') {
                         // 텍스트 기반 스프라이트 렌더링
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(sprite, x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2);
                    }
                }
            }
        }
    }

    // UI 업데이트
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
}

function displayError(errorMessage) {
    messageEl.textContent = errorMessage;
    messageEl.style.color = 'red';
}