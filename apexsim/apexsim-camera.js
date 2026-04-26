// =========================================================
// APEXSIM.Camera — Liminal Engine v8.2 (World‑Centered Final)
// =========================================================
// - Camera origin is (0,0) = world center
// - Reset returns to world center
// - Works perfectly with centered renderer
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Camera = {

    state: {
        x: 0,
        y: 0,
        zoom: 1
    },

    zoomStep: 0.1,
    minZoom: 0.2,
    maxZoom: 3.0,

    // -----------------------------------------------------
    // INIT — camera starts at world center
    // -----------------------------------------------------
    init() {
        this.state.x = 0;
        this.state.y = 0;
        this.state.zoom = 1;

        console.log("APEXSIM.Camera — Ready (World‑Centered).");
    },

    // -----------------------------------------------------
    // CAMERA ACTIONS
    // -----------------------------------------------------
    zoomIn() {
        this.state.zoom = Math.min(this.maxZoom, this.state.zoom + this.zoomStep);
    },

    zoomOut() {
        this.state.zoom = Math.max(this.minZoom, this.state.zoom - this.zoomStep);
    },

    reset() {
        this.state.x = 0;
        this.state.y = 0;
        this.state.zoom = 1;
    },

    pan(dx, dy) {
        this.state.x += dx;
        this.state.y += dy;
    },

    setPosition(x, y) {
        this.state.x = x;
        this.state.y = y;
    }
};
