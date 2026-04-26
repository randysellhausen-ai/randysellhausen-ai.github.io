// =========================================================
// APEXSIM.Test — Unit Spawning & Scenarios
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Test = {

    init() {
        // Spawn one friendly at center
        APEXSIM.Engine.addUnit(0, 0);
        const units = APEXSIM.Engine.units;
        const u = units[units.length - 1];
        u.isEnemy = false;
        console.log("APEXSIM.Test — Spawned initial test unit at world center (0, 0).");

        // Spawn one enemy offset so perception has something to see
        APEXSIM.Engine.addUnit(40, 0);
        const e = units[units.length - 1];
        e.isEnemy = true;
    },

    spawnFriendly(x = 0, y = 0) {
        APEXSIM.Engine.addUnit(x, y);
        const units = APEXSIM.Engine.units;
        const u = units[units.length - 1];
        u.isEnemy = false;
        return u;
    },

    spawnEnemy(x = 0, y = 0) {
        APEXSIM.Engine.addUnit(x, y);
        const units = APEXSIM.Engine.units;
        const u = units[units.length - 1];
        u.isEnemy = true;
        return u;
    },

    spawnMixedGroup(count = 10) {
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 200;
            if (Math.random() < 0.5) {
                this.spawnFriendly(x, y);
            } else {
                this.spawnEnemy(x, y);
            }
        }
    },

    clearAll() {
        APEXSIM.Engine.clearUnits();
    }
};

APEXSIM.Test.init();
