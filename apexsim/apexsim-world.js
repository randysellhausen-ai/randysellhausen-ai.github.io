// =========================================================
// APEXSIM.World — simple centered world
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.World = {
    width: 128,
    height: 128,
    tileSize: 16,

    init() {
        console.log(`APEXSIM.World — Initialized (${this.width}×${this.height})`);
    }
};

APEXSIM.World.init();
