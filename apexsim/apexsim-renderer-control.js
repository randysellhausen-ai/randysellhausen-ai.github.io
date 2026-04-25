// Control-layer wrapper for APEXSIM.Renderer
// Adds setGridVisible used by the control panel.

window.APEXSIM = window.APEXSIM || {};
APEXSIM.Renderer = APEXSIM.Renderer || {};

// Preserve original draw if it exists
APEXSIM.Renderer._originalDraw = APEXSIM.Renderer.draw || function () {};

APEXSIM.Renderer._showGrid = true;

// Called from control panel
APEXSIM.Renderer.setGridVisible = function (visible) {
    this._showGrid = !!visible;
};

// Wrapped draw
APEXSIM.Renderer.draw = function () {
    // If you later separate grid drawing, you can branch on _showGrid.
    // For now, we just call original draw; grid visibility can be wired inside there.
    this._originalDraw();
};
