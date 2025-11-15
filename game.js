/**
 * Snake Game - Main Game Logic
 * Classic snake game with HTML5 Canvas
 */

// ============================================================================
// GAME CONFIGURATION CONSTANTS
// ============================================================================

const GRID_SIZE = 20;        // 20x20 grid
const CELL_SIZE = 25;        // Each cell is 25x25 pixels
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE; // 500x500 pixels

// Game Loop Configuration
const FPS = 60;
const FRAME_DURATION = 1000 / FPS;
const GAME_SPEED = 150;     // ms per game tick (initial speed)

// Color Palette (Retro Style)
const COLORS = {
    background: '#1a1a2e',
    snake: '#00ff41',
    snakeHead: '#00ff41',
    snakeBody: '#00dd33',
    food: '#ff006e',
    grid: '#2a2a2a',
    text: '#ffffff'
};

// ============================================================================
// CANVAS SETUP
// ============================================================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Verify canvas is accessible
if (!canvas || !ctx) {
    console.error('Canvas not found or context unavailable');
    throw new Error('Failed to initialize canvas');
}

console.log('✓ Canvas initialized successfully');
console.log(`Canvas size: ${canvas.width}x${canvas.height}`);

// ============================================================================
// STATE MACHINE
// ============================================================================

/**
 * Game States
 * Defines all possible game states
 */
const GameStates = {
    START: 'start',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};

/**
 * State Manager
 * Manages game state transitions and lifecycle
 */
const stateManager = {
    currentState: GameStates.START,

    /**
     * Transition to a new state
     * @param {string} newState - The target state
     */
    transition(newState) {
        if (this.isValidTransition(newState)) {
            console.log(`State transition: ${this.currentState} → ${newState}`);
            this.onExit(this.currentState);
            this.currentState = newState;
            this.onEnter(newState);
        } else {
            console.warn(`Invalid state transition: ${this.currentState} → ${newState}`);
        }
    },

    /**
     * Validate if transition is allowed
     * @param {string} newState - The target state
     * @returns {boolean} True if transition is valid
     */
    isValidTransition(newState) {
        // All transitions are currently valid
        // Can add specific rules here if needed
        return Object.values(GameStates).includes(newState);
    },

    /**
     * Called when entering a state
     * @param {string} state - The state being entered
     */
    onEnter(state) {
        switch (state) {
            case GameStates.START:
                console.log('Entered START state');
                break;
            case GameStates.PLAYING:
                console.log('Entered PLAYING state');
                // Initialize game when entering PLAYING state
                score = 0;
                initSnake();
                generateFood();
                break;
            case GameStates.PAUSED:
                console.log('Entered PAUSED state');
                break;
            case GameStates.GAME_OVER:
                console.log('Entered GAME_OVER state');
                break;
        }
    },

    /**
     * Called when exiting a state
     * @param {string} state - The state being exited
     */
    onExit(state) {
        switch (state) {
            case GameStates.START:
                console.log('Exiting START state');
                break;
            case GameStates.PLAYING:
                console.log('Exiting PLAYING state');
                break;
            case GameStates.PAUSED:
                console.log('Exiting PAUSED state');
                break;
            case GameStates.GAME_OVER:
                console.log('Exiting GAME_OVER state');
                break;
        }
    }
};

// ============================================================================
// SNAKE DATA STRUCTURE
// ============================================================================

/**
 * Snake Object
 * Stores the snake's position, direction, and state
 */
const snake = {
    segments: [],                    // Array of {x, y} coordinates
    direction: {x: 1, y: 0},        // Current direction (right)
    nextDirection: {x: 1, y: 0},    // Queued direction
    growing: false                   // Growth flag
};

/**
 * Input Queue
 * Prevents multiple direction changes per game tick
 */
const inputQueue = [];

/**
 * Initialize snake at center of grid
 */
