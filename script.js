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

    item.classList.add('item');
    item.style.left = `${Math.random() * (gameAreaWidth - itemWidth)}px`;
    item.style.top = '0px';
    item.style.backgroundColor = isBadItem ? 'gray' : 'gold'; // Bad items are gray
    item.dataset.bad = isBadItem; // Flag bad items
    gameArea.appendChild(item);
    items.push(item);

    moveItem(item);
}

// Move Item
function moveItem(item) {
    const itemInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(itemInterval);
            return;
        }

        const itemTop = parseFloat(item.style.top);
        item.style.top = `${itemTop + 5}px`; // Item falls down

        if (itemTop + itemWidth >= gameAreaHeight) {
            // Remove item from the game if it reaches the bottom
            gameArea.removeChild(item);
            items = items.filter((i) => i !== item); // Remove item from array
            clearInterval(itemInterval);
        }

        // Collision detection
        if (
            parseFloat(item.style.top) + itemWidth >= gameAreaHeight - 50 && // Item has reached player level
            parseFloat(item.style.left) + itemWidth >= playerPosition && // Item is within player's horizontal range
            parseFloat(item.style.left) <= playerPosition + playerWidth
        ) {
            if (item.dataset.bad === "true") {
                // If the item is bad, end the game
                endGame('Game Over! 🎅 You caught a bad item!');
            } else {
                // If the item is good, increase score
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
                gameArea.removeChild(item);
                items = items.filter((i) => i !== item); // Remove item from array
                clearInterval(itemInterval);
            }
        }
    }, 50);
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

// Keyboard Controls (for Desktop)
document.addEventListener('keydown', (event) => {
    if (isGameOver) return;

    if (event.key === 'ArrowLeft' && playerPosition > 0) {
        playerPosition -= 10;
        player.style.left = `${playerPosition}px`;
    }
    if (event.key === 'ArrowRight' && playerPosition < gameAreaWidth - playerWidth) {
        playerPosition += 10;
        player.style.left = `${playerPosition}px`;
    }
});

// Touch Controls (for Mobile)
document.addEventListener('touchstart', (event) => {
    if (isGameOver) return;
    const touchStartX = event.touches[0].clientX;

    document.addEventListener('touchmove', (event) => {
        const touchMoveX = event.touches[0].clientX;
        if (touchMoveX < touchStartX && playerPosition > 0) {
            playerPosition -= 10;
        } else if (touchMoveX > touchStartX && playerPosition < gameAreaWidth - playerWidth) {
            playerPosition += 10;
        }
        player.style.left = `${playerPosition}px`;
    });
});
