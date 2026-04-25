// Simple camera control object used by the control panel.

window.APEXSIM = window.APEXSIM || {};
APEXSIM.Camera = APEXSIM.Camera || {};

APEXSIM.Camera.zoom = 1;

APEXSIM.Camera.zoomIn = function () {
    this.zoom = Math.min(this.zoom * 1.1, 4);
};

APEXSIM.Camera.zoomOut = function () {
    this.zoom = Math.max(this.zoom / 1.1, 0.25);
};

APEXSIM.Camera.reset = function () {
    this.zoom = 1;
};

// To fully wire this, apply APEXSIM.Camera.zoom in your renderer's transform.
// For now, it's a clean, ready-to-use control surface.
