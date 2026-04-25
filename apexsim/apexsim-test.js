// APEXSIM Test — Spawning Units

window.APEXSIM = window.APEXSIM || {};

APEXSIM.Test = {
    spawnTestUnit() {
        if (!APEXSIM.Engine || !APEXSIM.Data) return;

        const x = 10 + Math.random() * 60;
        const y = 10 + Math.random() * 30;

        const unit = APEXSIM.Data.createUnit(x, y);
        APEXSIM.Engine.addUnit(unit);
    }
};
