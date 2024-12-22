// Elements
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');
const gameArea = document.getElementById('game-area');
const rulesDisplay = document.getElementById('rules');
const startBtn = document.getElementById('start-btn');
const tokcoinDisplay = document.getElementById('tokcoin');

// Variables
let score = 0;
let playerPosition = 125; // Initial player position
let tokcoins = 5; // Starting TokCoins
const playerWidth = 50;
const gameAreaWidth = 300;
const gameAreaHeight = 500;
const itemWidth = 30;
let gameInterval;
let isGameOver = false;
let items = []; // Array to store falling items
let spawnRate = 1000; // Start with 1 second between items
let speedIncreaseThresholds = [100, 1000, 2000]; // Thresholds for speed increase

// Start Game
function startGame() {
    if (tokcoins <= 0) {
        alert("You don't have any TokCoins left! You cannot play.");
        return;
    }

    tokcoins--; // Deduct 1 TokCoin each time the game starts
    tokcoinDisplay.textContent = `TokCoins: ${tokcoins}`;

    score = 0;
    playerPosition = 125;
    isGameOver = false;
    items = [];
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverDisplay.style.display = 'none';
    player.style.left = `${playerPosition}px`;

    gameInterval = setInterval(spawnItem, spawnRate); // Spawn items every 1 second initially
    rulesDisplay.style.display = 'none'; // Hide rules when game starts
}

// End Game
function endGame(message) {
    clearInterval(gameInterval);
    items.forEach((item) => {
        if (gameArea.contains(item)) {
            gameArea.removeChild(item);
        }
    });
    items = []; // Clear all items
    isGameOver = true;
    gameOverDisplay.style.display = 'block';
}

// Restart Game
restartBtn.addEventListener('click', () => {
    startGame();
});

// Start Button Click (from Rules Display)
startBtn.addEventListener('click', () => {
    startGame();
});

// Spawn an Item
function spawnItem() {
    if (isGameOver) return;

    const item = document.createElement('div');
    const isBadItem = Math.random() < 0.2; // 20% chance of spawning a bad item
    const isSpecialBadItem = Math.random() < 0.1; // 10% chance of spawning a new, harder bad item

    item.classList.add('item');
    item.style.left = `${Math.random() * (gameAreaWidth - itemWidth)}px`;
    item.style.top = '0px';
    item.style.backgroundColor = isBadItem ? (isSpecialBadItem ? 'black' : 'gray') : 'gold'; // Black is a harder bad item
    item.dataset.bad = isBadItem; // Flag bad items
    gameArea.appendChild(item);
    items.push(item);

    moveItem(item);

    // Increase the speed as the score increases
    if (score >= speedIncreaseThresholds[0]) {
        spawnRate = 800; // Increase speed when score reaches 100
    }
    if (score >= speedIncreaseThresholds[1]) {
        spawnRate = 600; // Increase speed when score reaches 1000
    }
    if (score >= speedIncreaseThresholds[2]) {
        spawnRate = 400; // Increase speed when score reaches 2000
    }
    clearInterval(gameInterval);
    gameInterval = setInterval(spawnItem, spawnRate); // Restart interval with new spawn rate
}

// Move Item
function moveItem(item) {
    const itemInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(itemInterval);
            return;
        }

        const itemTop = parseInt(window.getComputedStyle(item).top) || 0;
        const itemLeft = parseInt(window.getComputedStyle(item).left);

        // If the item reaches the bottom of the game area
        if (itemTop >= gameAreaHeight - 50) {
            // Check collision with player
            if (itemLeft > playerPosition && itemLeft < playerPosition + playerWidth) {
                if (item.dataset.bad === 'true') {
                    // Player collected a bad item
                    clearInterval(itemInterval);
                    gameArea.removeChild(item);
                    endGame('You caught a bad item!');
                } else {
                    // Player collected a gift
                    score++;
                    scoreDisplay.textContent = `Score: ${score}`;
                    clearInterval(itemInterval);
                    gameArea.removeChild(item);
                }
            } else {
                clearInterval(itemInterval);
                gameArea.removeChild(item);
            }
        } else {
            item.style.top = `${itemTop + 5}px`;
        }
    }, 50); // Move items every 50ms
}

// Player Movement
document.addEventListener('keydown', (e) => {
    if (isGameOver) return;

    if (e.key === 'ArrowLeft' && playerPosition > 0) {
        playerPosition -= 10;
        player.style.left = `${playerPosition}px`;
    }
    if (e.key === 'ArrowRight' && playerPosition < gameAreaWidth - playerWidth) {
        playerPosition += 10;
        player.style.left = `${playerPosition}px`;
    }
});

