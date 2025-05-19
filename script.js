const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restart-btn");
const instructions = document.getElementById("instructions");
const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const difficultySelect = document.getElementById("difficulty");

const gridSize = 20;
const cols = canvas.width / gridSize;
const rows = canvas.height / gridSize;

let player = { x: 1, y: 1, color: "green", size: gridSize };
let goal = { x: cols - 2, y: rows - 2, color: "red", size: gridSize };
let walls = [];
let mazeCompleted = false;
let currentDifficulty = 'medium'; // Default difficulty

const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
};

// Initialize maze based on difficulty
function generateMaze() {
    walls = [];
    let wallDensity;

    switch (currentDifficulty) {
        case 'easy':
            wallDensity = 0.2;
            break;
        case 'medium':
            wallDensity = 0.3;
            break;
        case 'hard':
            wallDensity = 0.6;  // Increased difficulty for hard level
            break;
        default:
            wallDensity = 0.3;
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (Math.random() < wallDensity && (i !== 0 || j !== 0) && (i !== rows - 1 || j !== cols - 1)) {
                walls.push({ x: j, y: i });
            }
        }
    }
}

// Draw the player and the goal
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x * gridSize, player.y * gridSize, gridSize, gridSize);

    // Draw the goal
    ctx.fillStyle = goal.color;
    ctx.fillRect(goal.x * gridSize, goal.y * gridSize, gridSize, gridSize);
}

// Check if player collides with walls
function checkCollision(newX, newY) {
    return walls.some(wall => wall.x === newX && wall.y === newY);
}

// Check if the player reaches the goal
function checkGoal() {
    return player.x === goal.x && player.y === goal.y;
}

// Move player based on direction
function movePlayer(direction) {
    if (mazeCompleted) return;

    const newPlayerX = player.x + direction.x;
    const newPlayerY = player.y + direction.y;

    // Only move if there is no collision with walls
    if (newPlayerX >= 0 && newPlayerX < cols && newPlayerY >= 0 && newPlayerY < rows && !checkCollision(newPlayerX, newPlayerY)) {
        player.x = newPlayerX;
        player.y = newPlayerY;
    }

    // Check if player reaches goal
    if (checkGoal()) {
        mazeCompleted = true;
        instructions.textContent = "You won! Press restart to play again!";
        restartButton.style.display = "inline-block";
    }

    drawMaze();
}

// Restart the game
function restartGame() {
    player.x = 1;
    player.y = 1;
    mazeCompleted = false;
    instructions.textContent = "Use the buttons or arrow keys to navigate the maze. Find the exit!";
    restartButton.style.display = "none";
    generateMaze();
    drawMaze();
}

// Change difficulty level
difficultySelect.addEventListener("change", (event) => {
    currentDifficulty = event.target.value;
    restartGame();
});

// Add event listeners for the buttons
upButton.addEventListener("click", () => movePlayer(directions.ArrowUp));
downButton.addEventListener("click", () => movePlayer(directions.ArrowDown));
leftButton.addEventListener("click", () => movePlayer(directions.ArrowLeft));
rightButton.addEventListener("click", () => movePlayer(directions.ArrowRight));

restartButton.addEventListener("click", restartGame);

// Keyboard controls
window.addEventListener("keydown", (event) => {
    if (event.key in directions) {
        movePlayer(directions[event.key]);
    }
});

// Start the game
generateMaze();
drawMaze();
