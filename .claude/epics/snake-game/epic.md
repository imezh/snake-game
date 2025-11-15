---
name: snake-game
status: backlog
created: 2025-11-15T16:15:33Z
progress: 0%
prd: .claude/prds/snake-game.md
github: null
---

# Epic: snake-game

## Overview

Implementation of a classic browser-based snake game using vanilla JavaScript and HTML5 Canvas API. The game will be delivered as a single-page application with three core files (HTML, CSS, JS) totaling under 100KB. The technical approach emphasizes simplicity, performance (60fps), and zero external dependencies while delivering a retro pixel art aesthetic with local leaderboard persistence via localStorage.

**Core Technical Stack:**
- Vanilla JavaScript (ES6+) for game logic
- HTML5 Canvas API for rendering
- CSS3 for UI styling and layout
- localStorage for leaderboard persistence
- No build tools, frameworks, or external libraries

## Architecture Decisions

### 1. Vanilla JavaScript Over Frameworks
**Decision:** Use pure JavaScript without React, Vue, or other frameworks.
**Rationale:**
- Minimizes bundle size (target <100KB total)
- Eliminates build step complexity
- Reduces dependencies and maintenance overhead
- Sufficient for game's scope and state management needs
- Faster initial load time

### 2. Canvas-Based Rendering
**Decision:** Use HTML5 Canvas 2D context for all game rendering.
**Rationale:**
- Efficient for pixel-perfect grid-based rendering
- Direct control over frame rate and rendering loop
- Better performance than DOM manipulation for game loop
- Native support for retro pixel art aesthetic
- requestAnimationFrame integration for smooth 60fps

### 3. State Machine Pattern for Game States
**Decision:** Implement explicit state machine for game flow (START → PLAYING → PAUSED → GAME_OVER).
**Rationale:**
- Clear separation of UI and logic per state
- Simplifies input handling and rendering logic
- Easy to debug and test state transitions
- Prevents invalid state combinations

### 4. Module Pattern for Code Organization
**Decision:** Use JavaScript module pattern (or ES6 modules) to organize code into logical units.
**Rationale:**
- Separates concerns (game logic, rendering, input, storage)
- Enables independent testing of components
- Improves code maintainability
- Avoids global namespace pollution

### 5. Fixed Time-Step Game Loop
**Decision:** Implement game loop with fixed time-step and variable rendering.
**Rationale:**
- Decouples game logic from frame rate
- Ensures consistent physics/movement across devices
- Prevents game speed issues on faster/slower machines
- Industry standard for deterministic game behavior

### 6. localStorage-Only Persistence
**Decision:** Use browser localStorage exclusively for leaderboard data.
**Rationale:**
- No backend infrastructure required
- Zero latency for read/write operations
- Sufficient capacity for top 10 scores
- Meets PRD requirement for local-only leaderboards
- No privacy concerns or data collection

## Technical Approach

### Frontend Components

#### 1. Game State Manager
**Purpose:** Central state machine controlling game flow
**Responsibilities:**
- Manage game states: START, PLAYING, PAUSED, GAME_OVER
- Coordinate state transitions based on events
- Trigger appropriate rendering and logic updates per state

**Implementation:**
```javascript
const GameStates = { START: 'start', PLAYING: 'playing', PAUSED: 'paused', GAME_OVER: 'gameOver' };
class StateManager {
  currentState = GameStates.START;
  transition(newState) { /* validate and update state */ }
}
```

#### 2. Snake Controller
**Purpose:** Manage snake entity logic
**Responsibilities:**
- Maintain snake position as array of {x, y} coordinates
- Handle movement in current direction
- Grow snake when food consumed
- Detect self-collision
- Prevent invalid direction reversals

**Data Structure:**
```javascript
snake = {
  segments: [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}],
  direction: {x: 1, y: 0}, // moving right
  nextDirection: {x: 1, y: 0}
}
```

#### 3. Food Generator
**Purpose:** Manage food spawning logic
**Responsibilities:**
- Generate random valid position for food
- Ensure food doesn't spawn on snake body
- Detect collision between snake head and food

**Algorithm:**
```javascript
generateFood() {
  do {
    food = { x: random(0, gridWidth), y: random(0, gridHeight) };
  } while (isOnSnake(food));
  return food;
}
```

#### 4. Collision Detector
**Purpose:** Handle all collision detection logic
**Responsibilities:**
- Detect wall collisions (x/y outside grid bounds)
- Detect self-collision (head hits body segment)
- Detect food collision (head same position as food)

#### 5. Canvas Renderer
**Purpose:** Draw all visual elements to canvas
**Responsibilities:**
- Clear and redraw canvas each frame
- Render snake segments with pixel art style
- Render food item
- Draw UI overlays (score, length, menus)
- Apply retro color palette

