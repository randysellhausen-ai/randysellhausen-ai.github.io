// =========================================================
// APEXSIM.Engine — Liminal Engine v8.2 (with STOP Soft Reset)
// =========================================================
// - Simulation loop (play/pause/step/stop)
// - Unit management
// - Speed control
// - Renderer integration
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Engine = {

    units: [],
    _running: false,
    _speed: 1,
    _stepRequested: false,

    // -----------------------------------------------------
    // INIT
    // -----------------------------------------------------
    init() {
        console.log("APEXSIM.Engine — Initialized.");
        this._loop();
    },

    // -----------------------------------------------------
    // MAIN LOOP (RAF)
    // -----------------------------------------------------
    _loop() {
        requestAnimationFrame(() => this._loop());

        if (!this._running && !this._stepRequested) return;

        const dt = 0.016 * this._speed; // ~60 FPS base

        this._update(dt);

        if (APEXSIM.Renderer && typeof APEXSIM.Renderer.render === "function") {
            APEXSIM.Renderer.render();
        }

        this._stepRequested = false;
    },

    // -----------------------------------------------------
    // UPDATE SIMULATION
    // -----------------------------------------------------
    _update(dt) {
        for (let unit of this.units) {
            unit.x += unit.vx * dt * 60;
            unit.y += unit.vy * dt * 60;
        }
    },

    // -----------------------------------------------------
    // ENGINE CONTROLS
    // -----------------------------------------------------
    play() {
        this._running = true;
    },

    pause() {
        this._running = false;
    },

    step() {
        this._stepRequested = true;
    },

    // -----------------------------------------------------
    // STOP (Soft Reset)
    // -----------------------------------------------------
    stop() {
        this._running = false;
        this._speed = 1;
        this._stepRequested = false;

        // Clear all units
        this.units = [];

        console.log("APEXSIM.Engine — STOP invoked (soft reset).");
    },

    // -----------------------------------------------------
    // SPEED CONTROL
    // -----------------------------------------------------
    setSpeed(multiplier) {
        this._speed = Math.max(0.1, Math.min(4.0, multiplier));
    },

    // -----------------------------------------------------
    // UNIT MANAGEMENT
    // -----------------------------------------------------
    addUnit(x, y) {
        this.units.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
    },

    clearUnits() {
        this.units = [];
    }
};

// Auto-init
APEXSIM.Engine.init();
