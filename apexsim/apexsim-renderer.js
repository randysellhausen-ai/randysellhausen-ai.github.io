// APEXSIM Renderer — Grid + Units + Camera

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Renderer = {
    canvas: null,
    ctx: null,
    _showGrid: true,

    attachCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        console.log("APEXSIM.Renderer — Canvas attached.");
    },

    setGridVisible(visible) {
        this._showGrid = !!visible;
    },

    draw() {
        if (!this.ctx || !this.canvas) return;

        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, w, h);

        // Camera
        const tileSize = 16;
        ctx.translate(w / 2, h / 2);
        ctx.scale(APEXSIM.Camera.zoom, APEXSIM.Camera.zoom);
        ctx.translate(-w / 2, -h / 2);
        ctx.translate(-APEXSIM.Camera.x, -APEXSIM.Camera.y);

        // Background
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        // Grid
        if (this._showGrid) {
            ctx.strokeStyle = "rgba(40, 60, 80, 0.6)";
            ctx.lineWidth = 1;
            for (let x = 0; x < w; x += tileSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y < h; y += tileSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
        }

        // Units
        const units = (APEXSIM.Engine && APEXSIM.Engine.units) || [];
        for (let i = 0; i < units.length; i++) {
            const u = units[i];
            const px = u.x * tileSize;
            const py = u.y * tileSize;

            // Base square
            ctx.fillStyle = "#00c8ff";
            ctx.fillRect(px - 6, py - 6, 12, 12);

            // Top marker
            ctx.fillStyle = "#ffd84a";
            ctx.fillRect(px - 3, py - 10, 6, 4);
        }

        // Debug overlay
        if (APEXSIM.Debug && APEXSIM.Debug._visible) {
            APEXSIM.Debug.draw(ctx, w, h);
        }
    }
};
