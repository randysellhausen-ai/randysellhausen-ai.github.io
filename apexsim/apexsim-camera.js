// =========================================================
// APEXSIM.Camera — Liminal Engine v8.2
// Camera controller for zoom, pan, and reset
// =========================================================
// - Works directly with APEXSIM.Renderer.camera
// - Control panel buttons call zoomIn / zoomOut / reset
// - Future‑proof for panning, tracking, smoothing
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Camera = {

    zoomStep: 0.1,
    minZoom: 0.2,
    maxZoom: 3.0,

    init() {
        const Renderer = window.APEXSIM && APEXSIM.Renderer;
        if (!Renderer) {
            console.error("APEXSIM.Camera — Renderer not found.");
            return;
        }

        // UI BUTTON: Zoom In
        const zoomInBtn = document.getElementById("vc-camera-zoom-in");
        if (zoomInBtn) {
            zoomInBtn.addEventListener("click", () => {
                this.zoomIn();
            });
        }

        // UI BUTTON: Zoom Out
        const zoomOutBtn = document.getElementById("vc-camera-zoom-out");
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener("click", () => {
                this.zoomOut();
            });
        }

        // UI BUTTON: Reset Camera
        const resetBtn = document.getElementById("vc-camera-reset");
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                this.reset();
            });
        }

        console.log("APEXSIM.Camera — Ready.");
    },

    // =====================================================
    // CAMERA ACTIONS
    // =====================================================

    zoomIn() {
        const Renderer = APEXSIM.Renderer;
        const cam = Renderer.camera;

        cam.zoom = Math.min(this.maxZoom, cam.zoom + this.zoomStep);
    },

    zoomOut() {
        const Renderer = APEXSIM.Renderer;
        const cam = Renderer.camera;

        cam.zoom = Math.max(this.minZoom, cam.zoom - this.zoomStep);
    },

    reset() {
        const Renderer = APEXSIM.Renderer;
        const cam = Renderer.camera;

        cam.x = 0;
        cam.y = 0;
        cam.zoom = 1;
    },

    // =====================================================
    // FUTURE EXPANSION (not used yet)
    // =====================================================

    pan(dx, dy) {
        const Renderer = APEXSIM.Renderer;
        const cam = Renderer.camera;

        cam.x += dx;
        cam.y += dy;
    },

    setPosition(x, y) {
        const Renderer = APEXSIM.Renderer;
        const cam = Renderer.camera;

        cam.x = x;
        cam.y = y;
    }
};

// Auto‑init after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    if (window.APEXSIM && APEXSIM.Camera) {
        APEXSIM.Camera.init();
    }
});
