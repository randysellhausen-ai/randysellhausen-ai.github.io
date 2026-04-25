// =========================================================
// APEXSIM.Renderer — Liminal Engine v8.2
// Clean, deterministic, camera-aware, grid-aware renderer
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Renderer = {

    canvas: null,
    ctx: null,

    showGrid: true,
    showDebug: false,

    camera: {
        x: 0,
        y: 0,
        zoom: 1
    },

    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        if (!this.ctx) {
            console.error("APEXSIM.Renderer — Failed to get 2D context.");
            return;
        }

        console.log("APEXSIM.Renderer — Canvas attached.");
    },

    // Called every frame by index.html bootstrap
    draw() {
        if (!this.ctx) return;

        const ctx = this.ctx;
        const cam = this.camera;

        ctx.save();

        // Clear screen
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply camera transform
        ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        ctx.scale(cam.zoom, cam.zoom);
        ctx.translate(-cam.x, -cam.y);

        // Draw grid
        if (this.showGrid) {
            this._drawGrid();
        }

        // Draw units
        this._drawUnits();

        // Debug overlay
        if (this.showDebug) {
            this._drawDebug();
        }

        ctx.restore();
    },

    // =====================================================
    // GRID
    // =====================================================

    _drawGrid() {
        const ctx = this.ctx;
        const size = 32; // world tile size

        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 1;

        const width = this.canvas.width * 2;
        const height = this.canvas.height * 2;

        for (let x = -width; x < width; x += size) {
            ctx.beginPath();
            ctx.moveTo(x, -height);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = -height; y < height; y += size) {
            ctx.beginPath();
            ctx.moveTo(-width, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    },

    // =====================================================
    // UNITS
    // =====================================================

    _drawUnits() {
        const Engine = window.APEXSIM && APEXSIM.Engine;
        if (!Engine || !Engine.units) return;

        const ctx = this.ctx;

        for (let u of Engine.units) {
            ctx.fillStyle = "#00eaff";
            ctx.beginPath();
            ctx.arc(u.x * 32, u.y * 32, 6, 0, Math.PI * 2);
            ctx.fill();

            // Velocity vector
            ctx.strokeStyle = "rgba(0,255,255,0.5)";
            ctx.beginPath();
            ctx.moveTo(u.x * 32, u.y * 32);
            ctx.lineTo(
                (u.x + u.vx * 0.1) * 32,
                (u.y + u.vy * 0.1) * 32
            );
            ctx.stroke();
        }
    },

    // =====================================================
    // DEBUG OVERLAY
    // =====================================================

    _drawDebug() {
        const Engine = window.APEXSIM && APEXSIM.Engine;
        if (!Engine || !Engine.units) return;

        const ctx = this.ctx;

        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.font = "14px monospace";

        let y = 20;

        ctx.fillText(`Units: ${Engine.units.length}`, 20, y);
        y += 20;

        ctx.fillText(`Running: ${Engine._running}`, 20, y);
        y += 20;

        ctx.fillText(`Speed: ${Engine._speed.toFixed(2)}x`, 20, y);
        y += 20;

        ctx.fillText(`Step Requested: ${Engine._stepRequested}`, 20, y);
    },

    // =====================================================
    // CONTROL PANEL HOOKS
    // =====================================================

    setGridVisible(v) {
        this.showGrid = !!v;
    },

    setDebugVisible(v) {
        this.showDebug = !!v;
    },

    // =====================================================
    // CAMERA API (used by apexsim-camera.js)
    // =====================================================

    setCamera(x, y) {
        this.camera.x = x;
        this.camera.y = y;
    },

    setZoom(z) {
        this.camera.zoom = Math.max(0.1, Math.min(z, 5));
    }
};
