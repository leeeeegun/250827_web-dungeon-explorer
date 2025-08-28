const gameBoard = document.getElementById('game-board');
const messageBox = document.getElementById('message-box');

function render(gameState) {
    const { map, player, monsters, items, message } = gameState;

    // Clear the board
    gameBoard.innerHTML = '';

    // Set grid dimensions
    gameBoard.style.gridTemplateRows = `repeat(${map.length}, 40px)`;
    gameBoard.style.gridTemplateColumns = `repeat(${map[0].length}, 40px)`;

    // Render map tiles, monsters, items, and player
    map.forEach((row, y) => {
        row.forEach((tile, x) => {
            const tileElement = document.createElement('div');
            tileElement.classList.add('tile', tile); // WALL or FLOOR
            tileElement.style.gridRowStart = y + 1;
            tileElement.style.gridColumnStart = x + 1;
            gameBoard.appendChild(tileElement);
        });
    });

    // Render monsters
    if (monsters) {
        monsters.forEach(monster => {
            const monsterElement = document.createElement('div');
            monsterElement.classList.add('tile', 'MONSTER');
            monsterElement.style.gridRowStart = monster.y + 1;
            monsterElement.style.gridColumnStart = monster.x + 1;
            gameBoard.appendChild(monsterElement);
        });
    }

    // Render items
    if (items) {
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('tile', 'ITEM');
            itemElement.style.gridRowStart = item.y + 1;
            itemElement.style.gridColumnStart = item.x + 1;
            gameBoard.appendChild(itemElement);
        });
    }

    // Render player
    if (player) {
        const playerElement = document.createElement('div');
        playerElement.classList.add('tile', 'PLAYER');
        playerElement.style.gridRowStart = player.y + 1;
        playerElement.style.gridColumnStart = player.x + 1;
        gameBoard.appendChild(playerElement);
    }
    
    // Update message box
    if (message) {
        messageBox.textContent = message;
    }
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
        const response = await fetch('/api/game/start', { method: 'POST' });
        if (!response.ok) throw new Error('서버에서 데이터를 받아오지 못했습니다.');
        const gameState = await response.json();
        render(gameState);
    } catch (error) {
        messageBox.textContent = error.message;
    }
}

initGame();