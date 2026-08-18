const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const restartButton = document.getElementById("restart");

let playerX = 230;
let score = 0;
let gameRunning = true;

const playerSpeed = 7;
const bugSpeed = 3;

const keys = {
    ArrowLeft: false,
    ArrowRight: false
};

document.addEventListener("keydown", (event) => {
    if (event.key in keys) {
        keys[event.key] = true;
        event.preventDefault();
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key in keys) {
        keys[event.key] = false;
    }
});

function movePlayer() {
    if (!gameRunning) return;

    if (keys.ArrowLeft) {
        playerX -= playerSpeed;
    }

    if (keys.ArrowRight) {
        playerX += playerSpeed;
    }

    // Keep player inside the game area
    playerX = Math.max(
        0,
        Math.min(playerX, game.clientWidth - player.offsetWidth)
    );

    player.style.left = `${playerX}px`;
}

function createBug() {
    if (!gameRunning) return;

    const bug = document.createElement("div");
    bug.classList.add("bug");

    const maxX = game.clientWidth - 30;
    bug.style.left = `${Math.random() * maxX}px`;
    bug.style.top = "-30px";

    game.appendChild(bug);

    let bugY = -30;

    function moveBug() {
        if (!gameRunning) {
            bug.remove();
            return;
        }

        bugY += bugSpeed;
        bug.style.top = `${bugY}px`;

        if (checkCollision(player, bug)) {
            endGame();
            return;
        }

        // Remove bug after it leaves the screen
        if (bugY > game.clientHeight) {
            bug.remove();
            return;
        }

        requestAnimationFrame(moveBug);
    }

    requestAnimationFrame(moveBug);
}

function checkCollision(player, bug) {
    const playerRect = player.getBoundingClientRect();
    const bugRect = bug.getBoundingClientRect();

    return (
        playerRect.left < bugRect.right &&
        playerRect.right > bugRect.left &&
        playerRect.top < bugRect.bottom &&
        playerRect.bottom > bugRect.top
    );
}

function increaseScore() {
    if (!gameRunning) return;

    score++;
    scoreDisplay.textContent = score;
}

function endGame() {
    gameRunning = false;

    finalScore.textContent = score;
    gameOverScreen.classList.remove("hidden");
}

function restartGame() {
    // Remove all bugs
    document.querySelectorAll(".bug").forEach((bug) => bug.remove());

    playerX = 230;
    score = 0;
    gameRunning = true;

    player.style.left = `${playerX}px`;
    scoreDisplay.textContent = score;
    gameOverScreen.classList.add("hidden");
}

restartButton.addEventListener("click", restartGame);

// Game loop for player movement
function gameLoop() {
    movePlayer();

    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();

// Create bugs periodically
setInterval(createBug, 800);

// Increase score every second
setInterval(increaseScore, 1000);
