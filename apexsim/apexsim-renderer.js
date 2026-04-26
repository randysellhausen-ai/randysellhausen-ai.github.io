// =========================================================
// APEXSIM.Renderer — Unified Renderer (World + Units + Overlay)
// Fully compatible with your existing world, camera, input,
// and control panel.
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Renderer = {

    canvas: null,
    ctx: null,
    showGrid: true,

    init() {
        // Your input system uses #vc-canvas, so we MUST use that.
        this.canvas = document.getElementById("vc-canvas");
        if (!this.canvas) {
            console.error("Renderer ERROR: #vc-canvas not found.");
            return;
        }

        this.ctx = this.canvas.getContext("2d");

        this._resize();
        window.addEventListener("resize", () => this._resize());

        console.log("APEXSIM.Renderer — Canvas attached.");
    },

    _resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    render() {
        const ctx = this.ctx;
        if (!ctx) return;

        const cam = APEXSIM.Camera.state;
        const units = APEXSIM.Engine.units;
        const world = APEXSIM.World;

        // Clear screen
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // WORLD TRANSFORM
        ctx.save();
        ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        ctx.scale(cam.zoom, cam.zoom);
        ctx.translate(-cam.x, -cam.y);

        // Draw world
        this._drawWorld(ctx, world);

        // Draw units
        for (const u of units) {
            this._drawUnitTriangle(ctx, u);
        }

        ctx.restore();

        // Debug overlay (drawn in SCREEN SPACE)
        if (APEXSIM.DebugOverlay && APEXSIM.DebugOverlay.enabled) {
            APEXSIM.DebugOverlay.render(ctx, units, {
                x: cam.x,
                y: cam.y,
                zoom: cam.zoom,
                screenCenterX: this.canvas.width / 2,
                screenCenterY: this.canvas.height / 2
            });
        }
    },

    // -----------------------------------------------------
    // WORLD
    // -----------------------------------------------------
    _drawWorld(ctx, world) {
        const w = world.width;
        const h = world.height;
        const tile = world.tileSize;

        // Center world at (0,0)
        const left = -w / 2;
        const top = -h / 2;

        // Background
        ctx.fillStyle = "#0a0d10";
        ctx.fillRect(left, top, w, h);

        if (!this.showGrid) return;

        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = left; x <= left + w; x += tile) {
            ctx.beginPath();
            ctx.moveTo(x, top);
            ctx.lineTo(x, top + h);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = top; y <= top + h; y += tile) {
            ctx.beginPath();
            ctx.moveTo(left, y);
            ctx.lineTo(left + w, y);
            ctx.stroke();
        }
    },

    // -----------------------------------------------------
    // UNITS — Directional Triangles
    // -----------------------------------------------------
    _drawUnitTriangle(ctx, u) {
        const x = u.x;
        const y = u.y;

        const angle = Math.atan2(u.vy, u.vx || 0.0001);
        const size = 6;

        const tipX = x + Math.cos(angle) * size;
        const tipY = y + Math.sin(angle) * size;

        const leftAngle = angle + Math.PI * 0.75;
        const rightAngle = angle - Math.PI * 0.75;

        const leftX = x + Math.cos(leftAngle) * (size * 0.7);
        const leftY = y + Math.sin(leftAngle) * (size * 0.7);

        const rightX = x + Math.cos(rightAngle) * (size * 0.7);
        const rightY = y + Math.sin(rightAngle) * (size * 0.7);

        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(leftX, leftY);
        ctx.lineTo(rightX, rightY);
        ctx.closePath();

        ctx.fillStyle = u.isEnemy
            ? "rgba(255, 80, 80, 0.95)"
            : "rgba(80, 200, 255, 0.95)";

        ctx.fill();
    }
};

APEXSIM.Renderer.init();
