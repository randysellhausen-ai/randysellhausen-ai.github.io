// =========================================================
// APEXSIM.DebugBehavior — Behavior Visualization Helpers
// =========================================================

window.APEXSIM = window.APEXSIM || {};
APEXSIM.DebugBehavior = {

    drawIntentArrow(ctx, u, cam) {
        if (!u.desireVector) return;

        const scale = 12;
        const dx = u.desireVector.x * scale;
        const dy = u.desireVector.y * scale;

        const sx = u.x;
        const sy = u.y;
        const ex = sx + dx;
        const ey = sy + dy;

        ctx.save();
        ctx.strokeStyle = "rgba(0,255,180,0.9)";
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        const angle = Math.atan2(dy, dx);
        const size = 4;

        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(
            ex - Math.cos(angle - 0.4) * size,
            ey - Math.sin(angle - 0.4) * size
        );
        ctx.lineTo(
            ex - Math.cos(angle + 0.4) * size,
            ey - Math.sin(angle + 0.4) * size
        );
        ctx.closePath();
        ctx.fillStyle = "rgba(0,255,180,0.9)";
        ctx.fill();

        ctx.restore();
    },

    drawSoundMarkers(ctx, u) {
        if (!u.heardEvents) return;

        ctx.save();
        ctx.strokeStyle = "rgba(255,255,0,0.5)";
        ctx.lineWidth = 1;

        for (const ev of u.heardEvents) {
            ctx.beginPath();
            ctx.arc(ev.x, ev.y, 6, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    },

    drawLastSeen(ctx, u) {
        if (!u.lastSeenTarget) return;

        const t = u.lastSeenTarget;

        ctx.save();
        ctx.strokeStyle = "rgba(255,0,0,0.5)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(t.x, t.y, 5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }
};

console.log("APEXSIM.DebugBehavior — Ready.");

