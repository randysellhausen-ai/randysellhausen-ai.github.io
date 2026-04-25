// APEXSIM Engine — v8.0 Movement + AI Core

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Engine = {
    units: [],
    _paused: false,
    _timeScale: 1,
    _lastTime: null,
    _accumulator: 0,
    baseDeltaTime: 1 / 60, // 60 FPS fixed step

    init() {
        console.log("APEXSIM.Engine — Initialized.");
    },

    setTimeScale(scale) {
        this._timeScale = Math.max(0.1, Math.min(scale, 4));
    },

    pause() {
        this._paused = true;
    },

    resume() {
        this._paused = false;
    },

    step() {
        // Run exactly one fixed step
        this._paused = true;
        this._fixedUpdate(this.baseDeltaTime);
    },

    clearUnits() {
        this.units.length = 0;
    },

    addUnit(unit) {
        this.units.push(unit);
    },

    _fixedUpdate(dt) {
        // AI + Movement systems
        if (APEXSIM.Systems && typeof APEXSIM.Systems.update === "function") {
            APEXSIM.Systems.update(this.units, dt);
        }
    },

    update() {
        const now = performance.now() / 1000;
        if (this._lastTime === null) {
            this._lastTime = now;
            return;
        }

        if (this._paused) {
            this._lastTime = now;
            return;
        }

        let frameDt = now - this._lastTime;
        this._lastTime = now;

        frameDt *= this._timeScale;
        this._accumulator += frameDt;

        const step = this.baseDeltaTime;
        while (this._accumulator >= step) {
            this._fixedUpdate(step);
            this._accumulator -= step;
        }
    }
};

APEXSIM.Engine.init();