**Rendering Strategy:**
- Clear canvas on each frame
- Draw background/grid
- Draw food
- Draw snake (iterate segments, head last for layering)
- Draw UI text overlays

#### 6. Input Handler
**Purpose:** Process keyboard input
**Responsibilities:**
- Listen for arrow key events
- Queue direction changes (prevent multiple per frame)
- Handle pause/unpause (spacebar, P key)
- Handle menu navigation (Enter, ESC)
- Prevent browser default behaviors (arrow scrolling)

**Input Queue:**
```javascript
// Only allow one direction change per game tick
let inputQueue = [];
function queueInput(direction) {
  if (inputQueue.length < 2) inputQueue.push(direction);
}
```

#### 7. Score & Leaderboard Manager
**Purpose:** Track score and persist leaderboard
**Responsibilities:**
- Calculate score (10 points per food)
- Store/retrieve leaderboard from localStorage
- Insert new scores in sorted order
- Maintain top 10 entries only
- Display leaderboard modal

**localStorage Schema:**
```javascript
// Key: 'snake_leaderboard'
// Value: JSON array of:
[
  { score: 150, date: '2025-11-15T16:00:00Z' },
  { score: 120, date: '2025-11-14T14:30:00Z' },
  ...
]
```

#### 8. Difficulty Controller
**Purpose:** Implement progressive difficulty
**Responsibilities:**
- Track food consumed count
- Increase game speed by 8% every 5 food items
- Cap minimum interval at 50ms (maximum speed)

**Formula:**
```javascript
baseSpeed = 150; // ms per move
speedMultiplier = Math.pow(0.92, Math.floor(foodCount / 5));
currentSpeed = Math.max(50, baseSpeed * speedMultiplier);
```

### Backend Services

**N/A** - This is a purely client-side application with no backend infrastructure.

### Infrastructure

#### Deployment
- Static file hosting (GitHub Pages, Netlify, Vercel)
- No build process required - deploy raw HTML/CSS/JS files
- No environment variables or configuration needed
- Single directory with 4 files: index.html, styles.css, game.js, README.md

#### Browser Compatibility
- Target: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Feature detection for Canvas and localStorage
- Graceful error message if unsupported

#### Performance Optimization
- Minify JavaScript and CSS for production (optional)
- Use requestAnimationFrame for optimal rendering
- Avoid memory leaks in game loop
- Efficient collision detection (early exits)

#### Monitoring
- No analytics or monitoring (per PRD requirements)
- Manual testing for performance validation
- Browser DevTools for FPS monitoring during development

## Implementation Strategy

### Development Phases

#### Phase 1: Core Game Loop (Days 1-3)
1. Set up project structure (HTML/CSS/JS files)
2. Implement Canvas setup and basic rendering
3. Create game loop with requestAnimationFrame
4. Implement state machine (START, PLAYING, GAME_OVER)
5. Basic snake movement on grid

**Milestone:** Snake moves continuously and responds to arrow keys

#### Phase 2: Game Mechanics (Days 4-7)
1. Implement collision detection (walls, self)
2. Add food generation and consumption
3. Snake growth logic
4. Score calculation
5. Progressive difficulty system

**Milestone:** Fully playable game with win/loss conditions

#### Phase 3: UI & Polish (Days 8-10)
1. Implement all game states (start screen, pause, game over)
2. Apply retro pixel art styling
3. Add score and length display
4. Keyboard controls for all states
5. Visual polish and animations

**Milestone:** Complete UI flow with retro aesthetic

#### Phase 4: Leaderboard System (Days 11-12)
1. localStorage integration
2. Leaderboard data structure and sorting
3. Leaderboard modal UI
4. Score insertion and display
5. Clear leaderboard functionality

**Milestone:** Working leaderboard persistence

#### Phase 5: Testing & Optimization (Days 13-14)
1. Cross-browser testing
2. Performance optimization (target 60fps)
3. Bug fixes and edge cases
4. Code cleanup and comments
5. README documentation

**Milestone:** Production-ready game

### Risk Mitigation

**Risk 1: Performance Below 60fps**
- Mitigation: Profile early with DevTools
- Optimize rendering (only redraw changed areas if needed)
- Simplify visual effects if necessary

**Risk 2: localStorage Quota/Availability**
- Mitigation: Implement try/catch around localStorage operations
- Show warning if localStorage disabled
- Keep leaderboard data minimal (top 10 only)

**Risk 3: Canvas Support Issues**
- Mitigation: Feature detection on page load
- Display clear error message if unsupported
- Test on minimum supported browser versions

