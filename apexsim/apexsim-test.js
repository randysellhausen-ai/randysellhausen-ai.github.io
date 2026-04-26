// =========================================================
// APEXSIM.Test — Liminal Engine v8.2 (World‑Centered Version)
// =========================================================
// - Spawns units at the WORLD CENTER (not 10,10)
// - Random spawns occur within world bounds
// - Fully compatible with Engine, Renderer, Camera
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Test = {

    _bootSpawned: false,

    // -----------------------------------------------------
    // SPAWN ONE UNIT ON BOOT (center of world)
    // -----------------------------------------------------
    spawnTestUnit() {
        const Engine   = window.APEXSIM && APEXSIM.Engine;
        const World    = window.APEXSIM && APEXSIM.World;
        const Renderer = window.APEXSIM && APEXSIM.Renderer;

        if (!Engine || typeof Engine.addUnit !== "function") {
            console.warn("APEXSIM.Test.spawnTestUnit — Engine.addUnit is not available.");
            return;
        }

        if (!World || !Renderer) {
            console.warn("APEXSIM.Test.spawnTestUnit — World/Renderer not ready.");
            return;
        }

        // Only auto‑spawn once
        if (this._bootSpawned) return;
        this._bootSpawned = true;

        // Compute world center in pixel space
        const worldPixelWidth  = World.width  * Renderer.tileSize;
        const worldPixelHeight = World.height * Renderer.tileSize;

        const cx = worldPixelWidth  / 2;
        const cy = worldPixelHeight / 2;

        Engine.addUnit(cx, cy);

        console.log(`APEXSIM.Test — Spawned initial test unit at world center (${cx}, ${cy}).`);
    },

    // -----------------------------------------------------
    // SPAWN N RANDOM UNITS (within world bounds)
    // -----------------------------------------------------
    spawnRandomUnits(count) {
        const Engine   = window.APEXSIM && APEXSIM.Engine;
        const World    = window.APEXSIM && APEXSIM.World;
        const Renderer = window.APEXSIM && APEXSIM.Renderer;

        if (!Engine || typeof Engine.addUnit !== "function") {
            console.warn("APEXSIM.Test.spawnRandomUnits — Engine.addUnit is not available.");
            return;
        }

        if (!World || !Renderer) {
            console.warn("APEXSIM.Test.spawnRandomUnits — World/Renderer not ready.");
            return;
        }

        count = count || 10;

        const worldPixelWidth  = World.width  * Renderer.tileSize;
        const worldPixelHeight = World.height * Renderer.tileSize;

        for (let i = 0; i < count; i++) {
            const x = Math.random() * worldPixelWidth;
            const y = Math.random() * worldPixelHeight;
            Engine.addUnit(x, y);
        }

        console.log(`APEXSIM.Test — Spawned ${count} random units within world bounds.`);
    }
};
