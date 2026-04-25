// =========================================================
// APEXSIM — TEST UNIT SPAWNER
// =========================================================
// Creates a single test unit so the engine can be visually verified.
// =========================================================

window.APEXSIM = window.APEXSIM || {};

window.APEXSIM.Test = (function () {

    function spawnTestUnit() {
        const unit = {
            id: window.APEXSIM.Data.nextId(),
            x: 200,
            y: 200,
            vx: 1.2,
            vy: 0.8,
            color: "cyan",
            stance: "ready",

            update() {
                // Apply stance effects
                window.APEXSIM.Stance.apply(this);

                // Apply velocity
                window.APEXSIM.Physics.applyVelocity(this);

                // Bounce off edges (simple)
                const ctx = window.APEXSIM.UI.getContext();
                if (!ctx) return;

                const w = ctx.canvas.width;
                const h = ctx.canvas.height;

                if (this.x < 20 || this.x > w - 20) this.vx *= -1;
                if (this.y < 20 || this.y > h - 20) this.vy *= -1;
            }
        };

        window.APEXSIM.Core.addUnit(unit);
    }

    return {
        spawnTestUnit
    };

})();
