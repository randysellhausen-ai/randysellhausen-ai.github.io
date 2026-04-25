// =========================================================
// APEXSIM — STANCE SYSTEM v1
// =========================================================
// Units can be in one of several stances:
// idle, ready, defensive, aggressive
// =========================================================

window.APEXSIM = window.APEXSIM || {};
window.APEXSIM.Stance = (function () {

    const VALID_STANCES = ["idle", "ready", "defensive", "aggressive"];

    return {

        // Assign a stance to a unit
        set(unit, stance) {
            if (!VALID_STANCES.includes(stance)) {
                console.warn("Invalid stance:", stance);
                return;
            }
            unit.stance = stance;
        },

        // Cycle through stances (for testing)
        cycle(unit) {
            const index = VALID_STANCES.indexOf(unit.stance || "idle");
            const next = (index + 1) % VALID_STANCES.length;
            unit.stance = VALID_STANCES[next];
        },

        // Apply stance effects (simple v1)
        apply(unit) {
            switch (unit.stance) {
                case "idle":
                    unit.vx *= 0.9;
                    unit.vy *= 0.9;
                    break;

                case "ready":
                    // no change
                    break;

                case "defensive":
                    unit.vx *= 0.7;
                    unit.vy *= 0.7;
                    break;

                case "aggressive":
                    unit.vx *= 1.2;
                    unit.vy *= 1.2;
                    break;
            }
        }
    };

})();