function initSnake() {
    const centerX = Math.floor(GRID_SIZE / 2);
    const centerY = Math.floor(GRID_SIZE / 2);

    snake.segments = [
        {x: centerX, y: centerY},       // head
        {x: centerX - 1, y: centerY},   // body
        {x: centerX - 2, y: centerY}    // tail
    ];
    snake.direction = {x: 1, y: 0};  // moving right
    snake.nextDirection = {x: 1, y: 0};
    snake.growing = false;

    // Clear input queue
    inputQueue.length = 0;

    console.log('✓ Snake initialized at center:', snake.segments[0]);
}

/**
 * Move snake one step in current direction
 */
function moveSnake() {
    // Process input queue (take first queued direction)
    if (inputQueue.length > 0) {
        snake.nextDirection = inputQueue.shift();
    }

    // Update current direction
    snake.direction = snake.nextDirection;

    // Calculate new head position
    const head = snake.segments[0];
    const newHead = {
        x: head.x + snake.direction.x,
        y: head.y + snake.direction.y
    };

    // Add new head at the front
    snake.segments.unshift(newHead);

    // Remove tail (unless growing)
    if (!snake.growing) {
        snake.segments.pop();
    } else {
        snake.growing = false;
    }
}

/**
 * Grow the snake by one segment
 */
function growSnake() {
    snake.growing = true;
}

/**
 * Check if a direction change is valid (prevent reversing)
 * @param {object} newDirection - The new direction {x, y}
 * @returns {boolean} True if direction change is valid
 */
function isValidDirection(newDirection) {
    const currentDir = snake.direction;

    // Prevent reversing direction (e.g., can't go left when moving right)
    return !(newDirection.x === -currentDir.x && newDirection.y === -currentDir.y);
}

/**
 * Queue a direction change
 * @param {object} direction - Direction to queue {x, y}
 */
function queueDirection(direction) {
    // Only queue if valid and queue isn't full
    if (isValidDirection(direction) && inputQueue.length < 2) {
        inputQueue.push(direction);
    }
}

// ============================================================================
// FOOD SYSTEM
// ============================================================================

/**
 * Food Object
 * Stores the current food position
 */
let food = null;

/**
 * Score Tracking
 */
let score = 0;

/**
 * Generate food at random valid position
 * Ensures food never spawns on snake body
 */
function generateFood() {
    let newFood;
    let validPosition = false;
    let attempts = 0;
    const maxAttempts = 1000; // Prevent infinite loop

    while (!validPosition && attempts < maxAttempts) {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };

        // Check if food position is on snake
        validPosition = !isOnSnake(newFood);
        attempts++;
    }

    if (validPosition) {
        food = newFood;
        console.log('✓ Food generated at:', food);
    } else {
        console.warn('Failed to generate food - grid may be full');
    }
}

/**
 * Check if a position is occupied by snake
 * @param {object} position - Position to check {x, y}
 * @returns {boolean} True if position is on snake
 */
function isOnSnake(position) {
    return snake.segments.some(segment =>
        segment.x === position.x && segment.y === position.y
    );
}

/**
 * Check if snake head collides with food
 */
function checkFoodCollision() {
    if (!food) return;

    const head = snake.segments[0];

    if (head.x === food.x && head.y === food.y) {
        consumeFood();
    }
}

/**
 * Handle food consumption
 * Increases score, grows snake, generates new food
 */
function consumeFood() {
    score += 10;
    growSnake();
    generateFood();
    console.log(`✓ Food consumed! Score: ${score}`);
}

// ============================================================================
// COLLISION DETECTION
// ============================================================================

/**
 * Check if snake head hits wall
 * @returns {boolean} True if wall collision detected
 */
function checkWallCollision() {
    const head = snake.segments[0];

    return (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
    );
}

/**
 * Check if snake head hits its own body
 * @returns {boolean} True if self-collision detected
 */
function checkSelfCollision() {
    const head = snake.segments[0];

    // Check if head collides with any body segment (skip head itself at index 0)
    for (let i = 1; i < snake.segments.length; i++) {
        if (head.x === snake.segments[i].x && head.y === snake.segments[i].y) {
            return true;
        }
    }

    return false;
}

