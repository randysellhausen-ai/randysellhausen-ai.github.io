// =========================================================
// APEXSIM.Input — Liminal Engine v8.2 (World‑Centered)
// =========================================================
// - Handles camera movement (WASD + mouse drag)
// - Works with new Camera.state (x, y, zoom)
// - No translate(), no legacy API calls
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Input = {

    keys: {},
    mouseDown: false,
    lastMouseX: 0,
    lastMouseY: 0,

    init() {
        console.log("APEXSIM.Input — Initialized (Hybrid Camera).");

        window.addEventListener("keydown", e => this.keys[e.key] = true);
        window.addEventListener("keyup", e => this.keys[e.key] = false);

        const canvas = document.getElementById("vc-canvas");

        canvas.addEventListener("mousedown", e => {
            this.mouseDown = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });

        window.addEventListener("mouseup", () => {
            this.mouseDown = false;
        });

        window.addEventListener("mousemove", e => {
            if (!this.mouseDown) return;

            const dx = (e.clientX - this.lastMouseX) / APEXSIM.Camera.state.zoom;
            const dy = (e.clientY - this.lastMouseY) / APEXSIM.Camera.state.zoom;

            APEXSIM.Camera.pan(-dx, -dy);

            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });

        this._loop();
    },

    // -----------------------------------------------------
    // INPUT LOOP
    // -----------------------------------------------------
    _loop() {
        requestAnimationFrame(() => this._loop());

        const cam = APEXSIM.Camera;

        const speed = 8 / cam.state.zoom;

        if (this.keys["w"] || this.keys["ArrowUp"]) {
            cam.pan(0, -speed);
        }
        if (this.keys["s"] || this.keys["ArrowDown"]) {
            cam.pan(0, speed);
        }
        if (this.keys["a"] || this.keys["ArrowLeft"]) {
            cam.pan(-speed, 0);
        }
        if (this.keys["d"] || this.keys["ArrowRight"]) {
            cam.pan(speed, 0);
        }
    }
};

// Auto-init
window.addEventListener("DOMContentLoaded", () => APEXSIM.Input.init());
