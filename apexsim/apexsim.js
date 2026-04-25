// =========================================================
// APEXSIM — ROOT MODULE
// =========================================================
// This file initializes the APEXSIM namespace and provides
// the main simulation tick loop.
// =========================================================

window.APEXSIM = window.APEXSIM || {};

window.APEXSIM.version = "1.0.0";

window.APEXSIM.start = function () {
    console.log("APEXSIM started.");
    window.APEXSIM._running = true;
    tick();
};

window.APEXSIM.stop = function () {
    console.log("APEXSIM stopped.");
    window.APEXSIM._running = false;
};

function tick() {
    if (!window.APEXSIM._running) return;

    // Run systems
    if (window.APEXSIM.Engine) {
        window.APEXSIM.Engine.update();
    }

    // Render
    if (window.APEXSIM.Renderer) {
        window.APEXSIM.Renderer.draw();
    }

    requestAnimationFrame(tick);
}

