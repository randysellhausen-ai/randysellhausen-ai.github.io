// =========================================================
// APEXSIM.DebugControl — Liminal Engine v8.2
// Centralized debug toggles + hooks for future debug modules
// =========================================================
// - Controls debug overlay visibility
// - Provides a clean interface for future debug systems
// - Works directly with APEXSIM.Renderer and APEXSIM.Engine
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.DebugControl = {

    init() {
        const Renderer = window.APEXSIM && APEXSIM.Renderer;
        const Engine = window.APEXSIM && APEXSIM.Engine;

        if (!Renderer) {
            console.error("APEXSIM.DebugControl — Renderer not found.");
            return;
        }
        if (!Engine) {
            console.error("APEXSIM.DebugControl — Engine not found.");
            return;
        }

        // Debug overlay toggle (checkbox in control panel)
        const debugCheckbox = document.getElementById("vc-render-debug");
        if (debugCheckbox) {
            debugCheckbox.addEventListener("change", () => {
                Renderer.setDebugVisible(debugCheckbox.checked);
            });
        }

        // Future expansion:
        // - Engine state inspector
        // - Unit inspector
        // - Pathfinding visualizer
        // - Physics debug
        // - AI state debug
        // - Event tracing

        console.log("APEXSIM.DebugControl — Ready.");
    }
};

// Auto‑init after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    if (window.APEXSIM && APEXSIM.DebugControl) {
        APEXSIM.DebugControl.init();
    }
});
