// =========================================================
// APEXSIM — ENGINE
// =========================================================
// Main simulation engine: updates units and runs systems.
// =========================================================

window.APEXSIM = window.APEXSIM || {};

window.APEXSIM.Engine = (function () {

    return {

        update() {
            const units = window.APEXSIM.Core.getUnits();

            // Update each unit
            for (let unit of units) {
                if (unit.update) {
                    unit.update();
                }
            }

            // Run systems if they exist
            if (window.APEXSIM.Systems) {
                window.APEXSIM.Systems.updateAll();
            }
        }
    };

})();
