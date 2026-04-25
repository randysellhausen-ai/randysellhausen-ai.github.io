// =========================================================
// APEXUI.ControlPanel — Liminal Engine v8.2
// Connects UI buttons/sliders → Engine / Renderer / Camera
// =========================================================
// - Play / Pause / Step
// - Speed slider
// - Spawn 1 / Spawn 20 / Clear Units
// - Grid toggle (handled by RendererControl)
// - Debug toggle (handled by DebugControl)
// - Camera zoom/reset (handled by Camera)
// =========================================================

window.APEXUI = window.APEXUI || {};

APEXUI.ControlPanel = {

    init() {
        const Engine   = window.APEXSIM && APEXSIM.Engine;
        const Renderer = window.APEXSIM && APEXSIM.Renderer;
        const Camera   = window.APEXSIM && APEXSIM.Camera;

        if (!Engine)   console.error("APEXUI.ControlPanel — Engine missing.");
        if (!Renderer) console.error("APEXUI.ControlPanel — Renderer missing.");
        if (!Camera)   console.error("APEXUI.ControlPanel — Camera missing.");

        // =================================================
        // PANEL TOGGLE
        // =================================================
        const panel = document.getElementById("apex-control-panel");
        const toggleBtn = document.getElementById("vc-panel-toggle");

        if (panel && toggleBtn) {
            toggleBtn.addEventListener("click", () => {
                panel.classList.toggle("vc-panel--collapsed");
            });
        }

        // =================================================
        // SIMULATION CONTROLS
        // =================================================

        // Play
        const playBtn = document.getElementById("vc-sim-play");
        if (playBtn) {
            playBtn.addEventListener("click", () => {
                Engine.resume();
            });
        }

        // Pause
        const pauseBtn = document.getElementById("vc-sim-pause");
        if (pauseBtn) {
            pauseBtn.addEventListener("click", () => {
                Engine.pause();
            });
        }

        // Step
        const stepBtn = document.getElementById("vc-sim-step");
        if (stepBtn) {
            stepBtn.addEventListener("click", () => {
                Engine.step();
            });
        }

        // Speed slider
        const speedSlider = document.getElementById("vc-sim-speed");
        const speedValue  = document.getElementById("vc-sim-speed-value");

        if (speedSlider && speedValue) {
            speedSlider.addEventListener("input", () => {
                const v = parseFloat(speedSlider.value);
                Engine.setTimeScale(v);
                speedValue.textContent = v.toFixed(1) + "x";
            });
        }

        // =================================================
        // UNIT CONTROLS
        // =================================================

        // Spawn 1
        const spawn1Btn = document.getElementById("vc-units-spawn-1");
        if (spawn1Btn) {
            spawn1Btn.addEventListener("click", () => {
                Engine.spawnUnits(1);
            });
        }

        // Spawn 20
        const spawn20Btn = document.getElementById("vc-units-spawn-20");
        if (spawn20Btn) {
            spawn20Btn.addEventListener("click", () => {
                Engine.spawnUnits(20);
            });
        }

        // Clear Units
        const clearBtn = document.getElementById("vc-units-clear");
        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                Engine.clearUnits();
            });
        }

        // =================================================
        // CAMERA CONTROLS (delegated to APEXSIM.Camera)
        // =================================================

        const zoomInBtn = document.getElementById("vc-camera-zoom-in");
        if (zoomInBtn) {
            zoomInBtn.addEventListener("click", () => {
                Camera.zoomIn();
            });
        }

        const zoomOutBtn = document.getElementById("vc-camera-zoom-out");
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener("click", () => {
                Camera.zoomOut();
            });
        }

        const resetCamBtn = document.getElementById("vc-camera-reset");
        if (resetCamBtn) {
            resetCamBtn.addEventListener("click", () => {
                Camera.reset();
            });
        }

        console.log("APEXUI.ControlPanel — Ready.");
    }
};

// Auto‑init after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    if (window.APEXUI && APEXUI.ControlPanel) {
        APEXUI.ControlPanel.init();
    }
});
