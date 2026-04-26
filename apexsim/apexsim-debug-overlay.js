// =========================================================
// APEXSIM.DebugOverlay — visual debug layer
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.DebugOverlay = {

    enabled: false,

    init() {
        console.log("APEXSIM.DebugOverlay — Ready.");
    },

    render(ctx, units) {
        if (!this.enabled) return;

        ctx.save();
        ctx.lineWidth = 1;
        ctx.font = "12px monospace";
        ctx.fillStyle = "#ff00ff";
        ctx.strokeStyle = "#ff00ff";

        let id = 0;

        for (let u of units) {

            // Position label
            ctx.fillText(
                `ID:${id} (${u.x.toFixed(1)}, ${u.y.toFixed(1)})`,
                u.x + 10,
                u.y - 10
            );

            // Velocity vector
            ctx.beginPath();
            ctx.moveTo(u.x, u.y);
            ctx.lineTo(u.x + u.vx * 20, u.y + u.vy * 20);
            ctx.stroke();

            // Bounding circle
            ctx.beginPath();
            ctx.arc(u.x, u.y, 8, 0, Math.PI * 2);
            ctx.stroke();

            id++;
        }

        ctx.restore();
    }
};

APEXSIM.DebugOverlay.init();
