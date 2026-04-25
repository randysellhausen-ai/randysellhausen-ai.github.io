// =========================================================
// LIMINAL ENGINE — CORE BOOTSTRAP (v8.0)
// =========================================================

window.LiminalEngine = {
    version: "8.0",
    subsystems: {},

    // ---------------------------------------------
    // Load all engine subsystems
    // ---------------------------------------------
    load() {
        console.log("Liminal Engine v8.0 — Booting...");

        this.subsystems.sim = window.APEXSIM || {};
        this.subsystems.ui = window.APEXUI || {};
        this.subsystems.world = window.APEXWORLD || {};
        this.subsystems.game = window.APEXGAME || {};

        console.log("Subsystems loaded:", this.subsystems);
    },

    // ---------------------------------------------
    // Initialize the engine
    // ---------------------------------------------
    init() {
        console.log("Initializing Liminal Engine...");

        if (this.subsystems.sim.init) this.subsystems.sim.init();
        if (this.subsystems.ui.init) this.subsystems.ui.init();
        if (this.subsystems.world.init) this.subsystems.world.init();
        if (this.subsystems.game.init) this.subsystems.game.init();

        console.log("Liminal Engine initialized.");
    },

    // ---------------------------------------------
    // Start the engine
    // ---------------------------------------------
    start() {
        console.log("Starting Liminal Engine...");
        if (this.subsystems.sim.start) this.subsystems.sim.start();
    }
};

// Auto‑boot when the page loads
window.addEventListener("DOMContentLoaded", () => {
    LiminalEngine.load();
    LiminalEngine.init();
});
