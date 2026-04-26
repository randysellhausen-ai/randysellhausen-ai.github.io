// =========================================================
// APEXSIM.Test — spawn initial unit
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Test = {
    init() {
        const x = 0;
        const y = 0;
        APEXSIM.Engine.addUnit(x, y);
        console.log("APEXSIM.Test — Spawned initial test unit at world center (0, 0).");
    }
};

APEXSIM.Test.init();
