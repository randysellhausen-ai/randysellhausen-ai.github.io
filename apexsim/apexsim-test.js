// =========================================================
// APEXSIM.Test — Liminal Engine v8.2
// Simple test harness for spawning units into the simulation
// =========================================================
// - Used by index.html on boot (spawnTestUnit)
// - Safe to call multiple times
// - Uses APEXSIM.Engine.addUnit / spawnUnits
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Test = {

    _bootSpawned: false,

    // Called from index.html on load (optional)
    spawnTestUnit() {
        const Engine = window.APEXSIM && APEXSIM.Engine;
        if (!Engine || typeof Engine.addUnit !== "function") {
            console.warn("APEXSIM.Test.spawnTestUnit — Engine.addUnit is not available.");
            return;
        }

        // Only auto‑spawn once on boot
        if (this._bootSpawned) return;
        this._bootSpawned = true;

        // Spawn a single unit at a reasonable default position
        Engine.addUnit(10, 10);

        console.log("APEXSIM.Test — Spawned initial test unit at (10, 10).");
    },

    // Manual helper: spawn N units at random positions
    spawnRandomUnits(count) {
        const Engine = window.APEXSIM && APEXSIM.Engine;
        if (!Engine || typeof Engine.addUnit !== "function") {
            console.warn("APEXSIM.Test.spawnRandomUnits — Engine.addUnit is not available.");
            return;
        }

        count = count || 10;

        for (let i = 0; i < count; i++) {
            const x = 5 + Math.random() * 10;
            const y = 5 + Math.random() * 10;
            Engine.addUnit(x, y);
        }

        console.log(`APEXSIM.Test — Spawned ${count} random units.`);
    }
};
