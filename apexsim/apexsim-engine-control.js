// Control-layer wrapper for APEXSIM.Engine
// Adds pause/resume/step/timeScale/clearUnits without overwriting your core logic.

window.APEXSIM = window.APEXSIM || {};
APEXSIM.Engine = APEXSIM.Engine || {};

// Preserve original update if it exists
APEXSIM.Engine._originalUpdate = APEXSIM.Engine.update || function () {};

// Internal state
APEXSIM.Engine._paused = false;
APEXSIM.Engine._timeScale = 1;

// Public API used by the control panel
APEXSIM.Engine.pause = function () {
    this._paused = true;
};

APEXSIM.Engine.resume = function () {
    this._paused = false;
};

APEXSIM.Engine.step = function () {
    this._paused = true;
    this._originalUpdate(true);
};

APEXSIM.Engine.setTimeScale = function (scale) {
    this._timeScale = Math.max(0.1, Math.min(scale, 4));
};

APEXSIM.Engine.clearUnits = function () {
    if (this.units && Array.isArray(this.units)) {
        this.units.length = 0;
    }
};

// Wrapped update that respects pause/timeScale
APEXSIM.Engine.update = function () {
    if (this._paused) return;

    // If your original update uses dt internally, you can extend it later.
    // For now, we just call through.
    this._originalUpdate();
};
