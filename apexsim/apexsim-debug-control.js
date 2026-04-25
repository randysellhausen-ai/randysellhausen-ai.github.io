// Control-layer wrapper for APEXSIM.Debug
// Adds setDebugVisible used by the control panel.

window.APEXSIM = window.APEXSIM || {};
APEXSIM.Debug = APEXSIM.Debug || {};

APEXSIM.Debug._visible = false;

APEXSIM.Debug.setDebugVisible = function (visible) {
    this._visible = !!visible;
};

// You can check APEXSIM.Debug._visible inside your existing debug rendering logic.