/**
 * Check all collision types
 * Triggers game over if collision detected
 */
function checkCollisions() {
    if (checkWallCollision()) {
        console.log('✗ Wall collision detected');
        gameOver();
        return;
    }

    if (checkSelfCollision()) {
        console.log('✗ Self-collision detected');
        gameOver();
        return;
    }
}

/**
 * Handle game over
 * Transitions to GAME_OVER state
 */
function gameOver() {
    console.log(`Game Over! Final Score: ${score}`);
    stateManager.transition(GameStates.GAME_OVER);
}

// ============================================================================
// GAME LOOP VARIABLES
// ============================================================================

let lastFrameTime = 0;
let accumulator = 0;
let currentSpeed = GAME_SPEED;
let isRunning = false;

// ============================================================================
// UPDATE FUNCTION
// ============================================================================

/**
 * Update game logic based on current state
 * Called at fixed time-step intervals
 */
function update() {
    switch (stateManager.currentState) {
        case GameStates.PLAYING:
            updateGameLogic();
            break;
        case GameStates.PAUSED:
            // No updates while paused
            break;
        case GameStates.START:
        case GameStates.GAME_OVER:
            // No game logic updates in these states
            break;
    }
}

/**
 * Update game logic during PLAYING state
 */
function updateGameLogic() {
    // Move the snake
    moveSnake();

    // Check for food collision and consumption
    checkFoodCollision();

    // Check for wall and self collisions
    checkCollisions();
}

// ============================================================================
// RENDER FUNCTIONS
// ============================================================================

/**
 * Clear the canvas
 */
function clearCanvas() {
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Main render function
 * Renders appropriate screen based on current state
 */
function render() {
    clearCanvas();

    switch (stateManager.currentState) {
        case GameStates.START:
            renderStartScreen();
            break;
        case GameStates.PLAYING:
            renderGame();
            break;
        case GameStates.PAUSED:
            renderGame();
            renderPauseOverlay();
            break;
        case GameStates.GAME_OVER:
            renderGameOverScreen();
            break;
    }
}

/**
 * Render the start screen
 */
function renderStartScreen() {
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SNAKE GAME', canvas.width / 2, canvas.height / 3);

    ctx.font = '20px monospace';
    ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height / 2);

    ctx.font = '14px monospace';
    ctx.fillText('Use Arrow Keys to Move', canvas.width / 2, canvas.height / 1.5);
}

/**
 * Render the snake
 */
function drawSnake() {
    snake.segments.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? COLORS.snakeHead : COLORS.snakeBody;

        // Draw segment as filled rectangle
        ctx.fillRect(
            segment.x * CELL_SIZE,
            segment.y * CELL_SIZE,
            CELL_SIZE - 1, // -1 for pixel art gap
            CELL_SIZE - 1
        );

        // Optional: Add border for pixel art effect
        if (isHead) {
            ctx.strokeStyle = '#009922';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                segment.x * CELL_SIZE,
                segment.y * CELL_SIZE,
                CELL_SIZE - 1,
                CELL_SIZE - 1
            );
        }
    });
}

/**
 * Render the food
 */
function drawFood() {
    if (!food) return;

    ctx.fillStyle = COLORS.food;

    // Draw food as filled circle for visual distinction
    const centerX = food.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = food.y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Add highlight for 3D effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(centerX - radius / 3, centerY - radius / 3, radius / 3, 0, Math.PI * 2);
    ctx.fill();
}

/**
 * Render the game
 */
function renderGame() {
    // Draw the snake
    drawSnake();

    // Draw the food
    drawFood();

    // Draw score
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Draw debug info
    ctx.font = '14px monospace';
    ctx.fillText(`Length: ${snake.segments.length}`, 10, 55);
}

/**
 * Render pause overlay
 */
function renderPauseOverlay() {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);

    ctx.font = '18px monospace';
    ctx.fillText('Press SPACE to Resume', canvas.width / 2, canvas.height / 2 + 40);
}

