// =========================================================
// APEXSIM — DEBUG
// =========================================================
// Debug helpers: logging, inspection, overlays.
// =========================================================

window.APEXSIM = window.APEXSIM || {};

window.APEXSIM.Debug = (function () {

    return {

        // Log all units
        logUnits() {
            console.log("APEXSIM Units:", window.APEXSIM.Core.getUnits());
        },

        // Log all systems
        logSystems() {
            console.log("APEXSIM Systems:", window.APEXSIM.Systems);
        },

        // Log all modules
        logModules() {
            console.log("APEXSIM Modules:", window.APEXSIM.Modules.list());
        },

        // Draw debug text on canvas
        drawText(text, x = 10, y = 20, color = "white") {
            const ctx = window.APEXSIM.UI.getContext();
            if (!ctx) return;

            ctx.fillStyle = color;
            ctx.font = "14px monospace";
            ctx.fillText(text, x, y);
        }
    };

})();
