// =========================================================
// APEXSIM.Renderer — canvas + grid + units
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Renderer = {

    canvas: null,
    ctx: null,
    showGrid: true,

    init() {
        this.canvas = document.getElementById("vc-canvas");
        this.ctx = this.canvas.getContext("2d");

        const resize = () => {
            this.canvas.width = window.innerWidth - 260;
            this.canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);
        resize();

        console.log("APEXSIM.Renderer — Canvas attached.");
    },

    render() {
        const ctx = this.ctx;
        const cam = APEXSIM.Camera;
        const units = APEXSIM.Engine.units;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        ctx.translate(cx, cy);
        ctx.scale(cam.state.zoom, cam.state.zoom);
        ctx.translate(-cam.state.x, -cam.state.y);

        if (this.showGrid) {
            this._drawGrid();
        }

        this._drawUnits(units);
        this._drawCenterCrosshair();
    },

    _drawGrid() {
        const ctx = this.ctx;
        const size = APEXSIM.World.tileSize;
        const half = 2048;

        ctx.strokeStyle = "#222";
        ctx.lineWidth = 1;

        ctx.beginPath();
        for (let x = -half; x <= half; x += size) {
            ctx.moveTo(x, -half);
            ctx.lineTo(x, half);
        }
        for (let y = -half; y <= half; y += size) {
            ctx.moveTo(-half, y);
            ctx.lineTo(half, y);
        }
        ctx.stroke();
    },

    _drawUnits(units) {
        const ctx = this.ctx;
        ctx.fillStyle = "#00ffaa";
        for (let u of units) {
            ctx.beginPath();
            ctx.arc(u.x, u.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    _drawCenterCrosshair() {
        const ctx = this.ctx;
        ctx.strokeStyle = "#444";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 10);
        ctx.stroke();
    }
};

window.addEventListener("DOMContentLoaded", () => APEXSIM.Renderer.init());
