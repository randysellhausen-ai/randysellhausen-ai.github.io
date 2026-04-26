// =========================================================
// APEXSIM.DebugOverlay — Enhanced with Behavior Layer
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.DebugOverlay = {

    enabled: true,

    init() {
        console.log("APEXSIM.DebugOverlay — Ready.");
    },

    render(ctx, units, cam) {
        if (!this.enabled) return;

        ctx.save();
        ctx.translate(cam.screenCenterX, cam.screenCenterY);
        ctx.scale(cam.zoom, cam.zoom);
        ctx.translate(-cam.x, -cam.y);

        for (const u of units) {
            this._drawUnitDebug(ctx, u);
        }

        ctx.restore();
    },

    _drawUnitDebug(ctx, u) {
        const x = u.x;
        const y = u.y;

        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";

        const lines = [
            `State: ${u.state}`,
            `Behavior: ${u.behaviorName || "None"}`,
            `vx:${u.vx.toFixed(1)} vy:${u.vy.toFixed(1)}`
        ];

        let offset = -18;
        for (const line of lines) {
            ctx.fillText(line, x, y + offset);
            offset -= 12;
        }

        ctx.restore();

        APEXSIM.DebugBehavior.drawIntentArrow(ctx, u);
        APEXSIM.DebugBehavior.drawSoundMarkers(ctx, u);
        APEXSIM.DebugBehavior.drawLastSeen(ctx, u);
    }
};

APEXSIM.DebugOverlay.init();
