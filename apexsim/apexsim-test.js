// =========================================================
// APEXSIM.Test — Minimal Test Harness (Spawn 1 Unit Only)
// v1.1 — No STOP, No Reset, No Interference
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Test = {

    init() {
        console.log("APEXSIM.Test — Initializing test scenario...");

        // Spawn exactly 1 unit at world center
        this.spawnInitialUnit();

        console.log("APEXSIM.Test — Ready.");
    },

    spawnInitialUnit() {
        if (!APEXSIM.Engine || !APEXSIM.Engine.units) {
            console.warn("APEXSIM.Test — Engine not ready, cannot spawn.");
            return;
        }

        const world = APEXSIM.World;
        const x = 0;
        const y = 0;

        const unit = {
            id: "test-unit-1",
            label: "Test Unit",
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            state: "Idle",
            behaviorName: "None",
            path: []
        };

        APEXSIM.Engine.units.push(unit);

        console.log(
            `APEXSIM.Test — Spawned initial test unit at world center (${x}, ${y}).`
        );
    }
};

// Auto‑init when engine is ready
window.addEventListener("load", () => {
    setTimeout(() => APEXSIM.Test.init(), 50);
});
