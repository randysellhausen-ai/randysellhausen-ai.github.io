// =========================================================
// APEXSIM.Renderer — Core Rendering (World + Units + Overlay)
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Renderer = {

    canvas: null,
    ctx: null,

    init() {
        this.canvas = document.getElementById("apexsim-canvas");
        if (!this.canvas) {
            this.canvas = document.createElement("canvas");
            this.canvas.id = "apexsim-canvas";
            document.body.appendChild(this.canvas);
        }

        this.ctx = this.canvas.getContext("2d");

        this._resize();
        window.addEventListener("resize", () => this._resize());

        console.log("APEXSIM.Renderer — Canvas attached.");
    },

    _resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        if (APEXSIM.Camera) {
            APEXSIM.Camera.screenCenterX = this.canvas.width / 2;
            APEXSIM.Camera.screenCenterY = this.canvas.height / 2;
        }
    },

    render() {
        const ctx = this.ctx;
        if (!ctx) return;

        const camera = APEXSIM.Camera;
        const units = APEXSIM.Engine.units;
        const world = APEXSIM.World;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.save();
        ctx.translate(camera.screenCenterX, camera.screenCenterY);
        ctx.scale(camera.zoom, camera.zoom);
        ctx.translate(-camera.x, -camera.y);

        this._drawWorld(ctx, world);
        this._drawUnits(ctx, units);

        ctx.restore();

        if (APEXSIM.DebugOverlay && typeof APEXSIM.DebugOverlay.render === "function") {
            APEXSIM.DebugOverlay.render(ctx, units, camera);
        }
    },

    _drawWorld(ctx, world) {
        if (!world) return;

        ctx.fillStyle = "#050608";
        ctx.fillRect(
            world.originX,
            world.originY,
            world.width,
            world.height
        );

        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1;

        const step = world.cellSize || 16;
        for (let x = world.originX; x <= world.originX + world.width; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, world.originY);
            ctx.lineTo(x, world.originY + world.height);
            ctx.stroke();
        }
        for (let y = world.originY; y <= world.originY + world.height; y += step) {
            ctx.beginPath();
            ctx.moveTo(world.originX, y);
            ctx.lineTo(world.originX + world.width, y);
            ctx.stroke();
        }
    },

    _drawUnits(ctx, units) {
        for (const u of units) {
            this._drawUnitTriangle(ctx, u);
        }
    },

    _drawUnitTriangle(ctx, u) {
        const x = u.x;
        const y = u.y;

        let angle = Math.atan2(u.vy, u.vx || 0.0001);
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

        if (u.isEnemy) {
            ctx.fillStyle = "rgba(255, 80, 80, 0.95)";
        } else {
            ctx.fillStyle = "rgba(80, 200, 255, 0.95)";
        }

        ctx.fill();
    }
};

APEXSIM.Renderer.init();