**Risk 4: Input Latency/Responsiveness**
- Mitigation: Use input queue to buffer direction changes
- Implement fixed time-step game loop
- Test on various devices and browsers

### Testing Approach

**Manual Testing Focus Areas:**
1. Game mechanics (movement, collision, food consumption)
2. State transitions (start, pause, game over)
3. Score calculation accuracy
4. Leaderboard persistence across sessions
5. Progressive difficulty curve
6. Browser compatibility (Chrome, Firefox, Safari, Edge)
7. Performance monitoring (60fps target)
8. Edge cases (rapid key presses, boundary conditions)

**Performance Testing:**
- Use browser DevTools Performance tab
- Monitor frame rate during extended gameplay
- Check for memory leaks (play for 10+ minutes)
- Test on lower-end devices if available

**No Automated Testing:**
- Per resource constraints (single developer, no testing suite)
- Manual testing sufficient for project scope

## Task Breakdown Preview

The following high-level task categories will be created during epic decomposition:

- [ ] **Project Setup & Structure** - Initialize project files, configure canvas, set up development environment (0.5 days)
- [ ] **Core Game Loop & State Management** - Implement game loop, state machine, and frame timing logic (1.5 days)
- [ ] **Snake & Movement Logic** - Snake data structure, movement, direction controls, and input handling (2 days)
- [ ] **Collision & Food Systems** - Wall/self collision detection, food generation, consumption logic (1.5 days)
- [ ] **Rendering & Visual Design** - Canvas rendering, retro pixel art styling, UI overlays (2 days)
- [ ] **Game States & UI Flow** - Start screen, pause screen, game over screen, state transitions (1.5 days)
- [ ] **Leaderboard System** - localStorage integration, score persistence, leaderboard UI and modal (1.5 days)
- [ ] **Progressive Difficulty** - Speed adjustment logic, difficulty curve balancing (0.5 days)
- [ ] **Testing & Browser Compatibility** - Cross-browser testing, performance optimization, bug fixes (2 days)
- [ ] **Documentation & Deployment** - README, code comments, deployment to static hosting (1 day)

**Total: 10 tasks, ~14 days of development effort**

## Dependencies

### External Dependencies

**Browser APIs (Critical):**
1. **HTML5 Canvas API** - Required for all rendering
   - Risk: Low (universal support in modern browsers)
   - Fallback: Display error message if unavailable

2. **localStorage API** - Required for leaderboard persistence
   - Risk: Low (widely supported, may be disabled by user)
   - Fallback: Warn user, leaderboard disabled for session

3. **requestAnimationFrame API** - Required for smooth 60fps rendering
   - Risk: Very Low (standard in all modern browsers)
   - Fallback: setTimeout-based loop (less optimal)

4. **Keyboard Events API** - Required for game controls
   - Risk: None (universal support)

**Development Tools (Non-critical):**
- Git for version control
- Modern code editor (VS Code, Sublime, etc.)
- Modern browser with DevTools for testing

**Hosting (Required for deployment):**
- Static file hosting service (GitHub Pages, Netlify, Vercel, etc.)
- Risk: Low (many free options available)

### Internal Dependencies

**None** - Single developer, no team coordination required

**Skills Required:**
- JavaScript (ES6+): Intermediate to Advanced
- HTML5 Canvas API: Intermediate
- CSS3: Basic to Intermediate
- Browser DevTools: Intermediate

### Data Dependencies

**None** - No external data sources, APIs, or databases required

### Blocking Dependencies

**None** - All dependencies are browser APIs with universal support. No external services or team coordination required.

## Success Criteria (Technical)

### Performance Benchmarks
- **60fps Consistency:** 99%+ of frames rendered at 60fps during gameplay
- **Input Latency:** <50ms from keypress to snake direction change
- **Load Time:** <2 seconds to interactive on 3G connection
- **Bundle Size:** Total file size <100KB (HTML + CSS + JS)
- **Memory Stability:** No memory leaks during 15+ minute sessions

### Quality Gates

**Code Quality:**
- [ ] Modular code structure with clear separation of concerns
- [ ] Comprehensive code comments explaining game logic
- [ ] No global namespace pollution (use modules or IIFE)
- [ ] Consistent code style throughout

**Functionality:**
- [ ] All 38 functional requirements (FR-1 to FR-38) implemented
- [ ] All game states working correctly (start, playing, paused, game over)
- [ ] Leaderboard persists correctly across browser sessions
- [ ] Progressive difficulty curve feels balanced and engaging

**Browser Compatibility:**
- [ ] Works on Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- [ ] Graceful error message on unsupported browsers
- [ ] Consistent behavior across all supported browsers

**User Experience:**
- [ ] Game playable immediately with zero configuration
- [ ] Controls intuitive and responsive
- [ ] Clear visual feedback for all game states
- [ ] Retro pixel art aesthetic achieved

