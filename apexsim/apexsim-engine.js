// =========================================================
// APEXSIM — Engine (v8.1, with APEXPATH + addUnit API)
// =========================================================
// Responsibilities:
// - Owns unit list
// - Simulation loop (play / pause / step)
// - Time scaling (speed slider)
// - Spawning / clearing units
// - Integrates with APEXWORLD + APEXPATH
// - Units pathfind across the world grid
// - Compatible with APEXSIM.Engine.addUnit(...)
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Engine = {

    units: [],

    _nextId: 1,
    _running: false,
    _speed: 1.0,

    _lastTime: null,
    _stepRequested: false,

    init() {
        this.units = [];
        this._nextId = 1;
        this._running = false;
        this._speed = 1.0;
        this._lastTime = null;
        this._stepRequested = false;

        const loop = (timestamp) => {
            const now = timestamp / 1000;
            if (this._lastTime === null) {
                this._lastTime = now;
            }
            const dt = now - this._lastTime;
            this._lastTime = now;

            this._tick(dt * this._speed);

            window.requestAnimationFrame(loop);
        };
        window.requestAnimationFrame(loop);

        console.log("APEXSIM.Engine — Initialized.");
    },

    // =====================================================
    // Public controls (used by control panel / tests)
    // =====================================================

    play() {
        this._running = true;
    },

    pause() {
        this._running = false;
    },

    step() {
        this._stepRequested = true;
    },

    setSpeed(multiplier) {
        this._speed = Math.max(0.05, multiplier || 1.0);
    },

    spawnUnits(count) {
        count = count || 1;
        for (let i = 0; i < count; i++) {
            this._spawnUnit();
        }
    },

    clearUnits() {
        this.units = [];
    },

    // Legacy / external API used by apexsim-test.js
    // Supports:
    // - addUnit({ x, y, ... })
    // - addUnit(x, y)
    addUnit(arg1, arg2) {
        let unit;

        if (typeof arg1 === "object" && arg1 !== null) {
            unit = this._createUnitFromObject(arg1);
        } else {
            const x = typeof arg1 === "number" ? arg1 : 10;
            const y = typeof arg2 === "number" ? arg2 : 10;
            unit = this._createUnitAt(x, y);
        }

        this.units.push(unit);
        return unit;
    },

    // =====================================================
    // Internal simulation
    // =====================================================

    _tick(dt) {
        if (!this._running && !this._stepRequested) return;

        if (this._stepRequested) {
            this._stepRequested = false;
        }

        this._updateUnits(dt);
    },

    _spawnUnit() {
        const world = window.APEXWORLD && APEXWORLD.World;

        let x = 10;
        let y = 10;

        if (world) {
            const w = world.width;
            const h = world.height;
            x = Math.floor(w / 2);
            y = Math.floor(h / 2);
        }

        const unit = this._createUnitAt(x, y);
        this.units.push(unit);
    },

    _createUnitAt(x, y) {
        return {
            id: this._nextId++,

            x: x + Math.random() * 0.1,
            y: y + Math.random() * 0.1,

            vx: 0,
            vy: 0,

            speed: 4 + Math.random() * 3,

            path: null,
            pathIndex: 0,
            aiTarget: null
        };
    },

    _createUnitFromObject(src) {
        return {
            id: this._nextId++,

            x: typeof src.x === "number" ? src.x : 10,
            y: typeof src.y === "number" ? src.y : 10,

            vx: typeof src.vx === "number" ? src.vx : 0,
            vy: typeof src.vy === "number" ? src.vy : 0,

            speed: typeof src.speed === "number" ? src.speed : (4 + Math.random() * 3),

            path: src.path || null,
            pathIndex: typeof src.pathIndex === "number" ? src.pathIndex : 0,
            aiTarget: src.aiTarget || null
        };
    },

    _updateUnits(dt) {
        const world = window.APEXWORLD && APEXWORLD.World;
        const pathfinder = window.APEXPATH && APEXPATH.Pathfinder;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (world && pathfinder) {
                this._updateUnitWithPathfinding(u, dt, world, pathfinder);
            } else {
                this._updateUnitSimple(u, dt);
            }
        }
    },

    // =====================================================
    // Pathfinding-based movement (APEXPATH + APEXWORLD)
    // =====================================================

    _updateUnitWithPathfinding(u, dt, world, pathfinder) {
        if (!u.path || u.pathIndex >= u.path.length) {
            const startX = Math.round(u.x);
            const startY = Math.round(u.y);

            const goal = this._pickRandomWalkableTile(world);
            if (!goal) {
                this._updateUnitSimple(u, dt);
                return;
            }

            const path = pathfinder.findPath(startX, startY, goal.x, goal.y);

            if (!path || path.length === 0) {
                this._updateUnitSimple(u, dt);
                return;
            }

            u.path = path;
            u.pathIndex = 0;
            u.aiTarget = { x: goal.x, y: goal.y };
        }

        const node = u.path[u.pathIndex];
        if (!node) {
            this._updateUnitSimple(u, dt);
            return;
        }

        const targetX = node.x + 0.5;
        const targetY = node.y + 0.5;

        const dx = targetX - u.x;
        const dy = targetY - u.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;

        const moveDist = u.speed * dt;

        if (dist <= moveDist) {
            u.x = targetX;
            u.y = targetY;
            u.pathIndex++;

            u.vx = 0;
            u.vy = 0;
        } else {
            const nx = dx / dist;
            const ny = dy / dist;

            u.vx = nx * u.speed;
            u.vy = ny * u.speed;

            u.x += u.vx * dt;
            u.y += u.vy * dt;
        }
    },

    _pickRandomWalkableTile(world) {
        const maxAttempts = 64;

        for (let i = 0; i < maxAttempts; i++) {
            const x = Math.floor(Math.random() * world.width);
            const y = Math.floor(Math.random() * world.height);

            if (world.isWalkable(x, y)) {
                return { x, y };
            }
        }

        return null;
    },

    // =====================================================
    // Simple fallback movement (no world / no pathfinding)
    // =====================================================

    _updateUnitSimple(u, dt) {
        const speed = u.speed;

        if (Math.abs(u.vx) < 0.01 && Math.abs(u.vy) < 0.01) {
            const angle = Math.random() * Math.PI * 2;
            u.vx = Math.cos(angle) * speed;
            u.vy = Math.sin(angle) * speed;

            u.aiTarget = null;
        }

        u.x += u.vx * dt;
        u.y += u.vy * dt;
    }
};

// Auto-init
APEXSIM.Engine.init();
