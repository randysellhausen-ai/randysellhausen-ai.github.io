// =========================================================
// APEXSIM — Camera (v8.0, Hybrid)
// =========================================================
// - Stores camera position + zoom
// - Simple API for zoom + panning
// - Hybrid feel is driven by APEXSIM.Input
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Camera = {
    x: 0,
    y: 0,
    zoom: 1,

    minZoom: 0.25,
    maxZoom: 4.0,

    zoomIn() {
        this.zoom = Math.min(this.zoom * 1.1, this.maxZoom);
    },

    zoomOut() {
        this.zoom = Math.max(this.zoom / 1.1, this.minZoom);
    },

    reset() {
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
    },

    translate(dx, dy) {
        this.x += dx;
        this.y += dy;
    },

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
};
