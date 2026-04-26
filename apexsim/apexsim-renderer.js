// =========================================================
// APEXSIM.Renderer — World + Units + Infinite Grid + Overlay
// Compatible with:
//  - APEXSIM.World (width/height/tileSize)
//  - APEXSIM.Camera.state (x, y, zoom)
//  - #vc-canvas
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Renderer = {

    canvas: null,
    ctx: null,
    showGrid: true,

    init() {
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

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.save();
        ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        ctx.scale(cam.zoom, cam.zoom);
        ctx.translate(-cam.x, -cam.y);

        this._drawBackground(ctx, cam);
        if (this.showGrid) this._drawInfiniteGrid(ctx, cam, world);

        this._drawWorldBounds(ctx, world);

        for (const u of units) {
            this._drawUnitTriangle(ctx, u);
        }

        ctx.restore();

        if (APEXSIM.DebugOverlay && typeof APEXSIM.DebugOverlay.render === "function") {
            APEXSIM.DebugOverlay.render(ctx, units, {
                x: cam.x,
                y: cam.y,
                zoom: cam.zoom,
                screenCenterX: this.canvas.width / 2,
                screenCenterY: this.canvas.height / 2
            });
        }
    },

    _drawBackground(ctx, cam) {
        const halfW = this.canvas.width / (2 * cam.zoom);
        const halfH = this.canvas.height / (2 * cam.zoom);

        ctx.fillStyle = "#05070a";
        ctx.fillRect(cam.x - halfW, cam.y - halfH, halfW * 2, halfH * 2);
    },

    _drawInfiniteGrid(ctx, cam, world) {
        const tile = world.tileSize || 32;

        const halfW = this.canvas.width / (2 * cam.zoom);
        const halfH = this.canvas.height / (2 * cam.zoom);

        const startX = Math.floor((cam.x - halfW) / tile) * tile;
        const endX   = Math.floor((cam.x + halfW) / tile) * tile;
        const startY = Math.floor((cam.y - halfH) / tile) * tile;
        const endY   = Math.floor((cam.y + halfH) / tile) * tile;

        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1;

        for (let x = startX; x <= endX; x += tile) {
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, endY);
            ctx.stroke();
        }

        for (let y = startY; y <= endY; y += tile) {
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
            ctx.stroke();
        }
    },

    _drawWorldBounds(ctx, world) {
        const w = world.width;
        const h = world.height;

        const left = -w / 2;
        const top = -h / 2;

        ctx.strokeStyle = "rgba(0, 255, 180, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(left, top, w, h);
    },

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
