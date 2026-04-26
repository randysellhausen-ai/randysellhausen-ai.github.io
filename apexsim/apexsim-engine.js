// =========================================================
// APEXSIM.Engine — core simulation
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Engine = {

    units: [],
    _running: false,
    _speed: 1,
    _stepRequested: false,

    init() {
        console.log("APEXSIM.Engine — Initialized.");
        this._loop();
    },

    _loop() {
        requestAnimationFrame(() => this._loop());

        if (!this._running && !this._stepRequested) return;

        const dt = 0.016 * this._speed;

        this._update(dt);

        if (APEXSIM.Renderer && typeof APEXSIM.Renderer.render === "function") {
            APEXSIM.Renderer.render();
        }

        this._stepRequested = false;
    },

    _update(dt) {
        for (let unit of this.units) {
            unit.x += unit.vx * dt * 60;
            unit.y += unit.vy * dt * 60;
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
