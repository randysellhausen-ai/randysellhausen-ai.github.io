(function () {
    const root = window.APEXSIM || {};
    const Engine = root.Engine || {};
    const Renderer = root.Renderer || {};
    const Test = root.Test || {};
    const Camera = root.Camera || {};
    const Debug = root.Debug || {};

    function $(id) {
        return document.getElementById(id);
    }

    function safeCall(obj, fn, ...args) {
        if (obj && typeof obj[fn] === "function") {
            obj[fn](...args);
        } else {
            console.warn("[CONTROL PANEL] Missing", fn, "on", obj);
        }
    }

    function initPanel() {
        const panel = $("apex-control-panel");
        const toggleBtn = $("vc-panel-toggle");

        const playBtn = $("vc-sim-play");
        const pauseBtn = $("vc-sim-pause");
        const stepBtn = $("vc-sim-step");
        const speedSlider = $("vc-sim-speed");
        const speedValue = $("vc-sim-speed-value");

        const spawn1Btn = $("vc-units-spawn-1");
        const spawn20Btn = $("vc-units-spawn-20");
        const clearUnitsBtn = $("vc-units-clear");

        const gridCheckbox = $("vc-render-grid");
        const debugCheckbox = $("vc-render-debug");

        const zoomInBtn = $("vc-camera-zoom-in");
        const zoomOutBtn = $("vc-camera-zoom-out");
        const cameraResetBtn = $("vc-camera-reset");

        if (!panel) {
            console.error("[CONTROL PANEL] Panel root not found.");
            return;
        }

        // Panel toggle
        toggleBtn.addEventListener("click", () => {
            panel.classList.toggle("vc-panel--collapsed");
        });

        // Simulation controls
        playBtn.addEventListener("click", () => {
            safeCall(Engine, "resume");
        });

        pauseBtn.addEventListener("click", () => {
            safeCall(Engine, "pause");
        });

        stepBtn.addEventListener("click", () => {
            safeCall(Engine, "step");
        });

        speedSlider.addEventListener("input", () => {
            const value = parseFloat(speedSlider.value);
            speedValue.textContent = value.toFixed(1) + "x";
            safeCall(Engine, "setTimeScale", value);
        });

        // Unit controls
        spawn1Btn.addEventListener("click", () => {
            safeCall(Test, "spawnTestUnit");
        });

        spawn20Btn.addEventListener("click", () => {
            if (Test && typeof Test.spawnTestUnit === "function") {
                for (let i = 0; i < 20; i++) {
                    Test.spawnTestUnit();
                }
            } else {
                console.warn("[CONTROL PANEL] APEXSIM.Test.spawnTestUnit not available.");
            }
        });

        clearUnitsBtn.addEventListener("click", () => {
            safeCall(Engine, "clearUnits");
        });

        // Renderer controls
        gridCheckbox.addEventListener("change", () => {
            safeCall(Renderer, "setGridVisible", gridCheckbox.checked);
        });

        debugCheckbox.addEventListener("change", () => {
            safeCall(Debug, "setDebugVisible", debugCheckbox.checked);
        });

        // Camera controls
        zoomInBtn.addEventListener("click", () => {
            safeCall(Camera, "zoomIn");
        });

        zoomOutBtn.addEventListener("click", () => {
            safeCall(Camera, "zoomOut");
        });

        cameraResetBtn.addEventListener("click", () => {
            safeCall(Camera, "reset");
        });

        console.log("[CONTROL PANEL] VECTORCORE × LIMINAL ENGINE control panel initialized.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPanel);
    } else {
        initPanel();
    }
})();
