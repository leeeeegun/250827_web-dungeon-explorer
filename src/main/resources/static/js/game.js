const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const playerIconEl = document.getElementById('player-icon');

const TILE_SIZE = 32;
canvas.width = TILE_SIZE * 25; // 800
canvas.height = TILE_SIZE * 18; // 576

let gameState = 'MENU';
let keys = {};
const GRAVITY = 0.6;
let score = 0;

// 이미지 및 에셋 로드
const spriteSheet = document.getElementById('spritesheet');
const SPRITES = {
    player_stand: { x: 0, y: 0, w: 16, h: 16 },
    ground: { x: 0, y: 16, w: 16, h: 16 },
    block: { x: 16, y: 16, w: 16, h: 16 },
    monster: { x: 32, y: 16, w: 16, h: 16 },
    boss_dragon: { x: 0, y: 32, w: 32, h: 32 }
};
playerIconEl.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAIRJREFUOE9jZKAQMFKon4F4LxC/A/F/IM4FYjE0fBqI/wHxXyCOAWIBNA8D8V8gTgViITQ8GsS/gfg/EDfgBMjA8GkQ/wfiP0AcD8QimACmBQNpQPwPiAOB+C8Q/wXif0A8D4j9wGYwABY7A/F/IP4PxA1A/A+I/wHxHyAOA2IBAKo8eUT8oBsmAAAAAElFTSuQmCC';

// 타일맵 정의
const TILEMAP = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];
const MAP_WIDTH = TILEMAP[0].length * TILE_SIZE;
const MAP_HEIGHT = TILEMAP.length;

// 게임 객체 클래스
class Player {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.width = TILE_SIZE; this.height = TILE_SIZE;
        this.vx = 0; this.vy = 0;
        this.speed = 4;
        this.jumpPower = 15;
        this.onGround = false;
        this.lives = 3;
        this.hp = 100;
        this.maxHp = 100;
        this.attackPower = 20;
        this.invincibleTimer = 0; // ✨ 피격 후 무적 시간 타이머
    }

    draw() {
        // 무적 상태일 때 깜빡이는 효과
        if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer / 6) % 2 === 0) {
            return;
        }
        const sprite = SPRITES.player_stand;
        ctx.drawImage(spriteSheet, sprite.x, sprite.y, sprite.w, sprite.h, this.x - camera.x, this.y, this.width, this.height);
    }

    update() {
        if (this.invincibleTimer > 0) this.invincibleTimer--;

        if (keys['ArrowLeft'] || keys['a']) this.vx = -this.speed;
        else if (keys['ArrowRight'] || keys['d']) this.vx = this.speed;
        else this.vx = 0;
        this.x += this.vx;

        this.vy += GRAVITY;
        this.y += this.vy;
        this.onGround = false;

        // 맵과의 충돌 처리 (간단한 버전)
        const playerRow = Math.floor((this.y + this.height) / TILE_SIZE);
        const playerCol = Math.floor((this.x + this.width / 2) / TILE_SIZE);
        if (TILEMAP[playerRow] && TILEMAP[playerRow][playerCol] > 0) {
            this.y = playerRow * TILE_SIZE - this.height;
            this.vy = 0;
            this.onGround = true;
        }
    }

    jump() {
        if (this.onGround) {
            this.vy = -this.jumpPower;
            this.onGround = false;
        }
    }

    takeDamage(damage) {
        // 무적 상태가 아닐 때만 피해를 입음
        if (this.invincibleTimer <= 0) {
            this.hp -= damage;
            this.invincibleTimer = 120; // 2초간 무적 (60fps 기준)
            if (this.hp <= 0) {
                this.hp = 0;
                this.die();
            }
        }
    }

    die() {
        this.lives--;
        updateUI();
        if (this.lives > 0) {
            // 스테이지 처음에서 부활
            this.x = 100;
            this.y = 300;
            this.hp = this.maxHp;
            this.vy = 0;
        } else {
            gameState = 'GAME_OVER';
        }
    }
}