/**
 * Render game over screen
 */
function renderGameOverScreen() {
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 42px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 3);

    ctx.font = 'bold 24px monospace';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2);

    ctx.font = '18px monospace';
    ctx.fillText('Press SPACE to Restart', canvas.width / 2, canvas.height / 1.6);
}

// ============================================================================
// GAME LOOP
// ============================================================================

/**
 * Main Game Loop
 * Uses requestAnimationFrame for smooth 60fps rendering
 * Implements fixed time-step for consistent gameplay
 * @param {number} currentTime - Timestamp from requestAnimationFrame
 */
function gameLoop(currentTime) {
    if (!isRunning) return;

    // Request next frame
    requestAnimationFrame(gameLoop);

    // Calculate delta time since last frame
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    // Accumulate time for fixed time-step updates
    accumulator += deltaTime;

    // Update game logic at fixed intervals (currentSpeed)
    // This ensures consistent gameplay regardless of frame rate
    while (accumulator >= currentSpeed) {
        update();
        accumulator -= currentSpeed;
    }

    // Render current game state
    render();
}

/**
 * Start the game loop
 */
function startGameLoop() {
    if (!isRunning) {
        isRunning = true;
        lastFrameTime = performance.now();
        accumulator = 0;
        requestAnimationFrame(gameLoop);
        console.log('✓ Game loop started');
    }
}

/**
 * Stop the game loop
 */
function stopGameLoop() {
    isRunning = false;
    console.log('✓ Game loop stopped');
}

// ============================================================================
// INPUT HANDLING
// ============================================================================

/**
 * Handle keyboard input
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyPress(event) {
    const key = event.key;

    // Prevent default behavior for game keys
    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape'].includes(key)) {
        event.preventDefault();
    }

    switch (stateManager.currentState) {
        case GameStates.START:
            if (key === ' ') {
                stateManager.transition(GameStates.PLAYING);
            }
            break;

        case GameStates.PLAYING:
            // Handle arrow keys
            if (key === 'ArrowUp') {
                queueDirection({x: 0, y: -1});
            } else if (key === 'ArrowDown') {
                queueDirection({x: 0, y: 1});
            } else if (key === 'ArrowLeft') {
                queueDirection({x: -1, y: 0});
            } else if (key === 'ArrowRight') {
                queueDirection({x: 1, y: 0});
            } else if (key === ' ') {
                stateManager.transition(GameStates.PAUSED);
            } else if (key === 'Escape') {
                stateManager.transition(GameStates.START);
            }
            break;

        case GameStates.PAUSED:
            if (key === ' ') {
                stateManager.transition(GameStates.PLAYING);
            } else if (key === 'Escape') {
                stateManager.transition(GameStates.START);
            }
            break;

        case GameStates.GAME_OVER:
            if (key === ' ') {
                stateManager.transition(GameStates.START);
            }
            break;
    }
}

// Attach keyboard listener
document.addEventListener('keydown', handleKeyPress);

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the game
 */
function init() {
    console.log('✓ Initializing Snake Game');
    console.log(`  - Grid Size: ${GRID_SIZE}x${GRID_SIZE}`);
    console.log(`  - Cell Size: ${CELL_SIZE}px`);
    console.log(`  - Canvas Size: ${CANVAS_SIZE}x${CANVAS_SIZE}px`);
    console.log(`  - Target FPS: ${FPS}`);
    console.log(`  - Game Speed: ${GAME_SPEED}ms per tick`);

    // Set initial state
    stateManager.currentState = GameStates.START;

    // Start the game loop
    startGameLoop();

    // Initial render
    render();

    console.log('✓ Game initialized successfully');
    console.log('  Press SPACE to start playing');
}

// ============================================================================
// START THE GAME
// ============================================================================

// Initialize game when page loads
window.addEventListener('load', () => {
    console.log('='.repeat(50));
    console.log('SNAKE GAME - LOADING');
    console.log('='.repeat(50));
    init();
});
