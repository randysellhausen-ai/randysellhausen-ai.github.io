// =========================================================
// APEXSIM — Engine (v8.2, Auto‑Run, Control‑Panel Compatible)
// =========================================================
// - Auto‑running simulation loop
// - Control panel API: resume(), pause(), step(), setTimeScale()
// - Uses APEXSIM.Data.createUnit()
// - Integrates APEXWORLD + APEXPATH
// - Clean, deterministic, production‑ready
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Engine = {

    units: [],

    _nextId: 1,
    _running: true,
    _speed: 1.0,

    _lastTime: null,
    _stepRequested: false,

    // =====================================================
    // INIT — starts internal RAF loop
    // =====================================================
    init() {
        this.units = [];
        this._nextId = 1;
        this._running = true;
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

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);

        console.log("APEXSIM.Engine — Initialized.");
    },

    // =====================================================
    // CONTROL PANEL API
    // =====================================================

    resume() {
        this._running = true;
    },

    pause() {
        this._running = false;
    },

    step() {
        this._stepRequested = true;
    },

    setTimeScale(multiplier) {
        this._speed = Math.max(0.05, multiplier || 1.0);
    },

    play() { this.resume(); },
    setSpeed(v) { this.setTimeScale(v); },

    // =====================================================
    // UNIT MANAGEMENT
    // =====================================================

    spawnUnits(count) {
        count = count || 1;
        for (let i = 0; i < count; i++) {
            this._spawnUnit();
        }
    },

    clearUnits() {
        this.units = [];
    },

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
    // INTERNAL SIMULATION LOOP
    // =====================================================

    _tick(dt) {
        if (!this._running && !this._stepRequested) return;

        if (this._stepRequested) {
            this._stepRequested = false;
        }

        this._updateUnits(dt);

        // =================================================
        // RENDER EVERY FRAME (THIS WAS MISSING)
        // =================================================
        const Renderer = window.APEXSIM && APEXSIM.Renderer;
        if (Renderer && typeof Renderer.render === "function") {
            Renderer.render();
        }
    },

    _spawnUnit() {
        const world = window.APEXWORLD && APEXWORLD.World;

        let x = 10;
        let y = 10;

        if (world) {
            x = Math.floor(world.width / 2);
            y = Math.floor(world.height / 2);
        }

        const unit = this._createUnitAt(x, y);
        this.units.push(unit);
    },

    // =====================================================
    // UNIT CREATION
    // =====================================================

    _createUnitAt(x, y) {
        const Data = window.APEXSIM && APEXSIM.Data;
        let u;

        if (Data && typeof Data.createUnit === "function") {
            u = Data.createUnit(x, y);
        } else {
            u = {
                id: this._nextId++,
                x, y,
                vx: 0,
                vy: 0,
                maxSpeed: 10,
                maxAccel: 30,
                aiTarget: null
            };
        }

        u.path = u.path || null;
        u.pathIndex = u.pathIndex || 0;

        return u;
    },

    _createUnitFromObject(src) {
        const Data = window.APEXSIM && APEXSIM.Data;

        if (!("maxSpeed" in src) || !("maxAccel" in src)) {
            return this._createUnitAt(src.x || 10, src.y || 10);
        }

        src.path = src.path || null;
        src.pathIndex = src.pathIndex || 0;

        return src;
    },

    // =====================================================
    // UNIT UPDATE
    // =====================================================

    _updateUnits(dt) {
        const world = window.APEXWORLD && APEXWORLD.World;
        const pathfinder = window.APEXPATH && APEXPATH.Pathfinder;

        for (let u of this.units) {
            if (world && pathfinder) {
                this._updateUnitWithPathfinding(u, dt, world, pathfinder);
            } else {
                this._updateUnitSimple(u, dt);
            }
        }
    },

    // =====================================================
    // PATHFINDING MOVEMENT
    // =====================================================

    _updateUnitWithPathfinding(u, dt, world, pathfinder) {
        const speed = u.maxSpeed || 10;

        if (!u.path || u.pathIndex >= u.path.length) {
            const startX = Math.round(u.x);
            const startY = Math.round(u.y);

            const goal = this._pickRandomWalkableTile(world);
            if (!goal) return this._updateUnitSimple(u, dt);

            const path = pathfinder.findPath(startX, startY, goal.x, goal.y);
            if (!path || path.length === 0) return this._updateUnitSimple(u, dt);

            u.path = path;
            u.pathIndex = 0;
            u.aiTarget = goal;
        }

        const node = u.path[u.pathIndex];
        if (!node) return this._updateUnitSimple(u, dt);

        const targetX = node.x + 0.5;
        const targetY = node.y + 0.5;

        const dx = targetX - u.x;
        const dy = targetY - u.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;

        const moveDist = speed * dt;

        if (dist <= moveDist) {
            u.x = targetX;
            u.y = targetY;
            u.pathIndex++;
            u.vx = 0;
            u.vy = 0;
        } else {
            const nx = dx / dist;
            const ny = dy / dist;

            u.vx = nx * speed;
            u.vy = ny * speed;

            u.x += u.vx * dt;
            u.y += u.vy * dt;
        }
    },

    _pickRandomWalkableTile(world) {
        for (let i = 0; i < 64; i++) {
            const x = Math.floor(Math.random() * world.width);
            const y = Math.floor(Math.random() * world.height);
            if (world.isWalkable(x, y)) return { x, y };
        }
        return null;
    },

    // =====================================================
    // SIMPLE MOVEMENT (fallback)
    // =====================================================

    _updateUnitSimple(u, dt) {
        const speed = u.maxSpeed || 10;

        if (Math.abs(u.vx) < 0.01 && Math.abs(u.vy) < 0.01) {
            const angle = Math.random() * Math.PI * 2;
            u.vx = Math.cos(angle) * speed;
            u.vy = Math.sin(angle) * speed;
        }

        u.x += u.vx * dt;
        u.y += u.vy * dt;
    }
};

// Auto‑init
APEXSIM.Engine.init();
