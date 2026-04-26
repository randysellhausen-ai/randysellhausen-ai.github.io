// =========================================================
// APEXUI.ControlPanel — Liminal Engine v8.2
// =========================================================
// - Binds UI buttons to Engine + Renderer + Camera
// - Handles simulation controls, unit spawning, debug toggles
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXUI = {

    init() {
        console.log("APEXUI.ControlPanel — Ready.");

        // -------------------------------------------------
        // SIMULATION CONTROLS
        // -------------------------------------------------
        document.getElementById("vc-sim-play").addEventListener("click", () => {
            APEXSIM.Engine.play();
        });

        document.getElementById("vc-sim-pause").addEventListener("click", () => {
            APEXSIM.Engine.pause();
        });

        document.getElementById("vc-sim-step").addEventListener("click", () => {
            APEXSIM.Engine.step();
        });

        // ⭐ STOP (Soft Reset)
        document.getElementById("vc-sim-stop").addEventListener("click", () => {
            APEXSIM.Engine.stop();
        });

        // -------------------------------------------------
        // SPEED SLIDER
        // -------------------------------------------------
        const speedSlider = document.getElementById("vc-sim-speed");
        speedSlider.addEventListener("input", () => {
            const value = parseFloat(speedSlider.value);
            APEXSIM.Engine.setSpeed(value);
        });

        // -------------------------------------------------
        // UNIT CONTROLS
        // -------------------------------------------------
        document.getElementById("vc-units-spawn1").addEventListener("click", () => {
            APEXSIM.Engine.addUnit(0, 0); // Camera-centered spawn
        });

        document.getElementById("vc-units-spawn20").addEventListener("click", () => {
            for (let i = 0; i < 20; i++) {
                APEXSIM.Engine.addUnit(
                    (Math.random() - 0.5) * 200,
                    (Math.random() - 0.5) * 200
                );
            }
        });

        document.getElementById("vc-units-clear").addEventListener("click", () => {
            APEXSIM.Engine.clearUnits();
        });

        // -------------------------------------------------
        // RENDERER TOGGLES
        // -------------------------------------------------
        document.getElementById("vc-render-grid").addEventListener("change", (e) => {
            APEXSIM.Renderer.showGrid = e.target.checked;
        });

        document.getElementById("vc-render-debug").addEventListener("change", (e) => {
            if (!APEXSIM.DebugControl) return;
            APEXSIM.DebugControl.enabled = e.target.checked;
        });

        // -------------------------------------------------
        // CAMERA CONTROLS
        // -------------------------------------------------
        document.getElementById("vc-cam-zoomin").addEventListener("click", () => {
            APEXSIM.Camera.zoomIn();
        });

        document.getElementById("vc-cam-zoomout").addEventListener("click", () => {
            APEXSIM.Camera.zoomOut();
        });

        document.getElementById("vc-cam-reset").addEventListener("click", () => {
            APEXSIM.Camera.reset();
        });
    }
};

// Auto-init
window.addEventListener("DOMContentLoaded", () => APEXUI.init());
