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
 * Placeholder for future implementation (snake movement, collision, etc.)
 */
function updateGameLogic() {
    // Placeholder - will be implemented in future tasks
    // This is where snake movement, collision detection, etc. will go
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
 * Render the game (placeholder)
 * Will be fully implemented in rendering task
 */
function renderGame() {
    // Placeholder - will be implemented in future tasks
    ctx.fillStyle = COLORS.text;
    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Game View (to be implemented)', 10, 30);
    ctx.fillText(`State: ${stateManager.currentState}`, 10, 50);
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

    ctx.font = '18px monospace';
    ctx.fillText('Press SPACE to Restart', canvas.width / 2, canvas.height / 2);
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
// INPUT HANDLING (Basic state transitions for testing)
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
            if (key === ' ') {
                stateManager.transition(GameStates.PAUSED);
            } else if (key === 'Escape') {
                stateManager.transition(GameStates.START);
            }
            // Arrow keys will be handled in snake movement task
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