### Acceptance Criteria

**Must Have (All required):**
1. Snake moves continuously in grid-based pattern
2. Arrow keys control direction (with reverse prevention)
3. Food spawns randomly and is consumed on collision
4. Snake grows and score increases on food consumption
5. Game ends on wall or self-collision
6. Local leaderboard stores top 10 scores in localStorage
7. Progressive difficulty increases speed every 5 food items
8. All game states (start, playing, paused, game over) functional
9. Retro pixel art visual style applied
10. Game runs at consistent 60fps on modern browsers

**Performance Validation:**
- Load test: Page loads and game is playable within 2 seconds
- Stress test: Game maintains 60fps for 15+ minute session
- Compatibility test: Verified working on 4 target browsers
- Persistence test: Leaderboard survives browser close/reopen

**User Validation:**
- Playtesting: 3-5 people can play without confusion
- Feedback: Retro aesthetic is recognized and appreciated
- Challenge: Difficulty curve feels balanced (not too hard/easy)

## Estimated Effort

### Overall Timeline
**Total Development Time:** 14 working days (2.8 calendar weeks for single developer)

**Breakdown by Phase:**
- Phase 1: Core Game Loop - 3 days
- Phase 2: Game Mechanics - 4 days
- Phase 3: UI & Polish - 3 days
- Phase 4: Leaderboard - 2 days
- Phase 5: Testing & Optimization - 2 days

### Resource Requirements
- **Developers:** 1 (full-time equivalent)
- **Designers:** 0 (developer creates pixel art)
- **QA:** 0 (developer testing)
- **DevOps:** 0 (static hosting, no infrastructure)

### Critical Path Items

**Must Complete in Order:**
1. **Canvas Setup & Game Loop** → Blocks all rendering work
2. **Snake Movement** → Blocks collision detection and food system
3. **Collision Detection** → Blocks game over logic
4. **Core Gameplay** → Blocks UI polish and leaderboard
5. **All Features Complete** → Enables final testing phase

**Can Be Done in Parallel:**
- Visual styling (CSS) while implementing game logic
- Documentation while implementing features
- Testing individual components as they're completed

### Delivery Milestones

**Week 1 (Days 1-5):**
- Milestone: Playable core game (snake moves, eats food, collisions work)

**Week 2 (Days 6-10):**
- Milestone: Complete feature set (all game states, leaderboard, difficulty)

**Week 3 (Days 11-14):**
- Milestone: Production-ready (tested, polished, deployed)

### Confidence Level

**High Confidence (90%+):**
- Technical feasibility (well-understood technologies)
- Scope is clear and manageable
- No external dependencies or blockers
- Similar games exist as reference

**Risks to Timeline:**
- Performance optimization may require additional time
- Cross-browser compatibility issues could add 1-2 days
- Balancing difficulty curve may require iteration

**Buffer:** 2-3 additional days recommended for polish and unexpected issues

### Definition of Done

Epic is complete when:
- All 10 task categories are completed
- All functional requirements (FR-1 to FR-38) are implemented
- All success criteria are met
- Game is deployed to static hosting
- README documentation is complete
- Zero critical bugs remain
- Performance targets are achieved (60fps, <100KB, <2s load)

## Tasks Created

- [ ] 001.md - Project Setup & Structure (parallel: false, depends_on: none)
- [ ] 002.md - Core Game Loop & State Management (parallel: false, depends_on: 001)
- [ ] 003.md - Snake & Movement Logic (parallel: false, depends_on: 002)
- [ ] 004.md - Collision & Food Systems (parallel: false, depends_on: 003)
- [ ] 005.md - Rendering & Visual Design (parallel: false, depends_on: 002, 004)
- [ ] 006.md - Game States & UI Flow (parallel: false, depends_on: 002, 005)
- [ ] 007.md - Leaderboard System (parallel: false, depends_on: 006)
- [ ] 008.md - Progressive Difficulty (parallel: true, depends_on: 004)
- [ ] 009.md - Testing & Browser Compatibility (parallel: false, depends_on: 005, 006, 007, 008)
- [ ] 010.md - Documentation & Deployment (parallel: false, depends_on: 009)

**Total tasks:** 10
**Parallel tasks:** 1 (task 008 can run alongside other development)
**Sequential tasks:** 9
**Estimated total effort:** ~100 hours (14 working days)

**Critical Path:**
001 → 002 → 003 → 004 → 005 → 006 → 007 → 009 → 010

**Task Size Distribution:**
- XS: 1 task (001)
- S: 1 task (008)
- M: 7 tasks (002, 003, 004, 005, 006, 007, 010)
- L: 1 task (009)
