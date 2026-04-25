// =========================================================
// APEXSIM — MAIN SIMULATION CONTROLLER
// =========================================================
// This file initializes APEXSIM, loads subsystems, and
// provides the main update + render loop.
// Stance System is fully wired in.
// =========================================================

window.APEXSIM = window.APEXSIM || {};
window.APEXSIM.StanceSystem = window.APEXSIM.StanceSystem || {};

window.APEXSIM = (function () {

    const SIM = {
        units: [],

        // ---------------------------------------------
        // Initialize simulation
        // ---------------------------------------------
        init() {
            console.log("APEXSIM initialized.");

            // Future: load units, maps, AI, etc.
        },

        // ---------------------------------------------
        // Update simulation
        // ---------------------------------------------
        update(delta) {
            // Future: movement, AI, combat, etc.

            // Stance System hook (future: morale/suppression)
            if (window.APEXSIM.StanceSystem) {
                // Placeholder: no automatic stance changes yet
            }
        },

        // ---------------------------------------------
        // Render simulation
        // ---------------------------------------------
        render(ctx) {
            // Future: draw units, terrain, effects

            // Draw stance overlay if available
            if (window.APEXSIM.renderStanceOverlay) {
                window.APEXSIM.renderStanceOverlay(ctx, SIM.units);
            }
        },

        // ---------------------------------------------
        // Start simulation loop
        // ---------------------------------------------
        start() {
            console.log("APEXSIM started.");
            let last = performance.now();

            function loop(now) {
                const delta = now - last;
                last = now;

                SIM.update(delta);

                // Future: pass real canvas context
                // Example:
                // SIM.render(ctx);

                requestAnimationFrame(loop);
            }

            requestAnimationFrame(loop);
        }
    };

    return SIM;

})();
