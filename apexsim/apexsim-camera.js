// APEXSIM Camera — Pan + Zoom

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Camera = {
    x: 0,
    y: 0,
    zoom: 1,

    zoomIn() {
        this.zoom = Math.min(this.zoom * 1.1, 4);
    },

    zoomOut() {
        this.zoom = Math.max(this.zoom / 1.1, 0.25);
    },

    reset() {
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
    }
};
