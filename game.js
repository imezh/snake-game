/**
 * Snake Game - Main Game Logic
 * Classic snake game with HTML5 Canvas
 */

// Game Configuration Constants
const GRID_SIZE = 20;        // 20x20 grid
const CELL_SIZE = 25;        // Each cell is 25x25 pixels
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE; // 500x500 pixels

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

// Get Canvas and Context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Verify canvas is accessible
if (!canvas || !ctx) {
    console.error('Canvas not found or context unavailable');
} else {
    console.log('✓ Canvas initialized successfully');
    console.log(`Canvas size: ${canvas.width}x${canvas.height}`);

    // Basic canvas test - draw a colored rectangle
    ctx.fillStyle = COLORS.snake;
    ctx.fillRect(50, 50, 100, 100);

    ctx.fillStyle = COLORS.text;
    ctx.font = '16px monospace';
    ctx.fillText('Canvas Test: Rectangle Drawn', 60, 90);

    console.log('✓ Basic canvas drawing test passed');
}

// Module structure scaffold (to be implemented in future tasks)
const Game = {
    init() {
        console.log('Game module ready for implementation');
    }
};

// Initialize on load
window.addEventListener('load', () => {
    console.log('Snake Game loaded successfully');
    Game.init();
});
