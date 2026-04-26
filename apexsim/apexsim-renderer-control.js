// =========================================================
// APEXUI.ControlPanel — binds UI to Engine/Renderer/Camera
// =========================================================

window.APEXSIM = window.APEXSIM || {};

const APEXUI = {

    init() {
        console.log("APEXUI.ControlPanel — Ready.");

        // Simulation
        document.getElementById("vc-sim-play").addEventListener("click", () => {
            APEXSIM.Engine.play();
        });

        document.getElementById("vc-sim-pause").addEventListener("click", () => {
            APEXSIM.Engine.pause();
        });

        document.getElementById("vc-sim-step").addEventListener("click", () => {
            APEXSIM.Engine.step();
        });

        document.getElementById("vc-sim-stop").addEventListener("click", () => {
            APEXSIM.Engine.stop();
        });

        const speedSlider = document.getElementById("vc-sim-speed");
        speedSlider.addEventListener("input", () => {
            const value = parseFloat(speedSlider.value);
            APEXSIM.Engine.setSpeed(value);
        });

        // Units
        document.getElementById("vc-units-spawn1").addEventListener("click", () => {
            APEXSIM.Engine.addUnit(0, 0);
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

        // Renderer toggles
        document.getElementById("vc-render-grid").addEventListener("change", (e) => {
            APEXSIM.Renderer.showGrid = e.target.checked;
        });

        document.getElementById("vc-render-debug").addEventListener("change", (e) => {
            if (APEXSIM.DebugOverlay) {
                APEXSIM.DebugOverlay.enabled = e.target.checked;
            }
        });

        // Camera
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

window.addEventListener("DOMContentLoaded", () => APEXUI.init());
