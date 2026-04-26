// =========================================================
// APEXSIM.Camera — Liminal Engine v8.2 (Corrected 1.0 Version)
// =========================================================
// - Provides a real camera state object
// - Works with Renderer via Camera.state
// - Zoom / Pan / Reset are stable
// - No auto-init (bootloader initializes it properly)
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Camera = {

    // -----------------------------------------------------
    // CAMERA STATE (REAL OBJECT)
    // -----------------------------------------------------
    state: {
        x: 0,
        y: 0,
        zoom: 1
    },

    zoomStep: 0.1,
    minZoom: 0.2,
    maxZoom: 3.0,

    // -----------------------------------------------------
    // INIT
    // -----------------------------------------------------
    init() {
        console.log("APEXSIM.Camera — Ready.");
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
