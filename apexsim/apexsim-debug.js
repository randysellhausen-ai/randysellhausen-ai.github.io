// =========================================================
// APEXSIM — Debug (v8.0)
// =========================================================
// Responsibilities:
// - Debug visibility toggle (wired to control panel)
// - FPS tracking (smoothed)
// - Unit count + basic sim stats
// - Per-unit overlays (ID, speed, AI target, velocity)
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Debug = {

    _visible: false,

    _lastTime: null,
    _fps: 0,

    // For simple tick counting (optional external use)
    _tick: 0,

    // Called by control panel
    setDebugVisible(visible) {
        this._visible = !!visible;
    },

    // Internal FPS smoothing
    _updateFPS() {
        const now = performance.now() / 1000;
        if (this._lastTime === null) {
            this._lastTime = now;
            return;
        }
        const dt = now - this._lastTime;
        this._lastTime = now;

        const instant = dt > 0 ? (1 / dt) : 0;
        this._fps = this._fps * 0.9 + instant * 0.1;
        this._tick++;
    },

    // Main debug draw entry (called from Renderer)
    draw(ctx, w, h) {
        this._updateFPS();

        const units = (APEXSIM.Engine && APEXSIM.Engine.units) || [];

        // Reset transform for HUD-style overlay
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // ==============================
        // HUD TEXT (top-left)
        // ==============================
        ctx.font = "12px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#ffffff";

        const lines = [
            "LIMINAL ENGINE — DEBUG",
            "FPS: " + this._fps.toFixed(1),
            "Units: " + units.length,
            "Tick: " + this._tick
        ];

        let y = 10;
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 10, y);
            y += 14;
        }

        // ==============================
        // Per-unit overlays
        // ==============================
        this._drawUnitOverlays(ctx, units);
    },

    _drawUnitOverlays(ctx, units) {
        if (!units.length) return;

        const tile = 16;

        // Re-apply camera transform to match world space
        // (Renderer already applied camera before drawing units,
        // but we reset transform for HUD; now we re-enter world space.)
        const canvas = APEXSIM.Renderer.canvas;
        if (!canvas) return;

        const w = canvas.width;
        const h = canvas.height;

        ctx.save();

        ctx.translate(w / 2, h / 2);
        ctx.scale(APEXSIM.Camera.zoom, APEXSIM.Camera.zoom);
        ctx.translate(-w / 2, -h / 2);
        ctx.translate(-APEXSIM.Camera.x, -APEXSIM.Camera.y);

        ctx.font = "10px system-ui, sans-serif";
        ctx.textBaseline = "bottom";

        for (let i = 0; i < units.length; i++) {
            const u = units[i];

            const px = u.x * tile;
            const py = u.y * tile;

            // Velocity vector
            ctx.strokeStyle = "rgba(255, 80, 80, 0.9)";
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + u.vx * 4, py + u.vy * 4);
            ctx.stroke();

            // AI target marker
            if (u.aiTarget) {
                const tx = u.aiTarget.x * tile;
                const ty = u.aiTarget.y * tile;

                ctx.strokeStyle = "rgba(120, 200, 255, 0.9)";
                ctx.beginPath();
                ctx.arc(tx, ty, 4, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Text label (ID + speed)
            const speed = Math.sqrt(u.vx * u.vx + u.vy * u.vy);

            ctx.fillStyle = "#ffffff";
            ctx.fillText(
                "#" + u.id + "  v=" + speed.toFixed(2),
                px + 10,
                py - 8
            );
        }

        ctx.restore();
    }
};
