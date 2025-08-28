const gameBoard = document.getElementById('game-board');
const messageBox = document.getElementById('message-box');

function render(gameState) {

    gameBoard.innerHTML = '';
    const mapWidth = gameState.map[0].length;
    gameBoard.style.gridTemplateColumns = `repeat(${mapWidth}, 40px)`;

    gameState.map.forEach(row => {
        row.forEach(tileType => {
            const tile = document.createElement('div');

            tile.className = 'tile ' + tileType;
            gameBoard.appendChild(tile);
        });
    });

    // HP와 인벤토리 정보도 표시
    const player = gameState.player;
    const inventoryText = player.inventory.length > 0 ? player.inventory.join(', ') : '없음';
    messageBox.innerHTML = `HP: ${player.hp} | 인벤토리: [${inventoryText}]<br>${gameState.message}`;
}

window.addEventListener('keydown', (event) => {
    let direction = null;
    switch (event.key) {
        // 이동
        case 'ArrowUp': case 'w': direction = 'UP'; break;
        case 'ArrowDown': case 's': direction = 'DOWN'; break;
        case 'ArrowLeft': case 'a': direction = 'LEFT'; break;
        case 'ArrowRight': case 'd': direction = 'RIGHT'; break;
        // 공격
        case ' ': // 스페이스바
            event.preventDefault(); // 스페이스바의 기본 동작(페이지 스크롤) 방지
            attack();
            break;
        // 아이템 줍기
        case 'e':
            pickupItem();
            break;
    }
    if (direction) {
        movePlayer(direction);
    }
});

// 공격 요청 함수 추가
async function attack() {
    await sendAction('/api/game/attack');
}

// 아이템 줍기 요청 함수 추가
async function pickupItem() {
    await sendAction('/api/game/pickup');
}

// 이동 요청 함수를 범용 함수를 사용하도록 수정
async function movePlayer(direction) {
    await sendAction('/api/game/move', { direction: direction });
}

async function sendAction(url, body = null) {
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };
        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        if (!response.ok) throw new Error('요청에 실패했습니다.');

        const newGameState = await response.json();
        render(newGameState);

    } catch (error) {
        messageBox.textContent = error.message;
    }
}

async function initGame() {

    try {
        const response = await fetch('/api/game/state');
        if (!response.ok) throw new Error('서버에서 데이터를 받아오지 못했습니다.');
        const gameState = await response.json();
        render(gameState);
    } catch (error) {
        messageBox.textContent = error.message;
    }
}

initGame();
