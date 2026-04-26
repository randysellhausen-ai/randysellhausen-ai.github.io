// =========================================================
// APEXSIM.Camera — Liminal Engine v8.2 (World‑Centered Version)
// =========================================================
// - Real camera state object
// - Centers on world automatically
// - Reset returns to world center
// - Works with Renderer via Camera.state
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Camera = {

    // -----------------------------------------------------
    // CAMERA STATE
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
    // INIT — centers camera on world
    // -----------------------------------------------------
    init() {
        const World = window.APEXSIM && APEXSIM.World;
        const Renderer = window.APEXSIM && APEXSIM.Renderer;

        if (World && Renderer && World.width && World.height) {
            const worldPixelWidth  = World.width  * Renderer.tileSize;
            const worldPixelHeight = World.height * Renderer.tileSize;

            this.state.x = worldPixelWidth  / 2;
            this.state.y = worldPixelHeight / 2;
            this.state.zoom = 1;
        }

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
        const World = window.APEXSIM && APEXSIM.World;
        const Renderer = window.APEXSIM && APEXSIM.Renderer;

        if (World && Renderer && World.width && World.height) {
            const worldPixelWidth  = World.width  * Renderer.tileSize;
            const worldPixelHeight = World.height * Renderer.tileSize;

            this.state.x = worldPixelWidth  / 2;
            this.state.y = worldPixelHeight / 2;
        } else {
            this.state.x = 0;
            this.state.y = 0;
        }

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