class Boss {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.width = TILE_SIZE * 2; this.height = TILE_SIZE * 2; // 보스는 2x2 크기
        this.hp = 300;
        this.attackPower = 25; // 보스는 공격력이 더 셈
    }

    draw() {
        const sprite = SPRITES.boss_dragon;
        ctx.drawImage(spriteSheet, sprite.x, sprite.y, sprite.w, sprite.h, this.x - camera.x, this.y, this.width, this.height);
    }

    update() {
        // (나중에 복잡한 패턴 추가 가능)
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            gameState = 'WIN'; // 보스가 죽으면 승리!
        }
    }
}

// 게임 로직
let player;
let boss;
let camera = { x: 0, y: 0 };

function init() {
    player = new Player(100, 300);
    // 맵의 끝 부분에 보스 배치
    boss = new Boss(MAP_WIDTH - TILE_SIZE * 5, MAP_HEIGHT * TILE_SIZE - TILE_SIZE * 7);
    score = 0;
    updateUI();
    gameState = 'PLAYING';
}

function update() {
    if (gameState !== 'PLAYING') return;

    player.update();
    if (boss) boss.update();

    // 충돌 및 전투 로직
    if (boss && boss.hp > 0) {
        // 플레이어가 보스를 밟아서 공격
        if (checkCollision(player, boss) && player.vy > 0) {
            boss.takeDamage(player.attackPower);
            player.vy = -player.jumpPower / 1.5; // 밟고 살짝 튀어오름
        }
        // 보스가 플레이어에게 닿아서 공격
        else if (checkCollision(player, boss)) {
            player.takeDamage(boss.attackPower);
        }
    }

    camera.x = player.x - canvas.width / 3;
    if (camera.x < 0) camera.x = 0;
    if (camera.x + canvas.width > MAP_WIDTH) camera.x = MAP_WIDTH - canvas.width;

    updateUI();
}

function draw() {
    ctx.fillStyle = '#5c94fc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawMap();
    if (player) player.draw();
    if (boss) boss.draw();
}

function drawMap() {

    for (let row = 0; row < TILEMAP.length; row++) {
        for (let col = 0; col < TILEMAP[0].length; col++) {
            const tile = TILEMAP[row][col];
            let sprite;
            if (tile === 1) sprite = SPRITES.ground;
            else if (tile === 2) sprite = SPRITES.block;
            else continue;

            ctx.drawImage(spriteSheet, sprite.x, sprite.y, sprite.w, sprite.h,
                col * TILE_SIZE - camera.x, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

function updateUI() {
    scoreEl.textContent = String(score).padStart(6, '0');
    livesEl.textContent = `x ${player ? player.lives : 3}`;
}

// 충돌 감지 헬퍼 함수
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
}

// 메인 메뉴 및 게임 루프
function drawMenu(text, subtext) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = "48px 'Press Start 2P'";
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 3);
    ctx.font = "24px 'Press Start 2P'";
    ctx.fillText(subtext, canvas.width / 2, canvas.height / 2);
}

function gameLoop() {
    if (gameState === 'MENU') {
        drawMenu("Retro Dungeon", "Press ENTER to Start");
    } else if (gameState === 'PLAYING') {
        update();
        draw();
    } else if (gameState === 'GAME_OVER') {
        drawMenu("GAME OVER", "Press ENTER to Restart");
    } else if (gameState === 'WIN') {
        drawMenu("YOU WIN!", "Press ENTER to Restart");
    }
    requestAnimationFrame(gameLoop);
}

// 이벤트 리스너
window.addEventListener('keydown', (e) => {
    if ((gameState === 'MENU' || gameState === 'GAME_OVER' || gameState === 'WIN') && e.key === 'Enter') {
        init();
    }
    keys[e.key] = true;
    if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') && gameState === 'PLAYING') {
        e.preventDefault();
        player.jump();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// 게임 시작
spriteSheet.onload = gameLoop;
if (spriteSheet.complete) spriteSheet.onload();
