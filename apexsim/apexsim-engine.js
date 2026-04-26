// =========================================================
// APEXSIM.Engine — core simulation (Auto‑Play Edition)
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Engine = {

    units: [],
    _running: true,          // ⭐ AUTO‑PLAY ENABLED ⭐
    _speed: 1,
    _stepRequested: false,
    time: 0,

    init() {
        console.log("APEXSIM.Engine — Initialized.");
        this._loop();
    },

    _loop() {
        requestAnimationFrame(() => this._loop());

        // Engine now ALWAYS runs unless paused manually
        if (!this._running && !this._stepRequested) return;

        const dt = 0.016 * this._speed;

        this._update(dt);

        if (APEXSIM.Renderer && typeof APEXSIM.Renderer.render === "function") {
            APEXSIM.Renderer.render();
        }

        this._stepRequested = false;
    },

    _update(dt) {
        const scale = 60 * 8; // 8× movement scale

        this.time += dt;

        if (APEXSIM.AI && typeof APEXSIM.AI.update === "function") {
            APEXSIM.AI.update(this.units, dt);
        }

        for (let unit of this.units) {
            unit.x += unit.vx * dt * scale;
            unit.y += unit.vy * dt * scale;
        }
    },

    play() {
        this._running = true;
    },

    pause() {
        this._running = false;
    },

    step() {
        this._stepRequested = true;
    },

    stop() {
        this._running = false;
        this._speed = 1;
        this._stepRequested = false;
        this.units = [];
        this.time = 0;
        console.log("APEXSIM.Engine — STOP invoked (soft reset).");
    },

    setSpeed(multiplier) {
        this._speed = Math.max(0.1, Math.min(4.0, multiplier));
    },

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

APEXSIM.Engine.init();
