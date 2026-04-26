// =========================================================
// APEXSIM.DebugOverlay — Perception & State Visualization
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.DebugOverlay = {

    enabled: false,

    init() {
        console.log("APEXSIM.DebugOverlay — Ready.");
    },

    // Generic entry point (Renderer may call draw or render)
    draw(ctx, units, camera) {
        this.render(ctx, units, camera);
    },

    render(ctx, units, camera) {
        if (!this.enabled) return;
        if (!units || !camera) return;

        ctx.save();
        ctx.translate(camera.screenCenterX, camera.screenCenterY);
        ctx.scale(camera.zoom, camera.zoom);
        ctx.translate(-camera.x, -camera.y);

        for (const u of units) {
            this._drawUnitOverlay(ctx, u);
        }

        ctx.restore();
    },

    _drawUnitOverlay(ctx, u) {
        // Base position
        const x = u.x;
        const y = u.y;

        // Vision radius
        if (u.visionRadius) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(0, 255, 180, 0.25)";
            ctx.lineWidth = 1;
            ctx.arc(x, y, u.visionRadius, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Hearing radius
        if (u.hearingRadius) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(0, 180, 255, 0.15)";
            ctx.lineWidth = 1;
            ctx.arc(x, y, u.hearingRadius, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Dynamic FOV wedge
        if (u.visionFOV && (u.vx !== 0 || u.vy !== 0)) {
            const facing = Math.atan2(u.vy, u.vx || 0.0001);
            const half = u.visionFOV * 0.5;
            const r = u.visionRadius || 120;

            const a1 = facing - half;
            const a2 = facing + half;

            const x1 = x + Math.cos(a1) * r;
            const y1 = y + Math.sin(a1) * r;
            const x2 = x + Math.cos(a2) * r;
            const y2 = y + Math.sin(a2) * r;

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
            gradient.addColorStop(0.0, "rgba(0, 255, 180, 0.25)");
            gradient.addColorStop(0.5, "rgba(0, 255, 180, 0.12)");
            gradient.addColorStop(1.0, "rgba(0, 255, 180, 0.02)");

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x1, y1);
            ctx.arc(x, y, r, a1, a2);
            ctx.closePath();
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = "rgba(0, 255, 180, 0.35)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Threat markers (last seen target)
        if (u.lastSeenTarget) {
            const tx = u.lastSeenTarget.x;
            const ty = u.lastSeenTarget.y;

            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 80, 80, 0.9)";
            ctx.lineWidth = 1.5;
            const s = 4;
            ctx.moveTo(tx - s, ty - s);
            ctx.lineTo(tx + s, ty + s);
            ctx.moveTo(tx - s, ty + s);
            ctx.lineTo(tx + s, ty - s);
            ctx.stroke();
        }

        // State label
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.font = "10px monospace";
        const label = (u.state || "Unknown") + (u.isEnemy ? " [E]" : "");
        ctx.fillText(label, x + 6, y - 6);
    }
};

APEXSIM.DebugOverlay.init();
