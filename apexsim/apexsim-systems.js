// =========================================================
// APEXSIM — SYSTEMS
// =========================================================
// System manager: registers and updates all simulation systems.
// =========================================================

window.APEXSIM = window.APEXSIM || {};

window.APEXSIM.Systems = (function () {

    const systems = [];

    return {

        // Register a new system
        register(system) {
            if (system && typeof system.update === "function") {
                systems.push(system);
            }
        },

        // Update all systems
        updateAll() {
            for (let system of systems) {
                system.update();
            }
        },

        // Clear all systems
        clear() {
            systems.length = 0;
        }
    };

})();
