// =========================================================
// APEXSIM — CORE
// =========================================================
// Core data structures, unit registry, and helpers.
// =========================================================

window.APEXSIM = window.APEXSIM || {};

window.APEXSIM.Core = (function () {

    const units = [];

    return {

        // Register a new unit
        addUnit(unit) {
            units.push(unit);
        },

        // Get all units
        getUnits() {
            return units;
        },

        // Find a unit by ID
        getUnit(id) {
            return units.find(u => u.id === id) || null;
        },

        // Remove all units
        clearUnits() {
            units.length = 0;
        }
    };

})();
