// =========================================================
// APEXSIM.RendererControl — Liminal Engine v8.2
// Connects UI → Renderer (grid toggle, debug toggle)
// =========================================================
// This file listens for UI events and updates the renderer.
// No wrappers. No overrides. Pure direct control.
// =========================================================

window.APEXSIM = window.APEXSIM || {};

APEXSIM.RendererControl = {

    init() {
        const Renderer = window.APEXSIM && APEXSIM.Renderer;
        if (!Renderer) {
            console.error("APEXSIM.RendererControl — Renderer not found.");
            return;
        }

        // GRID TOGGLE
        const gridCheckbox = document.getElementById("vc-render-grid");
        if (gridCheckbox) {
            gridCheckbox.addEventListener("change", () => {
                Renderer.setGridVisible(gridCheckbox.checked);
            });
        }

        // DEBUG TOGGLE
        const debugCheckbox = document.getElementById("vc-render-debug");
        if (debugCheckbox) {
            debugCheckbox.addEventListener("change", () => {
                Renderer.setDebugVisible(debugCheckbox.checked);
            });
        }

        console.log("APEXSIM.RendererControl — Ready.");
    }
};

// Auto‑init after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    if (window.APEXSIM && APEXSIM.RendererControl) {
        APEXSIM.RendererControl.init();
    }
});
