# Snake Game

Classic snake game built with vanilla JavaScript and HTML5 Canvas.

## Description

A retro-style browser-based snake game featuring classic gameplay mechanics, progressive difficulty, and local leaderboard tracking. Built with pure JavaScript without any frameworks or external dependencies.

## How to Run

### Option 1: Direct File Access
1. Open `index.html` in a modern web browser
2. Start playing!

### Option 2: Local Server (Recommended for development)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Then open http://localhost:8000 in your browser
```

## Browser Compatibility

Requires a modern browser with HTML5 Canvas support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## File Structure

```
snake-game/
├── index.html      # Main HTML structure
├── styles.css      # Visual styling
├── game.js         # Game logic and rendering
└── README.md       # This file
```

## Development Status

**Current Progress:** Project structure initialized ✓

**Next Steps:**
- Implement core game loop
- Add snake movement logic
- Implement collision detection
- Add food generation
- Create game states (start, playing, pause, game over)
- Implement leaderboard

## Technical Details

- **Framework:** None (Vanilla JavaScript)
- **Rendering:** HTML5 Canvas API
- **Storage:** localStorage for leaderboard
- **Performance:** Target 60fps with requestAnimationFrame
- **Bundle Size:** <100KB total

## License

[To be determined]

## Credits

Generated with Claude Code as part of a classic game implementation exercise.
