// ====== Global Setup ======
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hitSound = document.getElementById('hitSound');

let hitCount = 0;
const maxHits = 3;

// Player
let player = { x: 50, y: 50, width: 30, height: 30, speed: 5 };

// Track keys
let keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// ====== Barrier Class ======
class Barrier {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

// ====== Platform Class ======
class Platform {
    constructor(x, y, width, height, dx = 0, dy = 0, barriers = []) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;
        this.barriers = barriers; // barriers attached to platform
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x < 0 || this.x + this.width > canvas.width) this.dx = -this.dx;
        if (this.y < 0 || this.y + this.height > canvas.height) this.dy = -this.dy;

        this.barriers.forEach(b => {
            b.x += this.dx;
            b.y += this.dy;
        });
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = 'red';
        this.barriers.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
    }
}

// ====== Maze Setup ======
let platforms = [
    new Platform(100, 200, 150, 20, 2, 0, [new Barrier(120, 180, 20, 20)]),
    new Platform(300, 400, 200, 20, 0, 2, [new Barrier(350, 380, 30, 30)]),
    new Platform(500, 150, 100, 20, 3, 0, [new Barrier(520, 130, 20, 20)])
];

// ====== Collision Functions ======
function isColliding(a, b) {
    return !(
        a.x + a.width < b.x ||
        a.x > b.x + b.width ||
        a.y + a.height < b.y ||
        a.y > b.y + b.height
    );
}

function checkCollisions() {
    platforms.forEach(p => {
        p.barriers.forEach(b => {
            if (isColliding(player, b)) {
                hitSound.play();
                hitCount++;

                // Push player back
                if (keys['ArrowLeft']) player.x += player.speed;
                if (keys['ArrowRight']) player.x -= player.speed;
                if (keys['ArrowUp']) player.y += player.speed;
                if (keys['ArrowDown']) player.y -= player.speed;

                // Game over
                if (hitCount >= maxHits) {
                    alert("Game Over!.");
                    window.location.reload();
                }
            }
        });
    });
}

// ====== Game Loop ======
function update() {
    // Move player
    if (keys['ArrowLeft']) player.x -= player.speed;
    if (keys['ArrowRight']) player.x += player.speed;
    if (keys['ArrowUp']) player.y -= player.speed;
    if (keys['ArrowDown']) player.y += player.speed;

    // Move platforms
    platforms.forEach(p => p.move());

    // Check collisions
    checkCollisions();

    draw();
    requestAnimationFrame(update);
}

// ====== Draw Function ======
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    platforms.forEach(p => p.draw());

    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Hits: ${hitCount}/${maxHits}`, 10, 30);
}

// ====== Start Game ======
update();
