// =========================================================
// APEXSIM — Renderer (v8.1)
// =========================================================
// Handles:
// - Canvas transforms
// - Camera zoom + offset
// - World rendering (APEXWORLD v1.0)
// - Grid rendering
// - Unit rendering
// - Debug overlay
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Renderer = {

    canvas: null,
    ctx: null,

    // Grid toggle (controlled by UI panel)
    _showGrid: true,

    // Attach canvas from UI layer
    attachCanvas(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext("2d");

        console.log("APEXSIM.Renderer — Canvas attached.");
    },

    // Called by UI panel
    setGridVisible(visible) {
        this._showGrid = !!visible;
    },

    // Main draw loop (called every frame from index.html)
    draw() {
        if (!this.ctx || !this.canvas) return;

        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Reset transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Clear screen
        ctx.clearRect(0, 0, w, h);

        // Fill background
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        // =====================================================
        // CAMERA TRANSFORM
        // =====================================================
        ctx.translate(w / 2, h / 2);
        ctx.scale(APEXSIM.Camera.zoom, APEXSIM.Camera.zoom);
        ctx.translate(-w / 2, -h / 2);

        ctx.translate(-APEXSIM.Camera.x, -APEXSIM.Camera.y);

        // =====================================================
        // WORLD RENDERING (APEXWORLD v1.0)
        // =====================================================
        if (window.APEXWORLD && APEXWORLD.Renderer) {
            APEXWORLD.Renderer.draw(ctx);
        }

        // =====================================================
        // GRID RENDERING
        // =====================================================
        if (this._showGrid) {
            this._drawGrid(ctx, w, h);
        }

        // =====================================================
        // UNIT RENDERING
        // =====================================================
        this._drawUnits(ctx);

        // =====================================================
        // DEBUG OVERLAY
        // =====================================================
        if (APEXSIM.Debug && APEXSIM.Debug._visible) {
            APEXSIM.Debug.draw(ctx, w, h);
        }
    },

    // =========================================================
    // Draw grid
    // =========================================================
    _drawGrid(ctx, w, h) {
        const tile = 16;

        ctx.strokeStyle = "rgba(40, 60, 80, 0.6)";
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x < w; x += tile) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y < h; y += tile) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(0 + w, y);
            ctx.stroke();
        }
    },

    // =========================================================
    // Draw units
    // =========================================================
    _drawUnits(ctx) {
        const units = (APEXSIM.Engine && APEXSIM.Engine.units) || [];
        const tile = 16;

        for (let i = 0; i < units.length; i++) {
            const u = units[i];

            const px = u.x * tile;
            const py = u.y * tile;

            // Base body
            ctx.fillStyle = "#00c8ff";
            ctx.fillRect(px - 6, py - 6, 12, 12);

            // Top marker
            ctx.fillStyle = "#ffd84a";
            ctx.fillRect(px - 3, py - 10, 6, 4);

            // Optional: velocity line (for debugging movement)
            if (APEXSIM.Debug && APEXSIM.Debug._visible) {
                ctx.strokeStyle = "#ff4444";
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px + u.vx * 4, py + u.vy * 4);
                ctx.stroke();
            }
        }
    }
};
