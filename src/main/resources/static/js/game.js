const gameBoard = document.getElementById("game-board");
const messageBox = document.getElementById("message-box");

function render (gameState) {
    // 기존에 있던 맵을 지움
    gameBoard.innerHTML = '';

    // 맵 크게 맞게 CSS grid를 설정
    const mapWidth = gameState.map[0].length;
    gameBoard.style.gridTemplateColumns = `repeat(${mapWidth}, 40px)`;

    // 서버에서 받은 맵 데이터를 한 칸씩 돌면서 화면에 그림
    gameState.map.forEach(row => {
        row.forEach(tileType => {
            const tile = document.createElement("div");
            tile.className = 'tile ' + tileType;
            gameBoard.appendChild(tile);
        });
    });

    // 메시지 박스에 메시지를 표시
    messageBox.textContent = gameState.message;
}

// 게임을 시작하는 함수
async function initGame () {
    try {
        const response = await fetch("/api/game/state");
        if (!response.ok) {
            throw new Error("서버에서 데이터를 받아오지 못했습니다.");
        }
        const gameState = await response.json();

        // 받아온 데이터로 화면을 그림
        render(gameState);
    } catch (error) {
        messageBox.textContent = error.message;

    }
}

initGame();