// =========================================================
// APEXSIM.DebugOverlay — Visual Debug + AI State Overlay
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.DebugOverlay = {

    enabled: false,

    init() {
        console.log("APEXSIM.DebugOverlay — Ready.");
    },

    // -----------------------------------------------------
    // MAIN RENDER ENTRY
    // -----------------------------------------------------
    render(ctx, units) {
        if (!this.enabled) return;

        ctx.save();
        ctx.lineWidth = 1;
        ctx.font = "12px monospace";
        ctx.fillStyle = "#ff00ff";
        ctx.strokeStyle = "#ff00ff";

        let id = 0;

        for (let u of units) {

            // =================================================
            // POSITION LABEL
            // =================================================
            ctx.fillText(
                `ID:${id} (${u.x.toFixed(1)}, ${u.y.toFixed(1)})`,
                u.x + 12,
                u.y - 12
            );

            // =================================================
            // VELOCITY VECTOR
            // =================================================
            ctx.beginPath();
            ctx.moveTo(u.x, u.y);
            ctx.lineTo(u.x + u.vx * 20, u.y + u.vy * 20);
            ctx.stroke();

            // =================================================
            // BOUNDING CIRCLE
            // =================================================
            ctx.beginPath();
            ctx.arc(u.x, u.y, 8, 0, Math.PI * 2);
            ctx.stroke();

            // =================================================
            // ⭐ AI STATE OVERLAY
            // =================================================
            const aiState = this._getAIState(u);

            ctx.fillStyle = "#ffaa00";
            ctx.fillText(aiState, u.x + 12, u.y + 4);

            ctx.fillStyle = "#ff00ff"; // reset for next unit

            id++;
        }

        ctx.restore();
    },

    // -----------------------------------------------------
    // AI STATE LOGIC (placeholder — replace with real AI later)
    // -----------------------------------------------------
    _getAIState(unit) {

        // You can replace this with real AI logic later.
        // For now, we infer a "state" from velocity.

        const speed = Math.sqrt(unit.vx * unit.vx + unit.vy * unit.vy);

        if (speed < 0.1) return "Idle";
        if (speed < 1.0) return "Wandering";
        if (speed < 2.0) return "Roaming";

        return "Sprinting";
    }
};

APEXSIM.DebugOverlay.init();
